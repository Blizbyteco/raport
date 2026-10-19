<?php

namespace Database\Seeders;

use App\Models\ClassSubject;
use App\Models\DailyLesson;
use App\Models\StudentDailyProgress;
use Illuminate\Database\Seeder;

class StudentDailyProgressSeeder extends Seeder
{
    public function run(): void
    {
        $classSubjects = ClassSubject::with([
            'schoolClass.classStudents' => function ($query) {
                $query->where('status', 'AKTIF');
            },
            'schoolClass.classStudents.student',
        ])
            ->get();

        if ($classSubjects->isEmpty()) {
            $this->command->error(
                'Tidak ada class subject untuk menjalankan StudentDailyProgressSeeder.'
            );

            return;
        }

        $scores = [
            88,
            82,
            75,
            91,
            68,
            79,
            95,
            73,
            86,
            64,
        ];

        $totalProgress = 0;

        foreach ($classSubjects as $classSubject) {
            $lessons = DailyLesson::where(
                'class_subject_id',
                $classSubject->id
            )
                ->orderBy('lesson_date')
                ->get();

            if ($lessons->isEmpty()) {
                continue;
            }

            $students = $classSubject->schoolClass
                ->classStudents()
                ->where(
                    'academic_year_id',
                    $classSubject->academic_year_id
                )
                ->where('status', 'AKTIF')
                ->with('student')
                ->get()
                ->pluck('student');

            if ($students->isEmpty()) {
                continue;
            }

            foreach ($lessons as $lesson) {
                foreach ($students->values() as $index => $student) {
                    $score = $scores[$index % count($scores)];

                    $note = match (true) {
                        $score >= 90 =>
                        'Siswa memahami materi dengan sangat baik.',

                        $score >= 80 =>
                        'Siswa memahami materi dengan baik.',

                        $score >= 70 =>
                        'Siswa cukup memahami materi dan masih perlu latihan.',

                        default =>
                        'Siswa memerlukan pendampingan lebih lanjut.',
                    };

                    StudentDailyProgress::create([
                        'daily_lesson_id' => $lesson->id,
                        'student_id' => $student->id,
                        'score' => $score,
                        'teacher_note' => $note,
                    ]);

                    $totalProgress++;
                }
            }
        }

        $this->command->info(
            "Berhasil membuat {$totalProgress} data student daily progress."
        );
    }
}
