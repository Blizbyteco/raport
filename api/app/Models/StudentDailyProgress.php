<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentDailyProgress extends Model
{
    protected $guarded = ['id'];

    public function dailyLesson(): BelongsTo
    {
        return $this->belongsTo(DailyLesson::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
