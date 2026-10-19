<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Extracurricular extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function teachers(): HasMany
    {
        return $this->hasMany(ExtracurricularTeacher::class);
    }

    public function students(): HasMany
    {
        return $this->hasMany(ExtracurricularStudent::class);
    }
}
