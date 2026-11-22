<?php

namespace App\Http\Controllers;

use App\Models\ClassSubject;
use App\Models\Student;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function classroomReport(Request $request, ClassSubject $classSubject)
    {
        $validated = $request->validate([
            'period' => ['sometimes', 'nullable', 'in:monthly,semester'],
            'month' => [
                'nullable',
                'required_if:period,monthly',
                'date_format:Y-m',
            ],
            'semester' => [
                'nullable',
                'required_if:period,semester',
                'in:ganjil,genap',
            ],
        ]);

        $classSubject->load([
            'subject',
            'schoolClass',
            'academicYear',
            'teacher',
        ]);

        $applyPeriodFilter = function ($query) use ($validated, $classSubject) {
            $period = $validated['period'] ?? null;

            if ($period === 'monthly') {
                [$year, $month] = explode('-', $validated['month']);

                $query
                    ->whereYear('lesson_date', (int) $year)
                    ->whereMonth('lesson_date', (int) $month);

                return;
            }

            if ($period !== 'semester') {
                return;
            }

            $academicYear = $classSubject->academicYear;
            $isGanjil = $validated['semester'] === 'ganjil';
            $year = (int) ($isGanjil
                ? ($academicYear?->start_year ?? now()->year)
                : ($academicYear?->end_year ?? now()->year + 1));

            $query
                ->whereYear('lesson_date', $year)
                ->whereMonth('lesson_date', '>=', $isGanjil ? 7 : 1)
                ->whereMonth('lesson_date', '<=', $isGanjil ? 12 : 6);
        };

        $students = $classSubject->schoolClass
            ->classStudents()
            ->where(
                'academic_year_id',
                $classSubject->academic_year_id
            )
            ->where('status', 'AKTIF')
            ->with('student')
            ->get()
            ->map(function ($classStudent) use ($classSubject, $applyPeriodFilter) {

                $lessons = $classSubject
                    ->dailyLessons()
                    ->where($applyPeriodFilter)
                    ->with([
                        'studentDailyProgress' => function ($query) use ($classStudent) {
                            $query->where(
                                'student_id',
                                $classStudent->student_id
                            );
                        },
                    ])
                    ->orderBy('lesson_date')
                    ->get();

                $progress = $lessons
                    ->map(function ($lesson) {
                        $item = $lesson->studentDailyProgress->first();

                        return [
                            'date' => $lesson->lesson_date,
                            'material' => $lesson->title,
                            'score' => $item?->score,
                            'note' => $item?->teacher_note,
                        ];
                    });

                $scores = $progress
                    ->pluck('score')
                    ->filter(fn ($score) => $score !== null);

                return [
                    'student' => $classStudent->student,
                    'lessons' => $progress,
                    'lesson_count' => $lessons->count(),
                    'assessed_count' => $scores->count(),
                    'average' => $scores->isNotEmpty()
                        ? round($scores->avg())
                        : null,
                    'lowest' => $scores->isNotEmpty()
                        ? $scores->min()
                        : null,
                    'highest' => $scores->isNotEmpty()
                        ? $scores->max()
                        : null,
                ];
            });

        $pdf = Pdf::loadView('reports.classroom', [
            'classSubject' => $classSubject,
            'students' => $students,
        ]);

        $pdf->setPaper('A4', 'landscape');

        $filename = sprintf(
            'laporan-%s-%s.pdf',
            str($classSubject->subject->name)->slug(),
            str($classSubject->schoolClass->name)->slug()
        );

        return $pdf->stream($filename);
    }

    public function studentReport(Student $student)
    {
        $classStudent = $student->classStudents()
            ->whereHas('academicYear', function ($query) {
                $query->where('is_active', true);
            })
            ->where('status', 'AKTIF')
            ->with(['academicYear', 'schoolClass'])
            ->firstOrFail();

        $academicYear = $classStudent->academicYear;
        $schoolClass = $classStudent->schoolClass;

        $classSubjects = $schoolClass->classSubjects()
            ->where('academic_year_id', $academicYear->id)
            ->with([
                'subject',
                'teacher',
                'dailyLessons' => function ($query) {
                    $query->orderBy('lesson_date');
                },
                'dailyLessons.studentDailyProgress' => function ($query) use ($student) {
                    $query->where('student_id', $student->id);
                },
            ])
            ->get();

        $subjects = $classSubjects->map(function ($classSubject) {
            $progress = $classSubject->dailyLessons
                ->map(fn ($lesson) => $lesson->studentDailyProgress->first())
                ->filter();

            $scores = $progress->pluck('score')->filter(fn ($score) => $score !== null);
            $average = $scores->isNotEmpty() ? round($scores->avg()) : null;

            // Ambil beberapa catatan guru sebagai dasar capaian kompetensi.
            $notes = $progress->pluck('teacher_note')->filter()->unique()->values();

            return [
                'name' => $classSubject->subject->name,
                'teacher' => $classSubject->teacher?->full_name,
                'final_score' => $average,
                'lesson_count' => $classSubject->dailyLessons->count(),
                'assessed_count' => $scores->count(),
                'notes' => $notes,
                'lessons' => $classSubject->dailyLessons->map(function ($lesson) {
                    $progress = $lesson->studentDailyProgress->first();

                    return [
                        'date' => $lesson->lesson_date,
                        'title' => $lesson->title,
                        'score' => $progress?->score,
                        'note' => $progress?->teacher_note,
                    ];
                }),
            ];
        });

        $pdf = Pdf::loadView('reports.student-report', [
            'student' => $student,
            'classStudent' => $classStudent,
            'academicYear' => $academicYear,
            'schoolClass' => $schoolClass,
            'subjects' => $subjects,
        ]);

        $pdf->setPaper('A4', 'portrait');
        $filename = 'rapor-'.str($student->full_name)->slug().'.pdf';

        return $pdf->stream($filename);
    }
}
