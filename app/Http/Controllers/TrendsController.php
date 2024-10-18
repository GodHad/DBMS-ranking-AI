<?php

namespace App\Http\Controllers;

use App\Models\Trend;
use Illuminate\Http\Request;

class TrendsController extends Controller
{
    public function getChartData()
    {
        try {
            $chartData = Trend::select('vendor_id', 'score', 'date')
                    ->with('vendor')
                    ->get()
                    ->groupBy('vendor_id')
                    ->map(function ($trends, $vendorId) {
                        $vendorName = $trends->first()->vendor->db_name;
                        $scores = $trends->pluck('score')->toArray();

                        return [
                            'name' => $vendorName,
                            'data' => $scores
                        ];
                    })
                    ->values()
                    ->toArray();
            $xaxisOption = Trend::where('vendor_id', 1)
                    ->select('date')
                    ->distinct()
                    ->pluck('date') // Use pluck to get an array of dates
                    ->toArray(); 
            return response()->json(['success' => true, 'chartData' => $chartData, 'xaxis' => $xaxisOption]);
        } catch (\Exception $th) {
            return response()->json(['success' => false, 'error' => $th->getMessage()]);
        }
    }
}
