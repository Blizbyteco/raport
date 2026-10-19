<?php

namespace Database\Seeders;

use App\Models\Student;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        $students = [
            [
                'nisn' => '3123702269',
                'gender' => 'L',
                'full_name' => 'Ach. Reihan Zainal Rasyid',
                'parent_name' => 'Zainal Arifin',
            ],
            [
                'nisn' => '3139665253',
                'gender' => 'P',
                'full_name' => 'AFIKA',
                'parent_name' => 'HOLIS',
            ],
            [
                'nisn' => '3131968060',
                'gender' => 'P',
                'full_name' => 'AISYATUL LAYLI',
                'parent_name' => "RIDA'I",
            ],
            [
                'nisn' => '3124258183',
                'gender' => 'P',
                'full_name' => 'Ameliatus Soleha',
                'parent_name' => 'Amzah',
            ],
            [
                'nisn' => '144345524',
                'gender' => 'P',
                'full_name' => "ASMA'UL KAMILA",
                'parent_name' => 'MUBAROK',
            ],
            [
                'nisn' => '3137714915',
                'gender' => 'P',
                'full_name' => 'BAQIYAH',
                'parent_name' => 'MISBARAH',
            ],
            [
                'nisn' => '3149261046',
                'gender' => 'P',
                'full_name' => 'BELLY QIARA SANEKA PUTRI',
                'parent_name' => 'ZULKIFLI',
            ],
            [
                'nisn' => '129323510',
                'gender' => 'P',
                'full_name' => 'DANIA SALMA',
                'parent_name' => 'RAHMAD SALEH',
            ],
            [
                'nisn' => '3136958846',
                'gender' => 'P',
                'full_name' => 'EMILIYATUL JANNAH',
                'parent_name' => "RA'IS",
            ],
            [
                'nisn' => '3124521266',
                'gender' => 'L',
                'full_name' => 'IRFAN EFENDI',
                'parent_name' => 'H. Rozikin (almarhum)',
            ],
            [
                'nisn' => '3127038839',
                'gender' => 'L',
                'full_name' => 'MUHAMMAD FAJAR',
                'parent_name' => 'SUDARSONO',
            ],
            [
                'nisn' => '3136772018',
                'gender' => 'P',
                'full_name' => 'NADIA PUTRI',
                'parent_name' => 'ABDUL HAMID',
            ],
            [
                'nisn' => '3129114827',
                'gender' => 'L',
                'full_name' => 'RIZKY RAMADHAN',
                'parent_name' => 'SUKARDI',
            ],
            [
                'nisn' => '3134098210',
                'gender' => 'P',
                'full_name' => 'SITI AISYAH',
                'parent_name' => 'M. YUSUF',
            ],
            [
                'nisn' => '3126587431',
                'gender' => 'L',
                'full_name' => 'AHMAD FAUZI',
                'parent_name' => 'ABDULLAH',
            ],
            [
                'nisn' => '3135219064',
                'gender' => 'P',
                'full_name' => 'NUR AINI',
                'parent_name' => 'HASAN',
            ],
            [
                'nisn' => '3128347615',
                'gender' => 'L',
                'full_name' => 'MOCH. RIZAL',
                'parent_name' => 'MUSTAFA',
            ],
            [
                'nisn' => '3137482906',
                'gender' => 'P',
                'full_name' => 'FATIMAH AZ ZAHRA',
                'parent_name' => 'H. ALI',
            ],
            [
                'nisn' => '3129654387',
                'gender' => 'L',
                'full_name' => 'ILHAM MAULANA',
                'parent_name' => 'SAMSUL',
            ],
            [
                'nisn' => '3138561270',
                'gender' => 'P',
                'full_name' => 'DEWI LESTARI',
                'parent_name' => 'JUNAIDI',
            ],
            [
                'nisn' => '3124765908',
                'gender' => 'L',
                'full_name' => 'FAHMI HIDAYAT',
                'parent_name' => 'MANSUR',
            ],
            [
                'nisn' => '3136942158',
                'gender' => 'P',
                'full_name' => 'RATNA SARI',
                'parent_name' => 'SUYANTO',
            ],
            [
                'nisn' => '3127854309',
                'gender' => 'L',
                'full_name' => 'DICKY PRATAMA',
                'parent_name' => 'BAMBANG',
            ],
            [
                'nisn' => '3139182764',
                'gender' => 'P',
                'full_name' => 'LAILATUL HUSNA',
                'parent_name' => 'ABDUL WAHID',
            ],
            [
                'nisn' => '3125476831',
                'gender' => 'L',
                'full_name' => 'RIFQI AKBAR',
                'parent_name' => 'MUSTAIN',
            ],
            [
                'nisn' => '3137629045',
                'gender' => 'P',
                'full_name' => 'MIFTAHUL JANNAH',
                'parent_name' => 'SUPRIYADI',
            ],
            [
                'nisn' => '3128915736',
                'gender' => 'L',
                'full_name' => 'ANDI SETIAWAN',
                'parent_name' => 'SUKIMAN',
            ],
            [
                'nisn' => '3134758209',
                'gender' => 'P',
                'full_name' => 'NURUL HIDAYATI',
                'parent_name' => 'ROHMAN',
            ],
            [
                'nisn' => '3126389417',
                'gender' => 'L',
                'full_name' => 'FAJAR RAMADHAN',
                'parent_name' => 'BASORI',
            ],
            [
                'nisn' => '3138274605',
                'gender' => 'P',
                'full_name' => 'ANISA RAHMAWATI',
                'parent_name' => 'SUGENG',
            ],
        ];

        foreach ($students as $student) {
            Student::updateOrCreate(
                ['nisn' => $student['nisn']],
                $student
            );
        }
    }
}
