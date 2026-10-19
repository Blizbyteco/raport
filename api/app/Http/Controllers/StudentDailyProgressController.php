<?php

namespace App\Http\Controllers;

use App\Models\DailyLesson;
use App\Models\StudentDailyProgress;
use Illuminate\Http\Request;

class StudentDailyProgressController extends Controller
{
    public function index(DailyLesson $dailyLesson)
    {
        $progress = $dailyLesson
            ->studentDailyProgress()
            ->with('student')
            ->get();

        return response()->json([
            'data' => $progress,
        ]);
    }

    public function update(
        Request $request,
        DailyLesson $dailyLesson,
        $student
    ) {
        $validated = $request->validate([
            'score' => [
                'required',
                'integer',
                'min:1',
                'max:100',
            ],

            'teacher_note' => [
                'nullable',
                'string',
            ],
        ]);

        $progress = StudentDailyProgress::where(
            'daily_lesson_id',
            $dailyLesson->id
        )
            ->where('student_id', $student)
            ->firstOrFail();

        $progress->update($validated);

        return response()->json([
            'message' => 'Progress siswa berhasil diperbarui.',
            'data' => $progress,
        ]);
    }
}
