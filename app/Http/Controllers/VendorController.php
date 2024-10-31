<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use App\Models\User;
use App\Models\Trend;
use App\Models\Category;
use App\Models\CountryTrend;
use App\Models\PrimaryCategoryVendor;
use App\Models\SecondaryCategoryVendor;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Jobs\ProcessAfterDbmsCreation;
use Carbon\Carbon;

class VendorController extends Controller
{
    public function vendors(Request $request)
    {
        try {
            // $countPerPage = $request->query('countPerPage');
            // if ($countPerPage) $vendors = Vendor::orderBy('overall_ranking')->limit($countPerPage)->get();
            // else $vendors = Vendor::with(['primaryCategory', 'secondaryCategory'])->get();
            $vendors = Vendor::with(['primaryCategory', 'secondaryCategory', 'user'])->get();
            // foreach ($vendors as $vendor) {
            //     // Split the primary_category and secondary_category fields into arrays of category IDs
            //     $primaryCategoryIds = explode(',', $vendor->primary_category);
            //     $secondaryCategoryIds = explode(',', $vendor->secondary_category);

            //     $vendor->primary_category = $primaryCategoryIds;
            //     $vendor->secondary_category = $secondaryCategoryIds;
            // }

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

            $country = $request->query('country');

            function getAverageTrends($startDate, $endDate, $country) {
                if (!$country || trim($country) === '')
                return Trend::whereBetween('date', [$startDate, $endDate])
                    ->selectRaw('vendor_id, AVG(score) as average_score')
                    ->groupBy('vendor_id')
                    ->orderBy('average_score', 'desc')
                    ->get();
                return CountryTrend::whereBetween('date', [$startDate, $endDate])
                    ->where('country_code', $country)
                    ->selectRaw('vendor_id, AVG(score) as average_score')
                    ->groupBy('vendor_id')
                    ->orderBy('average_score', 'desc')
                    ->get();
            }

            $currentMonthTrends = getAverageTrends($currentMonthStart, $currentMonthEnd, $country);
            $previousMonthTrends = getAverageTrends($previousMonthStart, $previousMonthEnd, $country);
            $previousYearTrends = getAverageTrends($previousYearStart, $previousYearEnd, $country);

            $rank = 1;
            foreach ($currentMonthTrends as $trend) {
                foreach ($vendors as $vendor) {
                    if ($vendor->id === $trend->vendor_id) {
                        $vendor->overall_ranking = $rank ++;
                        $vendor->overall_avg_score = (float)$trend->average_score;
                        break;
                    }
                }
            }

            $rank = 1;
            foreach ($previousMonthTrends as $trend) {
                foreach ($vendors as $vendor) {
                    if ($vendor->id === $trend->vendor_id) {
                        $vendor->prev_month_overall_ranking = $rank ++;
                        $vendor->prev_month_overall_avg_score = (float)$trend->average_score;
                        break;
                    }
                }
            }

            $rank = 1;
            foreach ($previousYearTrends as $trend) {
                foreach ($vendors as $vendor) {
                    if ($vendor->id === $trend->vendor_id) {
                        $vendor->prev_year_overall_ranking = $rank ++;
                        $vendor->prev_year_overall_avg_score = (float)$trend->average_score;
                        break;
                    }
                }
            }

            return response()->json(['success' => true, 'vendors' => $vendors->sortBy('overall_ranking')->values()]);
        } catch (\Exception $th) {
            return response()->json(['success' => false, 'error' => $th->getMessage()], 500);
        }
    }

    public function vendor(Request $request)
    {
        try {
            $vendor_id = $request->query('id');
            $vendor = Vendor::with('category')->find($vendor_id);
            return response()->json(['success' => true, 'vendor' => $vendor]);
        } catch (\Exception $th) {
            return response()->json(['success' => false, 'error' => $th->getMessage()], 500);
        }
    }

