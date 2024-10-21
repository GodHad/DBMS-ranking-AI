<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

Route::get('/api/user', function() {
    return response()->json(['user' => Auth::user()]);
});

Route::get('/{any}', function () {
    return view('app'); // Make sure this points to the correct view
})->where('any', '.*');

