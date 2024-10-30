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
            'firstname' => ['required', 'string'],
            'lastname' => ['required', 'string'],
            'mobile' => ['required', 'string'],
            'email' => ['required', 'email'],
            'company' => ['required', 'string'],
            'jobtitle' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string']
        ]);

        if ($validator->fails()) return response()->json(['success' => false, 'errors' => $validator->errors()]);

        Mail::send('emails.contact', $data, function ($message) use ($data) {
            $message->from('office@dbrank.ai');
            $message->to($data['email'])
                    ->subject('Contact Request from ' . $data['firstname']);
        });
        
        return response()->json(['success' => true]);
    }
}
