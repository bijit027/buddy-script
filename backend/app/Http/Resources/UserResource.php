<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->full_name,
            'avatar' => $this->avatar_url,
            'email' => $this->when($this->email, $this->email),
            'bio' => $this->when($this->bio, $this->bio),
            'cover_photo' => $this->when($this->cover_photo, $this->cover_photo_url),
        ];
    }
}
