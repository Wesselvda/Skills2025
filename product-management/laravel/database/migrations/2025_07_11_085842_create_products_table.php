<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string("gtin");
            $table->string("brand");
            $table->string("countryOfOrigin");
            $table->unsignedBigInteger("company_id");
            $table->timestamps();

            // $table->foreign("name_id", "names");
            // $table->foreign("description_id", "descriptions");
            // $table->foreign("weight_id", "weights");
            // $table->foreign("company_id", "companies");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
