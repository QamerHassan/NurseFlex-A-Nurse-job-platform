'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, X, User, Mail, Phone, MapPin, Globe, CheckCircle2, ArrowLeft, ChevronRight, AlertCircle } from 'lucide-react';
import api from '@/lib/api';

export default function ContactInfoPage() {
    const { id } = useParams();
    const router  = useRouter();
    const [job, setJob]               = useState<any>(null);
    const [loading, setLoading]       = useState(true);
    const [isSaving, setIsSaving]     = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);

    const [form, setForm] = useState({
        firstName: '', lastName: '', email: '', phone: '', city: '', province: ''
    });

    useEffect(() => {
        const init = async () => {
            try {
                const [jobsRes, profileRes] = await Promise.allSettled([
                    api.get('/jobs'),
                    api.get('/profile'),
                ]);

                if (jobsRes.status === 'fulfilled') {
                    const found = jobsRes.value.data.find((j: any) => j.id === id);
                    setJob(found || null);
                }

                // Pre-fill form
                const saved = JSON.parse(localStorage.getItem('applicationContactData') || '{}');
                const localUser = JSON.parse(localStorage.getItem('user') || '{}');
                const p = profileRes.status === 'fulfilled' ? profileRes.value.data : {};

                const fullName = p.name || p.user?.name || localUser.name || '';
                const parts    = fullName.trim().split(/\s+/);
                const locParts = (p.location || '').split(',').map((s: string) => s.trim());

                setForm({
                    firstName: saved.firstName || parts[0] || '',
                    lastName:  saved.lastName  || (parts.length > 1 ? parts.slice(1).join(' ') : ''),
                    email:     saved.email     || p.user?.email || localUser.email || '',
                    phone:     saved.phone     || p.phone || '',
                    city:      saved.city      || locParts[0] || '',
                    province:  saved.province  || (locParts[1] || ''),
                });
            } catch (err) {
                console.error('ContactInfo fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [id]);

    // Auto-save
    useEffect(() => {
        if (!loading) localStorage.setItem('applicationContactData', JSON.stringify(form));
    }, [form, loading]);

    const handleContinue = () => {
        setIsSaving(true);
        localStorage.setItem('applicationContactData', JSON.stringify(form));
        setTimeout(() => router.push(`/jobs/${id}/apply`), 600);
    };

    const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(p => ({ ...p, [field]: e.target.value }));

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={36} />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Top bar */}
            <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors">
                    <ArrowLeft size={16} /> Back
                </button>
                <p className="text-sm font-semibold text-slate-500">Step 1 of 4</p>
                <button onClick={() => setShowSaveModal(true)} className="text-sm font-semibold text-blue-600 hover:underline">
                    Save & close
                </button>
            </div>

            <div className="max-w-xl mx-auto px-4 py-8 space-y-5">
                {/* Job card */}
                {job && (
                    <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {job.title[0]?.toUpperCase()}
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900 text-sm">{job.title}</p>
                            <p className="text-xs text-slate-400">{job.hospital} · {job.location}</p>
                        </div>
                    </div>
                )}

                {/* Progress */}
                <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                        <span>Progress</span><span>25%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full w-1/4 bg-gradient-to-r from-blue-600 to-green-500 rounded-full transition-all duration-700" />
                    </div>
                </div>

                {/* Form card */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Contact Information</h1>
                        <p className="text-sm text-slate-400 mt-0.5">This info will be shared with the employer if they proceed.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'First name', key: 'firstName', icon: User,  type: 'text' },
                            { label: 'Last name',  key: 'lastName',  icon: User,  type: 'text' },
                        ].map(f => (
                            <div key={f.key} className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{f.label}</label>
                                <div className="relative">
                                    <f.icon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    <input type={f.type} value={(form as any)[f.key]} onChange={set(f.key)}
                                        className="w-full h-10 pl-8 pr-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white outline-none text-sm font-medium text-slate-900 transition-all" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {[
                        { label: 'Email address',      key: 'email',    icon: Mail,  type: 'email', note: 'Only shown to employer after you apply.' },
                        { label: 'Phone (optional)',   key: 'phone',    icon: Phone, type: 'tel',   note: '' },
                    ].map(f => (
                        <div key={f.key} className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{f.label}</label>
                            <div className="relative">
                                <f.icon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <input type={f.type} value={(form as any)[f.key]} onChange={set(f.key)}
                                    className="w-full h-10 pl-8 pr-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white outline-none text-sm font-medium text-slate-900 transition-all" />
                            </div>
                            {f.note && <p className="text-[11px] text-slate-400">{f.note}</p>}
                        </div>
                    ))}

                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'City',             key: 'city',     icon: MapPin, type: 'text' },
                            { label: 'State / Province', key: 'province', icon: Globe,  type: 'text' },
                        ].map(f => (
                            <div key={f.key} className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{f.label}</label>
                                <div className="relative">
                                    <f.icon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    <input type={f.type} value={(form as any)[f.key]} onChange={set(f.key)}
                                        className="w-full h-10 pl-8 pr-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-green-500 focus:bg-white outline-none text-sm font-medium text-slate-900 transition-all" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button onClick={handleContinue} disabled={isSaving}
                        className="w-full h-11 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-70 mt-2">
                        {isSaving ? <><Loader2 size={15} className="animate-spin" />Saving...</> : 'Save & Continue →'}
                    </button>

                    <p className="text-center text-[10px] text-slate-400">
                        By continuing you agree to NurseFlex's Terms of Service.
                    </p>
                </div>
            </div>

            {/* Save modal */}
            {showSaveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-7 max-w-sm w-full shadow-2xl space-y-5 relative">
                        <button onClick={() => setShowSaveModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X size={20} /></button>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Save progress before leaving?</h3>
                            <p className="text-sm text-slate-400 mt-1">You can finish this application anytime within 14 days.</p>
                        </div>
                        <div className="space-y-3">
                            <button onClick={() => router.push('/dashboard')}
                                className="w-full h-11 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold text-sm transition-all">
                                Save & Exit
                            </button>
                            <button onClick={() => router.push('/dashboard')}
                                className="w-full h-11 border border-slate-200 text-slate-600 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-all">
                                Don't Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
