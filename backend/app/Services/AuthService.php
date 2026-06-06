<?php

namespace App\Services;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    public function register(RegisterRequest $request): array
    {
        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'name' => $request->first_name.' '.$request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'message' => 'Registration successful.',
            'token' => $token,
            'user' => $this->formatUser($user),
        ];
    }

    public function login(LoginRequest $request): array
    {
        if (! Auth::attempt($request->only('email', 'password'))) {
            throw new \Illuminate\Auth\AuthenticationException('Invalid email or password.');
        }

        /** @var User $user */
        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'message' => 'Login successful.',
            'token' => $token,
            'user' => $this->formatUser($user),
        ];
    }

    public function logout(User $user): array
    {
        $user->currentAccessToken()->delete();

        return ['message' => 'Logged out successfully.'];
    }

    public function getCurrentUser(User $user): array
    {
        return $this->formatUser($user);
    }

    protected function formatUser(User $user): array
    {
        return [
            'id' => $user->id,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'name' => $user->full_name,
            'email' => $user->email,
            'avatar' => $user->avatar_url,
            'bio' => $user->bio,
            'cover_photo' => $user->cover_photo_url,
            'created_at' => $user->created_at,
        ];
    }
}
