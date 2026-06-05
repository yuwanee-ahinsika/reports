<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    protected $table = 'departments';
    protected $primaryKey = 'department_id';
    public $timestamps = false;

    protected $fillable = ['name'];

    public function employeeJobs(): HasMany
    {
        return $this->hasMany(EmployeeJob::class, 'department_id', 'department_id');
    }
}
