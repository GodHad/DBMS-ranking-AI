<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use App\Models\User;
use App\Models\Trend;
use App\Models\CountryTrend;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Jobs\ProcessAfterDbmsCreation;

class VendorController extends Controller
{
    public function vendors()
    {
        try {
            $vendors = Vendor::with('category')->get();
            return response()->json(['success' => true, 'vendors' => $vendors]);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'error' => 'Failed to get vendors']);
        }
    }

    public function vendor(Request $request)
    {
        try {
            $vendor_id = $request->query('id');
            $vendor = Vendor::with('category')->find($vendor_id);
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
                'db_name' => ['required', 'string'],
                'initial_release' => ['required', 'string'],
                'current_release' => ['required', 'string']
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'errors' => $validator->errors()]);
            }

            // $user = User::where('email', Auth::user()->email)->first();

            $vendor = Vendor::create([
                // 'user_id' => $user->id,
                'company_name' => $data['company_name'],
                'website_url' => $data['website_url'],
                'contact_info' => $data['contact_info'],
                'description' => $data['description'],
                'category_id' => $data['category_id'],
                'db_name' => $data['db_name'],
                'initial_release' => $data['initial_release'],
                'current_release' => $data['current_release']
            ]);
            
            ProcessAfterDbmsCreation::dispatch($vendor->db_name);

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
                'db_name' => ['sometimes', 'string'],
                'initial_release' => ['sometimes', 'string'],
                'current_release' => ['sometimes', 'string'],
                'approved' => ['sometimes', 'boolean']
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'errors' => $validator->errors()]);
            }

            $dbNameChanged = false;
            $validatedData = $validator->validated();
            if (array_key_exists('db_name', $validatedData)) {
                if ($vendor->db_name !== $validatedData['db_name']) {
                    $dbNameChanged = true;
                }
            }

            $vendor->update($validator->validated());

            if ($dbNameChanged) {
                Trend::where('vendor_id', $vendor->id)->delete();
                CountryTrend::where('vendor_id', $vendor->id)->delete();
                ProcessAfterDbmsCreation::dispatch($vendor->db_name);
            }

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

            Trend::where('vendor_id', $vendor->id)->delete();
            CountryTrend::where('vendor_id', $vendor->id)->delete();
            $vendor->delete();
            return response()->json(['success' => true]);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'error' => 'Failed to delete vendor']);
        }
    }
}
