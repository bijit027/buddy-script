<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileService
{
    public function updateProfile(Request $request, User $user): array
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'bio' => ['sometimes', 'nullable', 'string', 'max:500'],
            'avatar' => ['sometimes', 'nullable', 'file', 'mimes:jpg,jpeg,png', 'max:2048'],
            'cover_photo' => ['sometimes', 'nullable', 'file', 'mimes:jpg,jpeg,png', 'max:5120'],
        ]);

        $data = [];

        if ($request->has('name')) {
            $data['name'] = strip_tags($validated['name']);
        }

        if ($request->has('bio')) {
            $data['bio'] = strip_tags($validated['bio']);
        }

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                $this->deleteFile($user->avatar);
            }
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        if ($request->hasFile('cover_photo')) {
            if ($user->cover_photo) {
                $this->deleteFile($user->cover_photo);
            }
            $data['cover_photo'] = $request->file('cover_photo')->store('covers', 'public');
        }

        $user->update($data);
        $user->refresh();

        return [
            'message' => 'Profile updated successfully.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar_url,
                'bio' => $user->bio,
                'cover_photo' => $user->cover_photo_url,
            ],
        ];
    }

    protected function deleteFile(string $path): void
    {
        Storage::disk('public')->delete($path);
    }
}
