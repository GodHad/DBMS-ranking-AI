<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;

use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::HOME;

    public function index(Request $request)
    {
        // var_dump(Auth::guard('web')->user());
        // die();
        $data = $request->all();

        $validator = Validator::make($data, [
            'email' => ['required', 'string', 'email', 'max:255'],
            'password' => ['required', 'string']
        ]);

        if ($validator->fails()) return response()->json(['success' => false, 'errors' => $validator->errors()]);

        $user = User::where('email', $data['email'])->first();
        
        if (!$user) {
            return response()->json(['success' => false, 'errors' => ['User does not exist']]);
        }

        if (!Hash::check($data['password'], $user->password)) {
            return response()->json(['success' => false, 'errors' => ['Incorrect password']]);
        }

        if ($token = Auth::guard('web')->attempt(['email' => $data['email'], 'password' => $data['password']])) {
            $user = Auth::guard('web')->user();
            $admins = env('admin');
            if ($user) $user->admin = strpos($admins, $user->email) !== false;
            return response()->json(['success' => true, 'user' => $user, 'token' => $token]);
        } else {
            return response()->json(['success' => false, 'errors' => ['Login failed']]);
        }
    }

    public function logout()
    {
        Auth::guard('web')->logout();
        return response()->json(['success' => true]);
    }
}
