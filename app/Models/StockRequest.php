<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockRequest extends Model
{
    protected $table = 'stock_requests';
    public $timestamps = true;

    protected $fillable = [
        'employee_id',
        'stock_id',
        'quantity',
        'status',
        'hod_status',
        'processed_by',
        'hod_approved_by'
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'employee_id');
    }

    public function stock(): BelongsTo
    {
        return $this->belongsTo(Stock::class, 'stock_id', 'id');
    }
}
