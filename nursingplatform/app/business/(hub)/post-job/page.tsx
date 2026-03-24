"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import {
    Zap, ArrowRight, ClipboardList, DollarSign,
    MapPin, AlertCircle, CheckCircle2, Loader2,
    Info, Briefcase, ChevronDown, Users, Star, Lock, Calendar
} from 'lucide-react';

import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/app/components/ui/select";

// ─── Constants ────────────────────────────────────────────────────────────────
const DEPARTMENTS = [
    'Intensive Care Unit (ICU)', 'Emergency Room (ER)', 'Pediatrics',
    'General Ward', 'Operating Theatre', 'Oncology', 'Cardiology',
    'Neurology', 'Maternity / Labor & Delivery', 'Rehabilitation',
];

const SHIFT_TYPES = ['Morning (7am – 3pm)', 'Evening (3pm – 11pm)', 'Night (11pm – 7am)', 'Rotating Shifts', 'Per Diem / PRN'];
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Per Diem'];

// ─── Step dot ─────────────────────────────────────────────────────────────────
function StepDot({ num, label, active, done }: { num: number; label: string; active: boolean; done: boolean }) {
    return (
        <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${done ? 'bg-green-500 text-white' : active ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-slate-100 text-slate-400'}`}>
                {done ? <CheckCircle2 size={13} /> : num}
            </div>
            <span className={`text-xs font-semibold hidden sm:block ${active ? 'text-blue-600' : done ? 'text-green-600' : 'text-slate-400'}`}>{label}</span>
        </div>
    );
}

// ─── Job Limit Blocked Screen ─────────────────────────────────────────────────
function JobLimitBlocked() {
    const router = useRouter();
    return (
        <div className="max-w-lg mx-auto text-center space-y-6 py-12 font-sans">
            <div className="w-16 h-16 bg-amber-50 border-2 border-amber-200 rounded-2xl flex items-center justify-center mx-auto">
                <Lock size={28} className="text-amber-500" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-900">You've reached your free job post limit</h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                    Your free account includes 1 job post. Upgrade to a plan to post more jobs and reach more nurses.
                </p>
            </div>

            {/* Benefits */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 text-left space-y-3 shadow-sm">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">What you get with a plan</p>
                {[
                    'Post multiple jobs at the same time',
                    'Access to 12,600+ verified nurses',
                    'Priority listing in search results',
                    'Direct applicant management',
                ].map(b => (
                    <div key={b} className="flex items-center gap-2.5">
                        <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                        <p className="text-sm text-slate-600">{b}</p>
                    </div>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={() => router.push('/business/subscriptions?reason=job-limit')}
                    className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all">
                    <Zap size={15} className="fill-white text-white" /> View Plans & Pricing
                </button>
                <button
                    onClick={() => router.push('/business/dashboard')}
                    className="flex-1 h-11 border border-slate-200 text-slate-500 hover:bg-slate-50 font-semibold text-sm rounded-xl transition-all">
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function PostJobPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [blocked, setBlocked] = useState(false); // job limit reached

    const [form, setForm] = useState({
        title: '', department: 'Intensive Care Unit (ICU)', salary: '',
        date: '', shiftType: 'Morning (7am – 3pm)', jobType: 'Full-time',
        location: '', experience: '', description: '', requirements: '',
    });

    const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm(p => ({ ...p, [field]: e.target.value }));

    const setSelect = (field: string) => (val: string) =>
        setForm(p => ({ ...p, [field]: val }));

    // ── Validation ─────────────────────────────────────────────────────────────
    const validateStep1 = () => {
        if (!form.title.trim()) { setError('Job title is required.'); return false; }
        if (!form.salary.trim()) { setError('Salary is required.'); return false; }
        if (!form.date) { setError('Start date is required.'); return false; }
        if (!form.location.trim()) { setError('Location is required.'); return false; }
        setError(''); return true;
    };

    const validateStep2 = () => {
        if (!form.description.trim()) { setError('Job description is required.'); return false; }
        setError(''); return true;
    };

    const goNext = () => {
        if (step === 1 && !validateStep1()) return;
        if (step === 2 && !validateStep2()) return;
        setStep(s => s + 1);
    };

    // ── Submit ─────────────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            await api.post('/jobs', {
                title: form.title,
                description: `${form.department} | ${form.shiftType} | ${form.jobType}\n\nDescription:\n${form.description}\n\nRequirements:\n${form.requirements}`,
                salary: form.salary,
                type: form.jobType,
                location: form.location,
                department: form.department,
                shiftType: form.shiftType,
                experience: form.experience,
                date: form.date,
            });
            // Success → go to dashboard
            router.push('/business/dashboard');
        } catch (err: any) {
            console.error('Post job error:', err);

            // ── 403 = subscription limit reached → show upgrade screen ──
            if (err?.response?.status === 403) {
                setBlocked(true);
                return;
            }

            setError(err.response?.data?.message || 'Failed to post job. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ── Job limit blocked screen ───────────────────────────────────────────────
    if (blocked) return <JobLimitBlocked />;

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="max-w-2xl mx-auto space-y-5 pb-10 font-sans">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Post a Job</h1>
                    <p className="text-sm text-slate-400 mt-0.5">Find the right nurse for your facility.</p>
                </div>
            </div>

            {/* Steps */}
            <div className="flex items-center gap-2">
                <StepDot num={1} label="Job Details" active={step === 1} done={step > 1} />
                <div className={`flex-1 h-0.5 rounded-full transition-all ${step > 1 ? 'bg-green-400' : 'bg-slate-100'}`} />
                <StepDot num={2} label="Description" active={step === 2} done={step > 2} />
                <div className={`flex-1 h-0.5 rounded-full transition-all ${step > 2 ? 'bg-green-400' : 'bg-slate-100'}`} />
                <StepDot num={3} label="Review & Post" active={step === 3} done={false} />
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-start gap-2.5 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
                    <AlertCircle size={15} className="shrink-0 mt-0.5" />
                    {error}
                </div>
            )}

            {/* ════ STEP 1 ════ */}
            {step === 1 && (
                <div className="space-y-4">
                    <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-green-600 p-5 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
                        <div className="relative z-10 flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <Briefcase size={18} className="text-white" />
                            </div>
                            <div>
                                <p className="font-semibold">Step 1 — Job Details</p>
                                <p className="text-white/70 text-xs">Basic info about the position</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
                        <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                            {/* Job Title */}
                            <div className="space-y-1">
                                <Label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Job Title <span className="text-red-400">*</span></Label>
                                <input
                                    value={form.title} onChange={set('title')}
                                    placeholder="e.g. Senior ICU Nurse"
                                    className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-700 placeholder:text-slate-300 py-1 block"
                                />
                                <div className="h-px bg-slate-100" />
                            </div>
                            {/* Department */}
                            <div className="space-y-1">
                                <Label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Department</Label>
                                <Select value={form.department} onValueChange={setSelect('department')}>
                                    <SelectTrigger className="w-full bg-transparent border-none shadow-none outline-none text-sm font-medium text-slate-700 px-0 h-7 focus:ring-0">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border border-slate-200 shadow-2xl bg-white z-[200]">
                                        {DEPARTMENTS.map(d => <SelectItem key={d} value={d} className="text-sm text-slate-700 focus:bg-blue-50 focus:text-blue-700">{d}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <div className="h-px bg-slate-100" />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-x-8 gap-y-6">
                            {/* Salary */}
                            <div className="space-y-1">
                                <Label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Salary ($/hr) <span className="text-red-400">*</span></Label>
                                <input
                                    value={form.salary} onChange={set('salary')}
                                    placeholder="45.00"
                                    className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-700 placeholder:text-slate-300 py-1 block"
                                />
                                <div className="h-px bg-slate-100" />
                            </div>
                            {/* Date */}
                            <div className="space-y-1">
                                <Label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Start Date <span className="text-red-400">*</span></Label>
                                <div className="relative">
                                    <input
                                        type="date" value={form.date} onChange={set('date')}
                                        className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-700 py-1 block appearance-none [color-scheme:light] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                    />
                                    <Calendar
                                        size={14}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
                                    />
                                </div>
                                <div className="h-px bg-slate-100" />
                            </div>
                            {/* Job Type */}
                            <div className="space-y-1">
                                <Label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Job Type</Label>
                                <Select value={form.jobType} onValueChange={setSelect('jobType')}>
                                    <SelectTrigger className="w-full bg-transparent border-none shadow-none outline-none text-sm font-medium text-slate-700 px-0 h-7 focus:ring-0">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border border-slate-200 shadow-2xl bg-white z-[200]">
                                        {JOB_TYPES.map(t => <SelectItem key={t} value={t} className="text-sm text-slate-700 focus:bg-blue-50 focus:text-blue-700">{t}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <div className="h-px bg-slate-100" />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-x-8 gap-y-6">
                            {/* Shift */}
                            <div className="space-y-1">
                                <Label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Shift</Label>
                                <Select value={form.shiftType} onValueChange={setSelect('shiftType')}>
                                    <SelectTrigger className="w-full bg-transparent border-none shadow-none outline-none text-sm font-medium text-slate-700 px-0 h-7 focus:ring-0">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border border-slate-200 shadow-2xl bg-white z-[200]">
                                        {SHIFT_TYPES.map(s => <SelectItem key={s} value={s} className="text-sm text-slate-700 focus:bg-green-50 focus:text-green-700">{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <div className="h-px bg-slate-100" />
                            </div>
                            {/* Location */}
                            <div className="space-y-1">
                                <Label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Location <span className="text-red-400">*</span></Label>
                                <input
                                    value={form.location} onChange={set('location')}
                                    placeholder="e.g. Dallas, TX"
                                    className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-700 placeholder:text-slate-300 py-1 block"
                                />
                                <div className="h-px bg-slate-100" />
                            </div>
                            {/* Experience */}
                            <div className="space-y-1">
                                <Label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Experience</Label>
                                <input
                                    value={form.experience} onChange={set('experience')}
                                    placeholder="e.g. 2+ years ICU"
                                    className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-700 placeholder:text-slate-300 py-1 block"
                                />
                                <div className="h-px bg-slate-100" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <button onClick={() => router.back()}
                            className="h-10 px-5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 text-sm font-medium transition-all">
                            Cancel
                        </button>
                        <button onClick={goNext}
                            className="h-10 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold text-sm flex items-center gap-2 shadow-md transition-all">
                            Continue <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            )}

            {/* ════ STEP 2 ════ */}
            {step === 2 && (
                <div className="space-y-4">
                    <div className="rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 p-5 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
                        <div className="relative z-10 flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <ClipboardList size={18} className="text-white" />
                            </div>
                            <div>
                                <p className="font-semibold">Step 2 — Description</p>
                                <p className="text-white/70 text-xs">Tell nurses what the role involves</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
                        <div className="space-y-1">
                            <Label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Job Description <span className="text-red-400">*</span></Label>
                            <textarea
                                rows={5} value={form.description}
                                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                                placeholder="Describe the role, responsibilities, and daily duties..."
                                className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-700 placeholder:text-slate-300 resize-none leading-relaxed py-1 block"
                            />
                            <div className="h-px bg-slate-100" />
                            <p className="text-[11px] text-slate-300">{form.description.length} characters</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Requirements</Label>
                            <textarea
                                rows={3} value={form.requirements}
                                onChange={e => setForm(p => ({ ...p, requirements: e.target.value }))}
                                placeholder="Certifications, licenses, experience needed..."
                                className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-700 placeholder:text-slate-300 resize-none leading-relaxed py-1 block"
                            />
                            <div className="h-px bg-slate-100" />
                        </div>
                        <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-100 rounded-xl">
                            <Zap size={14} className="text-amber-500 fill-amber-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-700 leading-relaxed">
                                This job will be visible to all <strong>12,600+</strong> verified nurses on NurseFlex.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <button onClick={() => setStep(1)}
                            className="h-10 px-5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 text-sm font-medium transition-all">
                            ← Back
                        </button>
                        <button onClick={goNext}
                            className="h-10 px-6 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold text-sm flex items-center gap-2 shadow-md transition-all">
                            Preview <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            )}

            {/* ════ STEP 3 — REVIEW ════ */}
            {step === 3 && (
                <div className="space-y-4">
                    <div className="rounded-2xl bg-slate-900 p-5 text-white relative overflow-hidden">
                        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-500 to-green-500" />
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                <Star size={18} className="text-white" />
                            </div>
                            <div>
                                <p className="font-semibold">Step 3 — Review & Post</p>
                                <p className="text-white/60 text-xs">Check before going live</p>
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                        <div className="p-5 border-b border-slate-50 bg-gradient-to-r from-blue-600 to-green-600 text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-bold text-lg">
                                    {form.title[0]?.toUpperCase() || 'J'}
                                </div>
                                <div>
                                    <p className="font-semibold">{form.title}</p>
                                    <p className="text-white/70 text-xs">{form.department}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-3">
                            {[
                                { icon: DollarSign, label: 'Pay', value: `$${form.salary}/hr`, color: 'text-green-600', bg: 'bg-green-50' },
                                { icon: Briefcase, label: 'Type', value: form.jobType, color: 'text-blue-600', bg: 'bg-blue-50' },
                                { icon: MapPin, label: 'Location', value: form.location, color: 'text-green-600', bg: 'bg-green-50' },
                                { icon: Info, label: 'Date', value: form.date || 'TBD', color: 'text-blue-600', bg: 'bg-blue-50' },
                                { icon: Users, label: 'Experience', value: form.experience || 'Open', color: 'text-green-600', bg: 'bg-green-50' },
                                { icon: ClipboardList, label: 'Shift', value: form.shiftType, color: 'text-blue-600', bg: 'bg-blue-50' },
                            ].map((d, i) => (
                                <div key={i} className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl">
                                    <div className={`w-7 h-7 ${d.bg} rounded-lg flex items-center justify-center shrink-0`}>
                                        <d.icon size={13} className={d.color} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400">{d.label}</p>
                                        <p className="text-xs font-semibold text-slate-800 truncate">{d.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {form.description && (
                            <div className="px-5 pb-5">
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Description</p>
                                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">{form.description}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between">
                        <button onClick={() => setStep(2)} disabled={loading}
                            className="h-10 px-5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 text-sm font-medium transition-all disabled:opacity-50">
                            ← Edit
                        </button>
                        <button onClick={handleSubmit} disabled={loading}
                            className="h-10 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold text-sm flex items-center gap-2 shadow-lg disabled:opacity-60 transition-all">
                            {loading
                                ? <><Loader2 size={14} className="animate-spin" />Posting...</>
                                : <><Zap size={14} className="fill-white text-white" />Post Job Now</>
                            }
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}