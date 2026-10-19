<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\ClassStudent;
use App\Models\SchoolClass;
use App\Models\Student;
use Illuminate\Database\Seeder;

class ClassStudentSeeder extends Seeder
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
            ->get()
            ->keyBy('name');

        if ($classes->count() < 6) {
            throw new \RuntimeException(
                'Data kelas 10A, 10B, 11A, 11B, 12A, dan 12B belum lengkap.'
            );
        }

        $students = Student::orderBy('id')->get();

        if ($students->count() < 30) {
            throw new \RuntimeException(
                'Data siswa minimal 30 siswa untuk menjalankan ClassStudentSeeder.'
            );
        }

        $classNames = [
            '10A',
            '10B',
            '11A',
            '11B',
            '12A',
            '12B',
        ];

        $data = [];

        foreach ($students->take(30)->values() as $index => $student) {
            $className = $classNames[intdiv($index, 5)];

            $data[] = [
                'academic_year_id' => $academicYear->id,
                'school_class_id' => $classes[$className]->id,
                'student_id' => $student->id,
                'status' => 'AKTIF',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        ClassStudent::insert($data);
    }
}
