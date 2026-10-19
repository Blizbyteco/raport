<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\AttendanceDetail;
use App\Models\ClassSubject;
use Illuminate\Database\Seeder;

class AttendanceSeeder extends Seeder
{
    public function run(): void
    {
        $classSubjects = ClassSubject::with([
            'schoolClass',
            'subject',
        ])->get();

        if ($classSubjects->isEmpty()) {
            throw new \RuntimeException(
                'Data class subject belum tersedia untuk menjalankan AttendanceSeeder.'
            );
        }

        $totalAttendances = 0;
        $totalDetails = 0;

        foreach ($classSubjects as $classSubject) {
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

            /*
             * 4 pertemuan untuk setiap class subject.
             */
            for ($meeting = 1; $meeting <= 4; $meeting++) {
                $date = now()
                    ->startOfMonth()
                    ->addDays(($meeting - 1) * 7);

                $attendance = Attendance::create([
                    'class_subject_id' => $classSubject->id,
                    'date' => $date,
                    'notes' => "Absensi pertemuan {$meeting} - {$classSubject->subject->name}.",
                ]);

                foreach ($students->values() as $index => $student) {
                    /*
                     * Mayoritas siswa hadir,
                     * tetapi tetap ada variasi status.
                     */
                    $statusIndex = ($index + $meeting) % 10;

                    $status = match ($statusIndex) {
                        0, 1, 2, 3, 4, 5, 6 => 'present',
                        7 => 'permission',
                        8 => 'sick',
                        9 => 'absent',
                    };

                    $note = match ($status) {
                        'present' => null,
                        'permission' => 'Siswa izin tidak mengikuti pembelajaran.',
                        'sick' => 'Siswa tidak hadir karena sakit.',
                        'absent' => 'Siswa tidak hadir tanpa keterangan.',
                    };

                    AttendanceDetail::create([
                        'attendance_id' => $attendance->id,
                        'student_id' => $student->id,
                        'status' => $status,
                        'note' => $note,
                    ]);

                    $totalDetails++;
                }

                $totalAttendances++;
            }
        }

        $this->command->info(
            "Berhasil membuat {$totalAttendances} attendance dan {$totalDetails} attendance details."
        );
    }
}
