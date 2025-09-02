<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\MentorController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:api');

Route::prefix('v1')->group(function () {
    Route::prefix('users')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
    });

    Route::get('courses', [CourseController::class, 'index']);
    Route::get('courses/{id}', [CourseController::class, 'course']);

    Route::get('mentors/sessions', [MentorController::class, 'sessions']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('courses/{id}/enroll', [CourseController::class, 'enrollCourse']);
        Route::get('mentors/sessions/{id}/book', [MentorController::class, 'book']);
    });
});