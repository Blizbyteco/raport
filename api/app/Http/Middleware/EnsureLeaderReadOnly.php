<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureLeaderReadOnly
{
    /**
     * Head of foundation (leader) may read all data, but never mutate it.
     * Profile management and logout stay available for their own account.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || $user->role !== 'leader' || $request->isMethodSafe()) {
            return $next($request);
        }

        if ($request->is('api/profile', 'api/profile/password', 'api/logout')) {
            return $next($request);
        }

        return response()->json([
            'message' => 'Akun pimpinan yayasan hanya memiliki akses baca.',
        ], 403);
    }
}
