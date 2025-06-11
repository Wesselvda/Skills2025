<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Log extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'room_id',
        'service',
        'value_from',
        'value_to',
        'created_at'
    ];
}
