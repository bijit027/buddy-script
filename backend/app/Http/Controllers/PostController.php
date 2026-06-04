<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use App\Models\Like;
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
    public function index(Request $request): JsonResponse
    {
        $userId = Auth::id();

        $posts = Post::with('user')
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
            return $this->formatPost($post, in_array($post->id, $likedPostIds));
        });

        return response()->json($posts);
    }

    /**
     * Create a new post (text only or with image).
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'content'   => ['required', 'string', 'max:5000'],
            'image'     => ['nullable', 'file', 'mimes:jpg,jpeg,png,gif', 'max:5120'],
            'is_public' => ['required', 'boolean'],
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {
            $file = $request->file('image');

            // Validate MIME by reading file header (not just extension)
            $mimeType = $file->getMimeType();
            if (!in_array($mimeType, ['image/jpeg', 'image/png', 'image/gif'])) {
                return response()->json(['message' => 'Invalid image type.'], 422);
            }

            $imagePath = $file->store('posts', 'public');
        }

        $post = Post::create([
            'user_id'   => Auth::id(),
            'content'   => strip_tags($request->content),
            'image'     => $imagePath,
            'is_public' => $request->boolean('is_public'),
        ]);

        $post->load('user');

        return response()->json($this->formatPost($post, false), 201);
    }

    /**
     * Delete own post only. Returns 403 if not the owner.
     */
    public function destroy(int $id): JsonResponse
    {
        $post = Post::findOrFail($id);

        if ($post->user_id !== Auth::id()) {
            return response()->json(['message' => 'Forbidden. You can only delete your own posts.'], 403);
        }

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
        $post   = Post::findOrFail($id);
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
            'likes_count'   => $post->likes_count,
            'is_liked_by_me' => $isLiked,
        ]);
    }

    /**
     * Add a comment to a post.
     */
    public function addComment(Request $request, int $id): JsonResponse
    {
        $post = Post::findOrFail($id);

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

        return response()->json([
            'id'         => $comment->id,
            'content'    => $comment->content,
            'created_at' => $comment->created_at,
            'user'       => [
                'id'     => $comment->user->id,
                'name'   => $comment->user->name,
                'avatar' => $comment->user->avatar_url,
            ],
        ], 201);
    }

    /**
     * Get all comments for a post with user info.
     */
    public function getComments(int $id): JsonResponse
    {
        Post::findOrFail($id); // Ensure post exists

        $comments = Comment::with('user')
            ->where('post_id', $id)
            ->latest()
            ->get()
            ->map(fn (Comment $comment) => [
                'id'         => $comment->id,
                'content'    => $comment->content,
                'created_at' => $comment->created_at,
                'user'       => [
                    'id'     => $comment->user->id,
                    'name'   => $comment->user->name,
                    'avatar' => $comment->user->avatar_url,
                ],
            ]);

        return response()->json($comments);
    }

    /**
     * Consistent post format for all responses.
     */
    private function formatPost(Post $post, bool $isLikedByMe): array
    {
        return [
            'id'              => $post->id,
            'content'         => $post->content,
            'image'           => $post->image_url,
            'likes_count'     => $post->likes_count,
            'comments_count'  => $post->comments_count,
            'is_liked_by_me'  => $isLikedByMe,
            'is_public'       => (bool)$post->is_public,
            'created_at'      => $post->created_at,
            'user'            => [
                'id'     => $post->user->id,
                'name'   => $post->user->name,
                'avatar' => $post->user->avatar_url,
            ],
        ];
    }
}
