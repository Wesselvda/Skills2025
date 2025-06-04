<?php

namespace Database\Seeders;

use App\Models\Color;
use App\Models\DesignSymbol;
use App\Models\NavItem;
use App\Models\Product;
use App\Models\User;
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
        User::factory()->create([
            'name' => 'shopadmin',
            'email' => 'test@example.com',
            'password' => Hash::make('asdf')
        ]);

        Color::create([
            'name' => 'white'
        ]);
        Color::create([
            'name' => 'blue'
        ]);
        Color::create([
            'name' => 'yellow'
        ]);

        NavItem::create([
            'name' => 'Home',
            'link' => '/',
            'order' => 1
        ]);
        NavItem::create([
            'name' => 'Cart',
            'link' => '/cart',
            'order' => 2
        ]);
        NavItem::create([
            'name' => 'Design Symbols',
            'link' => '#',
            'order' => 3
        ]);
        NavItem::create([
            'name' => 'T-Shirts',
            'link' => '#',
            'order' => 4
        ]);
        NavItem::create([
            'name' => 'Accessories',
            'link' => '#',
            'order' => 5
        ]);
        NavItem::create([
            'name' => 'Admin Area',
            'link' => '/admin',
            'order' => 6
        ]);

        Product::create([
            'name' => 'T-Shirt',
            'imgname' => 'tshirt',
            'price' => 25
        ]);
        Product::create([
            'name' => 'Cup',
            'imgname' => 'cup',
            'price' => 12
        ]);

        DesignSymbol::create([
            'img' => 'iconmonstr-american-football-2-240.png'
        ]);

        DesignSymbol::create([
            'img' => 'iconmonstr-basketball-2-240.png'
        ]);

        DesignSymbol::create([
            'img' => 'iconmonstr-candy-24-240.png'
        ]);

        DesignSymbol::create([
            'img' => 'iconmonstr-construction-14-240.png'
        ]);

        DesignSymbol::create([
            'img' => 'iconmonstr-construction-17-240.png'
        ]);

        DesignSymbol::create([
            'img' => 'iconmonstr-control-panel-23-240.png'
        ]);

        DesignSymbol::create([
            'img' => 'iconmonstr-crown-19-240.png'
        ]);

        DesignSymbol::create([
            'img' => 'iconmonstr-fast-food-18-240.png'
        ]);

        DesignSymbol::create([
            'img' => 'iconmonstr-keyboard-15-240.png'
        ]);

        DesignSymbol::create([
            'img' => 'iconmonstr-marketing-4-240.png'
        ]);

        DesignSymbol::create([
            'img' => 'iconmonstr-trash-can-28-240.png'
        ]);

        DesignSymbol::create([
            'img' => 'iconmonstr-umbrella-15-240.png'
        ]);
    }
}