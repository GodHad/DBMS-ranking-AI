<?php

namespace App\Http\Controllers;

use App\Models\Sponsor;
use Illuminate\Http\Request;

class SponsorController extends Controller
{
    public function sponsors()
    {
        try {
            $sponsors = Sponsor::all();
            return response()->json(['success' => true, 'sponsors' => $sponsors]);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'error' => 'Failed to get sponsors']);
        }
    }

    public function sponsor(Request $request)
    {
        try {
            $sponsor_id = $request->query('id');
            $sponsor = Sponsor::find($sponsor_id);
            return response()->json(['success' => true, 'sponsor' => $sponsor]);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'error' => 'Failed to get sponsor']);
        }
    }

    public function create(Request $request)
    {
        try {
            $data = $request->all();

            $validator = Validator::make($data, [
                'name' => ['required', 'string', 'max:255'],
                'link' => ['required', 'string', 'max:255'],
                'logo_file' => ['required', 'file', 'mimes:jpeg,png,jpg,gif'],
                'banner_file' => ['required', 'file', 'mimes:jpeg,png,jpg,gif']
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'errors' => $validator->errors()]);
            }

            $logoPath = $request->file('logo')->store('logos', 'public/sponsors/logos');
            $bannerPath = $request->file('banner')->store('banners', 'public/sponsors/banners');

            Sponsor::create([
                'name' => $data['name'],
                'link' => $data['link'],
                'logo_url' => $logoPath,
                'banner' => $bannerPath,
            ]);

            return response()->json(['success' => true]);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'errors' => ['current_release' => 'Failed to create vendor']]);
        }
    }

    public function update(Request $request)
    {
        try {
            $data = $request->all();
            $id = $request->query('id');
            
            $validator = Validator::make($data, [
                'name' => ['sometimes', 'string', 'max:255'],
                'link' => ['sometimes', 'string', 'max:255'],
                'logo_file' => ['sometimes', 'file', 'mimes:jpeg,png,jpg,gif'],
                'banner_file' => ['sometimes', 'file', 'mimes:jpeg,png,jpg,gif'],
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'errors' => $validator->errors()]);
            }

            $sponsor = Sponsor::findOrFail($id);

            if ($request->hasFile('logo_file')) {
                if ($sponsor->logo_url) {
                    Storage::disk('public')->delete($sponsor->logo_url);
                }
                $logoPath = $request->file('logo_file')->store('logos', 'public/sponsors/logos');
                $sponsor->logo_url = $logoPath;
            }

            if ($request->hasFile('banner_file')) {
                if ($sponsor->banner) {
                    Storage::disk('public')->delete($sponsor->banner);
                }
                $bannerPath = $request->file('banner_file')->store('banners', 'public/sponsors/banners');
                $sponsor->banner = $bannerPath;
            }

            $sponsor->name = $data['name'];
            $sponsor->link = $data['link'];
            $sponsor->save();

            return response()->json(['success' => true]);

        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'errors' => ['current_release' => 'Failed to update sponsor']]);
        }
    }

    public function delete(Request $request)
    {
        try {
            $sponsor_id = $request->query('id'); 
            $sponsor = Sponsor::find($sponsor_id);

            if (!$sponsor) {
                return response()->json(['success' => false, 'error' => 'Sponsor not found']);
            }

            $sponsor->delete();
            return response()->json(['success' => true]);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'error' => 'Failed to delete sponsor']);
        }
    }

}
