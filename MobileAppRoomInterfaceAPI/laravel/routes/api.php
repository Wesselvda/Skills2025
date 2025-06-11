<?php

use App\Http\Controllers\RoomController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/start', [RoomController::class, 'start']);
    Route::post('/change', [RoomController::class, 'change']);
    Route::post('/room', [RoomController::class, 'room']);
});
