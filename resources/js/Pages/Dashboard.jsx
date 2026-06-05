import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { 
    Users, 
    Calendar, 
    Car, 
    Building2,
    TrendingUp,
    FileText
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

export default function Dashboard({ kpis, charts }) {
    // Curated soft color palette
    const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6', '#ef4444'];

    // Custom Tooltip component for light theme
    const CustomTooltip = ({ active, payload, label, formatter }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs shadow-xl">
                    <p className="font-semibold text-slate-700 mb-1">{label}</p>
                    {payload.map((item, idx) => (
                        <p key={idx} style={{ color: item.color }} className="text-[11px]">
                            {item.name}: <span className="font-bold text-slate-900">
                                {formatter ? formatter(item.value) : item.value}
                            </span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                            Dashboard
                        </h2>
                        <p className="text-slate-500 text-xs mt-1">Real-time HR & Operations analytics across all departments</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <a 
                            href={route('reports.dashboard.export-word')} 
                            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 hover:border-indigo-500 transition duration-150 ease-in-out shadow-sm"
                        >
                            <FileText className="h-4 w-4 text-indigo-600" />
                            <span>Export Word</span>
                        </a>
                        <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
                            Overview
                        </span>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Employees */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden group hover:border-indigo-300 transition-all duration-300 shadow-sm">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-550/5 rounded-full -mr-4 -mt-4 transition-all group-hover:scale-125 duration-350" />
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Headcount</span>
                        <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-650">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-extrabold text-slate-900 mb-1">
                        {kpis.totalEmployees}
                    </h3>
                    <p className="text-slate-500 text-[10px] flex items-center gap-1.5">
                        <span className="text-emerald-600 font-bold">Active</span> employees recorded
                    </p>
                </div>

                {/* Pending Leaves */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden group hover:border-pink-300 transition-all duration-300 shadow-sm">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full -mr-4 -mt-4 transition-all group-hover:scale-125 duration-350" />
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Pending Leaves</span>
                        <div className="p-2.5 rounded-xl bg-pink-50 text-pink-650">
                            <Calendar className="h-5 w-5" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-extrabold text-slate-900 mb-1">
                        {kpis.pendingLeaves}
                    </h3>
                    <p className="text-slate-500 text-[10px]">
                        Requires approval action
                    </p>
                </div>

                {/* Pending Vehicles */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden group hover:border-emerald-300 transition-all duration-300 shadow-sm">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-4 -mt-4 transition-all group-hover:scale-125 duration-350" />
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Pending Vehicles</span>
                        <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-650">
                            <Car className="h-5 w-5" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-extrabold text-slate-900 mb-1">
                        {kpis.pendingVehicles}
                    </h3>
                    <p className="text-slate-500 text-[10px]">
                        Active booking requests
                    </p>
                </div>
            </div>

            {/* Department Charts Row (Only Headcount) */}
            <div className="grid grid-cols-1 gap-8 mb-8">
                {/* Headcount by Department */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h4 className="text-sm font-bold text-slate-800">Department Headcount</h4>
                            <p className="text-slate-500 text-[10px] mt-0.5">Total active employees assigned per department</p>
                        </div>
                        <Building2 className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={charts.departmentsHeadcount} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                                <CartesianGrid stroke="#e2e8f0" vertical={false} strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#64748b" 
                                    fontSize={10} 
                                    tickLine={false} 
                                    axisLine={false}
                                    angle={-25}
                                    textAnchor="end"
                                    height={50}
                                />
                                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomTooltip formatter={(val) => `${val} Employees`} />} />
                                <Bar dataKey="headcount" name="Headcount" radius={[6, 6, 0, 0]}>
                                    {charts.departmentsHeadcount.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Operational Status Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Leave Requests Pie */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                    <div className="mb-4">
                        <h4 className="text-sm font-bold text-slate-800">Leave Requests Status</h4>
                        <p className="text-slate-500 text-[10px] mt-0.5">Overview of leave applications</p>
                    </div>
                    <div className="h-60 w-full relative flex items-center justify-center">
                        {charts.leaveStatus.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={charts.leaveStatus}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={4}
                                        dataKey="count"
                                        nameKey="status"
                                    >
                                        {charts.leaveStatus.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip formatter={(val) => `${val} Requests`} />} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <span className="text-slate-400 text-xs">No leave request records</span>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1.5 justify-center mt-2">
                        {charts.leaveStatus.map((entry, index) => (
                            <div key={index} className="flex items-center gap-1 text-[10px] text-slate-500">
                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                <span>{entry.status}: <span className="font-semibold text-slate-800">{entry.count}</span></span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Vehicle Reasons Pie */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                    <div className="mb-4">
                        <h4 className="text-sm font-bold text-slate-800">Vehicle Request Reasons</h4>
                        <p className="text-slate-500 text-[10px] mt-0.5">Purposes for vehicle bookings</p>
                    </div>
                    <div className="h-60 w-full relative flex items-center justify-center">
                        {charts.vehicleReasons.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={charts.vehicleReasons}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={4}
                                        dataKey="count"
                                        nameKey="reason"
                                    >
                                        {charts.vehicleReasons.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip formatter={(val) => `${val} Trips`} />} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <span className="text-slate-400 text-xs">No vehicle request records</span>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1.5 justify-center mt-2">
                        {charts.vehicleReasons.map((entry, index) => (
                            <div key={index} className="flex items-center gap-1 text-[10px] text-slate-500">
                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                <span>{entry.reason}: <span className="font-semibold text-slate-800">{entry.count}</span></span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Vehicle Status Pie */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                    <div className="mb-4">
                        <h4 className="text-sm font-bold text-slate-800">Vehicle Booking Status</h4>
                        <p className="text-slate-500 text-[10px] mt-0.5">Operational ratios of vehicle status</p>
                    </div>
                    <div className="h-60 w-full relative flex items-center justify-center">
                        {charts.vehicleStatus.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={charts.vehicleStatus}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={4}
                                        dataKey="count"
                                        nameKey="status"
                                    >
                                        {charts.vehicleStatus.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip formatter={(val) => `${val} Bookings`} />} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <span className="text-slate-400 text-xs">No vehicle status records</span>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1.5 justify-center mt-2">
                        {charts.vehicleStatus.map((entry, index) => (
                            <div key={index} className="flex items-center gap-1 text-[10px] text-slate-500">
                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                <span>{entry.status}: <span className="font-semibold text-slate-800">{entry.count}</span></span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
