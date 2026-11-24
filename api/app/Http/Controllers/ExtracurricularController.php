<?php

namespace App\Http\Controllers;

use App\Models\Extracurricular;
use Illuminate\Http\Request;

class ExtracurricularController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'academic_year_id' => [
                'nullable',
                'exists:academic_years,id',
            ],
        ]);

        $academicYearId = $validated['academic_year_id'] ?? null;

        $extracurriculars = Extracurricular::query()
            ->withCount([
                'teachers' => fn ($query) => $query->when(
                    $academicYearId,
                    fn ($countQuery) => $countQuery->where(
                        'academic_year_id',
                        $academicYearId
                    )
                ),
                'students' => fn ($query) => $query->when(
                    $academicYearId,
                    fn ($countQuery) => $countQuery->where(
                        'academic_year_id',
                        $academicYearId
                    )
                ),
            ])
            ->orderBy('name')
            ->get();

        return response()->json($extracurriculars);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ]);

        $extracurricular = Extracurricular::create($validated);

        return response()->json($extracurricular, 201);
    }

    public function show(Extracurricular $extracurricular)
    {
        return response()->json(
            $extracurricular->load([
                'teachers.teacher',
                'students.student',
            ])
        );
    }

    public function update(
        Request $request,
        Extracurricular $extracurricular
    ) {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ]);

        $extracurricular->update($validated);

        return response()->json($extracurricular);
    }

    public function destroy(Extracurricular $extracurricular)
    {
        $extracurricular->delete();

        return response()->json([
            'message' => 'Ekstrakurikuler berhasil dihapus.',
        ]);
    }
}
