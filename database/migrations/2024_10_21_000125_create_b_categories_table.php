<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('b_categories', function (Blueprint $table) {
            $table->bigIncrements('id'); // This should create an unsigned bigint
            $table->string('name'); // Category name
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('b_categories');
    }
};
