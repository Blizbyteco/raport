<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\ClassSubject;
use App\Models\DailyLesson;
use App\Models\Extracurricular;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\StudentDailyProgress;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function summary(): JsonResponse
    {
        $academicYear = AcademicYear::query()
            ->where('is_active', true)
            ->first()
            ?? AcademicYear::query()->orderByDesc('start_year')->first();

        $classSubjects = ClassSubject::query()
            ->when($academicYear, function ($query) use ($academicYear) {
                $query->where('academic_year_id', $academicYear->id);
            })
            ->get(['id', 'school_class_id']);

        $lessons = DailyLesson::query()
            ->whereIn('class_subject_id', $classSubjects->pluck('id'))
            ->get(['id', 'class_subject_id']);

        $lessonClassMap = $classSubjects
            ->pluck('school_class_id', 'id');

        $assessedByClass = StudentDailyProgress::query()
            ->whereIn('daily_lesson_id', $lessons->pluck('id'))
            ->get(['student_id', 'daily_lesson_id'])
            ->groupBy(function ($row) use ($lessons, $lessonClassMap) {
                $classSubjectId = $lessons
                    ->firstWhere('id', $row->daily_lesson_id)
                    ?->class_subject_id;

                return $lessonClassMap->get($classSubjectId);
            })
            ->map(fn ($rows) => $rows->pluck('student_id')->unique()->count());

        $classes = SchoolClass::query()
            ->withCount([
                'classStudents as students_count' => function ($query) use ($academicYear) {
                    $query->where('status', 'AKTIF')
                        ->when($academicYear, function ($query) use ($academicYear) {
                            $query->where('academic_year_id', $academicYear->id);
                        });
                },
            ])
            ->orderBy('grade_level')
            ->orderBy('name')
            ->get()
            ->map(function (SchoolClass $schoolClass) use ($assessedByClass) {
                $students = $schoolClass->students_count;
                $assessed = $assessedByClass->get($schoolClass->id, 0);

                return [
                    'id' => $schoolClass->id,
                    'name' => $schoolClass->name,
                    'grade_level' => $schoolClass->grade_level,
                    'students' => $students,
                    'progress' => $students > 0
                        ? min(100, (int) round($assessed / $students * 100))
                        : 0,
                ];
            })
            ->values();

        return response()->json([
            'data' => [
                'totals' => [
                    'students' => Student::query()->count(),
                    'teachers' => User::query()->where('role', 'teacher')->count(),
                    'classes' => SchoolClass::query()->count(),
                    'subjects' => Subject::query()->count(),
                    'extracurriculars' => Extracurricular::query()->count(),
                ],
                'academic_year' => $academicYear ? [
                    'id' => $academicYear->id,
                    'start_year' => $academicYear->start_year,
                    'end_year' => $academicYear->end_year,
                ] : null,
                'class_progress' => $classes,
            ],
        ]);
    }
}
