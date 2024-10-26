<?php

namespace App\Models;

use App\Models\User;
use App\Models\Category;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
    use HasFactory;
    protected $table = 'vendors';

    protected $fillable = [
        'company_name',
        'description',
        'primary_category',
        'secondary_category',
        'website_url',
        'technical_doc',
        'developer',
        'initial_release',
        'current_release',
        'license',
        'cloud_based_only',
        'dbaas_offerings',
        'implementation_lang',
        'server_os',
        'data_scheme',
        'typing',
        'xml_support',
        'secondary_indexes',
        'sql',
        'apis_access_method',
        'supported_programming_lang',
        'server_side_scripts',
        'triggers',
        'partitioning_methods',
        'replication_methods',
        'mapreduce',
        'consistency_concepts',
        'foreign_keys',
        'transaction_history',
        'concurrency',
        'durability',
        'in_memory_capabilities',
        'user_concepts',
        'db_name',
        'approved'
    ];

    public function primaryCategory()
    {
        return $this->belongsToMany(Category::class, 'primary_category_vendor', 'vendor_id', 'category_id');
    }

    public function secondaryCategory()
    {
        return $this->belongsToMany(Category::class, 'secondary_category_vendor', 'vendor_id', 'category_id');
    }
}
