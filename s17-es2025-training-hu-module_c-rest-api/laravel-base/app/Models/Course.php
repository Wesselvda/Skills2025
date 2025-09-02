<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    protected $fillable = [
        'id',
        'title',
        'description',
        'difficulty'
    ];

    public function chapters() : HasMany {
        return $this->hasMany(Chapter::class, "course_id");
    }
}
