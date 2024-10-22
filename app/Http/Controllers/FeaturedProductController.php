<?php

namespace App\Http\Controllers;

use App\Models\FeaturedProduct;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class FeaturedProductController extends Controller
{
    public function featured_products()
    {
        try {
            $featured_products = FeaturedProduct::all();
            return response()->json(['success' => true, 'featured_products' => $featured_products]);
        } catch (\Exception $th) {
            return response()->json(['success' => false, 'error' => $th->getMessage()], 500);
        }
    }

    public function featured_product(Request $request)
    {
        try {
            $featured_product_id = $request->query('id');
            $featured_product = FeaturedProduct::find($featured_product_id);
            return response()->json(['success' => true, 'featured_product' => $featured_product]);
        } catch (\Exception $th) {
            return response()->json(['success' => false, 'error' => $th->getMessage()], 500);
        }
    }

    public function create(Request $request)
    {
        try {
            $data = $request->all();

            $validator = Validator::make($data, [
                'title' => ['required', 'string', 'max:255'],
                'content' => ['required', 'string'],
                'link' => ['required', 'string', 'max:255'],
                'published' => ['required', 'integer'],
                'banner_file' => ['required', 'file', 'mimes:jpeg,png,jpg,gif']
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
            }

            $bannerPath = $request->file('banner_file')->store('images/featured_products/banners', 'public');

            FeaturedProduct::create([
                'title' => $data['title'],
                'content' => $data['content'],
                'link' => $data['link'],
                'published' => $data['published'],
                'banner' => $bannerPath,
            ]);

            return response()->json(['success' => true]);
        } catch (\Exception $th) {
            return response()->json(['success' => false, 'errors' => $th->getMessage()], 500);
        }
    }

    public function update(Request $request)
    {
        try {
            $data = $request->all();
            $validator = Validator::make($data, [
                'id' => ['required', 'integer'],
                'title' => ['required', 'string', 'max:255'],
                'content' => ['required', 'string'],
                'link' => ['required', 'string', 'max:255'],
                'published' => ['required', 'integer'],
                'banner_file' => ['nullable', 'file', 'mimes:jpeg,png,jpg,gif']
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'errors' => $validator->errors(), 'hello' => $request->banner_file], 422);
            }

            $featured_product = FeaturedProduct::findOrFail($data['id']);

            if ($request->hasFile('banner_file')) {
                if ($featured_product->banner) {
                    Storage::disk('public')->delete($featured_product->banner);
                }
                $bannerPath = $request->file('banner_file')->store('images/featured_products/banners', 'public');
                $featured_product->banner = $bannerPath;
            }


            $featured_product->title = $data['title'];
            $featured_product->content = $data['content'];
            $featured_product->link = $data['link'];
            $featured_product->published = $data['published'];

            $featured_product->save();

            return response()->json(['success' => true]);

        } catch (\Exception $th) {
            return response()->json(['success' => false, 'errors' => $th->getMessage()], 500);
        }
    }

    public function delete(Request $request)
    {
        try {
            $featured_product_id = $request->query('id');
            $featured_product = FeaturedProduct::find($featured_product_id);

            if (!$featured_product) {
                return response()->json(['success' => false, 'error' => 'Featured product not found'], 404);
            }

            Storage::disk('public')->delete($featured_product->banner);
            $featured_product->delete();
            return response()->json(['success' => true]);
        } catch (\Exception $th) {
            return response()->json(['success' => false, 'error' => $th->getMessage()], 500);
        }
    }
}
