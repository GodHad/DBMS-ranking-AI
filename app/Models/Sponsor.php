<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sponsor extends Model
{
    use HasFactory;
    protected $table = 'sponsors';

    protected $fillable = [
        'name',
        'description',
        'logo_url',
        'link',
        'banner',
        'featured'
    ];
}
