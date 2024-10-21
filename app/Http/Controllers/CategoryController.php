<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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

    public function create(Request $request)
    {
        try {
            $data = $request->all();
            $validator = Validator::make($data, [
                'title' => ['required', 'string', 'max:255'],
                'shortname' => ['required', 'string', 'max:255'],
            ]);
            
            if ($validator->fails()) return response()->json(['success' => false, 'errors' => $validator->errors()]);

            Category::create([
                'title' => $data['title'],
                'shortname' => $data['shortname']
            ]);

            return response()->json(['success' => true]);
        } catch (\Exception $th) {
            return response()->json(['success' => false, 'errors' => ['shortname' => 'Failed to create vendor'], 'error' => $th->getMessage()]);
        }
    }

    public function update(Request $request)
    {
        try {
            $data = $request->all();
            $id = $request->query('id');
            $category = Category::find($id);

            if (!$category) 
                return response()->json(['success' => false, 'errors' => ['shortname' => 'Can\'t find the category']]);
            
            $validator = Validator::make($data, [
                'title' => ['sometimes', 'string', 'max:255'],
                'shortname' => ['sometimes', 'string', 'max:255']
            ]);

            if ($validator->fails()) return response()->json(['success' => false, 'errors' => $validator->errors()]);

            $category->update($validator->validated());

            return response()->json(['success' => true, 'category' => $category]);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'errors' => ['shortname' => 'Failed to update vendor']]);
        }
    }

    public function delete(Request $request)
    {
        try {
            $id = $request->query('id');
            $category = Category::find($id);

            if (!$category)
                return response()->json(['success' => false, 'errors' => [ 'Can\'t find the category']], 422);

            $category->delete();
            return response()->json(['success' => true]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'errors' => ['shorname' => 'Failed to delete blog']]);
        }
    }
}
