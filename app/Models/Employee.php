<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model
{
    protected $table = 'employees';
    protected $primaryKey = 'employee_id';
    public $timestamps = false;

    protected $fillable = [
        'employee_code',
        'employment_status',
        'date_created',
        'full_name',
        'preferred_name',
        'date_of_birth',
        'gender',
        'marital_status',
        'nationality',
        'blood_group',
        'epf_number',
        'attendance_type',
        'created_by',
        'last_updated_by',
        'last_updated_date',
    ];

    protected $casts = [
        'date_created' => 'datetime',
        'date_of_birth' => 'date',
        'last_updated_date' => 'datetime',
    ];

    public function job(): HasOne
    {
        return $this->hasOne(EmployeeJob::class, 'employee_id', 'employee_id');
    }

    public function compensation(): HasOne
    {
        return $this->hasOne(EmployeeCompensation::class, 'employee_id', 'employee_id');
    }

    public function leaveRequests(): HasMany
    {
        return $this->hasMany(LeaveRequest::class, 'employee_id', 'employee_id');
    }

    public function vehicleRequests(): HasMany
    {
        return $this->hasMany(VehicleRequest::class, 'employee_id', 'employee_id');
    }
}
