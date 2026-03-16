"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Loader2, CheckCircle2, Globe, MapPin, Navigation, DollarSign, Clock, Calendar, EyeOff, ChevronDown } from 'lucide-react';

import { useSession } from 'next-auth/react';
import { US_STATES } from '@/app/lib/constants';

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        city: '',
        state: '',
        postcode: '',
        minPay: '',
        payPeriod: 'hour', // 'hour' or 'year'
        currency: 'Rs',
        jobTypes: [] as string[],
        jobTitles: [] as string[]
    });
    const [currentTitle, setCurrentTitle] = useState('');
    const router = useRouter();
    const { data: session, status } = useSession();

    // Redirect if not logged in
    useEffect(() => {
        if (status === 'loading') return;

        // 1. Basic Auth Check
        const hasLocalToken = typeof window !== 'undefined' && !!localStorage.getItem('token');
        if (!hasLocalToken && !session) {
            router.replace('/auth/login');
            return;
        }

        // 2. Unified Pending Guard
        const localUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
        const userRole = (session?.user as any)?.role || localUser?.role;
        const isPending = (session?.user as any)?.status === 'PENDING' || localUser?.status === 'PENDING';
        
        if (isPending) {
            router.replace('/auth/pending');
            return;
        }

        // 3. Role Guard: Businesses skip nurse onboarding
        if (userRole === 'BUSINESS') {
            router.replace('/business/dashboard');
            return;
        }
    }, [status, session, router]);

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const toggleJobType = (type: string) => {
        setFormData(prev => ({
            ...prev,
            jobTypes: prev.jobTypes.includes(type)
                ? prev.jobTypes.filter(t => t !== type)
                : [...prev.jobTypes, type]
        }));
    };

    const addJobTitle = (e: React.KeyboardEvent | React.MouseEvent) => {
        if (e.type === 'keydown' && (e as React.KeyboardEvent).key !== 'Enter') return;
        if (e.type === 'keydown') (e as React.KeyboardEvent).preventDefault();

        const title = currentTitle.trim();
        if (title && !formData.jobTitles.includes(title) && formData.jobTitles.length < 10) {
            setFormData(prev => ({
                ...prev,
                jobTitles: [...prev.jobTitles, title]
            }));
            setCurrentTitle('');
        }
    };

    const removeJobTitle = (title: string) => {
        setFormData(prev => ({
            ...prev,
            jobTitles: prev.jobTitles.filter(t => t !== title)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Combine city and state into location for the backend Profile model
            const submissionData = {
                ...formData,
                location: `${formData.city}, ${formData.state}`,
                country: 'USA'
            };
            
            // API call to complete onboarding
            const response = await api.post('/profile/onboard', submissionData);

            // Update local storage user object
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            user.isOnboarded = true;
            user.profile = response.data.profile;
            localStorage.setItem('user', JSON.stringify(user));

            // Success step
            setStep(5);
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (err) {
            console.error("Onboarding failed:", err);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // --- SUCCESS STEP ---
    if (step === 5) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <CheckCircle2 size={60} strokeWidth={1.5} />
                </div>
                <h1 className="text-4xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">Profile Updated!</h1>
                <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Taking you to your dashboard...</p>
            </div>
        );
    }

    const jobTypeOptions = ["Full-time", "Part-time", "Temporary", "Contract", "Internship", "Fresher"];

    return (
        <div className="min-h-screen bg-white font-sans flex flex-col">
            {/* 🔝 PROGRESS BAR */}
            <div className="w-full h-1 bg-slate-100 sticky top-0 z-50">
                <div
                    className="h-full bg-pink-600 transition-all duration-700 ease-in-out"
                    style={{ width: `${(step / 5) * 100}%` }}
                ></div>
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {Math.round((step / 5) * 100)}% complete
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center pt-24 px-6 max-w-2xl mx-auto w-full">

                {step === 1 && (
                    /* --- STEP 1: LOCATION --- */
                    <>
                        <div className="mb-12 w-full">
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] mb-6">
                                Let us make sure your preferences are up-to-date. <span className="text-pink-600">Where are you located?</span>
                            </h1>
                            <p className="text-slate-500 font-medium text-lg italic">
                                We use this to match you with jobs nearby. Since we support nurses <span className="text-slate-900 font-bold">strictly worldwide</span>, please specify your details below.
                            </p>
                        </div>

                        <form onSubmit={handleNext} className="w-full space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2 group">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 group-focus-within:text-pink-600 transition-colors">City</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-pink-600 transition-colors" size={20} />
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. New York"
                                            className="w-full p-5 pl-12 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-900 outline-none focus:bg-white focus:border-pink-600 transition-all"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 group">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 group-focus-within:text-pink-600 transition-colors">State</label>
                                    <div className="relative">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-pink-600 transition-colors z-10" size={20} />
                                        <select
                                            required
                                            className="w-full p-5 pl-12 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-900 outline-none focus:bg-white focus:border-pink-600 transition-all appearance-none cursor-pointer"
                                            value={formData.state}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        >
                                            <option value="" disabled>Select State</option>
                                            {US_STATES.map((state) => (
                                                <option key={state.value} value={state.value}>
                                                    {state.label}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 group max-w-xs">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 group-focus-within:text-pink-600 transition-colors">Postcode</label>
                                <div className="relative">
                                    <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-pink-600 transition-colors" size={20} />
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. SW1A 1AA"
                                        className="w-full p-5 pl-12 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-900 outline-none focus:bg-white focus:border-pink-600 transition-all"
                                        value={formData.postcode}
                                        onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="pt-10 flex justify-end items-center gap-6 border-t border-slate-100">
                                <button
                                    type="submit"
                                    className="bg-pink-600 hover:bg-pink-700 text-white font-black px-12 py-5 rounded-2xl shadow-2xl shadow-pink-200 transition-all active:scale-95 flex items-center gap-3 group"
                                >
                                    CONTINUE
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/40 transition-colors">
                                        <ChevronDown className="-rotate-90" size={16} />
                                    </div>
                                </button>
                            </div>
                        </form>
                    </>
                )}

                {step === 2 && (
                    /* --- STEP 2: MINIMUM PAY --- */
                    <>
                        <div className="mb-12 w-full">
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] mb-6">
                                What is the minimum pay you are looking for?
                            </h1>
                            <p className="text-slate-500 font-medium text-lg italic">
                                We use this to match you with jobs that pay around and above this amount.
                            </p>
                        </div>

                        <div className="w-full mb-8 p-5 bg-pink-50/50 rounded-2xl flex items-center gap-4 text-pink-600 border border-pink-100/50">
                            <EyeOff size={20} />
                            <span className="text-sm font-bold uppercase tracking-widest">Not shown to employers.</span>
                        </div>

                        <form onSubmit={handleNext} className="w-full space-y-10">
                            {/* PAY AMOUNT */}
                            <div className="space-y-3 group max-w-md">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 group-focus-within:text-pink-600 transition-colors">
                                    Minimum base pay
                                </label>
                                <div className="relative flex items-center">
                                    {/* CURRENCY SELECTOR */}
                                    <select
                                        className="absolute left-4 bg-transparent border-none font-black text-slate-900 outline-none cursor-pointer appearance-none z-10"
                                        value={formData.currency}
                                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                    >
                                        <option value="Rs">Rs</option>
                                        <option value="$">$</option>
                                        <option value="£">£</option>
                                        <option value="€">€</option>
                                    </select>
                                    <input
                                        required
                                        type="number"
                                        placeholder="0"
                                        className="w-full p-5 pl-16 bg-white border-2 border-slate-200 rounded-2xl font-black text-2xl text-slate-900 outline-none focus:border-pink-600 transition-all shadow-sm"
                                        value={formData.minPay}
                                        onChange={(e) => setFormData({ ...formData, minPay: e.target.value })}
                                    />
                                    <div className="absolute right-4 text-slate-300 group-focus-within:text-pink-200 pointer-events-none">
                                        <DollarSign size={24} />
                                    </div>
                                </div>
                            </div>

                            {/* PAY PERIOD */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                                    Pay period
                                </label>
                                <div className="flex flex-wrap gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, payPeriod: 'hour' })}
                                        className={`flex-1 min-w-[140px] p-5 rounded-2xl font-black border-2 transition-all flex flex-col items-center gap-2 ${formData.payPeriod === 'hour'
                                            ? 'bg-pink-50 border-pink-600 text-pink-600'
                                            : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                                            }`}
                                    >
                                        <Clock size={20} />
                                        PER HOUR
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, payPeriod: 'year' })}
                                        className={`flex-1 min-w-[140px] p-5 rounded-2xl font-black border-2 transition-all flex flex-col items-center gap-2 ${formData.payPeriod === 'year'
                                            ? 'bg-pink-50 border-pink-600 text-pink-600'
                                            : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                                            }`}
                                    >
                                        <Calendar size={20} />
                                        PER YEAR
                                    </button>
                                </div>
                            </div>

                            <button type="button" className="text-pink-600 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:underline">
                                Show more pay periods <ChevronDown size={14} />
                            </button>

                            {/* NAVIGATION ACTIONS */}
                            <div className="pt-10 flex justify-between items-center border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="px-8 py-4 text-slate-400 font-black hover:text-slate-900 transition-colors uppercase tracking-widest text-xs"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="bg-pink-600 hover:bg-pink-700 text-white font-black px-12 py-5 rounded-2xl shadow-2xl shadow-pink-200 transition-all active:scale-95 flex items-center gap-3 group"
                                >
                                    CONTINUE
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/40 transition-colors text-white">
                                        <ChevronDown className="-rotate-90" size={16} />
                                    </div>
                                </button>
                            </div>
                        </form>
                    </>
                )}

                {step === 3 && (
                    /* --- STEP 3: JOB TYPES --- */
                    <>
                        <div className="mb-12 w-full">
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] mb-6">
                                What type of job are you interested in?
                            </h1>
                        </div>

                        <div className="w-full space-y-4">
                            <div className="flex flex-col gap-3">
                                {jobTypeOptions.map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => toggleJobType(type)}
                                        className={`w-full p-4 rounded-2xl border-2 font-bold text-left transition-all flex items-center gap-4 ${formData.jobTypes.includes(type)
                                            ? 'bg-pink-600 border-pink-600 text-white'
                                            : 'bg-white border-slate-100 text-slate-900 hover:border-slate-200'
                                            }`}
                                    >
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${formData.jobTypes.includes(type) ? 'border-white' : 'border-slate-200 group-hover:border-slate-300'
                                            }`}>
                                            {formData.jobTypes.includes(type) ? <CheckCircle2 size={14} fill="currentColor" className="text-pink-600" /> : <div className="text-slate-300 font-black text-xl mb-1">+</div>}
                                        </div>
                                        {type}
                                    </button>
                                ))}
                            </div>

                            <div className="pt-10 flex justify-between items-center border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="px-8 py-4 text-slate-400 font-black hover:text-slate-900 transition-colors uppercase tracking-widest text-xs"
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="bg-pink-600 hover:bg-pink-700 text-white font-black px-12 py-5 rounded-2xl shadow-2xl shadow-pink-200 transition-all active:scale-95 flex items-center gap-3 group"
                                >
                                    CONTINUE
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/40 transition-colors text-white">
                                        <ChevronDown className="-rotate-90" size={16} />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {step === 4 && (
                    /* --- STEP 4: JOB TITLES --- */
                    <>
                        <div className="mb-12 w-full">
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] mb-6">
                                What job are you looking for?
                            </h1>
                            <p className="text-slate-500 font-medium text-lg italic mb-2">
                                This helps us show you the most relevant jobs. You can always change this later.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="w-full space-y-8">
                            <div className="space-y-4 group">
                                <div className="flex justify-between items-end">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 group-focus-within:text-pink-600 transition-colors">
                                        Job-title
                                    </label>
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                        {formData.jobTitles.length}/10
                                    </span>
                                </div>
                                <p className="text-xs font-bold text-slate-400 uppercase italic tracking-widest">Add up to 10 job titles</p>

                                <div className="space-y-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="e.g. Registered Nurse"
                                            className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-900 outline-none focus:bg-white focus:border-pink-600 transition-all pr-20"
                                            value={currentTitle}
                                            onChange={(e) => setCurrentTitle(e.target.value)}
                                            onKeyDown={addJobTitle}
                                        />
                                        <button
                                            type="button"
                                            onClick={addJobTitle}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-pink-600 text-white p-2 rounded-xl hover:bg-pink-700 transition-colors shadow-lg shadow-pink-100"
                                        >
                                            <div className="text-xl font-black mb-1 leading-none self-center">+</div>
                                        </button>
                                    </div>

                                    {/* TAGS LIST */}
                                    <div className="flex flex-wrap gap-2">
                                        {formData.jobTitles.map((title) => (
                                            <div
                                                key={title}
                                                className="bg-pink-50 text-pink-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2 border border-pink-100 group/tag hover:bg-pink-100 transition-colors animate-in fade-in zoom-in duration-300"
                                            >
                                                {title}
                                                <button
                                                    type="button"
                                                    onClick={() => removeJobTitle(title)}
                                                    className="text-blue-300 hover:text-pink-600 transition-colors"
                                                >
                                                    <Loader2 className="rotate-45" size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-10 flex justify-between items-center border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="px-8 py-4 text-slate-400 font-black hover:text-slate-900 transition-colors uppercase tracking-widest text-xs"
                                >
                                    Back
                                </button>
                                <button
                                    disabled={loading || formData.jobTitles.length === 0}
                                    type="submit"
                                    className="bg-pink-600 hover:bg-pink-700 disabled:bg-slate-300 text-white font-black px-12 py-5 rounded-2xl shadow-2xl shadow-pink-200 transition-all active:scale-95 flex items-center gap-3 group"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={24} />
                                    ) : (
                                        <>
                                            CONTINUE
                                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/40 transition-colors text-white">
                                                <ChevronDown className="-rotate-90" size={16} />
                                            </div>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </>
                )}

                {/* 📜 FOOTER */}
                <footer className="mt-auto py-12 text-center w-full">
                    <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.3em]">
                        © 2026 NurseFlex • Cookies, Privacy and Terms
                    </p>
                </footer>
            </div>
        </div>
    );
}
