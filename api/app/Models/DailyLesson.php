<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DailyLesson extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'lesson_date' => 'date',
    ];

    public function classSubject(): BelongsTo
    {
        return $this->belongsTo(ClassSubject::class);
    }

    public function studentProgress(): HasMany
    {
        return $this->hasMany(StudentDailyProgress::class);
    }

    public function studentDailyProgress(): HasMany
    {
        return $this->hasMany(StudentDailyProgress::class);
    }
}
