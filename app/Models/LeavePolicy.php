<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LeavePolicy extends Model
{
    protected $table = 'leave_policies';
    protected $primaryKey = 'leave_policy_id';
    public $timestamps = false;

    protected $fillable = ['name'];

    public function leaveRequests(): HasMany
    {
        return $this->hasMany(LeaveRequest::class, 'leave_policy_id', 'leave_policy_id');
    }
}
