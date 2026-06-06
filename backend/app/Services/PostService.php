<?php

namespace App\Services;

use App\Http\Requests\UpdatePostRequest;
use App\Http\Resources\PostResource;
use App\Http\Resources\UserResource;
use App\Models\Like;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PostService
{
    public function getFeed(Request $request): array
    {
        $userId = Auth::id();

        $posts = Post::with(['user', 'likes.user'])
            ->where(function ($query) use ($userId) {
                $query->where('is_public', true)
                    ->orWhere('user_id', $userId);
            })
            ->latest()
            ->paginate(15);

        $likedPostIds = Like::where('user_id', $userId)
            ->where('likeable_type', Post::class)
            ->whereIn('likeable_id', $posts->pluck('id'))
            ->pluck('likeable_id')
            ->toArray();

        $posts->getCollection()->transform(function (Post $post) use ($likedPostIds) {
            $post->is_liked_by_me = in_array($post->id, $likedPostIds);
            return $post;
        });

        return PostResource::collection($posts)->response()->getData(true);
    }

    public function createPost(Request $request): array
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:5000'],
            'image' => ['nullable', 'file', 'mimes:jpg,jpeg,png,gif', 'max:5120'],
            'is_public' => ['required', 'boolean'],
        ]);

        $imagePath = $this->handleImageUpload($request->file('image'));

        $post = Post::create([
            'user_id' => Auth::id(),
            'content' => strip_tags($validated['content']),
            'image' => $imagePath,
            'is_public' => $validated['is_public'],
        ]);

        $post->load('user');
        $post->is_liked_by_me = false;

        return (new PostResource($post))->resolve();
    }

    public function updatePost(UpdatePostRequest $request, Post $post): array
    {
        if ($request->has('content')) {
            $post->content = strip_tags($request->content);
        }

        if ($request->has('is_public')) {
            $post->is_public = $request->boolean('is_public');
        }

        if ($request->boolean('remove_image') && $post->image) {
            $this->deleteImage($post->image);
            $post->image = null;
        }

        if ($request->hasFile('image')) {
            $imagePath = $this->handleImageUpload($request->file('image'), $post->image);
            $post->image = $imagePath;
        }

        $post->save();
        $post->load(['user', 'likes.user']);

        $post->is_liked_by_me = $this->isPostLikedByUser($post->id, Auth::id());

        return (new PostResource($post))->resolve();
    }

    public function deletePost(Post $post): void
    {
        if ($post->image) {
            $this->deleteImage($post->image);
        }

        $post->delete();
    }

    public function toggleLike(Post $post): array
    {
        $userId = Auth::id();
        $existingLike = Like::where('user_id', $userId)
            ->where('likeable_type', Post::class)
            ->where('likeable_id', $post->id)
            ->first();

        if ($existingLike) {
            $existingLike->delete();
            $post->decrement('likes_count');
            $isLiked = false;
        } else {
            Like::create([
                'user_id' => $userId,
                'likeable_id' => $post->id,
                'likeable_type' => Post::class,
            ]);
            $post->increment('likes_count');
            $isLiked = true;
        }

        $post->refresh();

        return [
            'likes_count' => $post->likes_count,
            'is_liked_by_me' => $isLiked,
        ];
    }

    public function getLikes(Post $post): array
    {
        $likes = $post->likes()->with('user')->latest()->get()->pluck('user');

        return UserResource::collection($likes)->resolve();
    }

    protected function handleImageUpload($file, ?string $oldImagePath = null): ?string
    {
        if (!$file) {
            return $oldImagePath;
        }

        $mimeType = $file->getMimeType();
        if (!in_array($mimeType, ['image/jpeg', 'image/png', 'image/gif'])) {
            throw new \InvalidArgumentException('Invalid image type.');
        }

        if ($oldImagePath) {
            $this->deleteImage($oldImagePath);
        }

        return $file->store('posts', 'public');
    }

    protected function deleteImage(string $path): void
    {
        Storage::disk('public')->delete($path);
    }

    protected function isPostLikedByUser(int $postId, int $userId): bool
    {
        return Like::where('user_id', $userId)
            ->where('likeable_type', Post::class)
            ->where('likeable_id', $postId)
            ->exists();
    }
}