    public function create(Request $request)
    {
        try {
            $data = $request->all();

            $validator = Validator::make($data, [
                'company_name' => ['required', 'string', 'max:255'],
                'description' => ['required', 'string'],
                'primary_category' => ['required', 'array'],
                'primary_category.*' => ['integer'],
                'secondary_category' => ['nullable'],
                'website_url' => ['nullable'],
                'technical_doc' => ['nullable'],
                'developer' => ['nullable'],
                'initial_release' => ['nullable'],
                'current_release' => ['nullable'],
                'license' => ['nullable'],
                'cloud_based_only' => ['nullable'],
                'dbaas_offerings' => ['nullable'],
                'implementation_lang' => ['nullable'],
                'server_os' => ['nullable'],
                'data_scheme' => ['nullable'],
                'typing' => ['nullable'],
                'xml_support' => ['nullable'],
                'secondary_indexes' => ['nullable'],
                'sql' => ['nullable'],
                'apis_access_method' => ['nullable'],
                'supported_programming_lang' => ['nullable'],
                'server_side_scripts' => ['nullable'],
                'triggers' => ['nullable'],
                'partitioning_methods' => ['nullable'],
                'replication_methods' => ['nullable'],
                'mapreduce' => ['nullable'],
                'consistency_concepts' => ['nullable'],
                'foreign_keys' => ['nullable'],
                'concurrency' => ['nullable'],
                'durability' => ['nullable'],
                'in_memory_capabilities' => ['nullable'],
                'user_concepts' => ['nullable'],
                'db_name' => ['required'],
                'logo_file' => ['required', 'file', 'mimes:jpeg,png,jpg,gif,webp'],
                'banner_file' => ['required', 'file', 'mimes:jpeg,png,jpg,gif,webp']
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
            }

            $logoPath = $request->file('logo_file')->store('images/vendors/logos', 'public');
            $bannerPath = $request->file('banner_file')->store('images/vendors/banners', 'public');

            $vendor = Vendor::create([
                ...$validator->validated(),
                'logo_url' => $logoPath,
                'banner' => $bannerPath,
            ]);
            
            $primary_category = $data['primary_category'];
            $secondary_category = $data['secondary_category'];

            $primaryData = array_map(function ($categoryId) use ($vendor) {
                return [
                    'category_id' => $categoryId,
                    'vendor_id' => $vendor->id,
                ];
            }, $primary_category);
            
            $secondaryData = array_map(function ($categoryId) use ($vendor) {
                return [
                    'category_id' => $categoryId,
                    'vendor_id' => $vendor->id,
                ];
            }, $secondary_category);
            
            PrimaryCategoryVendor::insert($primaryData);
            SecondaryCategoryVendor::insert($secondaryData);

            ProcessAfterDbmsCreation::dispatch($vendor->db_name);

            return response()->json(['success' => true]);
        } catch (\Exception $th) {
            return response()->json(['success' => false, 'error' => $th->getMessage()], 500);
        }
    }

    public function update(Request $request)
    {
        try {
            $data = $request->all();
            $vendor_id = $request->query('id');
            $vendor = Vendor::find($vendor_id);

            if (!$vendor) {
                return response()->json(['success' => false, 'errors' => ['current_release' => 'Vendor not found']], 404);
            }

            $validator = Validator::make($data, [
                'company_name' => ['required', 'string', 'max:255'],
                'description' => ['required', 'string'],
                'primary_category' => ['required', 'array'],
                'primary_category.*' => ['integer'],
                'secondary_category' => ['nullable'],
                'website_url' => ['nullable'],
                'technical_doc' => ['nullable'],
                'developer' => ['nullable'],
                'initial_release' => ['nullable'],
                'current_release' => ['nullable'],
                'license' => ['nullable'],
                'cloud_based_only' => ['nullable'],
                'dbaas_offerings' => ['nullable'],
                'implementation_lang' => ['nullable'],
                'server_os' => ['nullable'],
                'data_scheme' => ['nullable'],
                'typing' => ['nullable'],
                'xml_support' => ['nullable'],
                'secondary_indexes' => ['nullable'],
                'sql' => ['nullable'],
                'apis_access_method' => ['nullable'],
                'supported_programming_lang' => ['nullable'],
                'server_side_scripts' => ['nullable'],
                'triggers' => ['nullable'],
                'partitioning_methods' => ['nullable'],
                'replication_methods' => ['nullable'],
                'mapreduce' => ['nullable'],
                'consistency_concepts' => ['nullable'],
                'foreign_keys' => ['nullable'],
                'concurrency' => ['nullable'],
                'durability' => ['nullable'],
                'in_memory_capabilities' => ['nullable'],
                'user_concepts' => ['nullable'],
                'db_name' => ['required'],
                'logo_file' => ['nullable', 'file', 'mimes:jpeg,png,jpg,gif,webp'],
                'banner_file' => ['nullable', 'file', 'mimes:jpeg,png,jpg,gif,webp']
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
            }

            $dbNameChanged = false;
            $validatedData = $validator->validated();
            if (array_key_exists('db_name', $validatedData)) {
                if ($vendor->db_name !== $validatedData['db_name']) {
                    $dbNameChanged = true;
                }
            }

            $vendor->update($validator->validated());
            if ($request->hasFile('logo_file')) {
                if ($vendor->logo_url) {
                    Storage::disk('public')->delete($vendor->logo_url);
                }
                $logoPath = $request->file('logo_file')->store('images/vendors/logos', 'public');
                $vendor->logo_url = $logoPath;
            }

            if ($request->hasFile('banner_file')) {
                if ($vendor->banner) {
                    Storage::disk('public')->delete($vendor->banner);
                }
                $bannerPath = $request->file('banner_file')->store('images/vendors/banners', 'public');
                $vendor->banner = $bannerPath;
            }
            $vendor->overall_ranking = 1000000;
            $vendor->primary_ranking = 1000000;
            $vendor->save();
            if ($dbNameChanged) {
                Trend::where('vendor_id', $vendor->id)->delete();
                CountryTrend::where('vendor_id', $vendor->id)->delete();
                ProcessAfterDbmsCreation::dispatch($vendor->db_name);
            }

            return response()->json(['success' => true, 'vendor' => $vendor]);
        } catch (\Exception $th) {
            return response()->json(['success' => false, 'error' => 'Failed to update vendor', 'hey' => $th->getMessage()], 500);
        }
    }

    public function delete(Request $request)
    {
        try {
            $vendor_id = $request->query('id');
            $vendor = Vendor::find($vendor_id);

            if (!$vendor) {
                return response()->json(['success' => false, 'error' => 'Vendor not found'], 404);
            }

            Trend::where('vendor_id', $vendor->id)->delete();
            CountryTrend::where('vendor_id', $vendor->id)->delete();
            $vendor->delete();
            return response()->json(['success' => true]);
        } catch (\Exception $th) {
            return response()->json(['success' => false, 'error' => $th->getMessage()], 500);
        }
    }

    public function increaseViews(Request $request)
    {
        $id = $request->query('id');

        if (!$id) {
            return response()->json(['success' => false, 'error' => 'Id is not defined'], 422);
        }

        try {
            $vendor = Vendor::findOrFail($id);
            $vendor->increment('profile_views');
            return response()->json(['success' => true]);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => 'Failed to update views'], 500);
        }
    }

    public function test()
    {
        Mail::raw('This is a test email from Laravel using Amazon SES!', function ($message) {
            $message->from('sunharius@gmail.com');
            $message->to('office@dbrank.ai')
                    ->subject('Test SES Email');
        });
        return response()->json(['success' => true]);
    }
}
