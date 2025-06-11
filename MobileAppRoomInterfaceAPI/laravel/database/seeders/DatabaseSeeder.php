<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $userNiek = User::create([
            'name' => 'Niek',
            'email' => 'niek@example.com',
            'password' => Hash::make('password_niek')
        ]);
        $tokenNiek = $userNiek->createToken('apitoken')->plainTextToken;

        echo 'API Token voor ' . $userNiek->name . ': "' . $tokenNiek . '"' . PHP_EOL;
        
        $userSara = User::create([
            'name' => 'Sara',
            'email' => 'sara@example.com',
            'password' => Hash::make('password_sara')
        ]);
        $tokenSara = $userSara->createToken('apitoken')->plainTextToken;

        echo 'API Token voor ' . $userSara->name . ': "' . $tokenSara . '"' . PHP_EOL;
    }
}
