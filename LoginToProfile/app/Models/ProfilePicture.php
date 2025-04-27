<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProfilePicture extends Model
{
    protected $fillable = [
        'imgurl'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
