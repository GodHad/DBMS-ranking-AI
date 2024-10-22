<?php

namespace App\Http\Controllers;

use App\Models\UserRole;
use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class AuthorRequestController extends Controller
{
    public function getAllAuthors()
    {
        $authors = UserRole::where('role', 'author')->with('user')->get();
        return response()->json(['success' => true, 'authors' => $authors]);
    }

    public function createAuthor(Request $request)
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
            $author = UserRole::where('user_id', $user->id)->where('role', 'author')->first();
            if ($author) {
                if ($author->approved === 0)
                    return response()->json(['error' => 'You already sent request'], 405);
                else return response()->json(['error' => 'You are approved now.'], 405);
            }
            else {
                $user->update($validator->validated());
                UserRole::create([
                    'user_id' => $user->id,
                    'approved' => $data['approved'],
                    'role' => 'author'
                ]);
                return response()->json(['success' => true]);
            }
        }

        $author = User::create([
            'name' => $data['name'],
            'surname' => $data['surname'],
            'email' => $data['email'],
            'phone_number' => $data['phone_number'],
            'job_title' => $data['job_title'],
            'company' => $data['company'],
            'password' => Hash::make($data['password']),
        ]);

        UserRole::create([
            'user_id' => $author->id,
            'approved' => $data['approved'],
            'role' => 'author'
        ]);

        return response()->json(['success' => true]);
    }

    public function updateAuthor(Request $request)
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

        $author = User::find($id);

        if (!$author) return response()->json(['error' => 'Author is not found'], 404);
        $author->name = $data['name'];
        $author->surname = $data['surname'];
        $author->email = $data['email'];
        $author->phone_number = $data['phone_number'];
        $author->job_title = $data['job_title'];
        $author->company = $data['company'];
        $author->save();

        $userRole = UserRole::find($data['userRoleId']);
        $userRole->approved = $data['approved'];
        $userRole->save();

        return response()->json(['success' => true]);
    }

    public function deleteAuthor(Request $request)
    {
        $id = $request->query('id');
        $author = User::find($id);

        if (!$author) return response()->json(['error' => 'Author is not found'], 404);

        $author->delete();

        return response()->json(['success' => true]);
    }
}
