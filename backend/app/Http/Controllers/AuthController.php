<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        private AuthService $authService
    ) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $data = $this->authService->register($request);
        return response()->json($data, 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $data = $this->authService->login($request);
            return response()->json($data);
        } catch (\Illuminate\Auth\AuthenticationException $e) {
            return response()->json(['message' => $e->getMessage()], 401);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        $data = $this->authService->logout($request->user());
        return response()->json($data);
    }

    public function me(Request $request): JsonResponse
    {
        $data = $this->authService->getCurrentUser($request->user());
        return response()->json($data);
    }
}
