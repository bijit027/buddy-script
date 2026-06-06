<?php

namespace App\Services;

use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Like;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentService
{
    public function addComment(Request $request, Post $post): array
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:1000'],
        ]);

        $comment = Comment::create([
            'user_id' => Auth::id(),
            'post_id' => $post->id,
            'content' => strip_tags($validated['content']),
        ]);

        $post->increment('comments_count');
        $comment->load('user');
        $comment->is_liked_by_me = false;

        return (new CommentResource($comment))->resolve();
    }

    public function getComments(Post $post): array
    {
        $userId = Auth::id();

        $comments = Comment::with(['user', 'replies.user', 'likes.user', 'replies.likes.user'])
            ->where('post_id', $post->id)
            ->whereNull('parent_id')
            ->latest()
            ->get();

        $allCommentIds = $comments->pluck('id')
            ->merge($comments->flatMap(fn ($c) => $c->replies->pluck('id')))
            ->unique()
            ->toArray();

        $likedCommentIds = Like::where('user_id', $userId)
            ->where('likeable_type', Comment::class)
            ->whereIn('likeable_id', $allCommentIds)
            ->pluck('likeable_id')
            ->toArray();

        $comments->each(function ($comment) use ($likedCommentIds) {
            $comment->is_liked_by_me = in_array($comment->id, $likedCommentIds);
            $comment->replies->each(function ($reply) use ($likedCommentIds) {
                $reply->is_liked_by_me = in_array($reply->id, $likedCommentIds);
            });
        });

        return CommentResource::collection($comments)->resolve();
    }

    public function toggleLike(Comment $comment): array
    {
        $userId = Auth::id();
        $existingLike = Like::where('user_id', $userId)
            ->where('likeable_type', Comment::class)
            ->where('likeable_id', $comment->id)
            ->first();

        if ($existingLike) {
            $existingLike->delete();
            $comment->decrement('likes_count');
            $isLiked = false;
        } else {
            Like::create([
                'user_id' => $userId,
                'likeable_id' => $comment->id,
                'likeable_type' => Comment::class,
            ]);
            $comment->increment('likes_count');
            $isLiked = true;
        }

        $comment->refresh();
        $comment->load('likes.user');

        return [
            'likes_count' => $comment->likes_count,
            'is_liked_by_me' => $isLiked,
            'recent_likes' => \App\Http\Resources\UserResource::collection(
                $comment->likes->sortByDesc('created_at')->take(3)->map->user
            )->resolve(),
        ];
    }

    public function addReply(Request $request, Comment $parentComment): array
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:1000'],
        ]);

        $reply = Comment::create([
            'user_id' => Auth::id(),
            'post_id' => $parentComment->post_id,
            'parent_id' => $parentComment->id,
            'content' => strip_tags($validated['content']),
        ]);

        $reply->load('user');
        $reply->is_liked_by_me = false;

        return [
            'id' => $reply->id,
            'content' => $reply->content,
            'created_at' => $reply->created_at,
            'likes_count' => 0,
            'is_liked_by_me' => false,
            'user' => [
                'id' => $reply->user->id,
                'name' => $reply->user->name,
                'avatar' => $reply->user->avatar_url,
            ],
        ];
    }

    public function getLikes(Comment $comment): array
    {
        $likes = $comment->likes()->with('user')->latest()->get()->pluck('user');

        return \App\Http\Resources\UserResource::collection($likes)->resolve();
    }
}
