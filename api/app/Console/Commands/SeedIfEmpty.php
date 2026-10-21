<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class SeedIfEmpty extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:seed-if-empty';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run the database seeders only when the database has not been seeded yet';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        if (User::query()->exists()) {
            $this->info('Database already seeded, skipping seeders.');

            return self::SUCCESS;
        }

        $this->call('db:seed', ['--force' => true]);

        return self::SUCCESS;
    }
}
