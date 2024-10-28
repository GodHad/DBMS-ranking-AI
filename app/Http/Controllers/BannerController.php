<?php

namespace App\Http\Controllers;

use App\Models\Banner;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class BannerController extends Controller
{
    public function getBanners()
    {
        $banners = Banner::all();

        return response()->json(['banners' => $banners]);
    }

    public function createBanner(Request $request)
    {
        $data = $request->all();
        $validator = Validator::make($data, [
            'file' => ['required', 'file', 'mimes:jpeg,png,jpg,gif,webp,webp'],
            'type' => ['required', 'integer'],
            'link' => ['required', 'string', 'max:255']
        ]);
        if ($validator->fails()) return response()->json(['errors' => $validator->errors()], 422);
        $url = $request->file('file')->store('images/banners', 'public');
        $banner = Banner::create([
            'url' => $url,
            'type' => $data['type'],
            'link' => $data['link']
        ]);

        return response()->json(['image' => $banner]);
    }

    public function updateBanner(Request $request)
    {
        try {
            $data = $request->all();
            $validator = Validator::make($data, [
                'id' => ['required', 'integer'],
                'link' => ['required', 'string', 'max:255'],
                'type' => ['required', 'integer'],
                'url' => ['required', 'string'],
                'file' => ['nullable', 'file', 'mimes:jpeg,png,jpg,gif,webp'],
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'errors' => $validator->errors(), 'hello' => $request->banner_file], 422);
            }

            $banner = Banner::findOrFail($data['id']);

            if ($request->hasFile('file')) {
                if ($banner->url) {
                    Storage::disk('public')->delete($banner->url);
                }
                $url = $request->file('file')->store('images/banners', 'public');
                $banner->url = $url;
            }

            $banner->link = $data['link'] ?? $banner->link;
            $banner->type = $data['type'] ?? $banner->type;

            $banner->save();

            return response()->json(['success' => true]);

        } catch (\Exception $th) {
            return response()->json(['success' => false, 'errors' => $th->getMessage()], 500);
        }
    }

    public function deleteBanner(Request $request)
    {
        $id = $request->query('id');
        $banner = Banner::findOrFail($id);

        if (!$banner)
            return response()->json(['success' => false, 'errors' => [ 'Banner is not found']], 422);
        
        Storage::disk('public')->delete($banner->url);
        $banner->delete();
        return response()->json(['id' => $banner->id]);
    }
}
