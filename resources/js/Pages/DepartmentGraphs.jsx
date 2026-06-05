import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DepartmentHeader from '@/Components/DepartmentHeader';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { filterLogsByDate } from '@/Utils/dateFilter';
import { BarChart3, Inbox } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

export default function DepartmentGraphs({ department, leaveRequests, vehicleRequests, jobTitles }) {
    const [filter, setFilter] = useState('today');
    const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6', '#ef4444'];

    // 1. Filter logs by Date
    const filteredLeaves = filterLogsByDate(leaveRequests, filter);
    const filteredVehicles = filterLogsByDate(vehicleRequests, filter);

    // 2. Aggregate leave types
    const leaveCounts = {};
    filteredLeaves.forEach(lr => {
        const key = lr.policy_name || 'N/A';
        leaveCounts[key] = (leaveCounts[key] || 0) + 1;
    });
    const leaveTypesData = Object.keys(leaveCounts).map(label => ({
        label,
        value: leaveCounts[label]
    }));

    // 3. Aggregate vehicle request reasons
    const vehicleCounts = {};
    filteredVehicles.forEach(vr => {
        const key = vr.reason || 'N/A';
        vehicleCounts[key] = (vehicleCounts[key] || 0) + 1;
    });
    const vehicleReasonsData = Object.keys(vehicleCounts).map(label => ({
        label,
        value: vehicleCounts[label]
    }));

    // Custom Tooltip component for light theme
    const CustomTooltip = ({ active, payload, label, formatter }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs shadow-xl">
                    <p className="font-semibold text-slate-700 mb-1">{label}</p>
                    {payload.map((item, idx) => (
                        <p key={idx} style={{ color: item.color }} className="text-[11px]">
                            {item.name}: <span className="font-bold text-slate-900">
                                {formatter ? formatter(item.value, item.payload) : item.value}
                            </span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <AuthenticatedLayout>
            <Head title={`${department.name} Visual Analytics`} />

            {/* Sub-Navigation & Header */}
            <DepartmentHeader
                department={department}
                activeTab="graphs"
                filter={filter}
                setFilter={setFilter}
                title="Graphs & Analytics"
                description={`Visualize HR data and requisitions distributions for ${department.name}`}
            />

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Leave Types Breakdown (PieChart) */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <h4 className="text-sm font-bold text-slate-800">Leave Requests ({filter.toUpperCase()})</h4>
                        <p className="text-slate-500 text-[10px] mt-0.5">Distribution of approved leave types in selected period</p>
                    </div>
                    <div className="h-56 w-full relative flex items-center justify-center mt-4">
                        {leaveTypesData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={leaveTypesData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={4}
                                        dataKey="value"
                                        nameKey="label"
                                    >
                                        {leaveTypesData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip formatter={(val) => `${val} Requests`} />} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-1.5 text-slate-400 text-xs h-full">
                                <Inbox className="h-5 w-5 text-slate-350" />
                                <span>No leave records in this period</span>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center mt-2 max-h-16 overflow-y-auto scrollbar-thin">
                        {leaveTypesData.map((entry, index) => (
                            <div key={index} className="flex items-center gap-1 text-[10px] text-slate-500">
                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                <span className="truncate">{entry.label}: <span className="font-semibold text-slate-800">{entry.value}</span></span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Vehicle Booking Reasons (PieChart) */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <h4 className="text-sm font-bold text-slate-800">Vehicle Trips Reasons ({filter.toUpperCase()})</h4>
                        <p className="text-slate-500 text-[10px] mt-0.5">Trip bookings purpose breakdown in selected period</p>
                    </div>
                    <div className="h-56 w-full relative flex items-center justify-center mt-4">
                        {vehicleReasonsData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={vehicleReasonsData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={4}
                                        dataKey="value"
                                        nameKey="label"
                                    >
                                        {vehicleReasonsData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip formatter={(val) => `${val} Trips`} />} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-1.5 text-slate-400 text-xs h-full">
                                <Inbox className="h-5 w-5 text-slate-350" />
                                <span>No vehicle records in this period</span>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center mt-2 max-h-16 overflow-y-auto scrollbar-thin">
                        {vehicleReasonsData.map((entry, index) => (
                            <div key={index} className="flex items-center gap-1 text-[10px] text-slate-500">
                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[(index + 2) % COLORS.length] }} />
                                <span className="truncate">{entry.label}: <span className="font-semibold text-slate-800">{entry.value}</span></span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Static Job Titles distribution */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h4 className="text-sm font-bold text-slate-800">Job Title Distribution</h4>
                        <p className="text-slate-500 text-[10px] mt-0.5">Headcount headcount breakdown across job titles (Static)</p>
                    </div>
                    <BarChart3 className="h-4 w-4 text-slate-450" />
                </div>
                <div className="h-72 w-full">
                    {jobTitles && jobTitles.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={jobTitles} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid stroke="#e2e8f0" horizontal={false} strokeDasharray="3 3" />
                                <XAxis type="number" stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                                <YAxis
                                    type="category"
                                    dataKey="label"
                                    stroke="#64748b"
                                    fontSize={9}
                                    tickLine={false}
                                    axisLine={false}
                                    width={120}
                                />
                                <Tooltip content={<CustomTooltip formatter={(val) => `${val} Employees`} />} />
                                <Bar dataKey="value" name="Headcount" radius={[0, 4, 4, 0]} fill="#4f46e5" barSize={14} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400 text-xs">No employees found</div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
