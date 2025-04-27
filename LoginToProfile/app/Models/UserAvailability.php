<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserAvailability extends Model
{
    protected $fillable = [
        'mo',
        'tu',
        'we',
        'th',
        'fr',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
