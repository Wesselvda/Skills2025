<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChapterCompletion extends Model
{
    protected $guarded = [];

    public function chapter() : BelongsTo {
        return $this->belongsTo(Chapter::class, 'chapter_id');
    }
}
