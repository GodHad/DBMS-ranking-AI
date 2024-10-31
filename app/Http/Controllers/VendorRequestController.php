<?php

namespace App\Http\Controllers;

use App\Models\VendorRequest;
use App\Models\User;
use App\Models\UserRole;
use App\Models\Vendor;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;

class VendorRequestController extends Controller
{
    public function getAllVendors()
    {
        $vendors = UserRole::with('user.vendor')->get();
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
            'firstname' => ['required', 'string'],
            'lastname' => ['required', 'string'],
            'mobile' => ['required', 'string'],
            'email' => ['required', 'email'],
            'company' => ['required', 'string'],
            'jobtitle' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'dbms_id' => ['required', 'integer']
        ]);

        if ($validator->fails()) return response()->json(['errors' => $validator->errors()], 422);

        $user = User::where('email', $data['email'])->first();

        $user_vendor = DB::table('user_vendor')->where('vendor_id', $data['dbms_id'])->first();
        if ($user_vendor) 
            return response()->json(['error' => 'This DBMS is already requested.'], 405);
        if ($user) {
            $user_vendor = DB::table('user_vendor')->where('user_id', $user->id)->first();
            if ($user_vendor) return response()->json(['error' => 'Your already sent request for other DBMS.'], 405);
            $vendor = VendorRequest::where('user_id', $user->id)->first();
            if ($vendor) return response()->json(['error' => 'You already sent request'], 405);
            else {
                $user->update([
                    'name' => $data['firstname'],
                    'surname' => $data['lastname'],
                    'email' => $data['email'],
                    'phone_number' => $data['mobile'],
                    'job_title' => $data['jobtitle'],
                    'company' => $data['company'],
                ]);

                VendorRequest::create([
                    'user_id' => $user->id
                ]);

                UserRole::create([
                    'user_id' => $user->id,
                    'approved' => 0,
                ]);

                DB::table('user_vendor')->updateOrInsert(
                    ['user_id' => $user->id, 'vendor_id' => $data['dbms_id']]
                );
        
                return response()->json(['success' => true]);
            }
        }

        
        $user = User::create([
            'name' => $data['firstname'],
            'surname' => $data['lastname'],
            'email' => $data['email'],
            'phone_number' => $data['mobile'],
            'job_title' => $data['jobtitle'],
            'company' => $data['company'],
            'password' => Hash::make('12345678'),
        ]);
        
        VendorRequest::create([
            'user_id' => $user->id
        ]);
        
        UserRole::create([
            'user_id' => $user->id,
        ]);

        DB::table('user_vendor')->updateOrInsert([
            'user_id' => $user->id, 
            'vendor_id' => $data['dbms_id']
        ]);
        
        Mail::send('emails.contact', $data, function ($message) use ($data) {
            $message->from('office@dbrank.ai');
            $message->to($data['email'])
                    ->subject('Contact Request from ' . $data['firstname']);
        });
        return response()->json(['success' => true]);
    }

    // public function createVendor(Request $request)
    // {
    //     $data = $request->all();

    //     $validator = Validator::make($data, [
    //         'name' => ['required', 'string', 'max:255'],
    //         'surname' => ['required', 'string', 'max:255'],
    //         'email' => ['required', 'email'],
    //         'phone_number' => ['required', 'string'],
    //         'job_title' => ['required', 'string'],
    //         'company' => ['required', 'string'],
    //         'password' => ['required', 'string'],
    //         'approved' => ['required', 'integer'],
    //         'author' => ['required', 'integer']
    //     ]);

    //     if ($validator->fails()) return response()->json(['errors' => $validator->errors()], 422);

    //     $user = User::where('email', $data['email'])->first();

    //     if ($user) {
    //         $vendor = UserRole::where('user_id', $user->id)->where('role', 'vendor')->first();
    //         if ($vendor) {
    //             if ($vendor->approved === 0)
    //                 return response()->json(['error' => 'You already sent request'], 405);
    //             else return response()->json(['error' => 'You are approved now.'], 405);
    //         }
    //         else {
    //             $user->update($validator->validated());
    //             UserRole::create([
    //                 'user_id' => $user->id,
    //                 'approved' => $data['approved'],
    //                 'author' => $data['author']
    //             ]);
    //             return response()->json(['success' => true]);
    //         }
    //     }

    //     $vendor = User::create([
    //         'name' => $data['name'],
    //         'surname' => $data['surname'],
    //         'email' => $data['email'],
    //         'phone_number' => $data['phone_number'],
    //         'job_title' => $data['job_title'],
    //         'company' => $data['company'],
    //         'password' => Hash::make($data['password']),
    //     ]);

    //     UserRole::create([
    //         'user_id' => $vendor->id,
    //         'approved' => $data['approved'],
    //         'author' => $data['author']
    //     ]);

    //     return response()->json(['success' => true]);
    // }


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
            'approved' => ['required', 'integer'],
            'author' => ['required', 'integer']
        ]);

        if ($validator->fails()) return response()->json(['errors' => $validator->errors()], 422);

        $vendor = User::with('vendor')->find($id);

        if (!$vendor) return response()->json(['Vendor is not found'], 404);
        $vendor->name = $data['name'];
        $vendor->surname = $data['surname'];
        $vendor->email = $data['email'];
        $vendor->phone_number = $data['phone_number'];
        $vendor->job_title = $data['job_title'];
        $vendor->company = $data['company'];
        $vendor->save();

        $dbms = Vendor::find($vendor->vendor[0]->id);
        $dbms->approved = $data['approved'];
        $dbms->save();

        $userRole = UserRole::find($data['userRoleId']);
        $userRole->approved = $data['approved'];
        $userRole->author = $data['author'];
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
