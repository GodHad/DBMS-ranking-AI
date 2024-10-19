<?php

namespace App\Models;

use App\Model\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class blog extends Model
{
    use HasFactory;
    
    protected $table = 'blog';
    protected $fillable = [
        'name',
        'email',
        'phone_number',
        'job_title',
        'role',
        'user_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
