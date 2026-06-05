<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Stock extends Model
{
    protected $table = 'stocks';
    public $timestamps = true;

    protected $fillable = [
        'name',
        'sku',
        'description',
        'quantity',
        'unit'
    ];

    public function requests(): HasMany
    {
        return $this->hasMany(StockRequest::class, 'stock_id', 'id');
    }
}
