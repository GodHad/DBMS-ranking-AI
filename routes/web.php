<?php

use App\Models\UserRole;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

Route::get('/api/user', function() {
    $user = Auth::guard('web')->user();
    $admins = env('admin');
    if ($user) {
        $user->admin = strpos($admins, $user->email) !== false;
        $userRole = UserRole::where('user_id', $user->id)->first();
        $user->author = $userRole->author;
    }
    return response()->json(['user' => $user]);
});

Route::get('/{any}', function () {
    return view('app'); // Make sure this points to the correct view
})->where('any', '.*');

