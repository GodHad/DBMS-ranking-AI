<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use App\Models\User;
use App\Models\Trend;
use App\Models\Category;
use App\Models\CountryTrend;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Jobs\ProcessAfterDbmsCreation;
use Carbon\Carbon;

class VendorController extends Controller
{
    public function vendors()
    {
        try {
            $vendors = Vendor::all();
            foreach ($vendors as $vendor) {
                // Split the primary_category and secondary_category fields into arrays of category IDs
                $primaryCategoryIds = explode(',', $vendor->primary_category);
                $secondaryCategoryIds = explode(',', $vendor->secondary_category);

                $vendor->primary_category = $primaryCategoryIds;
                $vendor->secondary_category = $secondaryCategoryIds;
            }

            $now = Carbon::now();

            $currentMonth = $now->copy()->subMonthNoOverflow();
            $currentMonthStart = $currentMonth->startOfMonth()->format('Y-m-d');
            $currentMonthEnd = $currentMonth->endOfMonth()->format('Y-m-d');

            $previousMonth = $currentMonth->copy()->subMonthNoOverflow();
            $previousMonthStart = $previousMonth->startOfMonth()->format('Y-m-d');
            $previousMonthEnd = $previousMonth->endOfMonth()->format('Y-m-d');

            $previousYear = $now->copy()->subYear();
            $previousYearStart = $previousYear->startOfMonth()->format('Y-m-d');
            $previousYearEnd = $previousYear->endOfMonth()->format('Y-m-d');

            function getAverageTrends($startDate, $endDate) {
                return Trend::whereBetween('date', [$startDate, $endDate])
                    ->selectRaw('vendor_id, AVG(score) as average_score')
                    ->groupBy('vendor_id')
                    ->orderBy('average_score', 'desc')
                    ->get();
            }

            $currentMonthTrends = getAverageTrends($currentMonthStart, $currentMonthEnd);
            $previousMonthTrends = getAverageTrends($previousMonthStart, $previousMonthEnd);
            $previousYearTrends = getAverageTrends($previousYearStart, $previousYearEnd);

            $rank = 1;
            foreach ($currentMonthTrends as $trend) {
                foreach ($vendors as $vendor) {
                    if ($vendor->id === $trend->vendor_id) {
                        $vendor->overall_ranking = $rank ++;
                        $vendor->overall_avg_score = $trend->average_score;
                        break;
                    }
                }
            }

            $rank = 1;
            foreach ($previousMonthTrends as $trend) {
                foreach ($vendors as $vendor) {
                    if ($vendor->id === $trend->vendor_id) {
                        $vendor->prev_month_overall_ranking = $rank ++;
                        $vendor->prev_month_overall_avg_score = $trend->average_score;
                        break;
                    }
                }
            }

            $rank = 1;
            foreach ($previousYearTrends as $trend) {
                foreach ($vendors as $vendor) {
                    if ($vendor->id === $trend->vendor_id) {
                        $vendor->prev_year_overall_ranking = $rank ++;
                        $vendor->prev_year_overall_avg_score = $trend->average_score;
                        break;
                    }
                }
            }

            return response()->json(['success' => true, 'vendors' => $vendors->sortBy('overall_ranking')->values()]);
        } catch (\Exception $th) {
            return response()->json(['success' => false, 'error' => 'Failed to get vendors', 'error' => $th->getMessage()]);
        }
    }

