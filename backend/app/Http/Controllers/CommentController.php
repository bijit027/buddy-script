<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Like;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    /**
     * Toggle like on a comment.
     */
    public function like(int $id): JsonResponse
    {
        $comment = Comment::with('post')->findOrFail($id);

        if ($response = $this->denyUnlessCanViewPost($comment->post)) {
            return $response;
        }

        $userId = Auth::id();

        $existingLike = Like::where('user_id', $userId)
            ->where('likeable_type', Comment::class)
            ->where('likeable_id', $id)
            ->first();

        if ($existingLike) {
            // Unlike
            $existingLike->delete();
            $comment->decrement('likes_count');
            $isLiked = false;
        } else {
            // Like
            Like::create([
                'user_id' => $userId,
                'likeable_id' => $id,
                'likeable_type' => Comment::class,
            ]);
            $comment->increment('likes_count');
            $isLiked = true;
        }

        $comment->refresh();

        return response()->json([
            'likes_count' => $comment->likes_count,
            'is_liked_by_me' => $isLiked,
        ]);
    }

    /**
     * Add a reply to a comment.
     */
    public function reply(Request $request, int $id): JsonResponse
    {
        $parentComment = Comment::with('post')->findOrFail($id);

        if ($response = $this->denyUnlessCanViewPost($parentComment->post)) {
            return $response;
        }

        $request->validate([
            'content' => ['required', 'string', 'max:1000'],
        ]);

        $reply = Comment::create([
            'user_id' => Auth::id(),
            'post_id' => $parentComment->post_id,
            'parent_id' => $parentComment->id,
            'content' => strip_tags($request->content),
        ]);

        $reply->load('user');

        return response()->json([
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
        ], 201);
    }

    /**
     * Block access to private posts unless the authenticated user is the author.
     */
    private function denyUnlessCanViewPost(?Post $post): ?JsonResponse
    {
        if (! $post || (! $post->is_public && $post->user_id !== Auth::id())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return null;
    }
}
