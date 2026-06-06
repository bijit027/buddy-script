<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdatePostRequest;
use App\Http\Resources\PostResource;
use App\Http\Resources\CommentResource;
use App\Http\Resources\UserResource;
use App\Models\Comment;
use App\Models\Like;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    /**
     * Paginated feed — 15 posts per page, latest first.
     * Eager loads user. Adds is_liked_by_me flag per post.
     */
    public function index(Request $request)
    {
        $userId = Auth::id();

        $posts = Post::with(['user', 'likes.user'])
            ->where(function ($query) use ($userId) {
                $query->where('is_public', true)
                    ->orWhere('user_id', $userId);
            })
            ->latest()
            ->paginate(15);

        // Add is_liked_by_me to each post
        $likedPostIds = Like::where('user_id', $userId)
            ->where('likeable_type', Post::class)
            ->whereIn('likeable_id', $posts->pluck('id'))
            ->pluck('likeable_id')
            ->toArray();

        $posts->getCollection()->transform(function (Post $post) use ($likedPostIds) {
            $post->is_liked_by_me = in_array($post->id, $likedPostIds);
            return $post;
        });

        return response()->json(PostResource::collection($posts)->response()->getData(true));
    }

    /**
     * Create a new post (text only or with image).
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'content' => ['required', 'string', 'max:5000'],
            'image' => ['nullable', 'file', 'mimes:jpg,jpeg,png,gif', 'max:5120'],
            'is_public' => ['required', 'boolean'],
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {
            $file = $request->file('image');

            // Validate MIME by reading file header (not just extension)
            $mimeType = $file->getMimeType();
            if (! in_array($mimeType, ['image/jpeg', 'image/png', 'image/gif'])) {
                return response()->json(['message' => 'Invalid image type.'], 422);
            }

            $imagePath = $file->store('posts', 'public');
        }

        $post = Post::create([
            'user_id' => Auth::id(),
            'content' => strip_tags($request->content),
            'image' => $imagePath,
            'is_public' => $request->boolean('is_public'),
        ]);

        $post->load('user');

        $post->is_liked_by_me = false;
        return response()->json((new PostResource($post))->resolve(), 201);
    }

    /**
     * Update own post (content, visibility, image). Returns 403 if not the owner.
     */
    public function update(UpdatePostRequest $request, int $id): JsonResponse
    {
        $post = Post::findOrFail($id);

        $this->authorize('update', $post);

        if ($request->has('content')) {
            $post->content = strip_tags($request->content);
        }

        if ($request->has('is_public')) {
            $post->is_public = $request->boolean('is_public');
        }

        if ($request->boolean('remove_image') && $post->image) {
            Storage::disk('public')->delete($post->image);
            $post->image = null;
        }

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $mimeType = $file->getMimeType();

            if (! in_array($mimeType, ['image/jpeg', 'image/png', 'image/gif'])) {
                return response()->json(['message' => 'Invalid image type.'], 422);
            }

            if ($post->image) {
                Storage::disk('public')->delete($post->image);
            }

            $post->image = $file->store('posts', 'public');
        }

        $post->save();
        $post->load(['user', 'likes.user']);

        $isLiked = Like::where('user_id', Auth::id())
            ->where('likeable_type', Post::class)
            ->where('likeable_id', $post->id)
            ->exists();

        $post->is_liked_by_me = $isLiked;
        return response()->json((new PostResource($post))->resolve());
    }

    /**
     * Delete own post only. Returns 403 if not the owner.
     */
    public function destroy(int $id): JsonResponse
    {
        $post = Post::findOrFail($id);

        $this->authorize('delete', $post);

        // Delete image from storage
        if ($post->image) {
            Storage::disk('public')->delete($post->image);
        }

        $post->delete();

        return response()->json(['message' => 'Post deleted.']);
    }

    /**
     * Toggle like on a post. Returns new likes_count.
     */
    public function like(int $id): JsonResponse
    {
        $post = Post::findOrFail($id);

        $this->authorize('view', $post);

        $userId = Auth::id();

        $existingLike = Like::where('user_id', $userId)
            ->where('likeable_type', Post::class)
            ->where('likeable_id', $id)
            ->first();

        if ($existingLike) {
            // Unlike
            $existingLike->delete();
            $post->decrement('likes_count');
            $isLiked = false;
        } else {
            // Like
            Like::create([
                'user_id' => $userId,
                'likeable_id' => $id,
                'likeable_type' => Post::class,
            ]);
            $post->increment('likes_count');
            $isLiked = true;
        }

        $post->refresh();

        return response()->json([
            'likes_count' => $post->likes_count,
            'is_liked_by_me' => $isLiked,
        ]);
    }

    /**
     * Get all users who liked a post.
     */
    public function getLikes(int $id)
    {
        $post = Post::findOrFail($id);

        $this->authorize('view', $post);

        $likes = $post->likes()->with('user')->latest()->get()->pluck('user');

        return response()->json(UserResource::collection($likes)->resolve());
    }

    /**
     * Add a comment to a post.
     */
    public function addComment(Request $request, int $id): JsonResponse
    {
        $post = Post::findOrFail($id);

        $this->authorize('view', $post);

        $request->validate([
            'content' => ['required', 'string', 'max:1000'],
        ]);

        $comment = Comment::create([
            'user_id' => Auth::id(),
            'post_id' => $id,
            'content' => strip_tags($request->content),
        ]);

        $post->increment('comments_count');
        $comment->load('user');

        $comment->is_liked_by_me = false;
        return response()->json((new CommentResource($comment))->resolve(), 201);
    }

    /**
     * Get all comments for a post with user info.
     */
    public function getComments(int $id)
    {
        $post = Post::findOrFail($id);

        $this->authorize('view', $post);

        $userId = Auth::id();

        $comments = Comment::with(['user', 'replies.user', 'likes.user', 'replies.likes.user'])
            ->where('post_id', $id)
            ->whereNull('parent_id')
            ->latest()
            ->get();

        $allCommentIds = $comments->pluck('id')->merge(
            $comments->flatMap(fn ($c) => $c->replies->pluck('id'))
        )->unique()->toArray();

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

        return response()->json(CommentResource::collection($comments)->resolve());
    }
}