    public function vendor(Request $request)
    {
        try {
            $vendor_id = $request->query('id');
            $vendor = Vendor::with('category')->find($vendor_id);
            return response()->json(['success' => true, 'vendor' => $vendor]);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'error' => 'Failed to get vendor']);
        }
    }

    public function create(Request $request)
    {
        try {
            $data = $request->all();

            $validator = Validator::make($data, [
                'company_name' => ['required', 'string', 'max:255'],
                'description' => ['required', 'string'],
                'primary_category' => ['required', 'string'],
                'secondary_category' => ['sometimes'],
                'website_url' => ['sometimes'],
                'technical_doc' => ['sometimes'],
                'developer' => ['sometimes'],
                'initial_release' => ['sometimes'],
                'current_release' => ['sometimes'],
                'license' => ['sometimes'],
                'cloud_based_only' => ['sometimes'],
                'dbaas_offerings' => ['sometimes'],
                'implementation_lang' => ['sometimes'],
                'server_os' => ['sometimes'],
                'data_scheme' => ['sometimes'],
                'typing' => ['sometimes'],
                'xml_support' => ['sometimes'],
                'secondary_indexes' => ['sometimes'],
                'sql' => ['sometimes'],
                'apis_access_method' => ['sometimes'],
                'supported_programming_lang' => ['sometimes'],
                'server_side_scripts' => ['sometimes'],
                'triggers' => ['sometimes'],
                'partitioning_methods' => ['sometimes'],
                'replication_methods' => ['sometimes'],
                'mapreduce' => ['sometimes'],
                'consistency_concepts' => ['sometimes'],
                'foreign_keys' => ['sometimes'],
                'concurrency' => ['sometimes'],
                'durability' => ['sometimes'],
                'in_memory_capabilities' => ['sometimes'],
                'user_concepts' => ['sometimes'],
                'db_name' => ['required'],
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'errors' => $validator->errors()]);
            }

            $vendor = Vendor::create($validator->validated());
            
            ProcessAfterDbmsCreation::dispatch($vendor->db_name);

            return response()->json(['success' => true]);
        } catch (\Exception $th) {
            return response()->json(['success' => false, 'errors' => ['current_release' => 'Failed to create vendor'], 'erorr' => $th->getMessage()]);
        }
    }

    public function update(Request $request)
    {
        try {
            $data = $request->all();
            $vendor_id = $request->query('id');
            $vendor = Vendor::find($vendor_id);

            if (!$vendor) {
                return response()->json(['success' => false, 'errors' => ['current_release' => 'Vendor not found']]);
            }

            $validator = Validator::make($data, [
                'company_name' => ['sometimes', 'max:255'],
                'description' => ['sometimes'],
                'primary_category' => ['sometimes'],
                'secondary_category' => ['sometimes'],
                'website_url' => ['sometimes'],
                'technical_doc' => ['sometimes'],
                'developer' => ['sometimes'],
                'initial_release' => ['sometimes'],
                'current_release' => ['sometimes'],
                'license' => ['sometimes'],
                'cloud_based_only' => ['sometimes'],
                'dbaas_offerings' => ['sometimes'],
                'implementation_lang' => ['sometimes'],
                'server_os' => ['sometimes'],
                'data_scheme' => ['sometimes'],
                'typing' => ['sometimes'],
                'xml_support' => ['sometimes'],
                'secondary_indexes' => ['sometimes'],
                'sql' => ['sometimes'],
                'apis_access_method' => ['sometimes'],
                'supported_programming_lang' => ['sometimes'],
                'server_side_scripts' => ['sometimes'],
                'triggers' => ['sometimes'],
                'partitioning_methods' => ['sometimes'],
                'replication_methods' => ['sometimes'],
                'mapreduce' => ['sometimes'],
                'consistency_concepts' => ['sometimes'],
                'foreign_keys' => ['sometimes'],
                'concurrency' => ['sometimes'],
                'durability' => ['sometimes'],
                'in_memory_capabilities' => ['sometimes'],
                'user_concepts' => ['sometimes'],
                'db_name' => ['sometimes'],
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'errors' => $validator->errors()]);
            }

            $dbNameChanged = false;
            $validatedData = $validator->validated();
            if (array_key_exists('db_name', $validatedData)) {
                if ($vendor->db_name !== $validatedData['db_name']) {
                    $dbNameChanged = true;
                }
            }

            $vendor->update($validator->validated());

            if ($dbNameChanged) {
                Trend::where('vendor_id', $vendor->id)->delete();
                CountryTrend::where('vendor_id', $vendor->id)->delete();
                ProcessAfterDbmsCreation::dispatch($vendor->db_name);
            }

            return response()->json(['success' => true, 'vendor' => $vendor]);
        } catch (\Exception $th) {
            return response()->json(['success' => false, 'error' => 'Failed to update vendor', 'hey' => $th->getMessage()]);
        }
    }

    public function delete(Request $request)
    {
        try {
            $vendor_id = $request->query('id');
            $vendor = Vendor::find($vendor_id);

            if (!$vendor) {
                return response()->json(['success' => false, 'error' => 'Vendor not found']);
            }

            Trend::where('vendor_id', $vendor->id)->delete();
            CountryTrend::where('vendor_id', $vendor->id)->delete();
            $vendor->delete();
            return response()->json(['success' => true]);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'error' => 'Failed to delete vendor']);
        }
    }

    public function test()
    {
        $now = Carbon::now();

        // Current Month
        $currentMonthStart = $now->copy()->startOfMonth()->format('Y-m-d');
        $currentMonthEnd = $now->copy()->endOfMonth()->format('Y-m-d');

        // Previous Month
        $previousMonth = $now->copy()->subMonthNoOverflow();
        $previousMonthStart = $previousMonth->startOfMonth()->format('Y-m-d');
        $previousMonthEnd = $previousMonth->endOfMonth()->format('Y-m-d');

        // Previous Year
        $previousYear = $now->copy()->subYear();
        $previousYearStart = $previousYear->startOfMonth()->format('Y-m-d');
        $previousYearEnd = $previousYear->endOfMonth()->format('Y-m-d');

        function getAverageTrends($startDate, $endDate) {
            return Trend::whereBetween('date', [$startDate, $endDate])
                ->selectRaw('vendor_id, AVG(score) as average_score')
                ->groupBy('vendor_id')
                ->orderBy('average_score', 'desc')
                ->get();
        }

        $currentMonthTrends = getAverageTrends($currentMonthStart, $currentMonthEnd);
        $previousMonthTrends = getAverageTrends($previousMonthStart, $previousMonthEnd);
        $previousYearTrends = getAverageTrends($previousYearStart, $previousYearEnd);

        $vendors = Vendor::all();

        $rank = 1;
        foreach ($currentMonthTrends as $trend) {
            foreach ($vendors as $vendor) {
                if ($vendor->id === $trend->vendor_id) {
                    $vendor->overall_ranking = $rank ++;
                    $vendor->overall_avg_score = $trend->average_score;
                    break;
                }
            }
        }

        $rank = 1;
        foreach ($previousMonthTrends as $trend) {
            foreach ($vendors as $vendor) {
                if ($vendor->id === $trend->vendor_id) {
                    $vendor->prev_month_overall_ranking = $rank ++;
                    $vendor->prev_month_overall_avg_score = $trend->average_score;
                    break;
                }
            }
        }

        $rank = 1;
        foreach ($previousYearTrends as $trend) {
            foreach ($vendors as $vendor) {
                if ($vendor->id === $trend->vendor_id) {
                    $vendor->prev_year_overall_ranking = $rank ++;
                    $vendor->prev_year_overall_avg_score = $trend->average_score;
                    break;
                }
            }
        }

        return response()->json(['vendors' => $vendors, 'trend' => $previousMonthTrends]);

        // $latestDate = Trend::max('date');

        // $latestTrends = Trend::where('date', $latestDate)->orderBy('score', 'desc')->get();

        // $rank = 1;
        // foreach ($latestTrends as $key => $trend) {
        //     $vendor = Vendor::find($trend->vendor_id);
        //     $vendor->overall_ranking = $rank ++;
        //     $vendor->primary_ranking = '';
        //     $vendor->save();
        // }

        // $vendors = Vendor::all();
        // foreach ($vendors as $vendor) {
        //     $primaryCategoryIds = explode(',', $vendor->primary_category);
        //     // Initialize primary ranking for each vendor
        //     $vendor->primary_ranking = '';

        //     foreach ($primaryCategoryIds as $category_id) {
        //         // Get same category vendors ordered by overall ranking
        //         $sameCategoryVendors = Vendor::where('primary_category', 'like', '%' . $category_id . '%')->orderBy('overall_ranking', 'asc')->get();

        //         foreach ($sameCategoryVendors as $index => $sameVendor) {
        //             if ($sameVendor->id === $vendor->id) {
        //                 // Update primary ranking as a space-separated string
        //                 $vendor->primary_ranking .= ($index + 1) . ' ';
        //             }
        //         }
        //     }
        //     $vendor->primary_ranking = trim($vendor->primary_ranking);

        //     // Save the vendor's primary ranking
        //     $vendor->save();
        // }

        
        
        // return response()->json(['trends' => $latestTrends]);
    }
}
