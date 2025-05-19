<?php

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Artisan::command('credits:refresh', function () {
    $users = User::all();
    foreach ($users as $user) {
        if ($user->last_credit_refresh === null || $user->last_credit_refresh->isBefore(Carbon::today())) {
            $user->credits += 10;
            $user->last_credit_refresh = now();
            $user->save();
            
            $user->creditTransactions()->create([
                'amount' => 10,
                'type' => 'refresh',
                'description' => 'Daily credit refresh.',
            ]);
        }
    }
})->purpose('Refresh user credits');