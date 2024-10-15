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
        $exePath = __DIR__ . '/main.exe';
        if ($this->option('all')) {
            Trend::truncate();
            CountryTrend::truncate();
            $keywords = Vendor::pluck('db_name')->toArray();
            $keywordsString = implode(',', $keywords);
            $command = escapeshellcmd($exePath) . " " . escapeshellarg($keywordsString);
        } else {
            $keyword = $this->argument('keywords');
            $command = escapeshellcmd($exePath) . " " . escapeshellarg($keyword);
        }

        Log::info('Running command: ' . $command);

        $output = [];
        $returnVar = 0;
        exec($command, $output, $returnVar);
    
        $country_score_file = 'trends_data_by_country_weekly.csv';
        $score_file = 'trends_data.csv';

        
        if ($returnVar === 0) {
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
            if (($handle1 = fopen($score_file, 'r')) !== false) {
                $header = fgetcsv($handle1);
                $len = count($header);

                $vendors = Vendor::whereIn('db_name', array_slice($header, 1, $len - 2))->get();
                $vendor_ids = $vendors->pluck('id', 'db_name')->toArray();
                $trends = [];

                while (($row = fgetcsv($handle1)) !== false) {
                    for ($i = 1; $i < $len - 1; $i++) {
                        if (isset($vendor_ids[$header[$i]])) { // Check if DBMS ID exists
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
            $this->info("Trends fetched");
        } else {
            $this->error("An error occurred while fetching trends: " . implode("\n", $output));
        }
    }

}
