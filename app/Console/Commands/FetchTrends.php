<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Dbms;
use App\Models\CountryTrend;
use App\Models\Trend;

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
        $dir = '../../../fetch_file/';
        if ($this->option('all')) {
            $keywords = Dbms::pluck('name')->toArray();
            $keywordsString = implode(',', $keywords);
            $command = $dir . "main.exe " . escapeshellarg($keywordsString);
        } else {
            $keyword = $this->argument('keywords');
            $command = $dir . "main.exe " . escapeshellarg($keyword);
        }

        $output = [];
        $returnVar = 0;
        exec($command, $output, $returnVar);

        $country_score_file = 'trends_data_by_country_weekly.csv';
        $score_file = 'trends_data.csv';

        
        if ($returnVar === 0) {
            if (($handle = fopen($dir . $country_score_file, 'r')) !== false) {
                $header = fgetcsv($handle);
                $len = count($header);

                $dbms = Dbms::whereIn('name', array_slice($header, 1, $len - 2))->get();
                $dbms_ids = $dbms->pluck('id', 'name')->toArray();
                $countryTrends = [];

                while (($row = fgetcsv($handle)) !== false) {
                    for ($i = 1; $i < $len - 1; $i++) {
                        if (isset($dbms_ids[$header[$i]])) {
                            $countryTrends[] = [
                                'dbms_id' => $dbms_ids[$header[$i]],
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
            if (($handle = fopen($dir . $score_file, 'r')) !== false) {
                $header = fgetcsv($handle);
                $len = count($header);

                $dbms = Dbms::whereIn('name', array_slice($header, 1, $len - 2))->get();
                $dbms_ids = $dbms->pluck('id', 'name')->toArray();
                $trends = [];

                while (($row = fgetcsv($handle)) !== false) {
                    for ($i = 1; $i < $len - 1; $i++) {
                        if (isset($dbms_ids[$header[$i]])) { // Check if DBMS ID exists
                            $trends[] = [
                                'dbms_id' => $dbms_ids[$header[$i]],
                                'score' => $row[$i],
                                'date' => $row[$len - 1],
                                'country_code' => $row[0],
                            ];
                        }
                    }
                }
                fclose($handle);
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
