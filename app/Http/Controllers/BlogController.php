<?php

namespace App\Http\Controllers;

use App\Model\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BlogController extends Controller
{
    public function getBlogs()
    {
        Blog::with('user')->all();
    }

    public function getBlog(Request $request)
    {
        $id = $request->query('id');
        
        $blog = Blog::with('user')->find($id);

        if (!$blog) {
            return response()->json(['success' => false, 'message' => 'Blog not found'], 404);
        }

        return response()->json(['success' => true, 'blog' => $blog]);
    }

    public function createBlog(Request $request)
    {
        $data = $request->all();

        $validator = Validator::make($data, [
            'user_id' => ['required', 'integer'],
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'tags' => ['required', 'string'],
            'categories' => ['required', 'string'],
        ]);

        if ($validator->fails()) return response()->json(['errors' => $validator->errors()], 422);

        Blog::create($validator->validated());

        return response()->json(['success' => true]);
    }

    public function updateBlog(Request $request)
    {
        $data = $request->all();
        $id = $request->query('id');

        $validator = Validator::make($data, [
            'user_id' => ['required', 'integer'],
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'tags' => ['required', 'string'],
            'categories' => ['required', 'string'],
        ]);

        if ($validator->fails()) return response()->json(['errors' => $validator->errors()], 422);

        $blog = Blog::find($id);
        
        if (!$blog) return response()->json(['error' => 'Blog is not found.'], 404);

        $blog->update($validator->validated());

        return response->json(['success' => true]);
    }

    public function deleteBlog(Request $request)
    {
        $id = $request->query('id');
        
    }
}
