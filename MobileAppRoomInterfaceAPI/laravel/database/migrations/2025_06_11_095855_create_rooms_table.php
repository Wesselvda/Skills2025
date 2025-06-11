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
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->integer('room_number')->unique();
            $table->string('room_colour')->default('yellow');
            $table->string('curtains')->default('open');
            $table->string('music')->default('off');
            $table->boolean('locked')->default(0);
            $table->integer('climate')->default(20);
            $table->boolean('do_not_disturb')->default(0);
            $table->boolean('make_up_room')->default(0);
            $table->timestamps();
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
