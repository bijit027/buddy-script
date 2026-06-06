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
            ['name' => 'Sarah Connor',  'email' => 'sarah@buddyscript.com'],
            ['name' => 'John Smith',    'email' => 'john@buddyscript.com'],
            ['name' => 'Emily Davis',   'email' => 'emily@buddyscript.com'],
            ['name' => 'Michael Brown', 'email' => 'michael@buddyscript.com'],
            ['name' => 'Jessica Lee',   'email' => 'jessica@buddyscript.com'],
            ['name' => 'David Kim',     'email' => 'david@buddyscript.com'],
            ['name' => 'Amanda White',  'email' => 'amanda@buddyscript.com'],
            ['name' => 'Robert Taylor', 'email' => 'robert@buddyscript.com'],
            ['name' => 'Lisa Anderson', 'email' => 'lisa@buddyscript.com'],
            ['name' => 'Kevin Thomas',  'email' => 'kevin@buddyscript.com'],
            ['name' => 'Michelle Jackson', 'email' => 'michelle@buddyscript.com'],
            ['name' => 'Daniel Harris',  'email' => 'daniel@buddyscript.com'],
            ['name' => 'Laura Martin',   'email' => 'laura@buddyscript.com'],
            ['name' => 'Chris Garcia',   'email' => 'chris@buddyscript.com'],
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
