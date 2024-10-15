<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DbmsController extends Controller
{
    public function create()
    {
        Dbms::create(['name' => 'MyDBMS']);
        return response()->json(['success' => true]);
    }
}
