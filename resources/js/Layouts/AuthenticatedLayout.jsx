import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { 
    LayoutDashboard, 
    Building2, 
    ChevronRight, 
    Search, 
    Menu, 
    X, 
    User,
    LogOut,
    TrendingUp,
    Boxes,
    Info
} from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const departments = usePage().props.departments || [];
    
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [deptSearch, setDeptSearch] = useState('');

    // Filter departments based on search query
    const filteredDepts = departments.filter(dept => 
        dept.name.toLowerCase().includes(deptSearch.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
            {/* Top Navigation Bar */}
            <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
                <div className="max-w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex items-center gap-3">
                            {/* Toggle Sidebar Button */}
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
                                title="Toggle Sidebar"
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                            
                            <Link href="/dashboard" className="flex items-center gap-2">
                                <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-650 to-violet-700 tracking-tight">
                                    Explores Reports
                                </span>
                            </Link>
                        </div>

                        {/* Right Top Nav (User Profile Dropdown) */}
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className="flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-sm font-medium border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition duration-150 ease-in-out focus:outline-none text-slate-700 shadow-sm"
                                        >
                                            <div className="h-5 w-5 rounded-full bg-indigo-550/10 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase border border-indigo-550/20">
                                                {user.name[0]}
                                            </div>
                                            <span className="hidden md:inline">{user.name}</span>
                                            <svg
                                                className="h-4 w-4 text-slate-400"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')} className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-slate-555" />
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="flex items-center gap-2 w-full text-left"
                                        >
                                            <LogOut className="h-4 w-4 text-red-500" />
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex flex-1 relative overflow-hidden">
                {/* Sidebar Navigation (Light theme) */}
                <aside 
                    className={`fixed inset-y-16 left-0 z-30 w-64 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out transform ${
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:relative lg:translate-x-0 flex flex-col`}
                >
                    {/* Sidebar Header */}
                    <div className="p-4 border-b border-slate-100">
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search className="h-4 w-4 text-slate-400" />
                            </span>
                            <input
                                type="text"
                                value={deptSearch}
                                onChange={(e) => setDeptSearch(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs placeholder-slate-400 text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                                placeholder="Search departments..."
                            />
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                        {['admin', 'hod', 'hr-executive', 'inventory manager'].includes(user?.role?.toLowerCase()) ? (
                            <>
                                <Link
                                    href={route('dashboard')}
                                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                                        route().current('dashboard')
                                            ? 'bg-indigo-50 border-l-2 border-indigo-600 text-indigo-700'
                                            : 'text-slate-650 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <LayoutDashboard className="h-4 w-4" />
                                        <span>Dashboard</span>
                                    </div>
                                    <ChevronRight className="h-3 w-3 opacity-60" />
                                </Link>

                                <Link
                                    href={route('reports.inventory')}
                                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                                        route().current('reports.inventory')
                                            ? 'bg-indigo-50 border-l-2 border-indigo-600 text-indigo-700 font-semibold pl-2.5'
                                            : 'text-slate-650 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Boxes className="h-4 w-4" />
                                        <span>Inventory Reports</span>
                                    </div>
                                    <ChevronRight className="h-3 w-3 opacity-60" />
                                </Link>

                                <div className="pt-4 pb-2 px-3">
                                    <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Departments</span>
                                </div>

                                {filteredDepts.length > 0 ? (
                                    filteredDepts.map((dept) => {
                                        const isCurrent = route().current('departments.report') && 
                                            parseInt(route().params.id) === dept.department_id;
                                        
                                        return (
                                            <Link
                                                key={dept.department_id}
                                                href={route('departments.report', dept.department_id)}
                                                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all ${
                                                    isCurrent
                                                        ? 'bg-indigo-50/70 border-l-2 border-indigo-600 text-indigo-700 font-semibold pl-2.5'
                                                        : 'text-slate-650 hover:text-slate-900 hover:bg-slate-50'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2.5 truncate">
                                                    <Building2 className={`h-4 w-4 shrink-0 ${isCurrent ? 'text-indigo-600' : 'text-slate-400'}`} />
                                                    <span className="truncate">{dept.name}</span>
                                                </div>
                                                <ChevronRight className="h-3 w-3 opacity-40 shrink-0" />
                                            </Link>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-6 text-slate-400 text-xs">
                                        No departments found
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="p-4 text-center text-slate-400 text-xs bg-slate-50 border border-slate-200/60 rounded-xl mt-4">
                                <p className="font-semibold text-slate-500 mb-1">Access Restricted</p>
                                <p className="text-[10px] text-slate-400">Reports and analytics pages are restricted to higher management only.</p>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div 
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-slate-900/20 z-20 lg:hidden"
                    />
                )}

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col overflow-y-auto bg-slate-50">
                    {header && (
                        <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
                            <div className="max-w-7xl mx-auto">
                                {header}
                            </div>
                        </header>
                    )}
                    
                    <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
                        {/* Notice Banner */}
                        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-100/50 shadow-sm flex items-start sm:items-center gap-3.5 backdrop-blur-sm">
                            <div className="p-2 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-650 text-white shadow-md shadow-indigo-550/20 shrink-0">
                                <Info className="h-4 w-4" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold text-indigo-950 uppercase tracking-wider">Automatic Report System</h4>
                                <p className="text-xs text-slate-650 mt-0.5 leading-relaxed font-medium">
                                    When new data is added to the database, it is automatically included in the reports.
                                </p>
                            </div>
                        </div>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
