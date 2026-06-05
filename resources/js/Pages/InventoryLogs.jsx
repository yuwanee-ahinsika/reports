import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InventoryHeader from '@/Components/InventoryHeader';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { filterRequestsByDate } from '@/Utils/dateFilter';
import { 
    Search, 
    AlertCircle,
    Inbox
} from 'lucide-react';

export default function InventoryLogs({ stocks, stockRequests }) {
    const [filter, setFilter] = useState('today');
    const [stockSearch, setStockSearch] = useState('');
    const [requestSearch, setRequestSearch] = useState('');

    // 1. Filter stock requests by date range
    const dateFilteredRequests = filterRequestsByDate(stockRequests, filter);

    // 2. Filter stock requests by search keyword
    const searchFilteredRequests = dateFilteredRequests.filter(req => 
        req.stock_name.toLowerCase().includes(requestSearch.toLowerCase()) ||
        (req.department_name && req.department_name.toLowerCase().includes(requestSearch.toLowerCase()))
    );

    // 3. Group by Department & Requested Item, summing quantities
    const groupedRequests = [];
    const requestGroups = {};

    searchFilteredRequests.forEach(req => {
        const deptName = req.department_name || 'N/A';
        const itemName = req.stock_name;
        const key = `${deptName}|${itemName}`;

        if (!requestGroups[key]) {
            requestGroups[key] = {
                department_name: deptName,
                stock_name: itemName,
                quantity: 0
            };
            groupedRequests.push(requestGroups[key]);
        }
        requestGroups[key].quantity += req.quantity;
    });

    // Filter Stock levels (Static Warehouse stock catalog)
    const filteredStocks = stocks.filter(stock => 
        stock.name.toLowerCase().includes(stockSearch.toLowerCase()) || 
        stock.sku.toLowerCase().includes(stockSearch.toLowerCase())
    );

    return (
        <AuthenticatedLayout>
            <Head title="Inventory Stock & Requisitions Logs" />

            {/* Sub-Navigation & Date Header */}
            <InventoryHeader
                activeTab="logs"
                filter={filter}
                setFilter={setFilter}
                title="Stock & Requisition Logs"
                description="Browse complete records of warehouse stocks and grouped employee requisitions"
            />

            {/* Current Stock Levels Table */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h4 className="text-sm font-bold text-slate-800">Current Stock Inventory</h4>
                        <p className="text-slate-500 text-[10px] mt-0.5">Real-time counts of product warehouse stock (Catalog)</p>
                    </div>
                    {/* Search filter */}
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search className="h-3.5 w-3.5 text-slate-400" />
                        </span>
                        <input
                            type="text"
                            value={stockSearch}
                            onChange={(e) => setStockSearch(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs placeholder-slate-400 text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white w-full sm:w-64 transition-colors shadow-sm"
                            placeholder="Search by product name or SKU..."
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/50">
                                <th className="pb-3 pt-2 pl-3">Item Name</th>
                                <th className="pb-3 pt-2">SKU</th>
                                <th className="pb-3 pt-2">Warehouse Quantity</th>
                                <th className="pb-3 pt-2">Unit</th>
                                <th className="pb-3 pt-2 pr-3">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredStocks.length > 0 ? (
                                filteredStocks.map((stock, idx) => (
                                    <tr key={idx} className="text-slate-750 hover:bg-slate-50/70 transition-colors">
                                        <td className="py-3.5 pl-3 font-semibold text-slate-900">{stock.name}</td>
                                        <td className="py-3.5 font-mono text-indigo-650 font-semibold">{stock.sku}</td>
                                        <td className="py-3.5 font-bold text-slate-800">{stock.quantity.toLocaleString()}</td>
                                        <td className="py-3.5 text-slate-600">{stock.unit || 'pcs'}</td>
                                        <td className="py-3.5 pr-3 text-slate-500 max-w-xs truncate" title={stock.description}>{stock.description || '-'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-10 text-center text-slate-400 font-medium">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <AlertCircle className="h-5 w-5 text-slate-300" />
                                            <span>No inventory items match search criteria.</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Stock Requests Log Table */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h4 className="text-sm font-bold text-slate-800">Stock Requisitions Log</h4>
                        <p className="text-slate-555 text-slate-500 text-[10px] mt-0.5">
                            Grouped by department & requested items with summed quantities ({filter.toUpperCase()})
                        </p>
                    </div>
                    {/* Search & filters */}
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search className="h-3.5 w-3.5 text-slate-400" />
                        </span>
                        <input
                            type="text"
                            value={requestSearch}
                            onChange={(e) => setRequestSearch(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs placeholder-slate-400 text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white w-full sm:w-64 transition-colors shadow-sm"
                            placeholder="Search department, item..."
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/50">
                                <th className="pb-3 pt-2 pl-3">Department</th>
                                <th className="pb-3 pt-2">Requested Item</th>
                                <th className="pb-3 pt-2 pr-3">Qty</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {groupedRequests.length > 0 ? (
                                groupedRequests.map((req, idx) => (
                                    <tr key={idx} className="text-slate-750 hover:bg-slate-50/70 transition-colors">
                                        <td className="py-3.5 pl-3 text-slate-600">{req.department_name || 'N/A'}</td>
                                        <td className="py-3.5 font-medium text-slate-700">{req.stock_name}</td>
                                        <td className="py-3.5 pr-3 font-bold text-slate-800">{req.quantity}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="py-10 text-center text-slate-400 font-medium">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Inbox className="h-5 w-5 text-slate-300" />
                                            <span>
                                                No requisition records found for <strong>"{filter}"</strong>. 
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
