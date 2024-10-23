<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

Route::get('/api/user', function() {
    $user = Auth::guard('web')->user();
    $admins = env('admin');
    if ($user) $user->admin = strpos($admins, $user->email) !== false;
    
    return response()->json(['user' => $user]);
});

Route::get('/{any}', function () {
    return view('app'); // Make sure this points to the correct view
})->where('any', '.*');

