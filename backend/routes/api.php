<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

// Auth routes (public)
Route::post('/register', [AuthController::class, 'register'])
    ->middleware('throttle:5,1');
Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:5,1');

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Posts
    Route::get('/posts', [PostController::class, 'index']);
    Route::post('/posts', [PostController::class, 'store'])
        ->middleware('throttle:20,1');
    Route::put('/posts/{post}', [PostController::class, 'update']);
    Route::delete('/posts/{post}', [PostController::class, 'destroy']);
    Route::post('/posts/{post}/like', [PostController::class, 'like'])
        ->middleware('throttle:60,1');
    Route::get('/posts/{post}/likes', [PostController::class, 'getLikes']);
    Route::get('/posts/{post}/comments', [PostController::class, 'getComments']);
    Route::post('/posts/{post}/comments', [PostController::class, 'addComment'])
        ->middleware('throttle:30,1');

    // Comments
    Route::post('/comments/{comment}/like', [CommentController::class, 'like'])
        ->middleware('throttle:60,1');
    Route::post('/comments/{comment}/reply', [CommentController::class, 'reply'])
        ->middleware('throttle:30,1');
    Route::get('/comments/{comment}/likes', [CommentController::class, 'getLikes']);

    // Profile
    Route::put('/profile', [ProfileController::class, 'update']);
});