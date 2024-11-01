<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Vendor;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $searchTerm = $request->input('searchTerm');
        
        if (!$searchTerm || $searchTerm === '') return response()->json(['dbms' => [], 'blog' => []]);

        $blogs = Blog::select('id', 'title')->where('title', 'LIKE', '%' . $searchTerm . '%')->get();
        $dbms = Vendor::select('id', 'db_name')->where('db_name', 'LIKE', '%' . $searchTerm . '%')->get();

        return response()->json(['dbms' => $dbms, 'blog' => $blogs]);
    }
}
