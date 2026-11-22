<?php

namespace App\Http\Controllers;

use App\Http\Resources\TeacherSubjectResource;
use App\Models\AcademicYear;
use App\Models\ClassHomeroomTeacher;
use App\Models\ClassSubject;
use App\Models\DailyLesson;
use App\Models\SchoolClass;
use App\Models\StudentDailyProgress;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClassSubjectController extends Controller
{
    public function teacherClasses()
    {
        $user = Auth::user();

        $classSubjects = ClassSubject::query()
            ->with([
                'subject',
                'schoolClass' => function ($query) {
                    $query->withCount([
                        'classStudents' => function ($query) {
                            $query->where('status', 'AKTIF');
                        },
                    ]);
                },
            ])
            ->where('teacher_id', $user->id)
            ->get();

        return TeacherSubjectResource::collection($classSubjects);
    }

    public function homeroomClasses(): JsonResponse
    {
        $user = Auth::user();
        $academicYear = $this->activeAcademicYear();

        $classes = ClassHomeroomTeacher::query()
            ->with([
                'schoolClass' => function ($query) {
                    $query->withCount([
                        'classStudents as students_count' => function ($query) {
                            $query->where('status', 'AKTIF');
                        },
                    ]);
                },
                'academicYear',
            ])
            ->where('teacher_id', $user->id)
            ->when($academicYear, function ($query) use ($academicYear) {
                $query->where('academic_year_id', $academicYear->id);
            })
            ->get()
            ->map(function (ClassHomeroomTeacher $row) {
                return [
                    'id' => $row->id,
                    'classroom' => [
                        'id' => $row->schoolClass?->id,
                        'name' => $row->schoolClass?->name,
                        'grade_level' => $row->schoolClass?->grade_level,
                    ],
                    'academic_year' => $row->academicYear ? [
                        'id' => $row->academicYear->id,
                        'start_year' => $row->academicYear->start_year,
                        'end_year' => $row->academicYear->end_year,
                    ] : null,
                    'student_count' => $row->schoolClass?->students_count ?? 0,
                ];
            })
            ->values();

        return response()->json([
            'data' => $classes,
        ]);
    }

    public function classDetail(SchoolClass $schoolClass): JsonResponse
    {
        $academicYear = $this->activeAcademicYear();

        $schoolClass->load([
            'classStudents' => function ($query) use ($academicYear) {
                $query->where('status', 'AKTIF')
                    ->when($academicYear, function ($query) use ($academicYear) {
                        $query->where('academic_year_id', $academicYear->id);
                    })
                    ->with('student');
            },
            'classSubjects' => function ($query) use ($academicYear) {
                $query->when($academicYear, function ($query) use ($academicYear) {
                    $query->where('academic_year_id', $academicYear->id);
                })->with(['subject', 'teacher']);
            },
            'homeroomTeachers' => function ($query) use ($academicYear) {
                $query->when($academicYear, function ($query) use ($academicYear) {
                    $query->where('academic_year_id', $academicYear->id);
                })->with('teacher');
            },
        ]);

        return response()->json([
            'data' => [
                'id' => $schoolClass->id,
                'name' => $schoolClass->name,
                'grade_level' => $schoolClass->grade_level,
                'academic_year' => $academicYear ? [
                    'id' => $academicYear->id,
                    'start_year' => $academicYear->start_year,
                    'end_year' => $academicYear->end_year,
                ] : null,
                'students' => $schoolClass->classStudents->map(function ($row) {
                    return [
                        'id' => $row->student?->id,
                        'nisn' => $row->student?->nisn,
                        'full_name' => $row->student?->full_name,
                    ];
                })->values(),
                'subjects' => $schoolClass->classSubjects->map(function (ClassSubject $classSubject) {
                    return [
                        'id' => $classSubject->id,
                        'subject' => [
                            'id' => $classSubject->subject?->id,
                            'name' => $classSubject->subject?->name,
                        ],
                        'teacher' => [
                            'id' => $classSubject->teacher?->id,
                            'full_name' => $classSubject->teacher?->full_name,
                        ],
                    ];
                })->values(),
                'homeroom_teachers' => $schoolClass->homeroomTeachers->map(function ($row) {
                    return [
                        'id' => $row->teacher?->id,
                        'full_name' => $row->teacher?->full_name,
                    ];
                })->values(),
            ],
        ]);
    }

    public function classProgress(SchoolClass $schoolClass): JsonResponse
    {
        $academicYear = $this->activeAcademicYear();

        $classSubjectIds = ClassSubject::query()
            ->where('school_class_id', $schoolClass->id)
            ->when($academicYear, function ($query) use ($academicYear) {
                $query->where('academic_year_id', $academicYear->id);
            })
            ->pluck('id');

        $students = $schoolClass->classStudents()
            ->where('status', 'AKTIF')
            ->when($academicYear, function ($query) use ($academicYear) {
                $query->where('academic_year_id', $academicYear->id);
            })
            ->with('student')
            ->get()
            ->pluck('student')
            ->filter()
            ->values();

        $lessonIds = DailyLesson::query()
            ->whereIn('class_subject_id', $classSubjectIds)
            ->pluck('id');

        $progress = StudentDailyProgress::query()
            ->whereIn('daily_lesson_id', $lessonIds)
            ->whereIn('student_id', $students->pluck('id'))
            ->get()
            ->groupBy('student_id');

        $studentRows = $students->map(function ($student) use ($progress) {
            $scores = $progress->get($student->id, collect())->pluck('score');
            $average = $scores->isNotEmpty() ? round($scores->avg(), 1) : null;

            return [
                'id' => $student->id,
                'nisn' => $student->nisn,
                'full_name' => $student->full_name,
                'average' => $average,
                'assessed' => $scores->count(),
                'status' => $this->progressStatus($average),
            ];
        })->values();

        $averages = $studentRows->pluck('average')->filter(fn ($value) => $value !== null);

        return response()->json([
            'data' => [
                'class' => [
                    'id' => $schoolClass->id,
                    'name' => $schoolClass->name,
                    'grade_level' => $schoolClass->grade_level,
                ],
                'academic_year' => $academicYear ? [
                    'id' => $academicYear->id,
                    'start_year' => $academicYear->start_year,
                    'end_year' => $academicYear->end_year,
                ] : null,
                'summary' => [
                    'average' => $averages->isNotEmpty() ? round($averages->avg(), 1) : null,
                    'total_lessons' => $lessonIds->count(),
                    'assessed_students' => $averages->count(),
                    'attention_students' => $studentRows->where('status', 'Perlu Perhatian')->count(),
                ],
                'students' => $studentRows,
            ],
        ]);
    }

    private function activeAcademicYear(): ?AcademicYear
    {
        return AcademicYear::query()
            ->where('is_active', true)
            ->first()
            ?? AcademicYear::query()->orderByDesc('start_year')->first();
    }

    public function evaluation(ClassSubject $classSubject): JsonResponse
    {
        $classSubject->load(['subject', 'schoolClass', 'academicYear']);

        $students = $classSubject->schoolClass
            ->classStudents()
            ->where('academic_year_id', $classSubject->academic_year_id)
            ->where('status', 'AKTIF')
            ->with('student')
            ->get()
            ->pluck('student')
            ->filter()
            ->values();

        $lessons = $classSubject->dailyLessons()
            ->orderBy('lesson_date')
            ->get();

        $progress = StudentDailyProgress::query()
            ->whereIn('daily_lesson_id', $lessons->pluck('id'))
            ->whereIn('student_id', $students->pluck('id'))
            ->get()
            ->groupBy('student_id');

        $studentRows = $students->map(function ($student) use ($lessons, $progress) {
            $byLesson = $progress->get($student->id, collect())
                ->keyBy('daily_lesson_id');

            $scores = $lessons->map(
                fn ($lesson) => $byLesson->get($lesson->id)?->score
            );

            $notes = $lessons
                ->map(fn ($lesson) => $byLesson->get($lesson->id)?->teacher_note)
                ->filter()
                ->values();

            return [
                'id' => $student->id,
                'name' => $student->full_name,
                'nis' => $student->nisn,
                'scores' => $scores->values(),
                'notes' => $notes->last() ?? '',
            ];
        })->values();

        $academicYear = $classSubject->academicYear;

        return response()->json([
            'data' => [
                'classroom' => [
                    'classSubjectId' => $classSubject->id,
                    'subject' => $classSubject->subject?->name,
                    'class' => $classSubject->schoolClass?->name,
                    'academicYear' => $academicYear
                        ? "{$academicYear->start_year}/{$academicYear->end_year}"
                        : null,
                ],
                'lessons' => $lessons->map(fn (DailyLesson $lesson) => [
                    'id' => $lesson->id,
                    'date' => $lesson->lesson_date?->toDateString(),
                    'title' => $lesson->title,
                ])->values(),
                'students' => $studentRows,
            ],
        ]);
    }

    private function progressStatus(?float $average): string
    {
        if ($average === null) {
            return 'Belum Dinilai';
        }

        if ($average >= 85) {
            return 'Sangat Baik';
        }

        if ($average >= 70) {
            return 'Baik';
        }

        return 'Perlu Perhatian';
    }

    public function students(ClassSubject $classSubject)
    {
        $students = $classSubject->schoolClass
            ->classStudents()
            ->where('academic_year_id', $classSubject->academic_year_id)
            ->where('status', 'AKTIF')
            ->with('student')
            ->get()
            ->pluck('student')
            ->map(function ($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->full_name,
                    'nis' => $student->nisn,
                ];
            })
            ->values();

        return response()->json([
            'data' => $students,
        ]);
    }

    public function index(Request $request, SchoolClass $schoolClass)
    {
        $validated = $request->validate([
            'academic_year_id' => ['required', 'exists:academic_years,id'],
        ]);

        $data = ClassSubject::with([
            'subject',
            'teacher',
        ])
            ->where('school_class_id', $schoolClass->id)
            ->where('academic_year_id', $validated['academic_year_id'])
            ->get();

        return response()->json($data);
    }

    public function store(
        Request $request,
        SchoolClass $schoolClass
    ) {
        $validated = $request->validate([
            'academic_year_id' => ['required', 'exists:academic_years,id'],
            'subject_id' => ['required', 'exists:subjects,id'],
            'teacher_id' => ['required', 'exists:users,id'],
        ]);

        $teacher = User::findOrFail(
            $validated['teacher_id']
        );

        if ($teacher->role !== 'teacher') {
            return response()->json([
                'message' => 'User yang dipilih bukan guru.',
            ], 422);
        }

        $classSubject = ClassSubject::create([
            'academic_year_id' => $validated['academic_year_id'],
            'school_class_id' => $schoolClass->id,
            'subject_id' => $validated['subject_id'],
            'teacher_id' => $validated['teacher_id'],
        ]);

        return response()->json(
            $classSubject->load(['subject', 'teacher']),
            201
        );
    }

    public function update(
        Request $request,
        SchoolClass $schoolClass,
        ClassSubject $classSubject
    ) {
        $validated = $request->validate([
            'subject_id' => ['required', 'exists:subjects,id'],
            'teacher_id' => ['required', 'exists:users,id'],
        ]);

        $teacher = User::findOrFail(
            $validated['teacher_id']
        );

        if ($teacher->role !== 'teacher') {
            return response()->json([
                'message' => 'User yang dipilih bukan guru.',
            ], 422);
        }

        $classSubject->update($validated);

        return response()->json(
            $classSubject->load(['subject', 'teacher'])
        );
    }

    public function destroy(
        SchoolClass $schoolClass,
        ClassSubject $classSubject
    ) {
        $classSubject->delete();

        return response()->json([
            'message' => 'Penempatan mata pelajaran berhasil dihapus.',
        ]);
    }
}
