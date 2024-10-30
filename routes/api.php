<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\SponsorController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DbmsController;
use App\Http\Controllers\TrendsController;
use App\Http\Controllers\EncyclopediaController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\VendorRequestController;
use App\Http\Controllers\AuthorRequestController;
use App\Http\Controllers\FeaturedProductController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\ContactController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group([
    'middleware' => 'api',
], function () {
    
    Route::group(['middleware' => 'admin'], function ($router) {
        Route::post('/create-sponsor', [SponsorController::class, 'create']);
        Route::post('/update-sponsor', [SponsorController::class, 'update']);
        Route::delete('/delete-sponsor', [SponsorController::class, 'delete']);

        Route::post('/create-category', [CategoryController::class, 'create']);
        Route::post('/update-category', [CategoryController::class, 'update']);
        Route::delete('/delete-category', [CategoryController::class, 'delete']);

        Route::post('/create-encyclopedia', [EncyclopediaController::class, 'create']);
        Route::post('/update-encyclopedia', [EncyclopediaController::class, 'update']);
        Route::delete('/delete-encyclopedia', [EncyclopediaController::class, 'delete']);
        Route::prefix('blog')->group(function () {
            Route::post('/create-tag', [BlogController::class, 'createTag']);
            Route::post('/update-tag', [BlogController::class, 'updateTag']);
            Route::delete('/delete-tag', [BlogController::class, 'deleteTag']);
        
            Route::post('/create-category', [BlogController::class, 'createCategory']);
            Route::post('/update-category', [BlogController::class, 'updateCategory']);
            Route::delete('/delete-category', [BlogController::class, 'deleteCategory']);
        });

        Route::post('/create-vendor-manager', [VendorRequestController::class, 'createVendor']);
        Route::post('/update-vendor-manager', [VendorRequestController::class, 'updateVendor']);
        Route::delete('/delete-vendor-manager', [VendorRequestController::class, 'deleteVendor']);

        Route::post('/create-author', [AuthorRequestController::class, 'createAuthor']);
        Route::post('/update-author', [AuthorRequestController::class, 'updateAuthor']);
        Route::delete('/delete-author', [AuthorRequestController::class, 'deleteAuthor']);

        Route::post('/create-featured-product', [FeaturedProductController::class, 'create']);
        Route::post('/update-featured-product', [FeaturedProductController::class, 'update']);
        Route::delete('/delete-featured-product', [FeaturedProductController::class, 'delete']);
    });

    Route::middleware(['author'])->group(function () {
        Route::post('/create-blog', [BlogController::class, 'createBlog']);
        Route::post('/update-blog', [BlogController::class, 'updateBlog']);
        Route::delete('/delete-blog', [BlogController::class, 'deleteBlog']);
    });

    Route::middleware(['vendor'])->group(function () {
        Route::post('/create-vendor', [VendorController::class, 'create']);
        Route::post('/update-vendor', [VendorController::class, 'update']);
        Route::delete('/delete-vendor', [VendorController::class, 'delete']);
    });
    // auth routes
    Route::post('/register', [RegisterController::class, 'index']);
    Route::post('/login', [LoginController::class, 'index']);
    Route::get('/logout', [LoginController::class, 'logout']);

    // vendor routes
    Route::get('/get-vendors', [VendorController::class, 'vendors']);
    Route::get('/get-vendor', [VendorController::class, 'vendor']);

    // sponsor routes
    Route::get('/get-sponsors', [SponsorController::class, 'sponsors']);
    Route::get('/get-sponsor', [SponsorController::class, 'sponsor']);

    // categories routes
    Route::get('/get-categories', [CategoryController::class, 'categories']);

    // trends routes
    Route::get('/get-trends-data-for-chart', [TrendsController::class, 'getChartData']);

    // encyclopedia routes
    Route::get('/get-encyclopedias', [EncyclopediaController::class, 'encyclopedias']);
    Route::get('/get-encyclopedia', [EncyclopediaController::class, 'encyclopedia']);

    // blogs routes
    Route::get('/get-blogs', [BlogController::class, 'getBlogs']);
    Route::get('/get-blog', [BlogController::class, 'getBlog']);
    
    Route::post('/blog/upload-image', [BlogController::class, 'uploadImage']);

    Route::get('/blog/get-tags', [BlogController::class, 'getTags']);

    Route::get('/blog/get-categories', [BlogController::class, 'getCategories']);

    // Route::get('/get-recently-blogs', [BlogController::class, 'getRecentlyBlogs']);

    // vendor requests
    Route::get('/get-vendor-managers', [VendorRequestController::class, 'getAllVendors']);
    
    Route::get('/get-vendor-requests', [VendorRequestController::class, 'getAllRequests']);
    
    // author requests
    Route::get('/get-authors', [AuthorRequestController::class, 'getAllAuthors']);

    // featured product
    Route::get('/get-featured-products', [FeaturedProductController::class, 'featured_products']);
    Route::get('/get-featured-product', [FeaturedProductController::class, 'featured_product']);

    // banner 
    Route::get('/get-banners', [BannerController::class, 'getBanners']);
    Route::post('/create-banner', [BannerController::class, 'createBanner']);
    Route::post('/update-banner', [BannerController::class, 'updateBanner']);
    Route::delete('/delete-banner', [BannerController::class, 'deleteBanner']);

    // testing route for fetching data
    Route::post('/send-request', [ContactController::class, 'index']);
    Route::get('/test', [VendorController::class, 'test']);
});
