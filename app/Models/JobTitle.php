<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobTitle extends Model
{
    protected $table = 'job_titles';
    protected $primaryKey = 'job_title_id';
    public $timestamps = false;

    protected $fillable = ['name'];

    public function employeeJobs(): HasMany
    {
        return $this->hasMany(EmployeeJob::class, 'job_title_id', 'job_title_id');
    }
}
