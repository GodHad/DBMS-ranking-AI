<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\SponsorController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DbmsController;
use App\Http\Controllers\TrendsController;
use App\Http\Controllers\EncyclopediaController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group([
    'middleware' => 'api',
], function ($router) {
    // auth routes
    Route::post('/register', [RegisterController::class, 'index']);
    Route::post('/login', [LoginController::class, 'index']);
    Route::get('/logout', [LoginController::class, 'logout']);

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
    Route::post('/update-sponsor', [SponsorController::class, 'update']);
    Route::delete('/delete-sponsor', [SponsorController::class, 'delete']);

    // categories routes
    Route::get('/get-categories', [CategoryController::class, 'categories']);
    Route::post('/create-category', [CategoryController::class, 'create']);
    Route::put('/update-category', [CategoryController::class, 'update']);
    Route::delete('/delete-category', [CategoryController::class, 'delete']);

    // trends routes
    Route::get('/get-trends-data-for-chart', [TrendsController::class, 'getChartData']);

    // encyclopedia routes
    Route::get('/get-encyclopedias', [EncyclopediaController::class, 'encyclopedias']);
    Route::get('/get-encyclopedia', [EncyclopediaController::class, 'encyclopedia']);
    Route::post('/create-encyclopedia', [EncyclopediaController::class, 'create']);
    Route::put('/update-encyclopedia', [EncyclopediaController::class, 'update']);
    Route::delete('/delete-encyclopedia', [EncyclopediaController::class, 'delete']);

    // testing route for fetching data
    Route::get('/test', [VendorController::class, 'test']);
});
