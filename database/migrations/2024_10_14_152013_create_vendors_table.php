<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVendorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vendors', function (Blueprint $table) {
            $table->increments('id');
            $table->string('company_name', 255);
            $table->string('website_url', 255);
            $table->text('contact_info');
            $table->text('description');
            $table->unsignedBigInteger('category_id')->nullable();
            $table->string('initial_release', 255);
            $table->string('current_release', 255);
            $table->integer('profile_views')->default(0);
            $table->string('db_name', 255);
            $table->boolean('approved')->default(false);
            $table->timestamps();

            $table->foreign('category_id')->references('id')->on('categories');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vendors');
    }
}
