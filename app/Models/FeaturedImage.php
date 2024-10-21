<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeaturedImage extends Model
{
    use HasFactory;
    protected $fillable = ['blog_id', 'url'];

    public function blog()
    {
        return $this->belongsTo(Blog::class);
    }
}
