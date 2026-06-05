<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Employee;
use App\Models\EmployeeJob;
use App\Models\LeaveRequest;
use App\Models\VehicleRequest;
use App\Models\Stock;
use App\Models\StockRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Display the main dashboard with global metrics (without salary details).
     */
    public function dashboard()
    {
        // 1. General KPIs (excluding Payroll)
        $totalEmployees = Employee::count();
        $pendingLeaves = LeaveRequest::whereIn('status', ['PENDING', 'RELIEVER ACCEPTED'])->count();
        $pendingVehicles = VehicleRequest::where('status', 'PENDING')->count();

        // 2. Headcount by Department
        $departmentsHeadcount = DB::table('departments as d')
            ->leftJoin('employee_job as ej', 'd.department_id', '=', 'ej.department_id')
            ->leftJoin('employees as e', 'ej.employee_id', '=', 'e.employee_id')
            ->select('d.department_id', 'd.name', DB::raw('count(e.employee_id) as headcount'))
            ->groupBy('d.department_id', 'd.name')
            ->orderBy('headcount', 'desc')
            ->get();

        // 3. Leave Status Overview
        $leaveStatusBreakdown = LeaveRequest::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();

        // 4. Vehicle Request Status & Reason Overviews
        $vehicleReasonBreakdown = VehicleRequest::select('reason', DB::raw('count(*) as count'))
            ->groupBy('reason')
            ->get();

        $vehicleStatusBreakdown = VehicleRequest::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();

        return Inertia::render('Dashboard', [
            'kpis' => [
                'totalEmployees' => $totalEmployees,
                'pendingLeaves' => $pendingLeaves,
                'pendingVehicles' => $pendingVehicles,
            ],
            'charts' => [
                'departmentsHeadcount' => $departmentsHeadcount,
                'leaveStatus' => $leaveStatusBreakdown,
                'vehicleReasons' => $vehicleReasonBreakdown,
                'vehicleStatus' => $vehicleStatusBreakdown,
            ]
        ]);
    }

    /**
     * Display reports department by department, filtering only absent members (no salaries).
     */
    /**
     * Display the department report landing page to choose a category.
     */
    public function departmentReport($id)
    {
        $department = Department::findOrFail($id);

        $headcount = DB::table('employee_job as ej')
            ->join('employees as e', 'ej.employee_id', '=', 'e.employee_id')
            ->where('ej.department_id', '=', $id)
            ->count();

        $employeeIds = DB::table('employee_job')
            ->where('department_id', '=', $id)
            ->pluck('employee_id')
            ->toArray();

        $pendingLeaves = 0;
        $pendingVehicles = 0;

        if (!empty($employeeIds)) {
            $pendingLeaves = LeaveRequest::whereIn('employee_id', $employeeIds)
                ->whereIn('status', ['PENDING', 'RELIEVER ACCEPTED'])
                ->count();

            $pendingVehicles = VehicleRequest::whereIn('employee_id', $employeeIds)
                ->where('status', 'PENDING')
                ->count();
        }

        return Inertia::render('DepartmentLanding', [
            'department' => $department,
            'kpis' => [
                'headcount' => $headcount,
                'pendingLeaves' => $pendingLeaves,
                'pendingVehicles' => $pendingVehicles,
            ]
        ]);
    }

    /**
     * Category 1: Department Dashboard overview (absent directory and key summaries)
     */
    public function departmentDashboard($id)
    {
        $department = Department::findOrFail($id);

        $headcount = DB::table('employee_job as ej')
            ->join('employees as e', 'ej.employee_id', '=', 'e.employee_id')
            ->where('ej.department_id', '=', $id)
            ->count();

        $employeeIds = DB::table('employee_job')
            ->where('department_id', '=', $id)
            ->pluck('employee_id')
            ->toArray();

        $absentEmployees = DB::table('employees as e')
            ->join('employee_job as ej', 'e.employee_id', '=', 'ej.employee_id')
            ->join('leave_requests as lr', 'e.employee_id', '=', 'lr.employee_id')
            ->leftJoin('job_titles as jt', 'ej.job_title_id', '=', 'jt.job_title_id')
            ->leftJoin('leave_policies as lp', 'lr.leave_policy_id', '=', 'lp.leave_policy_id')
            ->where('ej.department_id', '=', $id)
            ->where('lr.status', '=', 'APPROVED')
            ->select(
                'e.employee_id',
                'e.employee_code',
                'e.full_name',
                'e.employment_status',
                'e.gender',
                'jt.name as job_title',
                'ej.employment_type',
                'ej.employment_level',
                'lp.name as leave_policy',
                'lr.leave_start_date',
                'lr.leave_end_date',
                'lr.reason as leave_reason'
            )
            ->orderBy('lr.leave_start_date', 'desc')
            ->get();

        $pendingLeaves = 0;
        $pendingVehicles = 0;

        if (!empty($employeeIds)) {
            $pendingLeaves = LeaveRequest::whereIn('employee_id', $employeeIds)
                ->whereIn('status', ['PENDING', 'RELIEVER ACCEPTED'])
                ->count();

            $pendingVehicles = VehicleRequest::whereIn('employee_id', $employeeIds)
                ->where('status', 'PENDING')
                ->count();
        }

        return Inertia::render('DepartmentDashboard', [
            'department' => $department,
            'kpis' => [
                'headcount' => $headcount,
                'pendingLeaves' => $pendingLeaves,
                'pendingVehicles' => $pendingVehicles,
            ],
            'absentEmployees' => $absentEmployees,
        ]);
    }

    /**
     * Category 2: Department Graphs & Visual Analytics
     */
    public function departmentGraphs($id)
    {
        $department = Department::findOrFail($id);

        $employeeIds = DB::table('employee_job')
            ->where('department_id', '=', $id)
            ->pluck('employee_id')
            ->toArray();

        $leaveRequests = [];
        $vehicleRequests = [];

        if (!empty($employeeIds)) {
            $leaveRequests = DB::table('leave_requests as lr')
                ->join('employees as e', 'lr.employee_id', '=', 'e.employee_id')
                ->join('leave_policies as lp', 'lr.leave_policy_id', '=', 'lp.leave_policy_id')
                ->whereIn('lr.employee_id', $employeeIds)
                ->select(
                    'lr.leave_request_id',
                    'e.full_name as employee_name',
                    'lp.name as policy_name',
                    'lr.leave_start_date',
                    'lr.leave_end_date',
                    'lr.number_of_days',
                    'lr.status',
                    'lr.reason'
                )
                ->orderBy('lr.leave_start_date', 'desc')
                ->get();

            $vehicleRequests = DB::table('vehicle_requests as vr')
                ->join('employees as e', 'vr.employee_id', '=', 'e.employee_id')
                ->whereIn('vr.employee_id', $employeeIds)
                ->select(
                    'vr.vehicle_request_id',
                    'e.full_name as employee_name',
                    'vr.vehicle_reg_no',
                    'vr.start_date',
                    'vr.end_date',
                    'vr.reason',
                    'vr.status',
                    'vr.destinations'
                )
                ->orderBy('vr.start_date', 'desc')
                ->get();
        }

        $jobTitles = DB::table('employee_job as ej')
            ->join('job_titles as jt', 'ej.job_title_id', '=', 'jt.job_title_id')
            ->where('ej.department_id', '=', $id)
            ->select('jt.name as label', DB::raw('count(*) as value'))
            ->groupBy('ej.job_title_id', 'jt.name')
            ->orderBy('value', 'desc')
            ->get();

        return Inertia::render('DepartmentGraphs', [
            'department' => $department,
            'leaveRequests' => $leaveRequests,
            'vehicleRequests' => $vehicleRequests,
            'jobTitles' => $jobTitles,
        ]);
    }

    /**
     * Category 3: Department Logs & Details
     */
    public function departmentLogs($id)
    {
        $department = Department::findOrFail($id);

        $employeeIds = DB::table('employee_job')
            ->where('department_id', '=', $id)
            ->pluck('employee_id')
            ->toArray();

        $leaveRequests = [];
        $vehicleRequests = [];

        if (!empty($employeeIds)) {
            $leaveRequests = DB::table('leave_requests as lr')
                ->join('employees as e', 'lr.employee_id', '=', 'e.employee_id')
                ->join('leave_policies as lp', 'lr.leave_policy_id', '=', 'lp.leave_policy_id')
                ->whereIn('lr.employee_id', $employeeIds)
                ->select(
                    'lr.leave_request_id',
                    'e.full_name as employee_name',
                    'lp.name as policy_name',
                    'lr.leave_start_date',
                    'lr.leave_end_date',
                    'lr.number_of_days',
                    'lr.status',
                    'lr.reason'
                )
                ->orderBy('lr.leave_start_date', 'desc')
                ->get();

            $vehicleRequests = DB::table('vehicle_requests as vr')
                ->join('employees as e', 'vr.employee_id', '=', 'e.employee_id')
                ->whereIn('vr.employee_id', $employeeIds)
                ->select(
                    'vr.vehicle_request_id',
                    'e.full_name as employee_name',
                    'vr.vehicle_reg_no',
                    'vr.start_date',
                    'vr.end_date',
                    'vr.reason',
                    'vr.status',
                    'vr.destinations'
                )
                ->orderBy('vr.start_date', 'desc')
                ->get();
        }

        return Inertia::render('DepartmentLogs', [
            'department' => $department,
            'leaveRequests' => $leaveRequests,
            'vehicleRequests' => $vehicleRequests,
        ]);
    }

    /**
     * Export department report as a Word document (.docx) - Absents only, no salaries.
     */
    public function exportWord($id)
    {
        $department = Department::findOrFail($id);
        $filter = request()->query('filter', 'today');
        
        $todayStr = now()->toDateString();
        
        // Fetch ONLY absent members
        $absentQuery = DB::table('employees as e')
            ->join('employee_job as ej', 'e.employee_id', '=', 'ej.employee_id')
            ->join('leave_requests as lr', 'e.employee_id', '=', 'lr.employee_id')
            ->leftJoin('job_titles as jt', 'ej.job_title_id', '=', 'jt.job_title_id')
            ->leftJoin('leave_policies as lp', 'lr.leave_policy_id', '=', 'lp.leave_policy_id')
            ->where('ej.department_id', '=', $id)
            ->where('lr.status', '=', 'APPROVED');

        if ($filter === 'today') {
            $absentQuery->where('lr.leave_start_date', '<=', $todayStr)
                        ->where('lr.leave_end_date', '>=', $todayStr);
        } elseif ($filter === 'week') {
            $startOfWeek = now()->startOfWeek()->toDateString();
            $endOfWeek = now()->endOfWeek()->toDateString();
            $absentQuery->where(function($q) use ($startOfWeek, $endOfWeek) {
                $q->whereBetween('lr.leave_start_date', [$startOfWeek, $endOfWeek])
                  ->orWhereBetween('lr.leave_end_date', [$startOfWeek, $endOfWeek])
                  ->orWhere(function($sub) use ($startOfWeek, $endOfWeek) {
                      $sub->where('lr.leave_start_date', '<=', $startOfWeek)
                          ->where('lr.leave_end_date', '>=', $endOfWeek);
                  });
            });
        } elseif ($filter === 'month') {
            $startOfMonth = now()->startOfMonth()->toDateString();
            $endOfMonth = now()->endOfMonth()->toDateString();
            $absentQuery->where(function($q) use ($startOfMonth, $endOfMonth) {
                $q->whereBetween('lr.leave_start_date', [$startOfMonth, $endOfMonth])
                  ->orWhereBetween('lr.leave_end_date', [$startOfMonth, $endOfMonth])
                  ->orWhere(function($sub) use ($startOfMonth, $endOfMonth) {
                      $sub->where('lr.leave_start_date', '<=', $startOfMonth)
                          ->where('lr.leave_end_date', '>=', $endOfMonth);
                  });
            });
        }

        $absentEmployees = $absentQuery->select(
                'e.employee_code',
                'e.full_name',
                'jt.name as job_title',
                'lp.name as leave_policy',
                'lr.leave_start_date',
                'lr.leave_end_date',
                'lr.reason as leave_reason'
            )
            ->orderBy('lr.leave_start_date', 'desc')
            ->get();

        $absentsCount = $absentEmployees->count();

        $headcount = DB::table('employee_job as ej')
            ->join('employees as e', 'ej.employee_id', '=', 'e.employee_id')
            ->where('ej.department_id', '=', $id)
            ->count();

        $employeeIds = DB::table('employee_job')
            ->where('department_id', '=', $id)
            ->pluck('employee_id')
            ->toArray();

        // Leave Requests Log
        $leaveRequests = [];
        if (!empty($employeeIds)) {
            $leaveLogQuery = DB::table('leave_requests as lr')
                ->join('employees as e', 'lr.employee_id', '=', 'e.employee_id')
                ->join('leave_policies as lp', 'lr.leave_policy_id', '=', 'lp.leave_policy_id')
                ->whereIn('lr.employee_id', $employeeIds);

            if ($filter === 'today') {
                $leaveLogQuery->where('lr.leave_start_date', '<=', $todayStr)
                              ->where('lr.leave_end_date', '>=', $todayStr);
            } elseif ($filter === 'week') {
                $startOfWeek = now()->startOfWeek()->toDateString();
                $endOfWeek = now()->endOfWeek()->toDateString();
                $leaveLogQuery->where(function($q) use ($startOfWeek, $endOfWeek) {
                    $q->whereBetween('lr.leave_start_date', [$startOfWeek, $endOfWeek])
                      ->orWhereBetween('lr.leave_end_date', [$startOfWeek, $endOfWeek]);
                });
            } elseif ($filter === 'month') {
                $startOfMonth = now()->startOfMonth()->toDateString();
                $endOfMonth = now()->endOfMonth()->toDateString();
                $leaveLogQuery->where(function($q) use ($startOfMonth, $endOfMonth) {
                    $q->whereBetween('lr.leave_start_date', [$startOfMonth, $endOfMonth])
                      ->orWhereBetween('lr.leave_end_date', [$startOfMonth, $endOfMonth]);
                });
            }

            $leaveRequests = $leaveLogQuery->select(
                    'e.full_name as employee_name',
                    'lp.name as policy_name',
                    'lr.leave_start_date',
                    'lr.leave_end_date',
                    'lr.number_of_days',
                    'lr.status',
                    'lr.reason'
                )
                ->orderBy('lr.leave_start_date', 'desc')
                ->limit(30)
                ->get();
        }

        // Vehicle Requests Log
        $vehicleRequests = [];
        if (!empty($employeeIds)) {
            $vehicleLogQuery = DB::table('vehicle_requests as vr')
                ->join('employees as e', 'vr.employee_id', '=', 'e.employee_id')
                ->whereIn('vr.employee_id', $employeeIds);

            if ($filter === 'today') {
                $vehicleLogQuery->where('vr.start_date', '<=', $todayStr)
                                ->where('vr.end_date', '>=', $todayStr);
            } elseif ($filter === 'week') {
                $startOfWeek = now()->startOfWeek()->toDateString();
                $endOfWeek = now()->endOfWeek()->toDateString();
                $vehicleLogQuery->where(function($q) use ($startOfWeek, $endOfWeek) {
                    $q->whereBetween('vr.start_date', [$startOfWeek, $endOfWeek])
                      ->orWhereBetween('vr.end_date', [$startOfWeek, $endOfWeek]);
                });
            } elseif ($filter === 'month') {
                $startOfMonth = now()->startOfMonth()->toDateString();
                $endOfMonth = now()->endOfMonth()->toDateString();
                $vehicleLogQuery->where(function($q) use ($startOfMonth, $endOfMonth) {
                    $q->whereBetween('vr.start_date', [$startOfMonth, $endOfMonth])
                      ->orWhereBetween('vr.end_date', [$startOfMonth, $endOfMonth]);
                });
            }

            $vehicleRequests = $vehicleLogQuery->select(
                    'e.full_name as employee_name',
                    'vr.vehicle_reg_no',
                    'vr.start_date',
                    'vr.end_date',
                    'vr.reason',
                    'vr.status',
                    'vr.destinations'
                )
                ->orderBy('vr.start_date', 'desc')
                ->limit(30)
                ->get();
        }

        // Initialize PHPWord
        $phpWord = new \PhpOffice\PhpWord\PhpWord();

        // Document properties
        $properties = $phpWord->getDocInfo();
        $properties->setCreator('Explores Reports Dashboard');
        $properties->setTitle('Absent Members Report - ' . htmlspecialchars($department->name));
        $properties->setDescription('Generated Absent Members Report for ' . htmlspecialchars($department->name));

        // Section settings
        $section = $phpWord->addSection([
            'marginTop' => 1100,
            'marginBottom' => 1100,
            'marginLeft' => 1100,
            'marginRight' => 1100,
        ]);

        // Define Title Styles
        $phpWord->addTitleStyle(1, ['size' => 22, 'bold' => true, 'color' => '1e293b', 'name' => 'Arial'], ['spaceBefore' => 200, 'spaceAfter' => 200]);
        $phpWord->addTitleStyle(2, ['size' => 14, 'bold' => true, 'color' => '4f46e5', 'name' => 'Arial'], ['spaceBefore' => 150, 'spaceAfter' => 100]);

        // Add Header title
        $section->addTitle(htmlspecialchars($department->name) . ' Department - Absent Members Report', 1);
        $section->addText('Generated Date: ' . now()->format('Y-m-d H:i:s'), ['italic' => true, 'color' => '64748b', 'size' => 9]);
        $section->addTextBreak(1);

        // Add KPI Callouts Table (styled boxes)
        $section->addTitle('Department KPI Summary', 2);
        
        $kpiTableStyle = 'kpi_table';
        $phpWord->addTableStyle($kpiTableStyle, [
            'borderColor' => 'cbd5e1',
            'borderSize' => 6,
            'cellMargin' => 120,
        ]);
        
        $table = $section->addTable($kpiTableStyle);
        $row = $table->addRow();
        
        // Headcount Cell
        $cell1 = $row->addCell(4500, ['bgColor' => 'f8fafc']);
        $cell1->addText('Total Department Headcount', ['bold' => true, 'color' => '64748b', 'size' => 10]);
        $cell1->addText($headcount . ' Active Employees', ['size' => 12, 'bold' => true, 'color' => '0f172a']);
        
        // Absent Cell
        $cell2 = $row->addCell(4500, ['bgColor' => 'f8fafc']);
        $cell2->addText('Total Absent Members', ['bold' => true, 'color' => '64748b', 'size' => 10]);
        $cell2->addText($absentsCount . ' Members on Approved Leave', ['size' => 12, 'bold' => true, 'color' => 'b91c1c']);

        $section->addTextBreak(1);

        // Add Absent Directory Table
        $section->addTitle('Absent Members Directory', 2);
        
        $empTableStyle = 'employee_table';
        $phpWord->addTableStyle($empTableStyle, [
            'borderColor' => 'e2e8f0',
            'borderSize' => 6,
            'cellMargin' => 100,
        ]);

        $empTable = $section->addTable($empTableStyle);
        
        // Table Headers
        $headerRow = $empTable->addRow();
        $headerStyle = ['bold' => true, 'color' => 'ffffff', 'size' => 9.5];
        $headerBg = ['bgColor' => '4f46e5'];
        
        $headerRow->addCell(1500, $headerBg)->addText('Code', $headerStyle);
        $headerRow->addCell(2500, $headerBg)->addText('Name', $headerStyle);
        $headerRow->addCell(2000, $headerBg)->addText('Leave Type', $headerStyle);
        $headerRow->addCell(2500, $headerBg)->addText('Leave Dates', $headerStyle);
        $headerRow->addCell(1500, $headerBg)->addText('Reason', $headerStyle);
        
        // Table Body
        foreach ($absentEmployees as $emp) {
            $bodyRow = $empTable->addRow();
            $bodyRow->addCell(1500)->addText(htmlspecialchars($emp->employee_code), ['name' => 'Consolas', 'size' => 9]);
            $bodyRow->addCell(2500)->addText(htmlspecialchars($emp->full_name), ['size' => 9]);
            $bodyRow->addCell(2000)->addText(htmlspecialchars($emp->leave_policy ?? 'N/A'), ['size' => 9]);
            $bodyRow->addCell(2500)->addText($emp->leave_start_date . ' to ' . $emp->leave_end_date, ['size' => 8.5]);
            $bodyRow->addCell(1500)->addText(htmlspecialchars($emp->leave_reason ?? '-'), ['size' => 9]);
        }

        $section->addTextBreak(1);

        // Add Leave Log Table
        if (count($leaveRequests) > 0) {
            $section->addTitle('Recent Leave Activity', 2);
            $leaveTable = $section->addTable($empTableStyle);
            
            $headerRow = $leaveTable->addRow();
            $headerRow->addCell(2500, $headerBg)->addText('Employee', $headerStyle);
            $headerRow->addCell(2000, $headerBg)->addText('Policy Type', $headerStyle);
            $headerRow->addCell(2500, $headerBg)->addText('Dates', $headerStyle);
            $headerRow->addCell(800, $headerBg)->addText('Days', $headerStyle);
            $headerRow->addCell(1400, $headerBg)->addText('Status', $headerStyle);

            foreach ($leaveRequests as $lr) {
                $bodyRow = $leaveTable->addRow();
                $bodyRow->addCell(2500)->addText(htmlspecialchars($lr->employee_name), ['size' => 9]);
                $bodyRow->addCell(2000)->addText(htmlspecialchars($lr->policy_name), ['size' => 9]);
                $bodyRow->addCell(2500)->addText($lr->leave_start_date . ' to ' . $lr->leave_end_date, ['size' => 8.5]);
                $bodyRow->addCell(800)->addText($lr->number_of_days, ['size' => 9]);
                $bodyRow->addCell(1400)->addText(htmlspecialchars($lr->status), ['size' => 9, 'bold' => true]);
            }
            $section->addTextBreak(1);
        }

        // Add Vehicle Log Table
        if (count($vehicleRequests) > 0) {
            $section->addTitle('Recent Vehicle Booking Activity', 2);
            $vehicleTable = $section->addTable($empTableStyle);
            
            $headerRow = $vehicleTable->addRow();
            $headerRow->addCell(2500, $headerBg)->addText('Employee', $headerStyle);
            $headerRow->addCell(1800, $headerBg)->addText('Vehicle Reg No', $headerStyle);
            $headerRow->addCell(1500, $headerBg)->addText('Reason', $headerStyle);
            $headerRow->addCell(2000, $headerBg)->addText('Destinations', $headerStyle);
            $headerRow->addCell(1400, $headerBg)->addText('Status', $headerStyle);

            foreach ($vehicleRequests as $vr) {
                $bodyRow = $vehicleTable->addRow();
                $bodyRow->addCell(2500)->addText(htmlspecialchars($vr->employee_name), ['size' => 9]);
                $bodyRow->addCell(1800)->addText(htmlspecialchars($vr->vehicle_reg_no ?? 'N/A'), ['size' => 9]);
                $bodyRow->addCell(1500)->addText(htmlspecialchars($vr->reason), ['size' => 9]);
                $bodyRow->addCell(2000)->addText(htmlspecialchars($vr->destinations ?? '-'), ['size' => 9]);
                $bodyRow->addCell(1400)->addText(htmlspecialchars($vr->status), ['size' => 9, 'bold' => true]);
            }
        }

        // Export document as Word file for download
        $filename = str_replace(' ', '_', $department->name) . '_Absent_Members_Report.docx';
        $tempFile = tempnam(sys_get_temp_dir(), 'word_report_');

        $objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'Word2007');
        $objWriter->save($tempFile);

        return response()->download($tempFile, $filename)->deleteFileAfterSend(true);
    }

    /**
     * Display the inventory and stock reports.
     */
    /**
     * Display the inventory landing page to choose a category.
     */
    public function inventoryReport()
    {
        $totalItems = Stock::count();
        $totalQuantity = Stock::sum('quantity');
        $pendingRequests = StockRequest::whereIn('status', ['pending_hod', 'pending_gm', 'pending_manager'])->count();
        $approvedRequests = StockRequest::where('status', 'approved')->count();

        return Inertia::render('InventoryLanding', [
            'kpis' => [
                'totalItems' => $totalItems,
                'totalQuantity' => (int)$totalQuantity,
                'pendingRequests' => $pendingRequests,
                'approvedRequests' => $approvedRequests,
            ]
        ]);
    }

    /**
     * Category 1: Summary Dashboard View.
     */
    public function inventoryDashboard()
    {
        $totalItems = Stock::count();
        $totalQuantity = Stock::sum('quantity');
        $pendingRequests = StockRequest::whereIn('status', ['pending_hod', 'pending_gm', 'pending_manager'])->count();
        $approvedRequests = StockRequest::where('status', 'approved')->count();

        $stockRequests = DB::table('stock_requests as sr')
            ->join('stocks as s', 'sr.stock_id', '=', 's.id')
            ->leftJoin('employees as e', 'sr.employee_id', '=', 'e.employee_id')
            ->leftJoin('employee_job as ej', 'e.employee_id', '=', 'ej.employee_id')
            ->leftJoin('departments as d', 'ej.department_id', '=', 'd.department_id')
            ->select(
                'd.name as department_name',
                's.name as stock_name',
                'sr.quantity',
                'sr.status',
                'sr.created_at'
            )
            ->orderBy('sr.created_at', 'desc')
            ->get();

        return Inertia::render('InventoryDashboard', [
            'kpis' => [
                'totalItems' => $totalItems,
                'totalQuantity' => (int)$totalQuantity,
                'pendingRequests' => $pendingRequests,
                'approvedRequests' => $approvedRequests,
            ],
            'stockRequests' => $stockRequests,
        ]);
    }

    /**
     * Category 2: Graphs and visual metrics.
     */
    public function inventoryGraphs()
    {
        $stockLevels = Stock::select('name', 'quantity', 'unit')->get();

        $stockRequests = DB::table('stock_requests as sr')
            ->join('stocks as s', 'sr.stock_id', '=', 's.id')
            ->leftJoin('employees as e', 'sr.employee_id', '=', 'e.employee_id')
            ->leftJoin('employee_job as ej', 'e.employee_id', '=', 'ej.employee_id')
            ->leftJoin('departments as d', 'ej.department_id', '=', 'd.department_id')
            ->select(
                'd.name as department_name',
                's.name as stock_name',
                'sr.quantity',
                'sr.status',
                'sr.created_at'
            )
            ->orderBy('sr.created_at', 'desc')
            ->get();

        return Inertia::render('InventoryGraphs', [
            'stockLevels' => $stockLevels,
            'stockRequests' => $stockRequests,
        ]);
    }

    /**
     * Category 3: Inventory logs and records.
     */
    public function inventoryLogs()
    {
        $stocks = Stock::orderBy('name')->get();

        $stockRequests = DB::table('stock_requests as sr')
            ->join('stocks as s', 'sr.stock_id', '=', 's.id')
            ->leftJoin('employees as e', 'sr.employee_id', '=', 'e.employee_id')
            ->leftJoin('employee_job as ej', 'e.employee_id', '=', 'ej.employee_id')
            ->leftJoin('departments as d', 'ej.department_id', '=', 'd.department_id')
            ->select(
                'd.name as department_name',
                's.name as stock_name',
                'sr.quantity',
                'sr.status',
                'sr.created_at'
            )
            ->orderBy('sr.created_at', 'desc')
            ->get();

        return Inertia::render('InventoryLogs', [
            'stocks' => $stocks,
            'stockRequests' => $stockRequests,
        ]);
    }

    /**
     * Export global inventory report as a Word document (.docx).
     */
    public function exportInventoryWord()
    {
        $filter = request()->query('filter', 'today');

        $totalItems = Stock::count();
        $totalQuantity = Stock::sum('quantity');

        // Filter stock requests dynamically based on the date range
        $reqQuery = StockRequest::query();

        if ($filter === 'today') {
            $reqQuery->whereDate('created_at', '=', now()->toDateString());
        } elseif ($filter === 'week') {
            $startOfWeek = now()->startOfWeek()->toDateTimeString();
            $endOfWeek = now()->endOfWeek()->toDateTimeString();
            $reqQuery->whereBetween('created_at', [$startOfWeek, $endOfWeek]);
        } elseif ($filter === 'month') {
            $startOfMonth = now()->startOfMonth()->toDateTimeString();
            $endOfMonth = now()->endOfMonth()->toDateTimeString();
            $reqQuery->whereBetween('created_at', [$startOfMonth, $endOfMonth]);
        }

        $pendingRequests = (clone $reqQuery)->whereIn('status', ['pending_hod', 'pending_gm', 'pending_manager'])->count();
        $approvedRequests = (clone $reqQuery)->where('status', 'approved')->count();

        $stocks = Stock::orderBy('name')->get();

        $stockRequestsQuery = DB::table('stock_requests as sr')
            ->join('stocks as s', 'sr.stock_id', '=', 's.id')
            ->leftJoin('employees as e', 'sr.employee_id', '=', 'e.employee_id')
            ->leftJoin('employee_job as ej', 'e.employee_id', '=', 'ej.employee_id')
            ->leftJoin('departments as d', 'ej.department_id', '=', 'd.department_id')
            ->select(
                'd.name as department_name',
                's.name as stock_name',
                DB::raw('SUM(sr.quantity) as quantity')
            );

        if ($filter === 'today') {
            $stockRequestsQuery->whereDate('sr.created_at', '=', now()->toDateString());
        } elseif ($filter === 'week') {
            $startOfWeek = now()->startOfWeek()->toDateTimeString();
            $endOfWeek = now()->endOfWeek()->toDateTimeString();
            $stockRequestsQuery->whereBetween('sr.created_at', [$startOfWeek, $endOfWeek]);
        } elseif ($filter === 'month') {
            $startOfMonth = now()->startOfMonth()->toDateTimeString();
            $endOfMonth = now()->endOfMonth()->toDateTimeString();
            $stockRequestsQuery->whereBetween('sr.created_at', [$startOfMonth, $endOfMonth]);
        }

        $stockRequests = $stockRequestsQuery
            ->groupBy('d.department_id', 'd.name', 's.id', 's.name')
            ->orderBy('department_name')
            ->orderBy('stock_name')
            ->get();

        $phpWord = new \PhpOffice\PhpWord\PhpWord();

        // Document Info
        $properties = $phpWord->getDocInfo();
        $properties->setCreator('Explores Reports Dashboard');
        $properties->setTitle('Inventory and Stock Requests Report');

        $section = $phpWord->addSection([
            'marginTop' => 1100,
            'marginBottom' => 1100,
            'marginLeft' => 1100,
            'marginRight' => 1100,
        ]);

        $phpWord->addTitleStyle(1, ['size' => 22, 'bold' => true, 'color' => '1e293b', 'name' => 'Arial'], ['spaceBefore' => 200, 'spaceAfter' => 200]);
        $phpWord->addTitleStyle(2, ['size' => 14, 'bold' => true, 'color' => '4f46e5', 'name' => 'Arial'], ['spaceBefore' => 150, 'spaceAfter' => 100]);

        $section->addTitle('Inventory and Stock Request Report', 1);
        $section->addText('Generated Date: ' . now()->format('Y-m-d H:i:s') . ' (Filter: ' . ucfirst($filter) . ')', ['italic' => true, 'color' => '64748b', 'size' => 9]);
        $section->addTextBreak(1);

        // KPI Table
        $section->addTitle('Inventory KPI Summary', 2);
        $kpiTableStyle = 'kpi_table';
        $phpWord->addTableStyle($kpiTableStyle, [
            'borderColor' => 'cbd5e1',
            'borderSize' => 6,
            'cellMargin' => 120,
        ]);
        
        $table = $section->addTable($kpiTableStyle);
        $row = $table->addRow();
        
        $cell1 = $row->addCell(3000, ['bgColor' => 'f8fafc']);
        $cell1->addText('Total Stock Items', ['bold' => true, 'color' => '64748b', 'size' => 9]);
        $cell1->addText($totalItems . ' Product SKUs', ['size' => 11, 'bold' => true, 'color' => '0f172a']);
        
        $cell2 = $row->addCell(3000, ['bgColor' => 'f8fafc']);
        $cell2->addText('Total Quantity in Stock', ['bold' => true, 'color' => '64748b', 'size' => 9]);
        $cell2->addText($totalQuantity . ' pcs', ['size' => 11, 'bold' => true, 'color' => '0f172a']);

        $cell3 = $row->addCell(3000, ['bgColor' => 'f8fafc']);
        $cell3->addText('Pending / Approved Requests', ['bold' => true, 'color' => '64748b', 'size' => 9]);
        $cell3->addText($pendingRequests . ' Pending / ' . $approvedRequests . ' Approved', ['size' => 10, 'bold' => true, 'color' => '4f46e5']);

        $section->addTextBreak(1);

        // Current Inventory Table
        $section->addTitle('Current Stock Inventory Levels', 2);
        $tableStyle = 'inventory_table';
        $phpWord->addTableStyle($tableStyle, [
            'borderColor' => 'e2e8f0',
            'borderSize' => 6,
            'cellMargin' => 100,
        ]);

        $invTable = $section->addTable($tableStyle);
        $headerRow = $invTable->addRow();
        $headerStyle = ['bold' => true, 'color' => 'ffffff', 'size' => 9.5];
        $headerBg = ['bgColor' => '4f46e5'];

        $headerRow->addCell(3500, $headerBg)->addText('Item Name', $headerStyle);
        $headerRow->addCell(2000, $headerBg)->addText('SKU', $headerStyle);
        $headerRow->addCell(2000, $headerBg)->addText('Quantity', $headerStyle);
        $headerRow->addCell(1500, $headerBg)->addText('Unit', $headerStyle);

        foreach ($stocks as $stk) {
            $bodyRow = $invTable->addRow();
            $bodyRow->addCell(3500)->addText(htmlspecialchars($stk->name), ['size' => 9]);
            $bodyRow->addCell(2000)->addText(htmlspecialchars($stk->sku), ['name' => 'Consolas', 'size' => 9]);
            $bodyRow->addCell(2000)->addText($stk->quantity, ['size' => 9, 'bold' => true]);
            $bodyRow->addCell(1500)->addText(htmlspecialchars($stk->unit ?? 'pcs'), ['size' => 9]);
        }

        $section->addTextBreak(1);

        // Requests log
        if (count($stockRequests) > 0) {
            $section->addTitle('Recent Stock Requests Log', 2);
            $reqTable = $section->addTable($tableStyle);
            
            $headerRow = $reqTable->addRow();
            $headerRow->addCell(4000, $headerBg)->addText('Department', $headerStyle);
            $headerRow->addCell(4000, $headerBg)->addText('Stock Item', $headerStyle);
            $headerRow->addCell(1000, $headerBg)->addText('Qty', $headerStyle);

            foreach ($stockRequests as $req) {
                $bodyRow = $reqTable->addRow();
                $bodyRow->addCell(4000)->addText(htmlspecialchars($req->department_name ?? 'N/A'), ['size' => 9]);
                $bodyRow->addCell(4000)->addText(htmlspecialchars($req->stock_name), ['size' => 9]);
                $bodyRow->addCell(1000)->addText($req->quantity, ['size' => 9]);
            }
        }

        $filename = 'Inventory_Report.docx';
        $tempFile = tempnam(sys_get_temp_dir(), 'inv_report_');

        $objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'Word2007');
        $objWriter->save($tempFile);

        return response()->download($tempFile, $filename)->deleteFileAfterSend(true);
    }

    /**
     * Export global dashboard summary report as a Word document (.docx).
     */
    public function exportDashboardWord()
    {
        $totalEmployees = Employee::count();
        $pendingLeaves = LeaveRequest::whereIn('status', ['PENDING', 'RELIEVER ACCEPTED'])->count();
        $pendingVehicles = VehicleRequest::where('status', 'PENDING')->count();

        $departmentsHeadcount = DB::table('departments as d')
            ->leftJoin('employee_job as ej', 'd.department_id', '=', 'ej.department_id')
            ->leftJoin('employees as e', 'ej.employee_id', '=', 'e.employee_id')
            ->select('d.department_id', 'd.name', DB::raw('count(e.employee_id) as headcount'))
            ->groupBy('d.department_id', 'd.name')
            ->orderBy('headcount', 'desc')
            ->get();

        $leaveStatusBreakdown = LeaveRequest::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();

        $vehicleReasonBreakdown = VehicleRequest::select('reason', DB::raw('count(*) as count'))
            ->groupBy('reason')
            ->get();

        $phpWord = new \PhpOffice\PhpWord\PhpWord();

        // Document Info
        $properties = $phpWord->getDocInfo();
        $properties->setCreator('Explores Reports Dashboard');
        $properties->setTitle('Company Headcount and Operations Summary Report');

        $section = $phpWord->addSection([
            'marginTop' => 1100,
            'marginBottom' => 1100,
            'marginLeft' => 1100,
            'marginRight' => 1100,
        ]);

        $phpWord->addTitleStyle(1, ['size' => 22, 'bold' => true, 'color' => '1e293b', 'name' => 'Arial'], ['spaceBefore' => 200, 'spaceAfter' => 200]);
        $phpWord->addTitleStyle(2, ['size' => 14, 'bold' => true, 'color' => '4f46e5', 'name' => 'Arial'], ['spaceBefore' => 150, 'spaceAfter' => 100]);

        $section->addTitle('Company Headcount and Operations Summary Report', 1);
        $section->addText('Generated Date: ' . now()->format('Y-m-d H:i:s'), ['italic' => true, 'color' => '64748b', 'size' => 9]);
        $section->addTextBreak(1);

        // KPI Table
        $section->addTitle('Key Performance Indicators', 2);
        $kpiTableStyle = 'kpi_table';
        $phpWord->addTableStyle($kpiTableStyle, [
            'borderColor' => 'cbd5e1',
            'borderSize' => 6,
            'cellMargin' => 120,
        ]);
        
        $table = $section->addTable($kpiTableStyle);
        $row = $table->addRow();
        
        $cell1 = $row->addCell(3000, ['bgColor' => 'f8fafc']);
        $cell1->addText('Total Headcount', ['bold' => true, 'color' => '64748b', 'size' => 9]);
        $cell1->addText($totalEmployees . ' Active Employees', ['size' => 11, 'bold' => true, 'color' => '0f172a']);
        
        $cell2 = $row->addCell(3000, ['bgColor' => 'f8fafc']);
        $cell2->addText('Pending Leaves', ['bold' => true, 'color' => '64748b', 'size' => 9]);
        $cell2->addText($pendingLeaves . ' Requests', ['size' => 11, 'bold' => true, 'color' => '0f172a']);

        $cell3 = $row->addCell(3000, ['bgColor' => 'f8fafc']);
        $cell3->addText('Pending Vehicles', ['bold' => true, 'color' => '64748b', 'size' => 9]);
        $cell3->addText($pendingVehicles . ' Trips', ['size' => 11, 'bold' => true, 'color' => '4f46e5']);

        $section->addTextBreak(1);

        // Department Headcount Table
        $section->addTitle('Department Headcount Breakdown', 2);
        $tableStyle = 'operations_table';
        $phpWord->addTableStyle($tableStyle, [
            'borderColor' => 'e2e8f0',
            'borderSize' => 6,
            'cellMargin' => 100,
        ]);

        $deptTable = $section->addTable($tableStyle);
        $headerRow = $deptTable->addRow();
        $headerStyle = ['bold' => true, 'color' => 'ffffff', 'size' => 9.5];
        $headerBg = ['bgColor' => '4f46e5'];

        $headerRow->addCell(6000, $headerBg)->addText('Department Name', $headerStyle);
        $headerRow->addCell(3000, $headerBg)->addText('Active Headcount', $headerStyle);

        foreach ($departmentsHeadcount as $dept) {
            $bodyRow = $deptTable->addRow();
            $bodyRow->addCell(6000)->addText(htmlspecialchars($dept->name), ['size' => 9]);
            $bodyRow->addCell(3000)->addText($dept->headcount, ['size' => 9, 'bold' => true]);
        }

        $section->addTextBreak(1);

        // Leave Request Status Breakdown
        $section->addTitle('Leave Requests Status Breakdown', 2);
        $leaveTable = $section->addTable($tableStyle);
        $headerRow = $leaveTable->addRow();
        $headerRow->addCell(6000, $headerBg)->addText('Status', $headerStyle);
        $headerRow->addCell(3000, $headerBg)->addText('Count', $headerStyle);

        foreach ($leaveStatusBreakdown as $leave) {
            $bodyRow = $leaveTable->addRow();
            $bodyRow->addCell(6000)->addText(htmlspecialchars($leave->status), ['size' => 9]);
            $bodyRow->addCell(3000)->addText($leave->count, ['size' => 9, 'bold' => true]);
        }

        $section->addTextBreak(1);

        // Vehicle Request Reasons Breakdown
        $section->addTitle('Vehicle Requests Reason Breakdown', 2);
        $vehicleTable = $section->addTable($tableStyle);
        $headerRow = $vehicleTable->addRow();
        $headerRow->addCell(6000, $headerBg)->addText('Trip Reason', $headerStyle);
        $headerRow->addCell(3000, $headerBg)->addText('Total Trips', $headerStyle);

        foreach ($vehicleReasonBreakdown as $veh) {
            $bodyRow = $vehicleTable->addRow();
            $bodyRow->addCell(6000)->addText(htmlspecialchars($veh->reason ?? 'N/A'), ['size' => 9]);
            $bodyRow->addCell(3000)->addText($veh->count, ['size' => 9, 'bold' => true]);
        }

        $filename = 'Operations_Summary_Report.docx';
        $tempFile = tempnam(sys_get_temp_dir(), 'ops_report_');

        $objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'Word2007');
        $objWriter->save($tempFile);

        return response()->download($tempFile, $filename)->deleteFileAfterSend(true);
    }
}
