<?php

namespace App\Models;

use App\Models\User;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserRole extends Model
{
    use HasFactory;

    protected $table = 'user_roles';
    protected $fillable = [
        'user_id',
        'role',
        'approved'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}