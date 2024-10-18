<?php

namespace App\Http\Controllers;

use App\Models\Encyclopedia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EncyclopediaController extends Controller
{
    public function encyclopedias()
    {
        $encyclopedias = Encyclopedia::all();
        return response()->json(['encyclopedias' => $encyclopedias]);
    }

    public function encyclopedia(Request $request)
    {
        $id = $request->query('id');
        $encyclopedia = EncycloPedia::find($id);
        return response()->json(['encyclopedia' => $encyclopedia]);
    }

    public function create(Request $request)
    {
        $data = $request->all();
        $validator = Validator::make($data, [
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string']
        ]);
        
        if ($validator->fails()) return response()->json(['errors' => $validator->errors()], 422);

        Encyclopedia::create($validator->validated());

        return response()->json(['success' => true]);
    }

    public function update(Request $request)
    {
        $data = $request->all();
        $id = $request->query('id');
        $validator = Validator::make($data, [
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string']
        ]);

        $encyclopedia = Encyclopedia::find($id);
        if (!$encyclopedia) return response()->json(['errors' => 'Not found the encyclopedia'], 422);

        if ($validator->fails()) return response()->json(['errors' => $validator->errors()], 422);
        
        $encyclopedia->update($validator->validated());
        return response()->json(['success' => true]);
    }

    public function delete(Request $request)
    {
        $id = $request->query('id');
        $encyclopedia = Encyclopedia::find($id);

        if (!$encyclopedia)
            return response()->json(['error' => 'Not found the encyclopedia'], 404);

        $encyclopedia->delete();
        return response()->json(['success' => true]);
    }
}
