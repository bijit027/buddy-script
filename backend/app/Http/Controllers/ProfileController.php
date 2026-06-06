<?php

namespace App\Http\Controllers;

use App\Services\ProfileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function __construct(
        private ProfileService $profileService
    ) {}

    public function update(Request $request): JsonResponse
    {
        $data = $this->profileService->updateProfile($request, $request->user());
        return response()->json($data);
    }
}
