<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'firstname',
        'lastname',
        'email',
        'status',
        'items'
    ];

    protected function casts(): array
    {
        return [
            'items' => 'array',
        ];
    }
}
