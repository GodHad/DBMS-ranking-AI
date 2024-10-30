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
        'logo_url',
        'banner',
        'approved'
    ];

    public function primaryCategory()
    {
        return $this->hasManyThrough(
            Category::class,           // Target model
            PrimaryCategoryVendor::class, // Intermediate/pivot model
            'vendor_id',              // Foreign key on the pivot table (PrimaryCategoryVendor)
            'id',                     // Foreign key on the Category table
            'id',                     // Local key on the Vendor table
            'category_id'             // Local key on the PrimaryCategoryVendor table
        );
    }

    public function secondaryCategory()
    {
        return $this->hasManyThrough(
            Category::class,           // Target model
            SecondaryCategoryVendor::class, // Intermediate/pivot model
            'vendor_id',              // Foreign key on the pivot table (PrimaryCategoryVendor)
            'id',                     // Foreign key on the Category table
            'id',                     // Local key on the Vendor table
            'category_id'             // Local key on the PrimaryCategoryVendor table
        );
    }
}
