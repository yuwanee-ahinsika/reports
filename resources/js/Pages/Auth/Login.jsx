import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { TrendingUp, Lock, Mail } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 md:p-12 font-sans relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-indigo-200/20 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-violet-200/20 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2" />

            <Head title="Log in" />

            <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-xl p-8 relative z-10">
                {/* Brand Logo Header */}
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20 mb-4">
                        <TrendingUp className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        Explores Reports
                    </h2>
                    <p className="text-slate-500 text-xs mt-1">Sign in to your account to view reports</p>
                </div>

                {status && (
                    <div className="mb-5 p-3 bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 rounded-xl text-center">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5">
                    {/* Email Input */}
                    <div>
                        <InputLabel htmlFor="email" value="Email Address" className="text-slate-700 text-xs font-bold mb-1.5" />
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                                <Mail className="h-4 w-4" />
                            </span>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="block w-full pl-10 bg-slate-50 border-slate-200 focus:bg-white text-slate-800 text-xs rounded-xl py-2.5"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="name@example.com"
                            />
                        </div>
                        <InputError message={errors.email} className="mt-2 text-xs" />
                    </div>

                    {/* Password Input */}
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <InputLabel htmlFor="password" value="Password" className="text-slate-700 text-xs font-bold" />
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold focus:outline-none transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                                <Lock className="h-4 w-4" />
                            </span>
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="block w-full pl-10 bg-slate-50 border-slate-200 focus:bg-white text-slate-800 text-xs rounded-xl py-2.5"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>
                        <InputError message={errors.password} className="mt-2 text-xs" />
                    </div>

                    {/* Remember Me Checkbox */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center cursor-pointer">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-200"
                            />
                            <span className="ms-2 text-xs text-slate-500 select-none">
                                Remember me
                            </span>
                        </label>
                    </div>

                    {/* Sign In Button */}
                    <div className="pt-2">
                        <PrimaryButton 
                            className="w-full justify-center py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:from-indigo-800 active:to-violet-800 text-white rounded-xl shadow-lg shadow-indigo-600/10 font-bold transition-all focus:ring-indigo-500 text-xs" 
                            disabled={processing}
                        >
                            {processing ? 'Signing In...' : 'Sign In'}
                        </PrimaryButton>
                    </div>
                </form>

                {/* Additional footer (Optional link to register) */}
                <div className="text-center mt-6 pt-6 border-t border-slate-100">
                    <p className="text-slate-500 text-xs">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">
                            Register now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
