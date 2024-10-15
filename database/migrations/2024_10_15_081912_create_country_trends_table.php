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
        Schema::create('country_trends', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('vendor_id')->nullable();
            $table->string('country_code', 10);
            $table->integer('score');
            $table->string('date');
            $table->timestamps();
            $table->foreign('vendor_id')->references('id')->on('vendors');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('country_trends');
    }
};
