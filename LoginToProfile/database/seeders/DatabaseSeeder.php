<?php

namespace Database\Seeders;

use App\Models\ProfilePicture;
use App\Models\User;
use App\Models\UserAvailability;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $user = User::factory()->create([
            'name' => 'Test',
            'email' => 'test@example.com',
            'password' => Hash::make('TestPassword123!')
        ]);

        UserAvailability::create([
            'user_id' => $user->id,
            'mo' => true
        ]);

        ProfilePicture::create([
            'user_id' => $user->id
        ]);
    }
}
