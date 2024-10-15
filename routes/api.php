<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\SponsorController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DbmsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group([
    'middleware' => 'api',
], function ($router) {
    // auth routes
    Route::post('/register', [RegisterController::class, 'index']);
    Route::post('/login', [LoginController::class, 'index']);

    // vendor routes
    Route::get('/get-vendors', [VendorController::class, 'vendors']);
    Route::get('/get-vendor', [VendorController::class, 'vendor']);
    Route::post('/create-vendor', [VendorController::class, 'create']);
    Route::put('/update-vendor', [VendorController::class, 'update']);
    Route::delete('/delete-vendor', [VendorController::class, 'delete']);

    // sponsor routes
    Route::get('/get-sponsors', [SponsorController::class, 'sponsors']);
    Route::get('/get-sponsor', [SponsorController::class, 'sponsor']);
    Route::post('/create-sponsor', [SponsorController::class, 'create']);
    Route::put('/update-sponsor', [SponsorController::class, 'update']);
    Route::delete('/delete-sponsor', [SponsorController::class, 'delete']);

    // categories routes
    Route::get('/get-categories', [CategoryController::class, 'categories']);
    Route::post('/create-category', [CategoryController::class, 'create']);
    Route::put('/update-category', [CategoryController::class, 'update']);
    Route::delete('/delete-category', [CategoryController::class, 'delete']);

    // testing route for fetching data
    Route::get('/test', [DbmsController::class, 'create']);
});
