import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    BarChart3, 
    ListTodo, 
    ArrowRight,
    Users,
    Calendar,
    Car
} from 'lucide-react';

export default function DepartmentLanding({ department, kpis }) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                        {department.name} Department Reports
                    </h2>
                    <p className="text-slate-500 text-xs mt-1">Select a category below to explore specific reports and metrics for this department</p>
                </div>
            }
        >
            <Head title={`${department.name} Reports Menu`} />

            <div className="max-w-5xl mx-auto py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Category 1: Summary Dashboard */}
                    <Link
                        href={route('departments.dashboard', department.department_id)}
                        className="group bg-white border border-slate-200 hover:border-indigo-400 rounded-3xl p-8 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between h-96 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-8 -mt-8 transition-all group-hover:scale-125 duration-350" />
                        <div>
                            <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-650 inline-block mb-6 transition-transform group-hover:scale-110">
                                <LayoutDashboard className="h-7 w-7" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                Summary Dashboard
                            </h3>
                            <p className="text-slate-500 text-xs leading-relaxed mb-6">
                                View department headcount, absent employees directory, and quick HR summaries.
                            </p>
                        </div>
                        
                        <div>
                            <div className="border-t border-slate-100 pt-4 mb-4 grid grid-cols-1 gap-2 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                                <div className="flex items-center gap-1.5">
                                    <Users className="h-3.5 w-3.5 text-indigo-550" />
                                    <span>Headcount: {kpis.headcount} Active Employees</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-indigo-600 text-xs font-bold pt-2">
                                <span>Open Dashboard</span>
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>
                    </Link>

                    {/* Category 2: Graphs & Analytics */}
                    <Link
                        href={route('departments.graphs', department.department_id)}
                        className="group bg-white border border-slate-200 hover:border-emerald-400 rounded-3xl p-8 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between h-96 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-8 -mt-8 transition-all group-hover:scale-125 duration-350" />
                        <div>
                            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-650 inline-block mb-6 transition-transform group-hover:scale-110">
                                <BarChart3 className="h-7 w-7" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                                Graphs & Analytics
                            </h3>
                            <p className="text-slate-500 text-xs leading-relaxed mb-6">
                                Analyze job titles distribution, leave breakdown, and vehicle booking purposes in graphs.
                            </p>
                        </div>

                        <div>
                            <div className="border-t border-slate-100 pt-4 mb-4 flex items-center gap-2 text-[10px] text-slate-500 font-semibold uppercase">
                                <BarChart3 className="h-3.5 w-3.5 text-emerald-600" />
                                <span>Visual metrics & distributions</span>
                            </div>
                            <div className="flex items-center justify-between text-emerald-600 text-xs font-bold pt-2">
                                <span>Open Graphs</span>
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>
                    </Link>

                    {/* Category 3: Activity Logs */}
                    <Link
                        href={route('departments.logs', department.department_id)}
                        className="group bg-white border border-slate-200 hover:border-amber-400 rounded-3xl p-8 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between h-96 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-8 -mt-8 transition-all group-hover:scale-125 duration-350" />
                        <div>
                            <div className="p-4 rounded-2xl bg-amber-50 text-amber-650 inline-block mb-6 transition-transform group-hover:scale-110">
                                <ListTodo className="h-7 w-7" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                                Activity Logs
                            </h3>
                            <p className="text-slate-500 text-xs leading-relaxed mb-6">
                                View complete historical lists of all leave applications and vehicle bookings for this department.
                            </p>
                        </div>

                        <div>
                            <div className="border-t border-slate-100 pt-4 mb-4 grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3 text-amber-500" />
                                    <span>{kpis.pendingLeaves} Pending Leaves</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Car className="h-3 w-3 text-emerald-500" />
                                    <span>{kpis.pendingVehicles} Pending Trips</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-amber-600 text-xs font-bold pt-2">
                                <span>Open Logs</span>
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
