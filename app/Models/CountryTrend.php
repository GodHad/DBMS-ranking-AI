<?php

namespace App\Models;
use App\Models\Vendor;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CountryTrend extends Model
{
    use HasFactory;
    protected $table = 'country_trends';

    protected $fillable = [
        'vendor_id',
        'country_code',
        'score',
        'date'
    ];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class, 'vendor_id');
    }
}
