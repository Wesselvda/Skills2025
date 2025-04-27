<?php

use App\Http\Controllers\LoginController;
use Illuminate\Support\Facades\Route;

Route::get('/login', [LoginController::class, 'showLoginForm'])
    ->withoutMiddleware(['auth'])
    ->name('login');

Route::post('/login', [LoginController::class, 'login'])
    ->withoutMiddleware(['auth']);

Route::middleware(['auth'])->group(function () {
    Route::get('/', function () {
        return inertia('Dashboard');
    })->name('home');

    Route::get('/logout', [LoginController::class, 'logout']);

    Route::post('/updateprofile', [LoginController::class, 'updateProfile']);
    Route::post('/updateprofilepicture', [LoginController::class, 'updateProfilePicture']);
});