<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Artisan; 
use Illuminate\Support\Facades\Log;

class Dbms extends Model
{
    use HasFactory;
    
    protected $table = 'dbms';

    protected static function boot()
    {
        parent::boot();

        static::created(function ($dbms) { 
            try {
                Artisan::call('fetch:trends', ['keywords' => $dbms->name]);
                // Optionally capture and log output
                $output = Artisan::output();
                Log::info('fetch:trends command executed successfully: ' . $output);
            } catch (\Exception $e) {
                Log::error('Error running fetch:trends command: ' . $e->getMessage());
            }
        });
    }
}
