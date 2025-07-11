<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Contact;
use App\Models\Description;
use App\Models\Name;
use App\Models\Owner;
use App\Models\Product;
use App\Models\User;
use App\Models\Weight;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $companyOne = Company::create([
            'companyName' => "Innovateurs Tech SARL",
            'companyAddress' => "123 Boulevard du Silicon 75001 Paris",
            'companyTelephone' => "+33 1 23 45 67 89",
            'companyEmail' => "info@innovateurstech.fr",
        ]);

        $companyOwnerOne = Owner::create([
            'name' => "Alice Dupont",
            'mobileNumber' => "+33 6 12 34 56 78",
            'email' => "alice.dupont@innovateurstech.fr",
            'company_id' => $companyOne->id
        ]);

        $companyContactOne = Contact::create([
            'name' => "Bob Martin",
            'mobileNumber' => "+33 6 98 76 54 32",
            'email' => "bob.martin@innovateurstech.fr",
            'company_id' => $companyOne->id
        ]);

        $companyOne->save();

        $productOne = Product::create([
            'company_id' => $companyOne->id,
            'gtin' => "37900123458228",
            'brand' => 'Huiles de France',
            'countryOfOrigin' => 'France',
        ]);

        $nameOne = Name::create([
            'product_id' => $productOne->id,
            'en' => 'French Herb and Lemon Infused Olive Oil',
            'fr' => 'Huile d\'olive infusée aux herbes et au citron français'
        ]);

        $descriptionOne = Description::create([
            'product_id' => $productOne->id,
            'en' => 'Add a touch of freshness to your dishes with our French herb and lemon infused olive oil, featuring a blend of fragrant herbs and citrus.',
            'fr' => 'Ajoutez une touche de fraîcheur à vos plats avec notre huile d\'olive infusée aux herbes françaises et au citron, composée d\'un mélange d\'herbes parfumées et d\'agrumes.'
        ]);

        $weightOne = Weight::create([
            'product_id' => $productOne->id,
            'gross' => 0.5,
            'net' => 0.4,
            'unit' => 'g'
        ]);
    }
}
