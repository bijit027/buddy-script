<?php

use Illuminate\Support\Facades\Route;

// Auth routes (public)
Route::post('/register', [\App\Http\Controllers\AuthController::class, 'register']);
Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login'])
    ->middleware('throttle:5,1'); // 5 attempts per minute per IP

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout']);
    Route::get('/me', [\App\Http\Controllers\AuthController::class, 'me']);

    // Posts
    Route::get('/posts', [\App\Http\Controllers\PostController::class, 'index']);
    Route::post('/posts', [\App\Http\Controllers\PostController::class, 'store']);
    Route::delete('/posts/{id}', [\App\Http\Controllers\PostController::class, 'destroy']);
    Route::post('/posts/{id}/like', [\App\Http\Controllers\PostController::class, 'like']);
    Route::get('/posts/{id}/comments', [\App\Http\Controllers\PostController::class, 'getComments']);
    Route::post('/posts/{id}/comments', [\App\Http\Controllers\PostController::class, 'addComment']);
    // Comments
    Route::post('/comments/{id}/like', [\App\Http\Controllers\CommentController::class, 'like']);
    Route::post('/comments/{id}/reply', [\App\Http\Controllers\CommentController::class, 'reply']);

    // Profile
    Route::put('/profile', [\App\Http\Controllers\ProfileController::class, 'update']);
});
