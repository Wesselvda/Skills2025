<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Product extends Model
{
    public $guarded = [];

    public function name() : HasOne
    {
        return $this->hasOne(Name::class, "product_id", "id");
    }

    public function description() : HasOne
    {
        return $this->hasOne(Description::class, "product_id", "id");
    }

    public function weight() : HasOne
    {
        return $this->hasOne(Weight::class, "product_id", "id");
    }

    public function company() : HasOne
    {
        return $this->hasOne(Company::class, "id", "company_id");
    }
}
