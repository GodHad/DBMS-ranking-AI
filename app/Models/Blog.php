<?php

namespace App\Models;

use App\Models\User;
use App\Models\BCategory;
use App\Models\Tag;
use App\Models\FeaturedImage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    use HasFactory;
    
    protected $table = 'blogs';
    protected $fillable = [
        'title',
        'content',
        'user_id',
        'meta_title',
        'meta_description',
        'og_graph_image',
        'twitter_graph_image'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function categories()
    {
        return $this->belongsToMany(BCategory::class, 'blog_category');
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'blog_tag');
    }

    public function featured_images()
    {
        return $this->hasMany(FeaturedImage::class);
    }
}
