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
        Schema::create('blog_tag', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedBigInteger('blog_id'); // Ensure this is unsigned
            $table->unsignedBigInteger('tag_id'); // Ensure this is unsigned
            $table->timestamps();

            // Define foreign keys with appropriate data types
            $table->foreign('blog_id')->references('id')->on('blogs');
            $table->foreign('tag_id')->references('id')->on('tags');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blog_tag');
    }
};
