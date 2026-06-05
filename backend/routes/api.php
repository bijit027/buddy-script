<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

// Auth routes (public)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:5,1'); // 5 attempts per minute per IP

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Posts
    Route::get('/posts', [PostController::class, 'index']);
    Route::post('/posts', [PostController::class, 'store']);
    Route::delete('/posts/{id}', [PostController::class, 'destroy']);
    Route::post('/posts/{id}/like', [PostController::class, 'like']);
    Route::get('/posts/{id}/likes', [PostController::class, 'getLikes']);
    Route::get('/posts/{id}/comments', [PostController::class, 'getComments']);
    Route::post('/posts/{id}/comments', [PostController::class, 'addComment']);
    // Comments
    Route::post('/comments/{id}/like', [CommentController::class, 'like']);
    Route::post('/comments/{id}/reply', [CommentController::class, 'reply']);

    // Profile
    Route::put('/profile', [ProfileController::class, 'update']);
});
