<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SessionBooking extends Model
{
    protected $guarded = [];

    public function session() : BelongsTo {
        return $this->belongsTo(MentorSessions::class, 'mentor_session_id');
    }
}
