<?php

namespace App\Http\Controllers;

use App\Models\VendorRequest;
use App\Models\User;
use App\Models\UserRole;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class VendorRequestController extends Controller
{
    public function getAllVendors()
    {
        $vendors = UserRole::where('role', 'vendor')->with('user')->get();
        return response()->json(['success' => true, 'vendors' => $vendors]);
    }

    public function getAllRequests()
    {
        $vendor_requests = VendorRequest::with('user')->get();
        return response()->json(['success' => true, 'requests' => $vendor_requests]);
    }

    public function createVendorRequest(Request $request)
    {
        $data = $request->all();
        
        $validator = Validator::make($data, [
            'name' => ['required', 'string', 'max:255'],
            'surname' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email'],
            'phone_number' => ['required', 'string', 'max:255'],
            'job_title' => ['required', 'string', 'max:255'],
            'company' => ['required', 'string', 'max:255'],
        ]);

        if ($validator->fails()) return response()->json(['errors' => $validator->errors()], 422);

        $user = User::where('email', $data['email'])->first();

        if ($user) {
            $vendor = VendorRequest::where('user_id', $user->id)->first();
            if ($vendor) return response()->json(['error' => 'You already sent request'], 405);
            else {
                $user->update($validator->validated());

                VendorRequest::create([
                    'user_id' => $user->id
                ]);
        
                return response()->json(['success' => true]);
            }
        }

        $user = User::create([
            'name' => $data['name'],
            'surname' => $data['surname'],
            'email' => $data['email'],
            'phone_number' => $data['phone_number'],
            'job_title' => $data['job_title'],
            'company' => $data['company']
        ]);

        VendorRequest::create([
            'user_id' => $user->id
        ]);

        return response()->json(['success' => true]);
    }

    public function createVendor(Request $request)
    {
        $data = $request->all();

        $validator = Validator::make($data, [
            'name' => ['required', 'string', 'max:255'],
            'surname' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email'],
            'phone_number' => ['required', 'string'],
            'job_title' => ['required', 'string'],
            'company' => ['required', 'string'],
            'password' => ['required', 'string'],
            'approved' => ['required', 'integer']
        ]);

        if ($validator->fails()) return response()->json(['errors' => $validator->errors()], 422);

        $user = User::where('email', $data['email'])->first();

        if ($user) {
            $vendor = UserRole::where('user_id', $user->id)->where('role', 'vendor')->first();
            if ($vendor) {
                if ($vendor->approved === 0)
                    return response()->json(['error' => 'You already sent request'], 405);
                else return response()->json(['error' => 'You are approved now.'], 405);
            }
            else {
                $user->update($validator->validated());
                UserRole::create([
                    'user_id' => $user->id,
                    'approved' => $data['approved'],
                    'role' => 'vendor'
                ]);
                return response()->json(['success' => true]);
            }
        }

        $vendor = User::create([
            'name' => $data['name'],
            'surname' => $data['surname'],
            'email' => $data['email'],
            'phone_number' => $data['phone_number'],
            'job_title' => $data['job_title'],
            'company' => $data['company'],
            'password' => Hash::make($data['password']),
        ]);

        UserRole::create([
            'user_id' => $vendor->id,
            'approved' => $data['approved'],
            'role' => 'vendor'
        ]);

        return response()->json(['success' => true]);
    }


    public function updateVendor(Request $request)
    {
        $data = $request->all();
        $id = $request->query('id');

        $validator = Validator::make($data, [
            'name' => ['required', 'string', 'max:255'],
            'surname' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email'],
            'phone_number' => ['required', 'string'],
            'job_title' => ['required', 'string'],
            'company' => ['required', 'string'],
            'userRoleId' => ['required', 'integer'],
            'approved' => ['required', 'integer']
        ]);

        if ($validator->fails()) return response()->json(['errors' => $validator->errors()], 422);

        $vendor = User::find($id);

        if (!$vendor) return response()->json(['Vendor is not found'], 404);
        $vendor->name = $data['name'];
        $vendor->surname = $data['surname'];
        $vendor->email = $data['email'];
        $vendor->phone_number = $data['phone_number'];
        $vendor->job_title = $data['job_title'];
        $vendor->company = $data['company'];
        $vendor->save();

        $userRole = UserRole::find($data['userRoleId']);
        $userRole->approved = $data['approved'];
        $userRole->save();

        return response()->json(['success' => true]);
    }

    public function deleteVendor(Request $request)
    {
        $id = $request->query('id');
        $vendor = User::find($id);

        if (!$vendor) return response()->json(['error' => 'Vendor is not found'], 404);

        $vendor->delete();

        return response()->json(['success' => true]);
    }
}
