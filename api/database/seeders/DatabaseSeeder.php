<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            UserSeeder::class,
            StudentSeeder::class,
            AcademicYearSeeder::class,
            SchoolClassSeeder::class,
            SubjectSeeder::class,

            ClassStudentSeeder::class,
            ClassSubjectSeeder::class,
            ClassHomeroomTeacherSeeder::class,

            DailyLessonSeeder::class,
            StudentDailyProgressSeeder::class,

            AttendanceSeeder::class,
        ]);
    }
}
