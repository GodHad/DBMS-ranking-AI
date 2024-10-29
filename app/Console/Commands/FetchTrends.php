<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Vendor;
use App\Models\PrimaryCategoryVendor;
use App\Models\CountryTrend;
use App\Models\Trend;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

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
        set_time_limit(0);
        $exePath = __DIR__ . '/main.exe';
    
        if ($this->option('all')) {
            
            $keywords = Vendor::pluck('db_name', 'id')->toArray();
            
            foreach ($keywords as $id => $keyword) {
                $command = '/var/www/fetching_data.sh' . " " . escapeshellarg($keyword);
                // $command = escapeshellcmd($exePath) . " " . escapeshellarg($keyword);
                
                Log::info('Running command for keyword: ' . $command);

                $output = [];
                $returnVar = 0;
                exec($command . ' 2>&1', $output, $returnVar);
                
                Log::info('Command executed, returnVar: ' . $returnVar);
                Log::info('Output: ' . implode("\n", $output));
                
                Trend::where('vendor_id', $id)->delete();
                CountryTrend::where('vendor_id', $id)->delete();
                $this->processTrendData(); // Process the trend data after each command
            }
            
        } else {
            $keyword = $this->argument('keywords');
            $command = '/var/www/fetching_data.sh' . " " . escapeshellarg($keyword);
            // $command = escapeshellcmd($exePath) . " " . escapeshellarg($keyword);
            
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
        // $country_score_file = 'trends_data_by_country_weekly.csv';
        // $score_file = 'trends_data.csv';

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
        $latestMonthStart = Carbon::parse($latestDate)->startOfMonth();
        $latestMonthEnd = Carbon::parse($latestDate)->endOfMonth();

        $latestMonthTrends = Trend::whereBetween('date', [$latestMonthStart, $latestMonthEnd])->get();

        $vendorScores = [];

        foreach ($latestMonthTrends as $trend) {
            $vendorId = $trend->vendor_id;
            
            if (!isset($vendorScores[$vendorId])) {
                $vendorScores[$vendorId] = [
                    'totalScore' => 0,
                    'count' => 0
                ];
            }

            $vendorScores[$vendorId]['totalScore'] += $trend->score;
            $vendorScores[$vendorId]['count']++;
        }

        $averageScores = [];
        foreach ($vendorScores as $vendorId => $data) {
            $averageScores[$vendorId] = $data['totalScore'] / $data['count'];
        }

        arsort($averageScores);

        $rank = 1;
        foreach ($averageScores as $vendorId => $averageScore) {
            $vendor = Vendor::with('primaryCategory')->find($vendorId);
            if ($vendor) {
                $vendor->overall_ranking = $rank++;
                $vendor->primary_ranking = ''; 
                $vendor->save();
            }
        }

        Log::info('Update overall ranking');
        $categoryRankings = [];

        $vendors = Vendor::with('primaryCategory')->get();

        $categoryRankings = [];

        foreach ($vendors as $vendor) {
            foreach ($vendor->primaryCategory as $category) {
                $categoryId = $category->id;

                if (!isset($categoryRankings[$categoryId])) {
                    $categoryRankings[$categoryId] = [];
                }

                $categoryRankings[$categoryId][] = $vendor;
            }
        }

        foreach ($categoryRankings as $categoryId => $vendorsInCategory) {
            usort($vendorsInCategory, fn($a, $b) => $a->overall_ranking <=> $b->overall_ranking);

            foreach ($vendorsInCategory as $index => $vendor) {
                $currentRanking = $vendor->primary_ranking ?? '';
                $vendor->primary_ranking = trim($currentRanking . ' ' . ($index + 1));
            }
        }

        foreach ($vendors as $vendor) {
            $vendor->save();
        }

        Log::info('Finish re-ranking');
    }
}