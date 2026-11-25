<?php

namespace App\Http\Controllers;

use App\Models\ClassSubject;
use Illuminate\Support\Facades\Auth;

abstract class Controller
{
    /**
     * Admins may manage every subject; a teacher only the subjects they teach.
     */
    protected function ensureCanManageClassSubject(
        ClassSubject $classSubject
    ): void {
        $user = Auth::user();

        if ($user?->role === 'admin') {
            return;
        }

        $ownsSubject = $user?->role === 'teacher'
            && (int) $user->id === (int) $classSubject->teacher_id;

        abort_unless(
            $ownsSubject,
            403,
            'Anda tidak mengajar mata pelajaran ini.'
        );
    }
}
