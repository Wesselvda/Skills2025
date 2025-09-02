<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Enrollment extends Model
{
    protected $guarded = [];

    public function completed_chapters() : HasMany {
        return $this->hasMany(ChapterCompletion::class, 'enrollment_id');
    }
}
