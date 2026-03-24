"use client";
import React, { useEffect, useState } from 'react';
import {
    Loader2, Check, Zap, ShieldCheck,
    ArrowRight, Target, Globe, Cpu,
    AlertCircle, CheckCircle2, Crown
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { Skeleton } from "@/app/components/ui/skeleton";

export default function SubscriptionsPage() {
    const router       = useRouter();
    const searchParams = useSearchParams();
    const fromJobLimit = searchParams.get('reason') === 'job-limit'; // came from post-job block

    const [plans, setPlans]       = useState<any[]>([]);
    const [currentSub, setCurrentSub] = useState<any>(null);
    const [loading, setLoading]   = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                const [tiersRes, subRes] = await Promise.allSettled([
                    api.get('/tiers'),
                    api.get('/subscriptions/my'),
                ]);
                if (tiersRes.status === 'fulfilled') setPlans(Array.isArray(tiersRes.value.data) ? tiersRes.value.data : []);
                if (subRes.status === 'fulfilled')   setCurrentSub(subRes.value.data || null);
            } catch (err) {
                console.error('Subscriptions fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const handleSelectPlan = (tierId: string, isCurrent: boolean) => {
        if (isCurrent) return;
        router.push(`/business/checkout?tierId=${tierId}`);
    };

    // ── Loading ────────────────────────────────────────────────────────────────
    if (loading) return (
        <div className="space-y-6 font-sans">
            <Skeleton className="h-8 w-48" />
            <div className="grid md:grid-cols-3 gap-5">
                {[1,2,3].map(i => <Skeleton key={i} className="h-80 rounded-2xl" />)}
            </div>
        </div>
    );

    return (
        <div className="space-y-6 pb-10 font-sans">

            {/* ── Banner shown when redirected from post-job limit ── */}
            {fromJobLimit && (
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                    <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-amber-800 text-sm">You've used your free job post</p>
                        <p className="text-xs text-amber-600 mt-0.5">
                            Upgrade to a plan below to post more jobs and access all features.
                        </p>
                    </div>
                </div>
            )}

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Plans & Pricing</h1>
                    <p className="text-sm text-slate-400 mt-0.5">
                        Choose a plan to post more jobs and hire faster.
                    </p>
                </div>
                {currentSub && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-100 rounded-xl self-start">
                        <ShieldCheck size={15} className="text-green-600" />
                        <span className="text-sm font-semibold text-green-700">
                            Active: {currentSub.tier?.name || 'Plan'}
                        </span>
                    </div>
                )}
            </div>

            {/* ── Plans grid ── */}
            {plans.length === 0 ? (
                <div className="py-20 text-center bg-white border border-dashed border-slate-200 rounded-2xl">
                    <p className="text-slate-400 font-medium">No plans available right now.</p>
                    <p className="text-xs text-slate-400 mt-1">Contact us for custom pricing.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {plans.map((plan, idx) => {
                        const isCurrent = currentSub?.tierId === plan.id || currentSub?.tier?.id === plan.id;
                        const isPopular = plan.isPopular;
                        const perks     = plan.features || plan.perks || [];

                        return (
                            <div key={plan.id}
                                className={`relative bg-white border-2 rounded-2xl overflow-hidden flex flex-col transition-all hover:shadow-md ${
                                    isCurrent  ? 'border-green-400 shadow-md shadow-green-50' :
                                    isPopular  ? 'border-blue-500 shadow-lg shadow-blue-50 scale-[1.02]' :
                                    'border-slate-100 hover:border-slate-200'
                                }`}>

                                {/* Popular / Current badge */}
                                {(isPopular || isCurrent) && (
                                    <div className={`absolute top-0 left-0 right-0 py-1.5 text-center text-[10px] font-bold uppercase tracking-widest text-white ${isCurrent ? 'bg-green-500' : 'bg-gradient-to-r from-blue-600 to-green-600'}`}>
                                        {isCurrent ? '✓ Your Current Plan' : '⚡ Most Popular'}
                                    </div>
                                )}

                                <div className={`p-6 flex flex-col flex-1 ${(isPopular || isCurrent) ? 'pt-10' : ''}`}>
                                    {/* Icon + name */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPopular ? 'bg-gradient-to-br from-blue-600 to-green-500 text-white' : 'bg-slate-50 text-slate-500'}`}>
                                            {idx === 0 ? <Cpu size={18} /> : idx === 1 ? <Zap size={18} /> : <Globe size={18} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{plan.name}</p>
                                            <div className="flex items-baseline gap-0.5">
                                                <span className="text-xl font-bold text-blue-600">${plan.price}</span>
                                                <span className="text-xs text-slate-400">/month</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Job limit pill */}
                                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 mb-4">
                                        <Target size={13} className="text-green-600 shrink-0" />
                                        <span className="text-xs font-semibold text-slate-700">
                                            {plan.jobsLimit >= 999 ? 'Unlimited' : plan.jobsLimit} Active Job Posts
                                        </span>
                                    </div>

                                    {/* Features */}
                                    <ul className="space-y-2.5 flex-1 mb-5">
                                        {perks.map((f: string) => (
                                            <li key={f} className="flex items-start gap-2.5 text-xs text-slate-600">
                                                <CheckCircle2 size={13} className="text-green-500 shrink-0 mt-0.5" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA */}
                                    <button
                                        onClick={() => handleSelectPlan(plan.id, isCurrent)}
                                        disabled={isCurrent}
                                        className={`w-full h-10 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                                            isCurrent
                                                ? 'bg-green-50 text-green-600 border border-green-100 cursor-default'
                                                : isPopular
                                                    ? 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-md'
                                                    : 'bg-slate-900 hover:bg-blue-600 text-white'
                                        }`}>
                                        {isCurrent
                                            ? <><ShieldCheck size={15} />Current Plan</>
                                            : <>Get {plan.name} <ArrowRight size={14} /></>
                                        }
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Enterprise CTA ── */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full -mr-12 -mt-12 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-500/10 rounded-full -ml-8 -mb-8 blur-2xl" />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Enterprise</p>
                        <h3 className="text-lg font-bold text-white">Need a custom plan?</h3>
                        <p className="text-sm text-slate-400 mt-0.5 max-w-md">
                            Volume hiring, custom limits, dedicated account manager, and SLA guarantees.
                        </p>
                    </div>
                    <a href="mailto:enterprise@nurseflex.com"
                        className="h-10 px-6 rounded-xl bg-white text-slate-900 hover:bg-blue-50 font-semibold text-sm flex items-center gap-2 transition-all shrink-0 shadow-md">
                        Contact Sales <ArrowRight size={14} />
                    </a>
                </div>
            </div>

            <p className="text-center text-[10px] text-slate-300 uppercase tracking-widest">
                NurseFlex · Plans managed by admin
            </p>
        </div>
    );
}