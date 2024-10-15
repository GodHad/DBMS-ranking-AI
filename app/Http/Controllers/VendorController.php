<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class VendorController extends Controller
{
    public function vendors()
    {
        try {
            $vendors = Vendor::all();
            return response()->json(['success' => true, 'vendors' => $vendors]);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'error' => 'Failed to get vendors']);
        }
    }

    public function vendor(Request $request)
    {
        try {
            $vendor_id = $request->query('id');
            $vendor = Vendor::find($vendor_id);
            return response()->json(['success' => true, 'vendor' => $vendor]);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'error' => 'Failed to get vendor']);
        }
    }

    public function create(Request $request)
    {
        try {
            $data = $request->all();

            $validator = Validator::make($data, [
                'company_name' => ['required', 'string', 'max:255'],
                'website_url' => ['required', 'string', 'url'],
                'contact_info' => ['required', 'string'],
                'description' => ['required', 'string'],
                'category_id' => ['required', 'integer'],
                'initial_release' => ['required', 'string'],
                'current_release' => ['required', 'string']
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'errors' => $validator->errors()]);
            }

            // $user = User::where('email', Auth::user()->email)->first();

            Vendor::create([
                // 'user_id' => $user->id,
                'company_name' => $data['company_name'],
                'website_url' => $data['website_url'],
                'contact_info' => $data['contact_info'],
                'description' => $data['description'],
                'category_id' => $data['category_id'],
                'initial_release' => $data['initial_release'],
                'current_release' => $data['current_release']
            ]);

            return response()->json(['success' => true]);
        } catch (\Exception $th) {
            return response()->json(['success' => false, 'errors' => ['current_release' => 'Failed to create vendor'], 'erorr' => $th->getMessage()]);
        }
    }

    public function update(Request $request)
    {
        try {
            $data = $request->all();
            $vendor_id = $request->query('id');
            $vendor = Vendor::find($vendor_id);

            if (!$vendor) {
                return response()->json(['success' => false, 'errors' => ['current_release' => 'Vendor not found']]);
            }

            $validator = Validator::make($data, [
                'company_name' => ['sometimes', 'string', 'max:255'],
                'website_url' => ['sometimes', 'string', 'url'],
                'contact_info' => ['sometimes', 'string'],
                'description' => ['sometimes', 'string'],
                'category_id' => ['sometimes', 'integer'],
                'initial_release' => ['sometimes', 'string'],
                'current_release' => ['sometimes', 'string'],
                'approved' => ['sometimes', 'boolean']
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'errors' => $validator->errors()]);
            }

            $vendor->update($validator->validated());

            return response()->json(['success' => true, 'vendor' => $vendor]);
        } catch (\Exception $th) {
            return response()->json(['success' => false, 'error' => 'Failed to update vendor', 'hey' => $th->getMessage()]);
        }
    }

    public function delete(Request $request)
    {
        try {
            $vendor_id = $request->query('id');
            $vendor = Vendor::find($vendor_id);

            if (!$vendor) {
                return response()->json(['success' => false, 'error' => 'Vendor not found']);
            }

            $vendor->delete();
            return response()->json(['success' => true]);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'error' => 'Failed to delete vendor']);
        }
    }
}
