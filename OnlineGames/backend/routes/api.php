<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GameController;
use App\Http\Controllers\GameSessionController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;

// User Authentication
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/logout', [UserController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Games
Route::get('/games', [GameController::class, 'index']);
Route::get('/games/{id}', [GameController::class, 'show']);

// Game Sessions (Protected)
Route::middleware('auth:sanctum')->group(function() {
    Route::post('/games/{id}/start', [GameSessionController::class, 'start']);
    Route::post('/games/sessions/{id}/end', [GameSessionController::class, 'end']);
    Route::get('/games/sessions/active', [GameSessionController::class, 'activeSession']);
});