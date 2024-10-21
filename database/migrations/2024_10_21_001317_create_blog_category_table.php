<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('blog_b_category', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedBigInteger('blog_id'); // Should match blogs.id
            $table->unsignedBigInteger('b_category_id'); // Should match categories.id
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('blog_id')->references('id')->on('blogs');
            $table->foreign('b_category_id')->references('id')->on('b_categories');
        });
    }

    public function down()
    {
        Schema::dropIfExists('blog_b_category');
    }
};
