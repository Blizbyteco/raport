<?php

namespace Database\Seeders;

use App\Models\AcademicTerm;
use App\Models\AcademicYear;
use Illuminate\Database\Seeder;

class AcademicYearSeeder extends Seeder
{
    public function run(): void
    {
        $academicYear2025 = AcademicYear::create([
            'start_year' => 2025,
            'end_year' => 2026,
            'is_active' => false,
        ]);

        AcademicTerm::create([
            'academic_year_id' => $academicYear2025->id,
            'name' => 'Ganjil',
            'start_date' => '2025-07-01',
            'end_date' => '2025-12-31',
        ]);

        AcademicTerm::create([
            'academic_year_id' => $academicYear2025->id,
            'name' => 'Genap',
            'start_date' => '2026-01-01',
            'end_date' => '2026-06-30',
        ]);

        $academicYear2026 = AcademicYear::create([
            'start_year' => 2026,
            'end_year' => 2027,
            'is_active' => true,
        ]);

        AcademicTerm::create([
            'academic_year_id' => $academicYear2026->id,
            'name' => 'Ganjil',
            'start_date' => '2026-07-01',
            'end_date' => '2026-12-31',
        ]);

        AcademicTerm::create([
            'academic_year_id' => $academicYear2026->id,
            'name' => 'Genap',
            'start_date' => '2027-01-01',
            'end_date' => '2027-06-30',
        ]);
    }
}
