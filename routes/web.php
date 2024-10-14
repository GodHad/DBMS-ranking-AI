<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any}', function () {
    return view('app'); // Make sure this points to the correct view
})->where('any', '.*');
