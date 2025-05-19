<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GamesTableSeeder extends Seeder
{
    public function run()
    {
        $games = [
            [
                'title' => 'Tower of Hanoi',
                'subtitle' => 'Retro game Tower of Hanoi',
                'image_path' => 'DALL┬╖E 2024-04-21 08.37.24 - A digital illustration of a game screen for the Tower of Hanoi, designed in a retro arcade style with a color theme of purple, blue, and red. The game.webp',
                'credit_cost' => 5,
            ],
            [
                'title' => 'Snowman Yeti Penguin',
                'subtitle' => 'Retro game Snowman Yeti Penguin',
                'image_path' => 'DALL┬╖E 2024-04-21 08.37.28 - A digital illustration of a game screen for a Snowman Yeti Penguin game, designed in a retro arcade style with a color theme of purple, blue, and red.webp',
                'credit_cost' => 3,
            ],
            [
                'title' => '100 Meter Hurdles',
                'subtitle' => 'Retro game 100 Meter Hurdles',
                'image_path' => 'DALL┬╖E 2024-04-21 08.37.38 - A digital illustration of a game screen for a 2D 100 meter hurdles game, designed in a retro arcade style with a color theme of purple, blue, and red.webp',
                'credit_cost' => 4,
            ],
            [
                'title' => 'Tetris',
                'subtitle' => 'Retro game Tetris',
                'image_path' => 'DALL┬╖E 2024-04-21 08.37.43 - A digital illustration of a game screen for a Tetris game, presented in a retro arcade style with a color theme of purple, blue, and red. The game dis.webp',
                'credit_cost' => 6,
            ],
            [
                'title' => 'Whack-a-Mole',
                'subtitle' => 'Retro game Whack-a-Mole',
                'image_path' => 'DALL┬╖E 2024-04-21 08.37.48 - A digital illustration of a game screen for a Whack-a-Mole game, redesigned in a retro arcade style with vibrant colors of purple, blue, and red. The .webp',
                'credit_cost' => 2,
            ],
            [
                'title' => 'Racing Cadillac',
                'subtitle' => 'Retro game Racing Cadillac',
                'image_path' => 'DALL┬╖E 2024-04-21 08.37.52 - A digital illustration of a 2D racing game screen featuring a classic Cadillac car, designed in a retro arcade style with a color theme of purple, blu.webp',
                'credit_cost' => 7,
            ],
            [
                'title' => 'Pong',
                'subtitle' => 'Retro game Pong',
                'image_path' => 'DALL┬╖E 2024-04-21 08.37.55 - A digital illustration of a game screen for a classic Pong game, redesigned in a retro arcade style with a vibrant color palette of purple, red, and b.webp',
                'credit_cost' => 3,
            ],
            [
                'title' => 'Snake',
                'subtitle' => 'Retro game Snake',
                'image_path' => 'DALL┬╖E 2024-04-21 08.38.00 - A digital illustration of a game screen inspired by the classic Nokia snake game, but with a more colorful retro arcade style using purple, blue, and .webp',
                'credit_cost' => 4,
            ],
        ];

        DB::table('games')->insert($games);
    }
}
