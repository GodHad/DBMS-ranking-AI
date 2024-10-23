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
        // Path to the Linux-compatible executable
        $exePath = '/var/www/main'; // Update this to the correct path

        // Fetch keywords
        if ($this->option('all')) {
            $keywords = Vendor::pluck('db_name', 'id')->toArray();

            foreach ($keywords as $id => $keyword) {
                $this->runCommand($exePath, $keyword);

                // Clean up previous data
                Trend::where('id', $id)->delete();
                CountryTrend::where('id', $id)->delete();
                $this->processTrendData();
            }
        } else {
            $keyword = $this->argument('keywords');
            $this->runCommand($exePath, $keyword);
            $this->processTrendData();
        }

        $this->info("Trends fetched and processed");
    }

    /**
     * Run the command and log the output.
     */
    private function runCommand($exePath, $keyword)
    {
        $command = escapeshellcmd($exePath) . " " . escapeshellarg($keyword);
        Log::info('Running command for keyword: ' . $keyword);

        $output = [];
        $returnVar = 0;

        // Execute the command
        exec($command . ' 2>&1', $output, $returnVar);

        Log::info('Command executed, returnVar: ' . $returnVar);
        Log::info('Output: ' . implode("\n", $output));

        // Handle errors
        if ($returnVar !== 0) {
            $this->error("An error occurred while fetching trends: " . implode("\n", $output));
        }
    }

    private function processTrendData()
    {
        $country_score_file = 'trends_data_by_country_weekly.csv';
        $score_file = 'trends_data.csv';

        $this->processFile($country_score_file, CountryTrend::class);
        $this->processFile($score_file, Trend::class);

        // Optional: Update rankings after processing
        $this->updateRankings();
    }

    private function processFile($file, $model)
    {
        if (file_exists($file)) {
            if (($handle = fopen($file, 'r')) !== false) {
                $header = fgetcsv($handle);
                $len = count($header);
                $vendors = Vendor::whereIn('db_name', array_slice($header, 1, $len - 2))->get();
                $vendor_ids = $vendors->pluck('id', 'db_name')->toArray();
                $data = [];

                while (($row = fgetcsv($handle)) !== false) {
                    for ($i = 1; $i < $len - 1; $i++) {
                        if (isset($vendor_ids[$header[$i]])) {
                            $data[] = [
                                'vendor_id' => $vendor_ids[$header[$i]],
                                'score' => $row[$i],
                                'date' => $row[$len - 1],
                                'country_code' => isset($row[0]) ? $row[0] : null, // for country trends
                            ];
                        }
                    }
                }
                fclose($handle);
                
                if (!empty($data)) {
                    $model::insert($data);
                }
            }
        }
    }

    private function updateRankings()
    {
        Log::info('Start re-ranking');
        $latestDate = Trend::max('date');
        $latestTrends = Trend::where('date', $latestDate)->orderBy('score', 'desc')->get();

        $rank = 1;
        foreach ($latestTrends as $trend) {
            $vendor = Vendor::find($trend->vendor_id);
            if ($vendor) {
                $vendor->overall_ranking = $rank++;
                $vendor->primary_ranking = '';
                $vendor->save();
            }
        }

        Log::info('Updating overall ranking');
        $this->updatePrimaryRanking();
        Log::info('Finish re-ranking');
    }

    private function updatePrimaryRanking()
    {
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
    }
}
