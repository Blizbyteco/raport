<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AcademicYearController extends Controller
{
    /**
     * Display a listing of academic years.
     */
    public function index(): JsonResponse
    {
        $academicYears = AcademicYear::with([
            'terms' => function ($query) {
                $query->orderBy('start_date');
            },
        ])
            ->orderByDesc('start_year')
            ->get();

        return response()->json([
            'message' => 'Data tahun ajaran berhasil diambil.',
            'data' => $academicYears,
        ]);
    }

    /**
     * Store a newly created academic year.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'start_year' => [
                'required',
                'integer',
                'min:2000',
                'max:2100',
            ],

            'end_year' => [
                'required',
                'integer',
                'min:2000',
                'max:2100',
            ],

            'terms' => [
                'required',
                'array',
                'size:2',
            ],

            'terms.*.name' => [
                'required',
                Rule::in(['Ganjil', 'Genap']),
            ],

            'terms.*.start_date' => [
                'required',
                'date',
            ],

            'terms.*.end_date' => [
                'required',
                'date',
            ],
        ]);

        if ((int) $validated['end_year'] !== (int) $validated['start_year'] + 1) {
            return response()->json([
                'message' => 'Tahun selesai harus satu tahun setelah tahun mulai.',
            ], 422);
        }

        $termNames = collect($validated['terms'])
            ->pluck('name');

        if ($termNames->count() !== $termNames->unique()->count()) {
            return response()->json([
                'message' => 'Semester Ganjil dan Genap tidak boleh duplikat.',
            ], 422);
        }

        foreach ($validated['terms'] as $term) {
            if ($term['end_date'] < $term['start_date']) {
                return response()->json([
                    'message' => 'Tanggal selesai semester tidak boleh sebelum tanggal mulai.',
                ], 422);
            }
        }

        $academicYear = DB::transaction(function () use ($validated) {
            $academicYear = AcademicYear::create([
                'start_year' => $validated['start_year'],
                'end_year' => $validated['end_year'],
            ]);

            foreach ($validated['terms'] as $term) {
                $academicYear->terms()->create([
                    'name' => $term['name'],
                    'start_date' => $term['start_date'],
                    'end_date' => $term['end_date'],
                ]);
            }

            return $academicYear->load('terms');
        });

        return response()->json([
            'message' => 'Tahun ajaran berhasil dibuat.',
            'data' => $academicYear,
        ], 201);
    }

    /**
     * Display the specified academic year.
     */
    public function show(AcademicYear $academicYear): JsonResponse
    {
        $academicYear->load([
            'terms' => function ($query) {
                $query->orderBy('start_date');
            },
        ]);

        return response()->json([
            'message' => 'Data tahun ajaran berhasil diambil.',
            'data' => $academicYear,
        ]);
    }

    /**
     * Update the specified academic year.
     */
    public function update(
        Request $request,
        AcademicYear $academicYear
    ): JsonResponse {
        $validated = $request->validate([
            'start_year' => [
                'required',
                'integer',
                'min:2000',
                'max:2100',
            ],

            'end_year' => [
                'required',
                'integer',
                'min:2000',
                'max:2100',
            ],

            'terms' => [
                'required',
                'array',
                'size:2',
            ],

            'terms.*.id' => [
                'nullable',
                'integer',
            ],

            'terms.*.name' => [
                'required',
                Rule::in(['Ganjil', 'Genap']),
            ],

            'terms.*.start_date' => [
                'required',
                'date',
            ],

            'terms.*.end_date' => [
                'required',
                'date',
            ],
        ]);

        if ((int) $validated['end_year'] !== (int) $validated['start_year'] + 1) {
            return response()->json([
                'message' => 'Tahun selesai harus satu tahun setelah tahun mulai.',
            ], 422);
        }

        $termNames = collect($validated['terms'])
            ->pluck('name');

        if ($termNames->count() !== $termNames->unique()->count()) {
            return response()->json([
                'message' => 'Semester Ganjil dan Genap tidak boleh duplikat.',
            ], 422);
        }

        foreach ($validated['terms'] as $term) {
            if ($term['end_date'] < $term['start_date']) {
                return response()->json([
                    'message' => 'Tanggal selesai semester tidak boleh sebelum tanggal mulai.',
                ], 422);
            }
        }

        DB::transaction(function () use ($validated, $academicYear) {
            $academicYear->update([
                'start_year' => $validated['start_year'],
                'end_year' => $validated['end_year'],
            ]);

            foreach ($validated['terms'] as $term) {
                $academicYear->terms()->updateOrCreate(
                    [
                        'name' => $term['name'],
                    ],
                    [
                        'start_date' => $term['start_date'],
                        'end_date' => $term['end_date'],
                    ]
                );
            }
        });

        $academicYear->load([
            'terms' => function ($query) {
                $query->orderBy('start_date');
            },
        ]);

        return response()->json([
            'message' => 'Tahun ajaran berhasil diperbarui.',
            'data' => $academicYear,
        ]);
    }

    /**
     * Remove the specified academic year.
     */
    public function destroy(AcademicYear $academicYear): JsonResponse
    {
        if ($academicYear->is_active) {
            return response()->json([
                'message' => 'Tahun ajaran yang sedang aktif tidak dapat dihapus.',
            ], 422);
        }

        $academicYear->delete();

        return response()->json([
            'message' => 'Tahun ajaran berhasil dihapus.',
        ]);
    }
}
