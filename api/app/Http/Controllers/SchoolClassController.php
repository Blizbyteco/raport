<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use Illuminate\Http\Request;

class SchoolClassController extends Controller
{
    public function index()
    {
        return response()->json(
            SchoolClass::orderBy('grade_level')
                ->orderBy('name')
                ->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:50'],
            'grade_level' => ['required', 'integer', 'between:10,12'],
        ]);

        $schoolClass = SchoolClass::create($validated);

        return response()->json($schoolClass, 201);
    }

    public function show(SchoolClass $schoolClass)
    {
        return response()->json(
            $schoolClass->load([
                'classStudents.student',
                'classSubjects.subject',
                'classSubjects.teacher',
                'homeroomTeachers.teacher',
            ])
        );
    }

    public function update(
        Request $request,
        SchoolClass $schoolClass
    ) {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:50'],
            'grade_level' => ['required', 'integer', 'between:10,12'],
        ]);

        $schoolClass->update($validated);

        return response()->json($schoolClass);
    }

    public function destroy(SchoolClass $schoolClass)
    {
        $schoolClass->delete();

        return response()->json([
            'message' => 'Kelas berhasil dihapus.'
        ]);
    }
}
