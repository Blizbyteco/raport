<?php

namespace App\Http\Controllers;

use App\Models\ClassStudent;
use App\Models\SchoolClass;
use App\Models\Student;
use Illuminate\Http\Request;

class ClassStudentController extends Controller
{
    public function index(Request $request, SchoolClass $schoolClass)
    {
        $validated = $request->validate([
            'academic_year_id' => ['required', 'exists:academic_years,id'],
        ]);

        $students = ClassStudent::query()
            ->with('student')
            ->where('school_class_id', $schoolClass->id)
            ->where('academic_year_id', $validated['academic_year_id'])
            ->get();

        return response()->json($students);
    }

    public function store(
        Request $request,
        SchoolClass $schoolClass
    ) {
        $validated = $request->validate([
            'academic_year_id' => ['required', 'exists:academic_years,id'],
            'student_ids' => ['required', 'array', 'min:1'],
            'student_ids.*' => ['integer', 'exists:students,id'],
        ]);

        $academicYearId = $validated['academic_year_id'];

        foreach ($validated['student_ids'] as $studentId) {
            ClassStudent::updateOrCreate(
                [
                    'academic_year_id' => $academicYearId,
                    'student_id' => $studentId,
                ],
                [
                    'school_class_id' => $schoolClass->id,
                    'status' => 'AKTIF',
                ]
            );
        }

        return response()->json([
            'message' => 'Siswa berhasil ditempatkan ke kelas.'
        ], 201);
    }

    public function destroy(
        Request $request,
        SchoolClass $schoolClass,
        Student $student
    ) {
        $validated = $request->validate([
            'academic_year_id' => ['required', 'exists:academic_years,id'],
        ]);

        ClassStudent::where('academic_year_id', $validated['academic_year_id'])
            ->where('school_class_id', $schoolClass->id)
            ->where('student_id', $student->id)
            ->delete();

        return response()->json([
            'message' => 'Siswa berhasil dikeluarkan dari kelas.'
        ]);
    }
}
