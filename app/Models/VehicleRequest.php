<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VehicleRequest extends Model
{
    protected $table = 'vehicle_requests';
    protected $primaryKey = 'vehicle_request_id';
    public $timestamps = true;

    protected $fillable = [
        'employee_id',
        'vehicle_reg_no',
        'start_date',
        'is_one_day',
        'end_date',
        'reason',
        'manager_id',
        'status',
        'destinations',
        'trip_code',
        'reject_reason',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_one_day' => 'boolean',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'employee_id');
    }

    public function manager(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'manager_id', 'employee_id');
    }
}
