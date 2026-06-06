<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdatePostRequest;
use App\Http\Resources\PostResource;
use App\Http\Resources\CommentResource;
use App\Models\Post;
use App\Services\PostService;
use App\Services\CommentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function __construct(
        private PostService $postService,
        private CommentService $commentService
    ) {}

    public function index(Request $request): JsonResponse
    {
        return response()->json($this->postService->getFeed($request));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->postService->createPost($request);
        return response()->json($data, 201);
    }

    public function update(UpdatePostRequest $request, Post $post): JsonResponse
    {
        $this->authorize('update', $post);
        $data = $this->postService->updatePost($request, $post);
        return response()->json($data);
    }

    public function destroy(Post $post): JsonResponse
    {
        $this->authorize('delete', $post);
        $this->postService->deletePost($post);
        return response()->json(['message' => 'Post deleted.']);
    }

    public function like(Post $post): JsonResponse
    {
        $this->authorize('view', $post);
        $data = $this->postService->toggleLike($post);
        return response()->json($data);
    }

    public function getLikes(Post $post): JsonResponse
    {
        $this->authorize('view', $post);
        return response()->json($this->postService->getLikes($post));
    }

    public function addComment(Request $request, Post $post): JsonResponse
    {
        $this->authorize('view', $post);
        $data = $this->commentService->addComment($request, $post);
        return response()->json($data, 201);
    }

    public function getComments(Post $post): JsonResponse
    {
        $this->authorize('view', $post);
        return response()->json($this->commentService->getComments($post));
    }
}
