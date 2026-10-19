<?php

namespace App\Http\Controllers;

use App\Models\ClassHomeroomTeacher;
use App\Models\SchoolClass;
use App\Models\User;
use Illuminate\Http\Request;

class ClassHomeroomTeacherController extends Controller
{
    public function show(
        Request $request,
        SchoolClass $schoolClass
    ) {
        $validated = $request->validate([
            'academic_year_id' => ['required', 'exists:academic_years,id'],
        ]);

        $data = ClassHomeroomTeacher::with('teacher')
            ->where('school_class_id', $schoolClass->id)
            ->where('academic_year_id', $validated['academic_year_id'])
            ->first();

        return response()->json($data);
    }

    public function update(
        Request $request,
        SchoolClass $schoolClass
    ) {
        $validated = $request->validate([
            'academic_year_id' => ['required', 'exists:academic_years,id'],
            'teacher_id' => ['required', 'exists:users,id'],
        ]);

        $teacher = User::findOrFail($validated['teacher_id']);

        if ($teacher->role !== 'GURU') {
            return response()->json([
                'message' => 'User yang dipilih bukan guru.'
            ], 422);
        }

        $data = ClassHomeroomTeacher::updateOrCreate(
            [
                'academic_year_id' => $validated['academic_year_id'],
                'school_class_id' => $schoolClass->id,
            ],
            [
                'teacher_id' => $validated['teacher_id'],
            ]
        );

        return response()->json(
            $data->load('teacher')
        );
    }

    public function destroy(
        Request $request,
        SchoolClass $schoolClass
    ) {
        $validated = $request->validate([
            'academic_year_id' => ['required', 'exists:academic_years,id'],
        ]);

        ClassHomeroomTeacher::where(
            'academic_year_id',
            $validated['academic_year_id']
        )
            ->where('school_class_id', $schoolClass->id)
            ->delete();

        return response()->json([
            'message' => 'Wali kelas berhasil dihapus.'
        ]);
    }
}
