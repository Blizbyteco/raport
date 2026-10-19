<?php

namespace App\Http\Controllers;

use App\Models\ClassSubject;
use App\Models\DailyLesson;
use App\Models\StudentDailyProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DailyLessonController extends Controller
{
    public function index(ClassSubject $classSubject)
    {
        $classSubject->load([
            'subject',
            'schoolClass' => function ($query) use ($classSubject) {
                $query->withCount([
                    'classStudents as student_count' => function ($query) use ($classSubject) {
                        $query->where('academic_year_id', $classSubject->academic_year_id)
                            ->where('status', 'AKTIF');
                    },
                ]);
            },
        ]);

        $lessons = DailyLesson::query()
            ->where('class_subject_id', $classSubject->id)
            ->withCount('studentDailyProgress as assessed')
            ->withAvg('studentDailyProgress', 'score')
            ->orderByDesc('lesson_date')
            ->get();

        $data = $lessons->map(function ($lesson) use ($classSubject) {
            return [
                'id' => $lesson->id,
                'material' => $lesson->title,
                'date' => $lesson->lesson_date,
                'average' => round($lesson->student_daily_progress_avg_score ?? 0),
                'assessed' => $lesson->assessed,
                'totalStudents' => $classSubject->schoolClass->student_count,
            ];
        });

        return response()->json([
            'meta' => [
                'id' => $classSubject->id,
                'subject' => [
                    'id' => $classSubject->subject->id,
                    'name' => $classSubject->subject->name,
                ],
                'classroom' => [
                    'id' => $classSubject->schoolClass->id,
                    'name' => $classSubject->schoolClass->name,
                    'grade_level' => $classSubject->schoolClass->grade_level,
                    'student_count' => $classSubject->schoolClass->student_count,
                ],
            ],
            'data' => $data,
        ]);
    }

    public function store(
        Request $request,
        ClassSubject $classSubject
    ) {
        $validated = $request->validate([
            'lesson_date' => [
                'required',
                'date',
            ],

            'title' => [
                'required',
                'string',
                'max:150',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'progress' => [
                'required',
                'array',
                'min:1',
            ],

            'progress.*.student_id' => [
                'required',
                'integer',
                'exists:students,id',
            ],

            'progress.*.score' => [
                'required',
                'integer',
                'min:1',
                'max:100',
            ],

            'progress.*.teacher_note' => [
                'nullable',
                'string',
            ],
        ]);

        $lesson = DB::transaction(function () use (
            $validated,
            $classSubject
        ) {
            $lesson = DailyLesson::create([
                'class_subject_id' => $classSubject->id,
                'lesson_date' => $validated['lesson_date'],
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
            ]);

            foreach ($validated['progress'] as $item) {
                StudentDailyProgress::create([
                    'daily_lesson_id' => $lesson->id,
                    'student_id' => $item['student_id'],
                    'score' => $item['score'],
                    'teacher_note' => $item['teacher_note'] ?? null,
                ]);
            }

            return $lesson;
        });

        return response()->json([
            'message' => 'Pembelajaran dan progress siswa berhasil disimpan.',
            'data' => $lesson,
        ], 201);
    }

    public function show(
        ClassSubject $classSubject,
        DailyLesson $dailyLesson
    ) {
        $dailyLesson->load([
            'classSubject.subject',
            'classSubject.schoolClass',
        ]);

        return response()->json([
            'data' => $dailyLesson,
        ]);
    }

    public function update(
        Request $request,
        ClassSubject $classSubject,
        DailyLesson $dailyLesson
    ) {
        $validated = $request->validate([
            'lesson_date' => [
                'required',
                'date',
            ],

            'title' => [
                'required',
                'string',
                'max:150',
            ],

            'description' => [
                'nullable',
                'string',
            ],
        ]);

        $dailyLesson->update($validated);

        return response()->json([
            'message' => 'Pembelajaran berhasil diperbarui.',
            'data' => $dailyLesson,
        ]);
    }

    public function destroy(
        ClassSubject $classSubject,
        DailyLesson $dailyLesson
    ) {
        $dailyLesson->delete();

        return response()->json([
            'message' => 'Pembelajaran berhasil dihapus.',
        ]);
    }
}
