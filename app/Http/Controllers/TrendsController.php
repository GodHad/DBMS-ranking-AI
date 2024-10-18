<?php

namespace App\Http\Controllers;

use App\Models\Trend;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TrendsController extends Controller
{
    public function getChartData()
    {
        try {
            $chartData = Trend::select(
                    'vendor_id', 
                    DB::raw('ROUND(AVG(score), 2) as average_score'), // Calculate average score for each month
                    DB::raw('DATE_FORMAT(date, "%Y-%m") as month') // Format the date to 'YYYY-MM' format for month grouping
                )
                ->with('vendor')
                ->groupBy('vendor_id', 'month') // Group by vendor and month
                ->get()
                ->groupBy('vendor_id')
                ->map(function ($trends, $vendorId) {
                    $vendorName = $trends->first()->vendor->db_name;
                    $scores = $trends->pluck('average_score')->toArray(); // Get the average scores
            
                    return [
                        'name' => $vendorName,
                        'data' => $scores
                    ];
                })
                ->values()
                ->toArray();
            
            // Get the x-axis values, grouped by months (i.e., 'YYYY-MM' format)
            $xaxisOption = Trend::select(DB::raw('DATE_FORMAT(date, "%Y-%m") as month'))
                ->where('vendor_id', 1)
                ->distinct()
                ->orderBy('month') // Order the months chronologically
                ->pluck('month') // Use pluck to get an array of months
                ->toArray();
            
            return response()->json(['success' => true, 'chartData' => $chartData, 'xaxis' => $xaxisOption]);
        } catch (\Exception $th) {
            return response()->json(['success' => false, 'error' => $th->getMessage()]);
        }
    }
}
