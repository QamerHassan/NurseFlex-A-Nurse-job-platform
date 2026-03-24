"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Loader2, Mail, Lock, Eye, EyeOff, Building2, AlertCircle, X, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
    return (
        <div className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-xl text-white font-semibold text-sm shadow-2xl animate-in slide-in-from-top-4 duration-300 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {message}
            <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100"><X size={14} /></button>
        </div>
    );
}

interface LoginFormProps {
    callbackUrl: string;
}

export default function LoginForm({ callbackUrl }: LoginFormProps) {
    const router  = useRouter();
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [showPwd, setShowPwd]   = useState(false);
    const [loading, setLoading]   = useState(false);
    const [toast, setToast]       = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) { showToast('Email and password are required.'); return; }

        setLoading(true);
        try {
            const res = await api.post('/auth/login', { email, password });
            const { access_token, user } = res.data;

            localStorage.setItem('business_token', access_token);
            localStorage.setItem('business_user', JSON.stringify(user));
            localStorage.setItem('userType', 'business');

            await signIn('credentials', { email, password, redirect: false });

            showToast('Signed in! Redirecting...', 'success');
            setTimeout(() => { router.push(callbackUrl); router.refresh(); }, 1000);
        } catch (err: any) {
            console.error('Login error:', err);
            showToast(err.response?.data?.message || 'Login failed. Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Top bar */}
            <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                <Link href="/" className="text-lg font-bold text-blue-600">NurseFlex</Link>
                <p className="text-sm text-slate-400 hidden md:block">Business Portal</p>
                <Link href="/business/register" className="text-sm font-semibold text-green-600 hover:text-green-700">
                    New business? Register free →
                </Link>
            </div>

            <div className="flex items-center justify-center min-h-[calc(100vh-65px)] p-6">
                <div className="w-full max-w-sm space-y-5">

                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-green-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-3">
                            <Building2 size={24} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Business Sign In</h1>
                        <p className="text-sm text-slate-400">Sign in to manage your jobs and applicants.</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Email</label>
                            <div className="relative">
                                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <input
                                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                                    placeholder="hr@yourcompany.com" required
                                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white outline-none text-sm font-medium text-slate-900 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Password</label>
                                <Link href="/auth/forgot-password" className="text-[11px] text-blue-600 hover:underline font-medium">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <input
                                    type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                                    placeholder="Your password" required
                                    className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white outline-none text-sm font-medium text-slate-900 transition-all"
                                />
                                <button type="button" onClick={() => setShowPwd(v => !v)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors">
                                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full h-11 mt-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-70">
                            {loading ? <><Loader2 size={15} className="animate-spin" />Signing in...</> : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-400">
                        Don't have an account?{' '}
                        <Link href="/business/register" className="text-blue-600 font-semibold hover:underline">
                            Register free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
