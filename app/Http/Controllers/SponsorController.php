<?php

namespace App\Http\Controllers;

use App\Models\Sponsor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class SponsorController extends Controller
{
    public function sponsors()
    {
        try {
            $sponsors = Sponsor::all();
            return response()->json(['success' => true, 'sponsors' => $sponsors]);
        } catch (\Exception $th) {
            return response()->json(['success' => false, 'error' => $th->getMessage()], 500);
        }
    }

    public function sponsor(Request $request)
    {
        try {
            $sponsor_id = $request->query('id');
            $sponsor = Sponsor::find($sponsor_id);
            return response()->json(['success' => true, 'sponsor' => $sponsor]);
        } catch (\Exception $th) {
            return response()->json(['success' => false, 'error' => $th->getMessage()], 500);
        }
    }

    public function create(Request $request)
    {
        try {
            $data = $request->all();

            $validator = Validator::make($data, [
                'name' => ['required', 'string', 'max:255'],
                'description' => ['required', 'string'],
                'link' => ['required', 'string', 'max:255'],
                'featured' => ['required', 'integer'],
                'logo_file' => ['required', 'file', 'mimes:jpeg,png,jpg,gif'],
                'banner_file' => ['required', 'file', 'mimes:jpeg,png,jpg,gif']
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
            }

            $logoPath = $request->file('logo_file')->store('images/sponsors/logos', 'public');
            $bannerPath = $request->file('banner_file')->store('images/sponsors/banners', 'public');

            Sponsor::create([
                'name' => $data['name'],
                'description' => $data['description'],
                'link' => $data['link'],
                'featured' => $data['featured'],
                'logo_url' => $logoPath,
                'banner' => $bannerPath,
            ]);

            return response()->json(['success' => true]);
        } catch (\Exception $th) {
            return response()->json(['success' => false, 'error' => $th->getMessage()], 500);
        }
    }

    public function update(Request $request)
    {
        try {
            $data = $request->all();
            $validator = Validator::make($data, [
                'id' => ['required', 'integer'],
                'name' => ['required', 'string', 'max:255'],
                'featured' => ['required', 'integer'],
                'description' => ['required', 'string'],
                'link' => ['required', 'string', 'max:255'],
                'logo_file' => ['nullable', 'file', 'mimes:jpeg,png,jpg,gif'],
                'banner_file' => ['nullable', 'file', 'mimes:jpeg,png,jpg,gif']
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'errors' => $validator->errors(), 'hello' => $request->banner_file], 422);
            }

            $sponsor = Sponsor::findOrFail($data['id']);

            if ($request->hasFile('logo_file')) {
                if ($sponsor->logo_url) {
                    Storage::disk('public')->delete($sponsor->logo_url);
                }
                $logoPath = $request->file('logo_file')->store('images/sponsors/logos', 'public');
                $sponsor->logo_url = $logoPath;
            }

            if ($request->hasFile('banner_file')) {
                if ($sponsor->banner) {
                    Storage::disk('public')->delete($sponsor->banner);
                }
                $bannerPath = $request->file('banner_file')->store('images/sponsors/banners', 'public');
                $sponsor->banner = $bannerPath;
            }

            $sponsor->name = $data['name'] ?? $sponsor->name;
            $sponsor->description = $data['description'] ?? $sponsor->description;
            $sponsor->link = $data['link'] ?? $sponsor->link;
            $sponsor->featured = $data['featured'] ?? $sponsor->featured;

            $sponsor->save();

            return response()->json(['success' => true]);

        } catch (\Exception $th) {
            return response()->json(['success' => false, 'errors' => $th->getMessage()], 500);
        }
    }

    public function delete(Request $request)
    {
        try {
            $sponsor_id = $request->query('id');
            $sponsor = Sponsor::find($sponsor_id);

            if (!$sponsor) {
                return response()->json(['success' => false, 'error' => 'Sponsor not found'], 404);
            }

            $sponsor->delete();
            return response()->json(['success' => true]);
        } catch (\Exception $th) {
            return response()->json(['success' => false, 'error' => $th->getMessage()], 500);
        }
    }

}
