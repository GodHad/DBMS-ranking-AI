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

            $logoPath = $request->file('logo_file')->store('sponsors/logos', 'public');
            $bannerPath = $request->file('banner_file')->store('sponsors/banners', 'public');

            Sponsor::create([
                'name' => $data['name'],
                'link' => $data['link'],
                'logo_url' => $logoPath,
                'banner' => $bannerPath,
            ]);

            return response()->json(['success' => true]);
        } catch (\Exception $th) {
            return response()->json(['success' => false, 'errors' => ['current_release' => 'Failed to create sponsor.']]);
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
                $logoPath = $request->file('logo_file')->store('sponsors/logos', 'public');
                $sponsor->logo_url = $logoPath;
            }

            if ($request->hasFile('banner_file')) {
                if ($sponsor->banner) {
                    Storage::disk('public')->delete($sponsor->banner);
                }
                $bannerPath = $request->file('banner_file')->store('sponsors/banners', 'public');
                $sponsor->banner = $bannerPath;
            }

            if (!empty($data['name'])) {
                $sponsor->name = $data['name'];
            }
            
            if (!empty($data['link'])) {
                $sponsor->link = $data['link'];
            }

            $sponsor->save();

            return response()->json(['success' => true]);

        } catch (\Exception $th) {
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
