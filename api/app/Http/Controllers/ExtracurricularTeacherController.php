<?php

namespace App\Http\Controllers;

use App\Models\Extracurricular;
use App\Models\ExtracurricularTeacher;
use App\Models\User;
use Illuminate\Http\Request;

class ExtracurricularTeacherController extends Controller
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

        $teachers = ExtracurricularTeacher::query()
            ->with('teacher')
            ->where('extracurricular_id', $extracurricular->id)
            ->where('academic_year_id', $validated['academic_year_id'])
            ->get();

        return response()->json($teachers);
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
            'teacher_id' => [
                'required',
                'exists:users,id',
            ],
        ]);

        $teacher = User::findOrFail($validated['teacher_id']);

        if ($teacher->role !== 'GURU') {
            return response()->json([
                'message' => 'User yang dipilih bukan guru.'
            ], 422);
        }

        $assignment = ExtracurricularTeacher::firstOrCreate([
            'academic_year_id' => $validated['academic_year_id'],
            'extracurricular_id' => $extracurricular->id,
            'teacher_id' => $validated['teacher_id'],
        ]);

        return response()->json(
            $assignment->load('teacher'),
            201
        );
    }

    public function destroy(
        Request $request,
        Extracurricular $extracurricular,
        User $teacher
    ) {
        $validated = $request->validate([
            'academic_year_id' => [
                'required',
                'exists:academic_years,id',
            ],
        ]);

        ExtracurricularTeacher::where([
            'academic_year_id' => $validated['academic_year_id'],
            'extracurricular_id' => $extracurricular->id,
            'teacher_id' => $teacher->id,
        ])->delete();

        return response()->json([
            'message' => 'Guru berhasil dihapus dari ekstrakurikuler.'
        ]);
    }
}
