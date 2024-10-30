<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function index(Request $request)
    {
        $data = $request->all();
        $validator = Validator::make($data, [
            'email' => ['required', 'email'],
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string']
        ]);

        if ($validator->fails()) return response()->json(['success' => false, 'errors' => $validator->errors()]);

        Mail::raw($data['content'], function ($message) use ($data) {
            $message->from($data['email']);
            $message->to('sunharius@gmail.com')
                    ->subject($data['title']);
        });
        return response()->json(['success' => true]);
    }
}
