<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});

use App\Http\Controllers\ReportController;

use App\Http\Middleware\CheckHigherManagement;

Route::middleware(['auth', 'verified', CheckHigherManagement::class])->group(function () {
    Route::get('/dashboard', [ReportController::class, 'dashboard'])->name('dashboard');
    Route::get('/reports/dashboard/export-word', [ReportController::class, 'exportDashboardWord'])->name('reports.dashboard.export-word');
    Route::get('/departments/{id}', [ReportController::class, 'departmentReport'])->name('departments.report');
    Route::get('/departments/{id}/dashboard', [ReportController::class, 'departmentDashboard'])->name('departments.dashboard');
    Route::get('/departments/{id}/graphs', [ReportController::class, 'departmentGraphs'])->name('departments.graphs');
    Route::get('/departments/{id}/logs', [ReportController::class, 'departmentLogs'])->name('departments.logs');
    Route::get('/departments/{id}/export-word', [ReportController::class, 'exportWord'])->name('departments.export-word');
    Route::get('/reports/inventory', [ReportController::class, 'inventoryReport'])->name('reports.inventory');
    Route::get('/reports/inventory/dashboard', [ReportController::class, 'inventoryDashboard'])->name('reports.inventory.dashboard');
    Route::get('/reports/inventory/graphs', [ReportController::class, 'inventoryGraphs'])->name('reports.inventory.graphs');
    Route::get('/reports/inventory/logs', [ReportController::class, 'inventoryLogs'])->name('reports.inventory.logs');
    Route::get('/reports/inventory/export-word', [ReportController::class, 'exportInventoryWord'])->name('reports.inventory.export-word');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
