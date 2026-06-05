<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeJob extends Model
{
    protected $table = 'employee_job';
    protected $primaryKey = 'employee_id';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'employee_id',
        'department_id',
        'job_title_id',
        'employment_type',
        'employment_level',
        'company_type',
        'date_of_joining',
        'probation_end_date',
        'reporting_manager_id',
    ];

    protected $casts = [
        'date_of_joining' => 'date',
        'probation_end_date' => 'date',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'employee_id');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'department_id', 'department_id');
    }

    public function jobTitle(): BelongsTo
    {
        return $this->belongsTo(JobTitle::class, 'job_title_id', 'job_title_id');
    }

    public function reportingManager(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'reporting_manager_id', 'employee_id');
    }
}
