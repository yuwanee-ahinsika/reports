import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InventoryHeader from '@/Components/InventoryHeader';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { filterRequestsByDate } from '@/Utils/dateFilter';
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

export default function InventoryGraphs({ stockLevels, stockRequests }) {
    const [filter, setFilter] = useState('today');
    const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6', '#ef4444'];

    // Filter requests
    const filteredRequests = filterRequestsByDate(stockRequests, filter);

    // Compute request status breakdown data for PieChart
    const statusCounts = {};
    filteredRequests.forEach(r => {
        const statusLabel = r.status.replace('pending_', 'Pending ').toUpperCase();
        statusCounts[statusLabel] = (statusCounts[statusLabel] || 0) + 1;
    });
    const requestStatusData = Object.keys(statusCounts).map(status => ({
        status,
        count: statusCounts[status]
    }));

    // Compute most requested items data for BarChart
    const itemQuantities = {};
    filteredRequests.forEach(r => {
        itemQuantities[r.stock_name] = (itemQuantities[r.stock_name] || 0) + r.quantity;
    });
    const mostRequestedData = Object.keys(itemQuantities).map(name => ({
        name,
        total_qty: itemQuantities[name]
    })).sort((a, b) => b.total_qty - a.total_qty);

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
            <Head title="Inventory Charts & Graphs" />

            {/* Sub-Navigation & Date Header */}
            <InventoryHeader
                activeTab="graphs"
                filter={filter}
                setFilter={setFilter}
                title="Graphs & Analytics"
                description="Visualize warehouse stock volumes and dynamic requisitions trends"
            />

            {/* Recharts Graphs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Stock Levels Chart (Static warehouse catalog level) */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between lg:col-span-2">
                    <div>
                        <h4 className="text-sm font-bold text-slate-800">Current Warehouse Stock Levels</h4>
                        <p className="text-slate-500 text-[10px] mt-0.5">Quantities currently in stock per product item (Static Catalog)</p>
                    </div>
                    <div className="h-64 w-full mt-4">
                        {stockLevels && stockLevels.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stockLevels} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                                    <CartesianGrid stroke="#e2e8f0" vertical={false} strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="name" 
                                        stroke="#64748b" 
                                        fontSize={9} 
                                        tickLine={false} 
                                        axisLine={false}
                                        angle={-20}
                                        textAnchor="end"
                                        height={45}
                                    />
                                    <YAxis stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                                    <Tooltip content={<CustomTooltip formatter={(val, row) => `${val} ${row.unit || 'pcs'}`} />} />
                                    <Bar dataKey="quantity" name="Stock Qty" radius={[4, 4, 0, 0]}>
                                        {stockLevels.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400 text-xs">No stock data available</div>
                        )}
                    </div>
                </div>

                {/* Requests Status Pie (Dynamic by range) */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <h4 className="text-sm font-bold text-slate-800">Request Status ({filter.toUpperCase()})</h4>
                        <p className="text-slate-500 text-[10px] mt-0.5">Total stock requests by approval status in period</p>
                    </div>
                    <div className="h-44 w-full relative flex items-center justify-center mt-4">
                        {requestStatusData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={requestStatusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={45}
                                        outerRadius={60}
                                        paddingAngle={4}
                                        dataKey="count"
                                        nameKey="status"
                                    >
                                        {requestStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip formatter={(val) => `${val} Requests`} />} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-1.5 text-slate-400 text-xs h-full">
                                <Inbox className="h-5 w-5 text-slate-350" />
                                <span>No requests in this period</span>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center mt-2 max-h-16 overflow-y-auto scrollbar-thin">
                        {requestStatusData.map((entry, index) => (
                            <div key={index} className="flex items-center gap-1 text-[10px] text-slate-500">
                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[(index + 2) % COLORS.length] }} />
                                <span className="truncate">{entry.status}: <span className="font-semibold text-slate-800">{entry.count}</span></span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Popular Items Row (Dynamic by range) */}
            <div className="grid grid-cols-1 gap-8 mb-8">
                {/* Most Requested Items Chart */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div>
                        <h4 className="text-sm font-bold text-slate-800">Most Requested Stock Items ({filter.toUpperCase()})</h4>
                        <p className="text-slate-500 text-[10px] mt-0.5">Sum of total requested quantities per product item in selected period</p>
                    </div>
                    <div className="h-56 w-full mt-4">
                        {mostRequestedData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={mostRequestedData} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                                    <CartesianGrid stroke="#e2e8f0" horizontal={false} strokeDasharray="3 3" />
                                    <XAxis type="number" stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                                    <YAxis 
                                        type="category" 
                                        dataKey="name" 
                                        stroke="#64748b" 
                                        fontSize={9} 
                                        tickLine={false} 
                                        axisLine={false}
                                        width={100}
                                    />
                                    <Tooltip content={<CustomTooltip formatter={(val) => `${val} units requested`} />} />
                                    <Bar dataKey="total_qty" name="Units Requested" radius={[0, 4, 4, 0]} fill="#4f46e5" barSize={12} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400 text-xs flex-col gap-1.5">
                                <Inbox className="h-5 w-5 text-slate-350" />
                                <span>No requisitions recorded in this period. Choose 'All Time' from dropdown.</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
