<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['name' => 'Alex Johnson',   'email' => 'alex@buddyscript.com'],
            ['name' => 'Maria Garcia',   'email' => 'maria@buddyscript.com'],
            ['name' => 'James Wilson',   'email' => 'james@buddyscript.com'],
            ['name' => 'Priya Sharma',   'email' => 'priya@buddyscript.com'],
            ['name' => 'Demo User',      'email' => 'demo@buddyscript.com'],
        ];

        foreach ($users as $userData) {
            User::firstOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'password' => Hash::make('Password123'),
                    'bio' => 'Hey there! I am using BuddyScript.',
                ]
            );
        }
    }
}
