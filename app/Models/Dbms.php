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
    protected $fillable = [
        'name',
        'vendor_id'
    ];
}
