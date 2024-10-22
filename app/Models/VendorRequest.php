<?php

namespace App\Models;

use App\Models\User;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VendorRequest extends Model
{
    use HasFactory;

    protected $table = 'vendor_request';
    protected $fillable = [
        'user_id'
    ];

    public function user()
    {
        return $this()->belongsToOne(User::class, 'user_id');
    }
}
