<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckHigherManagement
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (!$user) {
            return redirect()->route('login');
        }

        $allowedRoles = ['admin', 'hod', 'hr-executive', 'inventory manager'];
        $userRole = strtolower($user->role ?? '');

        if (!in_array($userRole, $allowedRoles)) {
            auth()->guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return redirect()->route('login')->withErrors([
                'email' => 'Only higher management accounts are authorized to access this page.',
            ]);
        }

        return $next($request);
    }
}
