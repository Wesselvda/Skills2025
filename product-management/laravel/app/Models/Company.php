<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Company extends Model
{
    public $guarded = [];

    public function owner() : HasOne
    {
        return $this->hasOne(Owner::class, "company_id", "id");
    }

    public function contact() : HasOne
    {
        return $this->hasOne(Contact::class, "company_id", "id");
    }

    public function products() : HasMany
    {
        return $this->hasMany(Product::class, "company_id", "id");
    }
}
