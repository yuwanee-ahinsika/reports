import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DepartmentHeader from '@/Components/DepartmentHeader';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { filterLogsByDate } from '@/Utils/dateFilter';
import { Search, Inbox, SlidersHorizontal } from 'lucide-react';

export default function DepartmentLogs({ department, leaveRequests, vehicleRequests }) {
    const [filter, setFilter] = useState('today');
    const [leaveSearch, setLeaveSearch] = useState('');
    const [leaveStatus, setLeaveStatus] = useState('');
    const [vehicleSearch, setVehicleSearch] = useState('');
    const [vehicleStatus, setVehicleStatus] = useState('');

    // 1. Date filtering
    const dateFilteredLeaves = filterLogsByDate(leaveRequests, filter);
    const dateFilteredVehicles = filterLogsByDate(vehicleRequests, filter);

    // 2. Search & drop-down filtering
    const filteredLeaves = dateFilteredLeaves.filter(lr => {
        const matchesSearch = 
            lr.employee_name.toLowerCase().includes(leaveSearch.toLowerCase()) ||
            (lr.policy_name && lr.policy_name.toLowerCase().includes(leaveSearch.toLowerCase())) ||
            (lr.reason && lr.reason.toLowerCase().includes(leaveSearch.toLowerCase()));
        
        const matchesStatus = leaveStatus ? lr.status === leaveStatus : true;
        return matchesSearch && matchesStatus;
    });

    const filteredVehicles = dateFilteredVehicles.filter(vr => {
        const matchesSearch = 
            vr.employee_name.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
            (vr.vehicle_reg_no && vr.vehicle_reg_no.toLowerCase().includes(vehicleSearch.toLowerCase())) ||
            (vr.reason && vr.reason.toLowerCase().includes(vehicleSearch.toLowerCase())) ||
            (vr.destinations && vr.destinations.toLowerCase().includes(vehicleSearch.toLowerCase()));
        
        const matchesStatus = vehicleStatus ? vr.status === vehicleStatus : true;
        return matchesSearch && matchesStatus;
    });

    // Helper to format status badges
    const getStatusBadge = (status) => {
        const lower = status.toLowerCase();
        if (lower.includes('approved')) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-750 border border-emerald-200">
                    Approved
                </span>
            );
        }
        if (lower.includes('rejected')) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-rose-750 border border-rose-200">
                    Rejected
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-750 border border-amber-200">
                {status}
            </span>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title={`${department.name} Activity Logs`} />

            {/* Sub-Navigation & Header */}
            <DepartmentHeader
                department={department}
                activeTab="logs"
                filter={filter}
                setFilter={setFilter}
                title="Activity Logs"
                description={`View complete records of leaves and vehicle bookings for ${department.name}`}
            />

            {/* Leave Requests Log */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h4 className="text-sm font-bold text-slate-800">Leave Application Logs ({filter.toUpperCase()})</h4>
                        <p className="text-slate-500 text-[10px] mt-0.5">Records of leave requests submitted by department staff</p>
                    </div>
                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search className="h-3.5 w-3.5 text-slate-400" />
                            </span>
                            <input
                                type="text"
                                value={leaveSearch}
                                onChange={(e) => setLeaveSearch(e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs placeholder-slate-400 text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white w-full sm:w-56 transition-colors shadow-sm"
                                placeholder="Search by name, reason..."
                            />
                        </div>
                        <div className="flex items-center gap-1">
                            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
                            <select
                                value={leaveStatus}
                                onChange={(e) => setLeaveStatus(e.target.value)}
                                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-sm"
                            >
                                <option value="">All Statuses</option>
                                <option value="APPROVED">Approved</option>
                                <option value="PENDING">Pending</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/50">
                                <th className="pb-3 pt-2 pl-3">Employee</th>
                                <th className="pb-3 pt-2">Policy Type</th>
                                <th className="pb-3 pt-2">Start Date</th>
                                <th className="pb-3 pt-2">End Date</th>
                                <th className="pb-3 pt-2">Days</th>
                                <th className="pb-3 pt-2">Status</th>
                                <th className="pb-3 pt-2 pr-3">Reason</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredLeaves.length > 0 ? (
                                filteredLeaves.map((lr, idx) => (
                                    <tr key={idx} className="text-slate-750 hover:bg-slate-50/70 transition-colors">
                                        <td className="py-3.5 pl-3 font-semibold text-slate-900">{lr.employee_name}</td>
                                        <td className="py-3.5">{lr.policy_name}</td>
                                        <td className="py-3.5 text-slate-650">{lr.leave_start_date}</td>
                                        <td className="py-3.5 text-slate-650">{lr.leave_end_date}</td>
                                        <td className="py-3.5 font-bold text-slate-800">{lr.number_of_days}</td>
                                        <td className="py-3.5">{getStatusBadge(lr.status)}</td>
                                        <td className="py-3.5 pr-3 text-slate-500 max-w-xs truncate" title={lr.reason}>{lr.reason || '-'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-10 text-center text-slate-400 font-medium">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Inbox className="h-5 w-5 text-slate-300" />
                                            <span>
                                                No leave requests found for <strong>"{filter}"</strong>. 
                                                Try choosing <strong>"All Time"</strong> in the date filter.
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Vehicle Requisitions Log */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h4 className="text-sm font-bold text-slate-800">Vehicle Requisitions Log ({filter.toUpperCase()})</h4>
                        <p className="text-slate-500 text-[10px] mt-0.5">Booking and trip details submitted by department staff</p>
                    </div>
                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search className="h-3.5 w-3.5 text-slate-400" />
                            </span>
                            <input
                                type="text"
                                value={vehicleSearch}
                                onChange={(e) => setVehicleSearch(e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs placeholder-slate-400 text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white w-full sm:w-56 transition-colors shadow-sm"
                                placeholder="Search by name, vehicle, reason..."
                            />
                        </div>
                        <div className="flex items-center gap-1">
                            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
                            <select
                                value={vehicleStatus}
                                onChange={(e) => setVehicleStatus(e.target.value)}
                                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-sm"
                            >
                                <option value="">All Statuses</option>
                                <option value="APPROVED">Approved</option>
                                <option value="PENDING">Pending</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/50">
                                <th className="pb-3 pt-2 pl-3">Employee</th>
                                <th className="pb-3 pt-2">Vehicle Reg No</th>
                                <th className="pb-3 pt-2">Start Date</th>
                                <th className="pb-3 pt-2">End Date</th>
                                <th className="pb-3 pt-2">Reason</th>
                                <th className="pb-3 pt-2">Status</th>
                                <th className="pb-3 pt-2 pr-3">Destinations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredVehicles.length > 0 ? (
                                filteredVehicles.map((vr, idx) => (
                                    <tr key={idx} className="text-slate-750 hover:bg-slate-50/70 transition-colors">
                                        <td className="py-3.5 pl-3 font-semibold text-slate-900">{vr.employee_name}</td>
                                        <td className="py-3.5 font-mono text-indigo-650 font-semibold">{vr.vehicle_reg_no}</td>
                                        <td className="py-3.5 text-slate-650">{vr.start_date}</td>
                                        <td className="py-3.5 text-slate-650">{vr.end_date}</td>
                                        <td className="py-3.5">{vr.reason}</td>
                                        <td className="py-3.5">{getStatusBadge(vr.status)}</td>
                                        <td className="py-3.5 pr-3 text-slate-500 max-w-xs truncate" title={vr.destinations}>{vr.destinations || '-'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-10 text-center text-slate-400 font-medium">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Inbox className="h-5 w-5 text-slate-300" />
                                            <span>
                                                No vehicle bookings found for <strong>"{filter}"</strong>. 
                                                Try choosing <strong>"All Time"</strong> in the date filter.
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
