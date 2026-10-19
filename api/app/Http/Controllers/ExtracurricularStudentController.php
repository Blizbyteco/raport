<?php

namespace App\Http\Controllers;

use App\Models\Extracurricular;
use App\Models\ExtracurricularStudent;
use App\Models\Student;
use Illuminate\Http\Request;

class ExtracurricularStudentController extends Controller
{
    public function index(
        Request $request,
        Extracurricular $extracurricular
    ) {
        $validated = $request->validate([
            'academic_year_id' => [
                'required',
                'exists:academic_years,id',
            ],
        ]);

        $students = ExtracurricularStudent::query()
            ->with('student')
            ->where('extracurricular_id', $extracurricular->id)
            ->where('academic_year_id', $validated['academic_year_id'])
            ->get();

        return response()->json($students);
    }

    public function store(
        Request $request,
        Extracurricular $extracurricular
    ) {
        $validated = $request->validate([
            'academic_year_id' => [
                'required',
                'exists:academic_years,id',
            ],
            'student_ids' => [
                'required',
                'array',
                'min:1',
            ],
            'student_ids.*' => [
                'integer',
                'exists:students,id',
            ],
        ]);

        foreach ($validated['student_ids'] as $studentId) {
            ExtracurricularStudent::firstOrCreate([
                'academic_year_id' => $validated['academic_year_id'],
                'extracurricular_id' => $extracurricular->id,
                'student_id' => $studentId,
            ]);
        }

        return response()->json([
            'message' => 'Siswa berhasil ditambahkan ke ekstrakurikuler.'
        ], 201);
    }

    public function destroy(
        Request $request,
        Extracurricular $extracurricular,
        Student $student
    ) {
        $validated = $request->validate([
            'academic_year_id' => [
                'required',
                'exists:academic_years,id',
            ],
        ]);

        ExtracurricularStudent::where([
            'academic_year_id' => $validated['academic_year_id'],
            'extracurricular_id' => $extracurricular->id,
            'student_id' => $student->id,
        ])->delete();

        return response()->json([
            'message' => 'Siswa berhasil dikeluarkan dari ekstrakurikuler.'
        ]);
    }
}
