<?php

namespace App\Models;

use App\Models\User;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
    use HasFactory;
    protected $table = 'vendors';

    protected $fillable = [
        'user_id',
        'company_name',
        'website_url',
        'contact_info',
        'description',
        'category_id',
        'initial_release',
        'current_release',
        'profile_views',
        'approved'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
