<?php

namespace Database\Seeders;

use App\Models\SchoolClass;
use Illuminate\Database\Seeder;

class SchoolClassSeeder extends Seeder
{
    public function run(): void
    {
        $classes = [];

        for ($grade = 7; $grade <= 12; $grade++) {
            foreach (['A', 'B', 'C'] as $section) {
                $classes[] = [
                    'name' => "{$grade}{$section}",
                    'grade_level' => $grade,
                ];
            }
        }

        SchoolClass::insert($classes);
    }
}
