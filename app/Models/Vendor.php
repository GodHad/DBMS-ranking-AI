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

    protected $hidden = [
        'category_id'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
}
