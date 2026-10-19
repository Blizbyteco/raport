<?php

namespace App\Http\Controllers;

use App\Http\Resources\TeacherSubjectResource;
use App\Models\ClassSubject;
use App\Models\SchoolClass;
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

        $teacher = \App\Models\User::findOrFail(
            $validated['teacher_id']
        );

        if ($teacher->role !== 'GURU') {
            return response()->json([
                'message' => 'User yang dipilih bukan guru.'
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

        $teacher = \App\Models\User::findOrFail(
            $validated['teacher_id']
        );

        if ($teacher->role !== 'GURU') {
            return response()->json([
                'message' => 'User yang dipilih bukan guru.'
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
            'message' => 'Penempatan mata pelajaran berhasil dihapus.'
        ]);
    }
}
