<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->index('is_public');
            $table->index('created_at');
            // user_id is often indexed automatically by foreignId()->constrained(), but let's be explicit
        });

        Schema::table('comments', function (Blueprint $table) {
            $table->index('post_id');
            $table->index('parent_id');
        });

        // Note: 'likes' table already has morphs('likeable') which creates the likeable_type/likeable_id index,
        // and a unique(['user_id', 'likeable_id', 'likeable_type']) which covers user_id.
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropIndex(['is_public']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('comments', function (Blueprint $table) {
            $table->dropIndex(['post_id']);
            $table->dropIndex(['parent_id']);
        });
    }
};
