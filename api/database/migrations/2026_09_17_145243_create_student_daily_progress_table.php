<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('student_daily_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('daily_lesson_id')
                ->constrained('daily_lessons')
                ->cascadeOnDelete();

            $table->foreignId('student_id')
                ->constrained('students')
                ->cascadeOnDelete();

            $table->integer('score');
            $table->text('teacher_note')->nullable();
            $table->timestamps();

            $table->unique(
                ['daily_lesson_id', 'student_id'],
                'daily_progress_lesson_student_unique'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_daily_progress');
    }
};
