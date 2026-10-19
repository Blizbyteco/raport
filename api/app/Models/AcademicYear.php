<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AcademicYear extends Model
{
    protected $guarded = ['id'];
    protected $casts = ['is_active' => 'boolean'];

    public function classStudents(): HasMany
    {
        return $this->hasMany(ClassStudent::class);
    }

    public function classSubjects(): HasMany
    {
        return $this->hasMany(ClassSubject::class);
    }

    public function homeroomTeachers(): HasMany
    {
        return $this->hasMany(ClassHomeroomTeacher::class);
    }

    public function extracurricularTeachers(): HasMany
    {
        return $this->hasMany(ExtracurricularTeacher::class);
    }

    public function extracurricularStudents(): HasMany
    {
        return $this->hasMany(ExtracurricularStudent::class);
    }

    public function terms()
    {
        return $this->hasMany(AcademicTerm::class);
    }
}
