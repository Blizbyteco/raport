<?php

namespace Database\Seeders;

use App\Models\ClassSubject;
use App\Models\DailyLesson;
use App\Models\Subject;
use Illuminate\Database\Seeder;

class DailyLessonSeeder extends Seeder
{
    public function run(): void
    {
        $subjects = [
            'Pendidikan Kewarganegaraan',
            'Bahasa Indonesia',
            'Matematika',
            'Bahasa Inggris',
            'Seni Budaya',
            'Informatika',
        ];

        $subjectData = [
            'Pendidikan Kewarganegaraan' => [
                [
                    'title' => 'Pancasila sebagai Dasar Negara',
                    'description' => 'Siswa mempelajari kedudukan dan fungsi Pancasila sebagai dasar negara.',
                ],
                [
                    'title' => 'Nilai-Nilai Pancasila',
                    'description' => 'Pembelajaran mengenai nilai-nilai Pancasila dalam kehidupan sehari-hari.',
                ],
                [
                    'title' => 'Norma dalam Kehidupan Masyarakat',
                    'description' => 'Siswa mempelajari pengertian dan jenis-jenis norma dalam kehidupan bermasyarakat.',
                ],
                [
                    'title' => 'Hak dan Kewajiban Warga Negara',
                    'description' => 'Pembelajaran mengenai hak dan kewajiban sebagai warga negara.',
                ],
            ],

            'Bahasa Indonesia' => [
                [
                    'title' => 'Teks Deskripsi',
                    'description' => 'Siswa mempelajari struktur dan ciri kebahasaan teks deskripsi.',
                ],
                [
                    'title' => 'Teks Narasi',
                    'description' => 'Pembelajaran mengenai struktur dan unsur-unsur teks narasi.',
                ],
                [
                    'title' => 'Kalimat Efektif',
                    'description' => 'Siswa mempelajari penggunaan kalimat efektif dalam komunikasi.',
                ],
                [
                    'title' => 'Menyusun Paragraf',
                    'description' => 'Pembelajaran mengenai cara menyusun paragraf yang runtut dan padu.',
                ],
            ],

            'Matematika' => [
                [
                    'title' => 'Bilangan Bulat',
                    'description' => 'Siswa mempelajari operasi hitung pada bilangan bulat.',
                ],
                [
                    'title' => 'Aljabar',
                    'description' => 'Pengenalan bentuk aljabar dan operasi dasar pada bentuk aljabar.',
                ],
                [
                    'title' => 'Persamaan Linear',
                    'description' => 'Pembelajaran mengenai persamaan linear dan penyelesaiannya.',
                ],
                [
                    'title' => 'Fungsi',
                    'description' => 'Siswa mempelajari konsep dasar fungsi dan penerapannya.',
                ],
            ],

            'Bahasa Inggris' => [
                [
                    'title' => 'Introduction and Classroom Expressions',
                    'description' => 'Pengenalan ungkapan yang digunakan dalam kegiatan pembelajaran di kelas.',
                ],
                [
                    'title' => 'Introducing Yourself',
                    'description' => 'Siswa mempelajari cara memperkenalkan diri menggunakan Bahasa Inggris.',
                ],
                [
                    'title' => 'Greetings and Leave Taking',
                    'description' => 'Pembelajaran mengenai ungkapan salam dan berpamitan.',
                ],
                [
                    'title' => 'Daily Activities',
                    'description' => 'Siswa mempelajari kosakata dan kalimat sederhana tentang aktivitas sehari-hari.',
                ],
            ],

            'Seni Budaya' => [
                [
                    'title' => 'Pengenalan Seni Rupa',
                    'description' => 'Siswa mempelajari pengertian dan jenis-jenis seni rupa.',
                ],
                [
                    'title' => 'Unsur-Unsur Seni Rupa',
                    'description' => 'Pembelajaran mengenai unsur-unsur dasar dalam seni rupa.',
                ],
                [
                    'title' => 'Menggambar Bentuk',
                    'description' => 'Siswa melakukan praktik menggambar bentuk menggunakan objek sederhana.',
                ],
                [
                    'title' => 'Apresiasi Karya Seni',
                    'description' => 'Pembelajaran mengenai cara mengapresiasi dan memahami karya seni.',
                ],
            ],

            'Informatika' => [
                [
                    'title' => 'Pengenalan Informatika',
                    'description' => 'Siswa mempelajari konsep dasar informatika dan penerapannya dalam kehidupan.',
                ],
                [
                    'title' => 'Berpikir Komputasional',
                    'description' => 'Pembelajaran mengenai konsep berpikir komputasional dalam menyelesaikan masalah.',
                ],
                [
                    'title' => 'Algoritma Dasar',
                    'description' => 'Siswa mempelajari konsep algoritma dan langkah-langkah penyelesaian masalah.',
                ],
                [
                    'title' => 'Pengenalan Pemrograman',
                    'description' => 'Pengenalan konsep dasar pemrograman dan struktur program sederhana.',
                ],
            ],
        ];

        $classSubjects = ClassSubject::with('subject')
            ->whereHas('subject', function ($query) use ($subjects) {
                $query->whereIn('name', $subjects);
            })
            ->get();

        if ($classSubjects->isEmpty()) {
            throw new \RuntimeException(
                'Data class subject belum tersedia untuk menjalankan DailyLessonSeeder.'
            );
        }

        $startDate = now()->startOfMonth()->setDay(1);

        foreach ($classSubjects as $classSubject) {
            $subjectName = $classSubject->subject->name;

            if (!isset($subjectData[$subjectName])) {
                continue;
            }

            foreach ($subjectData[$subjectName] as $index => $lesson) {
                DailyLesson::create([
                    'class_subject_id' => $classSubject->id,
                    'lesson_date' => $startDate->copy()->addDays($index * 2),
                    'title' => $lesson['title'],
                    'description' => $lesson['description'],
                ]);
            }
        }
    }
}
