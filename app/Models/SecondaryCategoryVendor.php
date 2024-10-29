<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SecondaryCategoryVendor extends Model
{
    use HasFactory;
    protected $table = 'secondary_category_vendor';
    protected $fillable = [
        'category_id',
        'vendor_id'
    ];
}
