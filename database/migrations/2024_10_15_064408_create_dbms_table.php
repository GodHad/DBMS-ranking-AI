<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDbmsTable extends Migration
{
    public function up()
    {
        Schema::create('dbms', function (Blueprint $table) {
            $table->increments('id'); // or $table->bigIncrements('id');
            $table->string('name', 255);
            $table->unsignedInteger('vendor_id')->nullable();
            $table->timestamps();

            // Ensure foreign key constraint is properly formed
            $table->foreign('vendor_id')->references('id')->on('vendors')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('dbms', function (Blueprint $table) {
            $table->dropForeign(['vendor_id']);
        });

        Schema::dropIfExists('dbms');
    }
}
