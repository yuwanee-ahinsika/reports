<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeaveRequest extends Model
{
    protected $table = 'leave_requests';
    protected $primaryKey = 'leave_request_id';
    public $timestamps = false;

    protected $fillable = [
        'employee_id',
        'leave_policy_id',
        'leave_start_date',
        'leave_end_date',
        'number_of_days',
        'reason',
        'oversee_member_id',
        'half_day_session',
        'manager_comment',
        'reliever_comment',
        'is_special_request',
        'address',
        'status',
        'requested_at',
        'updated_at',
    ];

    protected $casts = [
        'leave_start_date' => 'date',
        'leave_end_date' => 'date',
        'number_of_days' => 'decimal:2',
        'is_special_request' => 'boolean',
        'requested_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'employee_id');
    }

    public function policy(): BelongsTo
    {
        return $this->belongsTo(LeavePolicy::class, 'leave_policy_id', 'leave_policy_id');
    }

    public function overseeMember(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'oversee_member_id', 'employee_id');
    }
}
