<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function categories()
    {
        try {
            $categories = Category::all();
            return response()->json(['success' => true, 'categories' => $categories]);
        } catch (\Exception $th) {
            return response()->json(['success' => false, 'error' => $th->getMessage()]);
        }
    }
}
