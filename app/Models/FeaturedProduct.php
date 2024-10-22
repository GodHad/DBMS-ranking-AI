<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeaturedProduct extends Model
{
    use HasFactory;
    
    protected $table = 'featured_products';
    protected $fillable = [
        'title',
        'content',
        'link',
        'banner',
        'published'
    ];
}
