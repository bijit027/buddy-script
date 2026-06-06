<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Never redirect in API context.
     * API should always return JSON 401 instead.
     */
    protected function redirectTo(Request $request): ?string
    {
        return null;
    }
}