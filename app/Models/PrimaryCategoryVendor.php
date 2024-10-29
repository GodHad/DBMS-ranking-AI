<?php

namespace App\Models;

use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrimaryCategoryVendor extends Model
{
    use HasFactory;
    protected $table = 'primary_category_vendor';
    protected $fillable = [
        'category_id',
        'vendor_id'
    ];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class, 'vendor_id');
    }

    // Each entry belongs to one Category
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
}
