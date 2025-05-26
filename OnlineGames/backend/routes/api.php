<?php

use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GameController;
use App\Http\Controllers\GameSessionController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;

Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/logout', [UserController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/admin/login', [AdminController::class, 'login']);
Route::get('/admin/getdata', [AdminController::class, 'getData']);
Route::post('/admin/user/{id}/deactivate', [AdminController::class, 'deactivateUser']);
Route::post('/admin/user/{id}/anonymize', [AdminController::class, 'anonymizeUser']);
Route::post('/admin/game/{id}/toggle', [AdminController::class, 'toggleGameActive']);
Route::post('/admin/games/reorder', [AdminController::class, 'reorderGames']);
Route::post('/admin/games', [AdminController::class, 'addGame']);
Route::post('/admin/games/{id}/edit', [AdminController::class, 'editGame']);


Route::get('/games', [GameController::class, 'index']);
Route::get('/games/{id}', [GameController::class, 'show']);

Route::middleware('auth:sanctum')->group(function() {
    Route::post('/games/{id}/start', [GameSessionController::class, 'start']);
    Route::post('/games/sessions/{id}/end', [GameSessionController::class, 'end']);
    Route::get('/games/sessions/active', [GameSessionController::class, 'activeSession']);
});