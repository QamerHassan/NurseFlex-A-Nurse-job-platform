"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut } from 'next-auth/react';
import {
  Loader2, Building2, Mail, Lock, Eye, EyeOff,
  ArrowRight, LogOut, User, CheckCircle2, AlertCircle,
  X, Shield, Check
} from 'lucide-react';
import api from '@/lib/api';
import { clearAllUserData } from '@/lib/auth-utils';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────
interface RegisterFormProps {
  initialSession: any;
  initialTiers?: any[]; // kept for compatibility but not used in register flow
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  return (
    <div className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-xl text-white font-semibold text-sm shadow-2xl animate-in slide-in-from-top-4 duration-300 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
      {type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
      {message}
      <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100"><X size={14} /></button>
    </div>
  );
}

// ─── Password strength ────────────────────────────────────────────────────────
function PasswordStrength({ pwd }: { pwd: string }) {
  if (!pwd) return null;
  const checks = [
    pwd.length >= 8,
    /[A-Z]/.test(pwd),
    /[0-9]/.test(pwd),
  ];
  const score = checks.filter(Boolean).length;
  const colors = ['bg-red-400', 'bg-amber-400', 'bg-green-500'];
  const labels = ['Weak', 'Medium', 'Strong'];
  return (
    <div className="space-y-1 mt-1">
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i < score ? colors[score - 1] : 'bg-slate-100'}`} />
        ))}
      </div>
      <p className={`text-[11px] font-semibold ${score === 3 ? 'text-green-600' : score === 2 ? 'text-amber-600' : 'text-red-500'}`}>
        {labels[score - 1] || 'Too short'}
      </p>
    </div>
  );
}

export default function RegisterForm({ initialSession, initialTiers }: RegisterFormProps) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(!!initialSession);

  const [email, setEmail] = useState('');
  const [bizName, setBizName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSignOut = async () => {
    clearAllUserData();
    await signOut({ redirect: false });
    setIsLoggedIn(false);
  };

  const validate = () => {
    if (!bizName.trim()) { showToast('Business name is required.', 'error'); return false; }
    if (!email || !email.includes('@')) { showToast('Enter a valid email address.', 'error'); return false; }
    if (password.length < 8) { showToast('Password must be at least 8 characters.', 'error'); return false; }
    if (password !== confirmPwd) { showToast('Passwords do not match.', 'error'); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // 1. Register business account (free — no tier needed)
      await api.post('/auth/register', {
        name: bizName,
        email: email,
        password: password,
        role: 'BUSINESS',
      });

      // 2. Auto-login
      const loginRes = await api.post('/auth/login', { email, password });
      const { access_token, user } = loginRes.data;

      localStorage.setItem('business_token', access_token);
      localStorage.setItem('business_user', JSON.stringify(user));
      localStorage.setItem('userType', 'business');

      // 3. Sync NextAuth
      await signIn('credentials', { email, password, redirect: false });

      showToast('Account created! Taking you to your dashboard...', 'success');
      setTimeout(() => router.push('/business/dashboard'), 1500);
    } catch (err: any) {
      console.error('Register error:', err);
      showToast(
        err.response?.data?.message || 'Registration failed. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Already logged in ──────────────────────────────────────────────────────
  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-8 max-w-sm w-full text-center space-y-5">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-green-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <User size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">You're already signed in</h2>
            <p className="text-sm text-slate-400 mt-1">{initialSession?.user?.email}</p>
          </div>
          <div className="space-y-3">
            <button onClick={() => router.push('/business/dashboard')}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all">
              Go to Dashboard <ArrowRight size={15} />
            </button>
            <button onClick={handleSignOut}
              className="w-full h-11 border border-slate-200 text-slate-500 rounded-xl font-semibold text-sm hover:bg-slate-50 flex items-center justify-center gap-2 transition-all">
              <LogOut size={14} /> Sign Out & Register New Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Register form ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Top bar */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-blue-600">NurseFlex</Link>
        <p className="text-sm text-slate-400 hidden md:block">Business Registration</p>
        <Link href="/business/login" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
          Already have an account? Sign in →
        </Link>
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-65px)] p-6">
        <div className="w-full max-w-md space-y-6">

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-green-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-3">
              <Building2 size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Create a Business Account</h1>
            <p className="text-sm text-slate-400">
              Register free and post your first job. Upgrade anytime for more.
            </p>
          </div>

          {/* Free badge */}
          <div className="flex items-center justify-center gap-2 py-2.5 px-4 bg-green-50 border border-green-100 rounded-xl">
            <CheckCircle2 size={15} className="text-green-600 shrink-0" />
            <p className="text-sm font-semibold text-green-700">
              Free to register · 1 free job post included
            </p>
          </div>

          {/* Form card */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">

            {/* Business name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Business / Hospital Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Building2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text" value={bizName} onChange={e => setBizName(e.target.value)}
                  placeholder="e.g. Mayo Clinic"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white outline-none text-sm font-medium text-slate-900 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Work Email <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="hr@yourcompany.com"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white outline-none text-sm font-medium text-slate-900 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white outline-none text-sm font-medium text-slate-900 transition-all"
                />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors">
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <PasswordStrength pwd={password} />
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Confirm Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white outline-none text-sm font-medium text-slate-900 transition-all"
                />
              </div>
              {confirmPwd && (
                <p className={`text-[11px] font-semibold flex items-center gap-1 ${password === confirmPwd ? 'text-green-600' : 'text-red-500'}`}>
                  {password === confirmPwd
                    ? <><CheckCircle2 size={11} />Passwords match</>
                    : <><AlertCircle size={11} />Passwords do not match</>
                  }
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-11 mt-2 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-70"
            >
              {loading
                ? <><Loader2 size={15} className="animate-spin" />Creating Account...</>
                : <>Create Free Account <ArrowRight size={15} /></>
              }
            </button>
          </div>

          {/* What happens next */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">What happens next</p>
            {[
              { num: '1', text: 'Your account is created instantly — no payment needed' },
              { num: '2', text: 'Post your first job for free right away' },
              { num: '3', text: 'Need more posts? Upgrade to a plan from your dashboard' },
            ].map(s => (
              <div key={s.num} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-green-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">
                  {s.num}
                </div>
                <p className="text-sm text-slate-600">{s.text}</p>
              </div>
            ))}
          </div>

          {/* Trust */}
          <div className="flex items-center justify-center gap-5 flex-wrap">
            {[
              { icon: Shield, label: 'Secure & Encrypted', color: 'text-blue-500' },
              { icon: CheckCircle2, label: 'No credit card needed', color: 'text-green-500' },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <b.icon size={13} className={b.color} />{b.label}
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-slate-400">
            By registering you agree to our{' '}
            <Link href="/terms" className="text-blue-600 hover:underline">Terms</Link> &{' '}
            <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}