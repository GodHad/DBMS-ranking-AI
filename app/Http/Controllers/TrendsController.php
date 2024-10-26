<?php

namespace App\Http\Controllers;

use App\Models\Trend;
use App\Models\CountryTrend;
use App\Models\Vendor;
use App\Models\Category;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TrendsController extends Controller
{
    public function getChartData(Request $request)
    {
        try {
            $country = $request->query('country');
            if (!$country)
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
                        $vendor = Vendor::with('primaryCategory')->find($vendorId);
                        $vendorName = $vendor->db_name;
                        $primary_category = $vendor->primaryCategory;
                        $scores = $trends->pluck('average_score')->toArray(); // Get the average scores
                        return [
                            'name' => $vendorName,
                            'data' => $scores,
                            'primary_category' => $primary_category
                        ];
                    })
                    ->values()
                    ->toArray();
            else {
                $chartData = CountryTrend::where('country_code', $country)
                    ->select(
                        'vendor_id', 
                        DB::raw('ROUND(AVG(score), 2) as average_score'), // Calculate average score for each month
                        DB::raw('DATE_FORMAT(date, "%Y-%m") as month') // Format the date to 'YYYY-MM' format for month grouping
                    )
                    ->with('vendor')
                    ->groupBy('vendor_id', 'month') // Group by vendor and month
                    ->get()
                    ->groupBy('vendor_id')
                    ->map(function ($trends, $vendorId) {
                        $vendor = Vendor::with('primaryCategory')->find($vendorId);
                        $vendorName = $vendor->db_name;
                        $primary_category = $vendor->primaryCategory;
                        $scores = $trends->pluck('average_score')->toArray(); // Get the average scores
                        return [
                            'name' => $vendorName,
                            'data' => $scores,
                            'primary_category' => $primary_category
                        ];
                    })
                    ->values()
                    ->toArray();
            }
            $vendor = Vendor::first();

            if ($vendor) {
                $xaxisOption = Trend::select(DB::raw('DATE_FORMAT(date, "%Y-%m") as month'))
                    ->where('vendor_id', $vendor->id) // Use the first vendor's ID
                    ->distinct()
                    ->orderBy('month') // Order the months chronologically
                    ->pluck('month') // Use pluck to get an array of months
                    ->toArray();
            } else {
                $xaxisOption = [];
                Log::info('No vendor found.');
            }
            
            return response()->json(['success' => true, 'chartData' => $chartData, 'xaxis' => $xaxisOption]);
        } catch (\Exception $th) {
            return response()->json(['success' => false, 'error' => $th->getMessage()]);
        }
    }
}
