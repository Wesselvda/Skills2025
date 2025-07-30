<?php

use App\Http\Controllers\ContentController;
use Illuminate\Support\Facades\Route;

Route::get('/', [ContentController::class, 'index']);
Route::get('/heritages/{path?}', [ContentController::class, 'show'])
    ->where('path', '.*');
Route::get('/tags/{tag}', [ContentController::class, 'tag']);
Route::get('/search', [ContentController::class, 'search']);
