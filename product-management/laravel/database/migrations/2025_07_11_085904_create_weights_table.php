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
        Schema::create('weights', function (Blueprint $table) {
            $table->id();
            $table->float('gross');
            $table->float('net');
            $table->string('unit');
            $table->unsignedBigInteger("product_id");
            $table->timestamps();

            // $table->foreign("product_id", "products");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('weights');
    }
};
