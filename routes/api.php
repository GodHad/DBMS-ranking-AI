<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group([
    'middleware' => 'api',
], function ($router) {
    Route::post('/register', [RegisterController::class, 'index']);
    Route::post('/login', [LoginController::class, 'index']);
});

Route::get('/test', function () {
    return 'API is working';
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
