<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Attendance extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'date' => 'date',
    ];

    public function classSubject(): BelongsTo
    {
        return $this->belongsTo(ClassSubject::class);
    }

    public function details(): HasMany
    {
        return $this->hasMany(AttendanceDetail::class);
    }
}
