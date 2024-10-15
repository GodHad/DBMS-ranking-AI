<?php

namespace App\Http\Controllers;

use App\Models\Dbms;
use Illuminate\Http\Request;
use App\Jobs\ProcessAfterDbmsCreation;

class DbmsController extends Controller
{
    public function create()
    {
        try {
            //code...
            $dbms = Dbms::create(['name' => 'MongoDB', 'vendor_id' => 1]);
            ProcessAfterDbmsCreation::dispatch($dbms);
            return response()->json(['success' => true]);
        } catch (\Exception $th) {
            //throw $th;
            return response()->json(['success' => false, $th->getMessage()]);
        }
    }
}
