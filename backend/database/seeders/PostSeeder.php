<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Like;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    private array $postContents = [
        'Just finished a 10km run this morning! Feeling amazing 🏃‍♂️ #fitness #morning',
        "Working on an exciting new project. Can't wait to share it with you all! 🚀",
        'The sunset tonight was absolutely breathtaking 🌅 Nature never ceases to amaze me.',
        "Just tried that new coffee shop downtown. Best latte I've ever had ☕",
        "Reading 'Atomic Habits' for the second time. Different insights every read 📚",
        'Team lunch was a blast today! Great people make work so much better 🍕',
        'Finally got my home office setup just the way I like it. Productivity mode: ON 💻',
        'Weekend hike completed! 8 miles, zero complaints. The views were worth it 🏔️',
        'Hot take: remote work has made us all better at communication. Discuss 👇',
        'Cooked a new recipe from scratch tonight. Pasta carbonara came out perfect! 🍝',
        'Just adopted a rescue dog. Meet Max, the newest member of the family 🐕',
        'Three years of learning to code. The journey has been incredible. Never stop learning!',
        "Monday motivation: You don't have to be perfect, just consistent. 💪",
        'That moment when your code finally works after 3 hours of debugging 🎉',
        'Grateful for the small things: good coffee, sunshine, and fast internet ✨',
        "Started journaling daily. It's changed how I process my thoughts completely.",
        'New playlist dropped for those late-night coding sessions 🎵 Link in bio.',
        'The best investment you can make is in yourself. Never underestimate learning.',
        'Throwback to that road trip last summer. We need to do it again ASAP 🚗',
        'Just crossed the 1000 followers milestone! Thank you all for the support 🙏',
        'Morning coffee hits different when you actually slept well. Small wins! ☕',
        'Anyone else obsessed with productivity apps? Just discovered Notion templates.',
        'The gym was empty at 6am. Peak productivity achieved 💪',
        'Book recommendation: "Deep Work" by Cal Newport. Changed my workflow.',
        'Weekend plans: coding, coffee, and catching up on my reading list 📚',
        'Just deployed my first side project to production! Exciting times 🚀',
        'The struggle of choosing between Netflix and coding is real tonight.',
        'Pro tip: Always backup your code before refactoring. Learned this the hard way.',
        'Coffee shops are my second office. The background noise helps me focus.',
        'Just finished a 30-day challenge. Consistency really is key! 🎯',
        'Looking for recommendations: What podcasts are you listening to?',
        'The weather is perfect for a walk. Time to take a break from the screen.',
        'Just learned a new keyboard shortcut. Productivity boost unlocked! ⌨️',
        'Reminder: It is okay to rest. Burnout is real, take care of yourself.',
        'Excited to announce I am starting a new chapter in my career! More details soon.',
        'The best conversations happen over late-night coffee and deep discussions.',
        'Just watched a documentary that changed my perspective on life. Highly recommend.',
        'Coding in the zone is the best feeling. Time just disappears.',
        'Small progress every day adds up to big results. Keep going! 🌟',
        'The sunset from my balcony tonight was unreal. Sometimes I need to pause and appreciate.',
        'Just had the most productive week of my life. Momentum is building!',
        'Anyone else excited for the weekend? Plans or relaxing?',
        'Learning a new framework is challenging but so rewarding. Growth mindset!',
        'The simple things: good food, good company, and good vibes. That is the life.',
        'Just finished a great book. Now I need another recommendation! 📖',
        'Coffee + coding = perfect Sunday morning combo ☕💻',
        'The support from this community is incredible. Thank you all! 🙏',
        'Just hit a major milestone in my project. Celebration time! 🎉',
        'Reminder: Comparison is the thief of joy. Focus on your own journey.',
        'The best ideas come when you are not even trying. Keep an open mind.',
        'Just tried a new productivity technique and it actually works!',
        'Weekend vibes: relaxation, recharge, and ready for Monday.',
        'The little wins matter just as much as the big ones. Celebrate them all!',
        'Just had an amazing conversation with a stranger. You never know who you will meet.',
        'Coding tip: Read documentation before asking questions. It saves time.',
        'The beauty of open source: learning from the best in the world.',
        'Just organized my workspace. Clear desk, clear mind! 🧹',
        'Sometimes the best solution is the simplest one. Keep it simple.',
        'Just discovered a new music genre. My playlist just got an upgrade! 🎵',
        'The journey of a thousand miles begins with a single step. Start today.',
        'Just finished a difficult task. The satisfaction is unmatched.',
        'Reminder: You are capable of more than you think. Believe in yourself.',
        'Just had a breakthrough moment. Everything clicked into place! 💡',
        'The best way to learn is by doing. Theory is good, practice is better.',
        'Just updated my portfolio. Always good to showcase your work.',
        'The community here is so supportive. Grateful for every connection.',
        'Just tried a new recipe and it was a disaster. Back to ordering pizza 🍕',
        'Learning from mistakes is the fastest way to grow. Embrace them.',
        'Just had the best coffee of my life. I need to go back to that cafe!',
        'The art of debugging: patience, persistence, and lots of coffee.',
        'Just finished a side project. Now to decide the next one!',
        'Reminder: Take breaks. Your brain needs rest to function at its best.',
        'Just discovered a hidden gem of a restaurant. Food was amazing!',
        'The satisfaction of solving a complex problem never gets old.',
        'Just had a great mentorship session. Always learn from those ahead of you.',
        'Coding is 10% writing code and 90% figuring out why it does not work.',
        'Just booked my next trip. Adventure awaits! ✈️',
        'The best days are the ones where you learn something new.',
        'Just optimized my database queries. Performance boost achieved! 🚀',
        'Reminder: Your mental health matters more than your productivity.',
        'Just had a realization that changed everything. Perspective is powerful.',
        'The little details make the big difference. Pay attention to them.',
        'Just finished reading all my unread emails. Inbox zero achieved! 📧',
        'The journey is just as important as the destination. Enjoy the process.',
        'Just learned a new design pattern. Code quality just leveled up.',
        'Reminder: Be kind to yourself. You are doing better than you think.',
        'Just had the most productive weekend. Ready to tackle the week!',
        'The best code is the code you do not have to write. Keep it simple.',
        'Just discovered a new tool that will save me hours of work. Game changer!',
        'The beauty of coding: you can build anything you can imagine.',
        'Just finished a challenging project. Growth happens outside comfort zone.',
        'Reminder: Celebrate small wins. They lead to big victories.',
        'Just had an inspiring conversation. Motivation levels: maximum!',
        'The best investment: time in yourself. It always pays dividends.',
        'Just cleaned up my codebase. Refactoring is therapeutic 🧹',
        'The difference between good and great is attention to detail.',
        'Just started a new habit. Day 1 of many! 🎯',
        'Reminder: Progress over perfection. Keep moving forward.',
        'Just had a breakthrough idea. Time to execute! 💡',
        'The best teams are those who support each other. Build that culture.',
        'Just finished a book that changed my perspective. Highly recommend.',
        'The art of communication: listen more than you speak.',
        'Just optimized my workflow. Efficiency unlocked! ⚡',
        'Reminder: You are your best investment. Never stop learning.',
        'Just had a great networking event. Connections are everything.',
        'The best solutions come from collaboration. Work together.',
        'Just discovered a new framework. Excited to dive in!',
        'Reminder: Balance is key. Work hard, rest harder.',
        'Just finished a marathon coding session. Time to recharge 🔋',
        'The beauty of technology: it connects us all.',
        'Just had a realization about my career path. Time to pivot!',
        'The best advice: never stop being curious about the world.',
        'Just updated my skills. Learning is a lifelong journey.',
        'Reminder: Your network is your net worth. Build meaningful connections.',
        'Just had an amazing experience. Grateful for every moment.',
        'The little things in life are actually the big things. Appreciate them.',
    ];

    public function run(): void
    {
        $users = User::all();

        foreach ($this->postContents as $index => $content) {
            $user = $users[$index % $users->count()];

            $post = Post::create([
                'user_id' => $user->id,
                'content' => $content,
                'image' => null,
                'is_public' => rand(0, 1) === 1,
            ]);

            // Random likes (3-12 per post)
            $likers = $users->random(rand(3, min(12, $users->count())));
            foreach ($likers as $liker) {
                Like::firstOrCreate([
                    'user_id' => $liker->id,
                    'likeable_id' => $post->id,
                    'likeable_type' => Post::class,
                ]);
            }
            $post->update(['likes_count' => $likers->count()]);

            // 2-6 comments per post
            $commenters = $users->random(rand(2, min(6, $users->count())));
            $sampleComments = [
                'Great post! Love this! 💯',
                'Totally agree with you on this one.',
                'Thanks for sharing this with us! 🙌',
                'This is so inspiring, thank you!',
                'Can relate to this so much!',
                'Well said! Keep it coming.',
                'This made my day! 😊',
                'Spot on with this analysis.',
                'Love the perspective you shared.',
                'This is exactly what I needed to hear today.',
                'Amazing content as always!',
                'You always have the best insights.',
                'This resonates with me deeply.',
                'Keep up the great work! 🌟',
                'This is gold! Saving for later.',
            ];
            $commentCount = 0;
            foreach ($commenters as $commenter) {
                $comment = Comment::create([
                    'user_id' => $commenter->id,
                    'post_id' => $post->id,
                    'content' => $sampleComments[array_rand($sampleComments)],
                ]);

                // Add 1-3 replies to some comments
                if (rand(0, 1) === 1) {
                    $repliers = $users->random(rand(1, min(3, $users->count())));
                    foreach ($repliers as $replier) {
                        Comment::create([
                            'user_id' => $replier->id,
                            'post_id' => $post->id,
                            'parent_id' => $comment->id,
                            'content' => $sampleComments[array_rand($sampleComments)],
                        ]);
                    }
                }
                $commentCount++;
            }
            $post->update(['comments_count' => $commentCount]);
        }
    }
}
