<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ProcessAfterDbmsCreation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $dbms;

    /**
     * Create a new job instance.
     *
     * @param Dbms $dbms
     * @return void
     */
    public function __construct($dbms)
    {
        $this->dbms = $dbms;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        Log::info('start fetch:trends command executed successfully. Output: ');
        try {
            Artisan::call('fetch:trends', ['keywords' => $this->dbms]);

            // Log a summary of the command's output
            $output = Artisan::output();
            Log::info('fetch:trends command executed successfully. Output: ' . Str::limit($output, 200));
        } catch (\Exception $e) {
            Log::error('Error running fetch:trends command: ' . $e->getMessage());
        }
    }
}