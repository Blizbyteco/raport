<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ResetDummyDataSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('attendance_details')->delete();
        DB::table('attendances')->delete();

        DB::table('student_daily_progress')->delete();
        DB::table('daily_lessons')->delete();

        DB::table('class_homeroom_teachers')->delete();
        DB::table('class_subjects')->delete();
        DB::table('class_students')->delete();

        DB::table('students')->delete();
        DB::table('subjects')->delete();
        DB::table('school_classes')->delete();
        DB::table('academic_years')->delete();
    }
}
