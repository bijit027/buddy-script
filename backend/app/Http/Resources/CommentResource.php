<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
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
            'content' => $this->content,
            'created_at' => $this->created_at,
            'likes_count' => $this->likes_count,
            'is_liked_by_me' => (bool) ($this->is_liked_by_me ?? false),
            'user' => new UserResource($this->whenLoaded('user')),
            'recent_likes' => UserResource::collection(
                $this->whenLoaded('likes', function () {
                    return $this->likes->sortByDesc('created_at')->take(3)->map->user;
                })
            ),
            'replies' => CommentResource::collection($this->whenLoaded('replies')),
        ];
    }
}
