<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\ClassSubject;
use App\Models\SchoolClass;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Seeder;

class ClassSubjectSeeder extends Seeder
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

        $subjects = Subject::orderBy('id')
            ->take(6)
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

        if ($subjects->count() < 6) {
            throw new \RuntimeException(
                'Data subject minimal 6 untuk menjalankan ClassSubjectSeeder.'
            );
        }

        if ($teachers->isEmpty()) {
            throw new \RuntimeException(
                'Data guru belum tersedia untuk menjalankan ClassSubjectSeeder.'
            );
        }

        $data = [];

        $teacherIndex = 0;

        foreach ($classes as $class) {
            foreach ($subjects as $subject) {
                $teacher = $teachers[$teacherIndex % $teachers->count()];

                $data[] = [
                    'academic_year_id' => $academicYear->id,
                    'school_class_id' => $class->id,
                    'subject_id' => $subject->id,
                    'teacher_id' => $teacher->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                $teacherIndex++;
            }
        }

        ClassSubject::insert($data);
    }
}
