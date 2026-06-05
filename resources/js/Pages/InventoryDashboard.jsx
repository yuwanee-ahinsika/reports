import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InventoryHeader from '@/Components/InventoryHeader';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { filterRequestsByDate } from '@/Utils/dateFilter';
import { 
    Boxes, 
    Clock, 
    CheckCircle, 
    Archive,
    Inbox,
    CalendarCheck,
    TrendingUp,
    Layers
} from 'lucide-react';

export default function InventoryDashboard({ kpis, stockRequests }) {
    const [filter, setFilter] = useState('today');

    // Filter stock requests dynamically based on date range
    const filteredRequests = filterRequestsByDate(stockRequests, filter);

    // Calculate dynamic KPIs from the filtered range
    const pendingCount = filteredRequests.filter(r => r.status.toLowerCase().includes('pending')).length;
    const approvedCount = filteredRequests.filter(r => r.status.toLowerCase().includes('approved')).length;
    const totalRequests = filteredRequests.length;
    const totalUnitsRequested = filteredRequests.reduce((acc, curr) => acc + curr.quantity, 0);

    return (
        <AuthenticatedLayout>
            <Head title="Inventory Summary Dashboard" />

            {/* Sub-Navigation & Date Header */}
            <InventoryHeader
                activeTab="dashboard"
                filter={filter}
                setFilter={setFilter}
                title="Summary Dashboard"
                description="View warehouse totals and real-time stock requisitions summaries"
            />

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Stock Items (Static) */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden group hover:border-indigo-300 transition-all duration-300 shadow-sm">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-4 -mt-4 transition-all group-hover:scale-125 duration-350" />
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Warehouse Products</span>
                        <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-650">
                            <Boxes className="h-5 w-5" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-extrabold text-slate-900 mb-1">
                        {kpis.totalItems}
                    </h3>
                    <p className="text-slate-500 text-[10px]">
                        Registered product SKUs in catalog
                    </p>
                </div>

                {/* Total Stock Quantity (Static) */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden group hover:border-emerald-300 transition-all duration-300 shadow-sm">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-4 -mt-4 transition-all group-hover:scale-125 duration-350" />
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Warehouse Stock Qty</span>
                        <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-650">
                            <Archive className="h-5 w-5" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-extrabold text-slate-900 mb-1">
                        {kpis.totalQuantity.toLocaleString()}
                    </h3>
                    <p className="text-slate-500 text-[10px]">
                        Total pieces physically in stock
                    </p>
                </div>

                {/* Pending Requisitions (Dynamic) */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden group hover:border-amber-300 transition-all duration-300 shadow-sm">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-4 -mt-4 transition-all group-hover:scale-125 duration-350" />
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Pending (Selected Range)</span>
                        <div className="p-2.5 rounded-xl bg-amber-50 text-amber-650">
                            <Clock className="h-5 w-5" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-extrabold text-slate-900 mb-1">
                        {pendingCount}
                    </h3>
                    <p className="text-slate-500 text-[10px]">
                        Requisitions awaiting review
                    </p>
                </div>

                {/* Approved Requisitions (Dynamic) */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden group hover:border-blue-300 transition-all duration-300 shadow-sm">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-4 -mt-4 transition-all group-hover:scale-125 duration-350" />
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Approved (Selected Range)</span>
                        <div className="p-2.5 rounded-xl bg-blue-50 text-blue-650">
                            <CheckCircle className="h-5 w-5" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-extrabold text-slate-900 mb-1">
                        {approvedCount}
                    </h3>
                    <p className="text-slate-500 text-[10px]">
                        Requisitions fully completed
                    </p>
                </div>
            </div>

            {/* Dynamic Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Requisition Activity Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <h4 className="text-sm font-bold text-slate-800">Requisitions Activity Summary</h4>
                        <p className="text-slate-500 text-[10px] mt-0.5">Key totals for requests within the selected date range</p>
                    </div>

                    <div className="my-6 space-y-4">
                        <div className="flex items-center justify-between py-2 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <Layers className="h-4 w-4 text-slate-450" />
                                <span className="text-xs font-medium text-slate-650">Total Requisitions Made</span>
                            </div>
                            <span className="text-sm font-bold text-slate-800">{totalRequests}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-slate-450" />
                                <span className="text-xs font-medium text-slate-650">Total Units Requested</span>
                            </div>
                            <span className="text-sm font-bold text-slate-800">{totalUnitsRequested.toLocaleString()} pcs</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <CalendarCheck className="h-4 w-4 text-slate-455" />
                                <span className="text-xs font-medium text-slate-650">Average Requisition Size</span>
                            </div>
                            <span className="text-sm font-bold text-slate-800">
                                {totalRequests > 0 ? Math.round(totalUnitsRequested / totalRequests) : 0} pcs
                            </span>
                        </div>
                    </div>

                    <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200 inline-block self-start">
                        Active Filter: {filter.toUpperCase()}
                    </span>
                </div>

                {/* Quick Info Alerts Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <h4 className="text-sm font-bold text-slate-800">System Notification & Logs</h4>
                        <p className="text-slate-500 text-[10px] mt-0.5">Quick warnings or guides on selected filters</p>
                    </div>

                    {filteredRequests.length === 0 ? (
                        <div className="my-8 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-3">
                            <Inbox className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold">No Records Found</p>
                                <p className="mt-1 text-amber-700">
                                    There are no stock requisitions logged under the current <strong>"{filter}"</strong> filter. 
                                    Please switch the date dropdown on the top right to <strong>"All Time"</strong> to display the historical seed data.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="my-8 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-emerald-550 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold">Data Loaded Successfully</p>
                                <p className="mt-1 text-emerald-700">
                                    Displaying {filteredRequests.length} active requisitions for the selected period. Toggle categories above to view graphs or detailed lists.
                                </p>
                            </div>
                        </div>
                    )}

                    <p className="text-[10px] text-slate-400">
                        * Total Warehouse Products are catalog entries and remain static across date filters.
                    </p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
