import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DepartmentHeader from '@/Components/DepartmentHeader';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { filterAbsentsByDate } from '@/Utils/dateFilter';
import { 
    Users, 
    Calendar, 
    Car, 
    Search, 
    AlertCircle,
    Inbox
} from 'lucide-react';

export default function DepartmentDashboard({ department, kpis, absentEmployees }) {
    const [filter, setFilter] = useState('today');
    const [searchTerm, setSearchTerm] = useState('');
    const [genderFilter, setGenderFilter] = useState('');
    const [levelFilter, setLevelFilter] = useState('');

    // 1. Filter absents by Date range
    const dateFilteredAbsents = filterAbsentsByDate(absentEmployees, filter);

    // 2. Filter absents by search keyword and dropdowns
    const filteredAbsents = dateFilteredAbsents.filter(emp => {
        const matchesSearch = 
            emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (emp.employee_code && emp.employee_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (emp.job_title && emp.job_title.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesGender = genderFilter ? emp.gender === genderFilter : true;
        const matchesLevel = levelFilter ? emp.employment_level === levelFilter : true;
        
        return matchesSearch && matchesGender && matchesLevel;
    });

    return (
        <AuthenticatedLayout>
            <Head title={`${department.name} Summary Dashboard`} />

            {/* Sub-Navigation & Header */}
            <DepartmentHeader
                department={department}
                activeTab="dashboard"
                filter={filter}
                setFilter={setFilter}
                title="Summary Dashboard"
                description={`View active headcount and currently absent directory for ${department.name}`}
            />

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Employees */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden group hover:border-indigo-300 transition-all duration-300 shadow-sm">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-4 -mt-4 transition-all group-hover:scale-125 duration-350" />
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Department Headcount</span>
                        <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-650">
                            <Users className="h-5 w-5" /> 
                        </div>
                    </div>
                    <h3 className="text-3xl font-extrabold text-slate-900 mb-1">
                        {kpis.headcount}
                    </h3>
                    <p className="text-slate-500 text-[10px]">
                        Active employees assigned to this department
                    </p>
                </div>

                {/* Absent Members count */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden group hover:border-pink-300 transition-all duration-300 shadow-sm">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full -mr-4 -mt-4 transition-all group-hover:scale-125 duration-350" />
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Absent Members ({filter.toUpperCase()})</span>
                        <div className="p-2.5 rounded-xl bg-pink-50 text-pink-650">
                            <Calendar className="h-5 w-5" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-extrabold text-slate-900 mb-1">
                        {dateFilteredAbsents.length}
                    </h3>
                    <p className="text-slate-500 text-[10px]">
                        Employees on approved leave in period
                    </p>
                </div>

                {/* Pending Requisitions */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden group hover:border-emerald-300 transition-all duration-300 shadow-sm">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-4 -mt-4 transition-all group-hover:scale-125 duration-350" />
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Pending Requisitions</span>
                        <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-650">
                            <Car className="h-5 w-5" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-extrabold text-slate-900 mb-1">
                        {kpis.pendingLeaves + kpis.pendingVehicles}
                    </h3>
                    <p className="text-slate-500 text-[10px]">
                        Pending leaves & vehicle bookings
                    </p>
                </div>
            </div>

            {/* Absent Employees Directory Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h4 className="text-sm font-bold text-slate-800">Absent Members Directory ({filter.toUpperCase()})</h4>
                        <p className="text-slate-500 text-[10px] mt-0.5">List of employees currently absent on approved leave in period</p>
                    </div>
                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Search Input */}
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search className="h-3.5 w-3.5 text-slate-400" />
                            </span>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs placeholder-slate-400 text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white w-56 transition-colors shadow-sm"
                                placeholder="Search absents by name, code..."
                            />
                        </div>
                        {/* Gender Filter */}
                        <select
                            value={genderFilter}
                            onChange={(e) => setGenderFilter(e.target.value)}
                            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-sm"
                        >
                            <option value="">All Genders</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        {/* Level Filter */}
                        <select
                            value={levelFilter}
                            onChange={(e) => setLevelFilter(e.target.value)}
                            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-sm"
                        >
                            <option value="">All Levels</option>
                            <option value="Senior">Senior</option>
                            <option value="Mid">Mid</option>
                            <option value="Junior">Junior</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/50">
                                <th className="pb-3 pt-2 pl-3">Emp Code</th>
                                <th className="pb-3 pt-2">Full Name</th>
                                <th className="pb-3 pt-2">Job Title</th>
                                <th className="pb-3 pt-2">Leave Type</th>
                                <th className="pb-3 pt-2">Start Date</th>
                                <th className="pb-3 pt-2">End Date</th>
                                <th className="pb-3 pt-2 pr-3">Leave Reason</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredAbsents.length > 0 ? (
                                filteredAbsents.map((emp, idx) => (
                                    <tr key={idx} className="text-slate-750 hover:bg-slate-50/70 transition-colors">
                                        <td className="py-3.5 pl-3 font-mono text-indigo-650 font-bold">{emp.employee_code || '-'}</td>
                                        <td className="py-3.5 font-medium text-slate-900">{emp.full_name}</td>
                                        <td className="py-3.5">{emp.job_title || 'N/A'}</td>
                                        <td className="py-3.5 font-semibold text-slate-700">{emp.leave_policy || 'N/A'}</td>
                                        <td className="py-3.5 text-slate-600">{emp.leave_start_date}</td>
                                        <td className="py-3.5 text-slate-600">{emp.leave_end_date}</td>
                                        <td className="py-3.5 pr-3 text-slate-500 max-w-[200px] truncate" title={emp.leave_reason}>{emp.leave_reason || '-'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-10 text-center text-slate-400 font-medium">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Inbox className="h-5 w-5 text-slate-350" />
                                            <span>
                                                No absent members recorded for <strong>"{filter}"</strong>. 
                                                Try changing the dropdown to <strong>"All Time"</strong>.
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
