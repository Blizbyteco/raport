<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    protected $guarded = ['id'];

    public function classStudents(): HasMany
    {
        return $this->hasMany(ClassStudent::class);
    }

    public function dailyProgress(): HasMany
    {
        return $this->hasMany(StudentDailyProgress::class);
    }

    public function extracurriculars(): HasMany
    {
        return $this->hasMany(ExtracurricularStudent::class);
    }
}
