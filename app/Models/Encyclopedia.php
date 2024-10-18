<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Encyclopedia extends Model
{
    use HasFactory;
    protected $table = 'encyclopedia';

    protected $fillable = [
        'title',
        'content',
    ];
}
