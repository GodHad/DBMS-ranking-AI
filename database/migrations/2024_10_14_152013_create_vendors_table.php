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
            $table->text('description');
            $table->string('primary_category', 255);
            $table->string('secondary_category', 255);
            $table->string('overall_ranking', 255);
            $table->string('primary_ranking', 255);
            $table->text('contact_info');
            $table->string('website_url', 255);
            $table->string('technical_doc', 255);
            $table->string('developer', 255);
            $table->string('initial_release', 255);
            $table->string('current_release', 255);
            $table->string('license', 255);
            $table->boolean('cloud_based_only', 255);
            $table->string('dbaas_offerings', 255);
            $table->string('implementation_lang', 255);
            $table->string('server_os', 255);
            $table->boolean('data_scheme', 255);
            $table->boolean('typing', 255);
            $table->boolean('xml_support', 255);
            $table->boolean('secondary_indexes', 255);
            $table->string('sql', 255);
            $table->string('apis_access_method', 255);
            $table->string('supported_programming_lang', 255);
            $table->string('server-side scripts', 255);
            $table->boolean('triggers');
            $table->string('partitioning_methods', 255);
            $table->string('replication_methods', 255);
            $table->boolean('mapreduce');
            $table->string('consistency_concepts', 255);
            $table->boolean('foreign_keys');
            $table->boolean('transaction_concepts');
            $table->boolean('concurrency');
            $table->boolean('durability');
            $table->boolean('in_memory_capabilities');
            $table->string('user_concepts', 255);
            $table->integer('profile_views')->default(0);
            $table->string('db_name', 255);
            $table->boolean('approved')->default(false);
            $table->timestamps();
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
