<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Post;
use App\Models\PostLike;
use App\Models\User;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    private array $postContents = [
        "Just finished a 10km run this morning! Feeling amazing 🏃‍♂️ #fitness #morning",
        "Working on an exciting new project. Can't wait to share it with you all! 🚀",
        "The sunset tonight was absolutely breathtaking 🌅 Nature never ceases to amaze me.",
        "Just tried that new coffee shop downtown. Best latte I've ever had ☕",
        "Reading 'Atomic Habits' for the second time. Different insights every read 📚",
        "Team lunch was a blast today! Great people make work so much better 🍕",
        "Finally got my home office setup just the way I like it. Productivity mode: ON 💻",
        "Weekend hike completed! 8 miles, zero complaints. The views were worth it 🏔️",
        "Hot take: remote work has made us all better at communication. Discuss 👇",
        "Cooked a new recipe from scratch tonight. Pasta carbonara came out perfect! 🍝",
        "Just adopted a rescue dog. Meet Max, the newest member of the family 🐕",
        "Three years of learning to code. The journey has been incredible. Never stop learning!",
        "Monday motivation: You don't have to be perfect, just consistent. 💪",
        "That moment when your code finally works after 3 hours of debugging 🎉",
        "Grateful for the small things: good coffee, sunshine, and fast internet ✨",
        "Started journaling daily. It's changed how I process my thoughts completely.",
        "New playlist dropped for those late-night coding sessions 🎵 Link in bio.",
        "The best investment you can make is in yourself. Never underestimate learning.",
        "Throwback to that road trip last summer. We need to do it again ASAP 🚗",
        "Just crossed the 1000 followers milestone! Thank you all for the support 🙏",
    ];

    public function run(): void
    {
        $users = User::all();

        foreach ($this->postContents as $index => $content) {
            $user = $users[$index % $users->count()];

            $post = Post::create([
                'user_id' => $user->id,
                'content' => $content,
                'image'   => null, // No images needed for demo
            ]);

            // Random likes (2-8 per post)
            $likers = $users->random(rand(2, min(8, $users->count())));
            foreach ($likers as $liker) {
                PostLike::firstOrCreate([
                    'user_id' => $liker->id,
                    'post_id' => $post->id,
                ]);
            }
            $post->update(['likes_count' => $likers->count()]);

            // 1-3 comments per post
            $commenters = $users->random(rand(1, min(3, $users->count())));
            $sampleComments = [
                'Great post! Love this!',
                'Totally agree with you 💯',
                'Thanks for sharing this 🙌',
                'This is so inspiring!',
                'Can relate to this so much!',
            ];
            $commentCount = 0;
            foreach ($commenters as $commenter) {
                Comment::create([
                    'user_id' => $commenter->id,
                    'post_id' => $post->id,
                    'content' => $sampleComments[array_rand($sampleComments)],
                ]);
                $commentCount++;
            }
            $post->update(['comments_count' => $commentCount]);
        }
    }
}
