<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EmployeeCompensation extends Model
{
    protected $table = 'employee_compensation';
    protected $primaryKey = 'comp_id';
    public $timestamps = false;

    protected $fillable = [
        'employee_id',
        'salary_currency',
        'pay_frequency',
        'effective_from',
        'effective_to',
    ];

    protected $casts = [
        'effective_from' => 'date',
        'effective_to' => 'date',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'employee_id');
    }

    public function components(): HasMany
    {
        return $this->hasMany(EmployeeCompensationComponent::class, 'comp_id', 'comp_id');
    }
}
