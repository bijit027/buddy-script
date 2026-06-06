<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    protected function redirectTo(Request $request): ?string
    {
        // API requests should never redirect anywhere
        if ($request->expectsJson() || $request->is('api/*')) {
            return null;
        }

        // Web requests (only if you actually use Blade auth pages)
        return null;
    }
}