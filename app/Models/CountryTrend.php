<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CountryTrend extends Model
{
    use HasFactory;
    protected $table = 'country_trends';

    protected $fillable = [
        'dbms_id',
        'country_code',
        'score',
        'date'
    ];
}
