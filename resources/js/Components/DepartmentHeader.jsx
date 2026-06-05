import { Link } from '@inertiajs/react';
import { 
    FileText, 
    Calendar,
    LayoutDashboard,
    BarChart3,
    ListTodo,
    ChevronRight,
    ArrowLeft
} from 'lucide-react';

export default function DepartmentHeader({ department, activeTab, filter, setFilter, title, description }) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="flex items-start gap-4">
                    <Link 
                        href={route('departments.report', department.department_id)}
                        className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors mt-1"
                        title="Back to Department Categories"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 leading-tight flex items-center gap-2">
                            <span>{department.name}</span>
                            <ChevronRight className="h-4 w-4 text-slate-350" />
                            <span className="text-indigo-650 font-semibold">{title}</span>
                        </h2>
                        <p className="text-slate-500 text-xs mt-1">{description}</p>
                    </div>
                </div>

                {/* Filters & Actions */}
                <div className="flex flex-wrap items-center gap-3 self-end md:self-center">
                    {/* Date Selector Dropdown */}
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="bg-transparent border-none p-0 pr-8 text-xs font-semibold text-slate-700 focus:ring-0 cursor-pointer focus:outline-none"
                        >
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="all">All Time</option>
                        </select>
                    </div>

                    {/* Download Word Document */}
                    <a 
                        href={route('departments.export-word', { id: department.department_id, filter })} 
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/15"
                    >
                        <FileText className="h-4 w-4" />
                        <span>Download Word Report</span>
                    </a>
                </div>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-1">
                <Link
                    href={route('departments.dashboard', department.department_id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                        activeTab === 'dashboard'
                            ? 'bg-indigo-50 text-indigo-755 text-indigo-700 border border-indigo-150'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                >
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    <span>Summary Dashboard</span>
                </Link>

                <Link
                    href={route('departments.graphs', department.department_id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                        activeTab === 'graphs'
                            ? 'bg-indigo-50 text-indigo-755 text-indigo-700 border border-indigo-150'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                >
                    <BarChart3 className="h-3.5 w-3.5" />
                    <span>Graphs & Analytics</span>
                </Link>

                <Link
                    href={route('departments.logs', department.department_id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                        activeTab === 'logs'
                            ? 'bg-indigo-50 text-indigo-755 text-indigo-700 border border-indigo-150'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                >
                    <ListTodo className="h-3.5 w-3.5" />
                    <span>Activity Logs</span>
                </Link>
            </div>
        </div>
    );
}
