<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\ClassHomeroomTeacher;
use App\Models\SchoolClass;
use App\Models\User;
use Illuminate\Database\Seeder;

class ClassHomeroomTeacherSeeder extends Seeder
{
    public function run(): void
    {
        $academicYear = AcademicYear::where('is_active', true)->firstOrFail();

        $classes = SchoolClass::whereIn('name', [
            '10A',
            '10B',
            '11A',
            '11B',
            '12A',
            '12B',
        ])
            ->orderBy('name')
            ->get();

        $teachers = User::where('role', 'teacher')
            ->where('is_active', true)
            ->orderBy('id')
            ->get();

        if ($classes->count() < 6) {
            throw new \RuntimeException(
                'Data kelas 10A, 10B, 11A, 11B, 12A, dan 12B belum lengkap.'
            );
        }

        if ($teachers->isEmpty()) {
            throw new \RuntimeException(
                'Data guru belum tersedia untuk menjalankan ClassHomeroomTeacherSeeder.'
            );
        }

        $data = [];

        foreach ($classes as $index => $class) {
            $teacher = $teachers[$index % $teachers->count()];

            $data[] = [
                'academic_year_id' => $academicYear->id,
                'school_class_id' => $class->id,
                'teacher_id' => $teacher->id,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        ClassHomeroomTeacher::insert($data);
    }
}
