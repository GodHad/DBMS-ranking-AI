<?php

namespace App\Http\Middleware;
use App\Models\UserRole;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class VendorMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::guard('web')->user();
        if (!$user) return response()->json(['error' => 'You can\'t do this operation'], 403);
        $userRole = UserRole::where('user_id', $user->id)->where('approved', 1)->first();
        $admin_emails = env('admin');
        if (strpos($admin_emails, $user->email) === false && !$userRole) return response()->json(['error' => 'You can\'t do this operation'], 403);
        return $next($request);
    }
}
