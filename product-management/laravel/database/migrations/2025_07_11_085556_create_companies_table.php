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
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string("companyName");
            $table->string("companyAddress");
            $table->string("companyTelephone");
            $table->string("companyEmail");
            $table->timestamps();

            // $table->foreign("owner_id", "owners");
            // $table->foreign("contact_id", "contacts");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
