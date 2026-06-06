<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Services\CommentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function __construct(
        private CommentService $commentService
    ) {}

    public function like(Comment $comment): JsonResponse
    {
        $this->authorize('view', $comment->post);
        $data = $this->commentService->toggleLike($comment);
        return response()->json($data);
    }

    public function reply(Request $request, Comment $comment): JsonResponse
    {
        $this->authorize('view', $comment->post);
        $data = $this->commentService->addReply($request, $comment);
        return response()->json($data, 201);
    }

    public function getLikes(Comment $comment): JsonResponse
    {
        $this->authorize('view', $comment->post);
        return response()->json($this->commentService->getLikes($comment));
    }
}
