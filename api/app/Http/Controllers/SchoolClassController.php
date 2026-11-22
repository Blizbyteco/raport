<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use Illuminate\Http\Request;

class SchoolClassController extends Controller
{
    public function index(Request $request)
    {
        $classes = SchoolClass::query()
            ->with([
                'homeroomTeachers' => function ($query) {
                    $query->with('teacher')->latest('id');
                },
            ])
            ->withCount([
                'classStudents as students_count' => fn ($query) => $query->where('status', 'AKTIF'),
                'classSubjects as subjects_count',
            ])
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search')->toString();

                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('grade_level')
            ->orderBy('name')
            ->get();

        return response()->json($classes);
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
        $schoolClass->load([
            'classStudents.student',
            'classSubjects.subject',
            'classSubjects.teacher',
            'homeroomTeachers.teacher',
        ]);

        $schoolClass->loadCount([
            'classStudents as students_count' => fn ($query) => $query->where('status', 'AKTIF'),
            'classSubjects as subjects_count',
        ]);

        return response()->json($schoolClass);
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
            'message' => 'Kelas berhasil dihapus.',
        ]);
    }
}
