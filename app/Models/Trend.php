<?php

namespace App\Models;
use App\Models\Vendor;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Trend extends Model
{
    use HasFactory;
    protected $table = 'trends';

    protected $fillable = [
        'vendor_id',
        'score',
        'date'
    ];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class, 'vendor_id');
    }
}
