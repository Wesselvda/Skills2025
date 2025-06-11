<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = [
        'user_id',
        'room_number',
        'room_colour',
        'curtains',
        'music',
        'locked',
        'climate',
        'do_not_disturb',
        'make_up_room'
    ];

    public function logs()
    {
        return $this->hasMany(Log::class);
    }
}