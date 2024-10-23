<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Vendor;
use App\Models\CountryTrend;
use App\Models\Trend;
use Illuminate\Support\Facades\Log;

class FetchTrends extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fetch:trends {keywords?} {--all}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch Google Trends data for specified keywords';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        ini_set('max_execution_time', 300);
        $exePath = '/var/www/main'; 
    
        if ($this->option('all')) {
            
            $keywords = Vendor::pluck('db_name', 'id')->toArray();
            
            foreach ($keywords as $id => $keyword) {
                $command = '/var/www/fetching_data.sh' . " " . escapeshellarg($keyword);
                Log::info('Running command for keyword: ' . $commnad);

                $output = [];
                $returnVar = 0;
                exec($command . ' 2>&1', $output, $returnVar);
                
                Log::info('Command executed, returnVar: ' . $returnVar);
                Log::info('Output: ' . implode("\n", $output));
                
                Trend::where('id', $id)->delete();
                CountryTrend::where('id', $id)->delete();
                $this->processTrendData(); // Process the trend data after each command
            }
            
        } else {
            $keyword = $this->argument('keywords');
            $command = '/var/www/fetching_data.sh' . " " . escapeshellarg($keyword);
            
            Log::info('Running command for single keyword: ' . $command);
            $output = [];
            $returnVar = 0;
            exec($command . ' 2>&1', $output, $returnVar);
            
            Log::info('Command executed, returnVar: ' . $returnVar);
            Log::info('Output: ' . implode("\n", $output));
            
            $this->processTrendData(); // Process the trend data for single keyword
        }

        $this->info("Trends fetched and processed");
        $this->error("An error occurred while fetching trends: " . implode("\n", $output));
    }

    private function processTrendData()
    {
        $country_score_file = '/var/www/trends_data_by_country_weekly.csv';
        $score_file = '/var/www/trends_data.csv';

        // Process country trends
        if (file_exists($country_score_file)) {
            if (($handle = fopen($country_score_file, 'r')) !== false) {
                $header = fgetcsv($handle);
                $len = count($header);

                $vendors = Vendor::whereIn('db_name', array_slice($header, 1, $len - 2))->get();
                $vendor_ids = $vendors->pluck('id', 'db_name')->toArray();
                $countryTrends = [];

                while (($row = fgetcsv($handle)) !== false) {
                    for ($i = 1; $i < $len - 1; $i++) {
                        if (isset($vendor_ids[$header[$i]])) {
                            $countryTrends[] = [
                                'vendor_id' => $vendor_ids[$header[$i]],
                                'score' => $row[$i],
                                'date' => $row[$len - 1],
                                'country_code' => $row[0],
                            ];
                        }
                    }
                }
                fclose($handle);
                if (!empty($countryTrends)) {
                    CountryTrend::insert($countryTrends);
                }
            }
        }

        // Process trends
        if (file_exists($score_file)) {
            if (($handle1 = fopen($score_file, 'r')) !== false) {
                $header = fgetcsv($handle1);
                $len = count($header);

                $vendors = Vendor::whereIn('db_name', array_slice($header, 1, $len - 2))->get();
                $vendor_ids = $vendors->pluck('id', 'db_name')->toArray();
                $trends = [];

                while (($row = fgetcsv($handle1)) !== false) {
                    for ($i = 1; $i < $len - 1; $i++) {
                        if (isset($vendor_ids[$header[$i]])) {
                            $trends[] = [
                                'vendor_id' => $vendor_ids[$header[$i]],
                                'score' => $row[$i],
                                'date' => $row[0],
                            ];
                        }
                    }
                }
                fclose($handle1);
                if (!empty($trends)) {
                    Trend::insert($trends);
                }
            }
        }

        // Optional: Update rankings after processing
        $this->updateRankings();
    }

    private function updateRankings()
    {
        Log::info('Start to re-ranking');
        $latestDate = Trend::max('date');
        $latestTrends = Trend::where('date', $latestDate)->orderBy('score', 'desc')->get();

        $rank = 1;
        foreach ($latestTrends as $trend) {
            $vendor = Vendor::find($trend->vendor_id);
            $vendor->overall_ranking = $rank++;
            $vendor->primary_ranking = '';
            $vendor->save();
        }

        Log::info('Update overall ranking');
        $vendors = Vendor::all();
        foreach ($vendors as $vendor) {
            $primaryCategoryIds = explode(',', $vendor->primary_category);
            $vendor->primary_ranking = '';

            foreach ($primaryCategoryIds as $category_id) {
                $sameCategoryVendors = Vendor::where('primary_category', 'like', '%' . $category_id . '%')->orderBy('overall_ranking', 'asc')->get();

                foreach ($sameCategoryVendors as $index => $sameVendor) {
                    if ($sameVendor->id === $vendor->id) {
                        $vendor->primary_ranking .= ($index + 1) . ' ';
                    }
                }
            }
            $vendor->primary_ranking = trim($vendor->primary_ranking);
            $vendor->save();
        }
        Log::info('Finish re-ranking');
    }
}