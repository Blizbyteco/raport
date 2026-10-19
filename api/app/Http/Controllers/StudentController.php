<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $students = Student::query()
            ->when(
                $request->search,
                fn($query, $search) =>
                $query->where('full_name', 'like', "%{$search}%")
                    ->orWhere('nisn', 'like', "%{$search}%")
            )
            ->orderBy('full_name')
            ->paginate(20);

        return response()->json($students);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nisn' => ['required', 'string', 'max:20', 'unique:students,nisn'],
            'full_name' => ['required', 'string', 'max:100'],
            'gender' => ['nullable', 'string', 'size:1'],
            'parent_name' => ['nullable', 'string', 'max:100'],
        ]);

        $student = Student::create($validated);

        return response()->json($student, 201);
    }

    public function show(Student $student)
    {
        return response()->json(
            $student->load([
                'classStudents.schoolClass',
                'classStudents.academicYear',
            ])
        );
    }

    public function update(
        Request $request,
        Student $student
    ) {
        $validated = $request->validate([
            'nisn' => [
                'required',
                'string',
                'max:20',
                'unique:students,nisn,' . $student->id,
            ],
            'full_name' => ['required', 'string', 'max:100'],
            'gender' => ['nullable', 'string', 'size:1'],
            'parent_name' => ['nullable', 'string', 'max:100'],
        ]);

        $student->update($validated);

        return response()->json($student);
    }

    public function destroy(Student $student)
    {
        $student->delete();

        return response()->json([
            'message' => 'Siswa berhasil dihapus.'
        ]);
    }
}
