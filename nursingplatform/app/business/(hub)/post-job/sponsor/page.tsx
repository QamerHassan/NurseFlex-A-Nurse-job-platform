"use client";
import React, { useState, useEffect } from 'react';
import { 
    HelpCircle, ChevronRight, Check, Star,
    Zap, ArrowRight, Loader2, Info,
    Settings, Target, Users, Clock,
    Layout, Briefcase, CreditCard,
    DollarSign, PoundSterling, ShieldCheck, X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BaseUrl } from '@/lib/constants';

import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";

interface Tier {
    id: number;
    name: string;
    description: string;
    price: number;
    billingCycle: string;
    features: string[];
    isActive: boolean;
    isFeatured: boolean;
    jobLimit?: number;
}

export default function SponsorJobPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [tiersLoading, setTiersLoading] = useState(true);
    const [tiers, setTiers] = useState<Tier[]>([]);
    const [selectedTierId, setSelectedTierId] = useState<number | null>(null);

    useEffect(() => {
        const fetchTiers = async () => {
            try {
                const url = `${BaseUrl}/tiers`;
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    setTiers(data);
                    const featured = data.find((t: Tier) => t.isFeatured);
                    if (featured) {
                        setSelectedTierId(featured.id);
                    } else if (data.length > 0) {
                        setSelectedTierId(data[0].id);
                    }
                }
            } catch (error) {
                console.error('[NurseFlex] Pricing data error:', error);
            } finally {
                setTiersLoading(false);
            }
        };

        fetchTiers();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.push(`/business/post-job/billing?tierId=${selectedTierId}`);
        }, 800);
    };

    const handleSkip = () => {
        router.push('/business/dashboard');
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 py-10 animate-in fade-in duration-1000 px-4">
            <header className="flex flex-col md:flex-row justify-between items-end gap-12 border-b border-slate-100 pb-16">
                <div className="text-center md:text-left space-y-6">
                    <div className="flex items-center gap-6 justify-center md:justify-start mb-2">
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase underline decoration-blue-500/20 underline-offset-[12px] decoration-8">Sponsor Your Job</h1>
                        <Badge className="bg-blue-600 font-black text-[10px] uppercase tracking-[0.4em] px-4 py-1.5 shadow-xl shadow-blue-100 italic">Step 08</Badge>
                    </div>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.3em] max-w-2xl">Boost your job posting to reach more qualified healthcare professionals</p>
                </div>
                <div className="hidden lg:flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100 shadow-sm">
                    <ShieldCheck className="text-blue-600" size={24} />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-tight">Secure Payment<br/>Processing Certified</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Protocol Info */}
                <aside className="lg:col-span-3 space-y-8">
                    <Card className="border-none shadow-2xl shadow-blue-50 bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group h-full">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="relative z-10 space-y-8">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 border border-white/20 shadow-2xl transition-transform group-hover:rotate-12 group-hover:scale-110">
                                <Zap size={32} />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-lg font-black uppercase tracking-widest italic text-blue-400">Boost Visibility</h3>
                                <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight">
                                    "Sponsoring your job helps it reach more qualified healthcare professionals and fill your opening faster."
                                </p>
                            </div>
                            <Separator className="bg-white/10" />
                            <div className="space-y-2">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic">Platform Status: Active</p>
                            </div>
                        </div>
                    </Card>
                </aside>

                {/* Main Sponsorship Grid */}
                <div className="lg:col-span-9 space-y-12">
                    {tiersLoading ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-6">
                            <Loader2 className="animate-spin text-blue-600" size={64} />
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">Loading promotion options...</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-8">
                            {tiers.map((tier) => {
                                const isSelected = selectedTierId === tier.id;
                                return (
                                    <Card 
                                        key={tier.id}
                                        onClick={() => setSelectedTierId(tier.id)}
                                        className={`relative group border-none shadow-2xl transition-all cursor-pointer rounded-[4rem] overflow-hidden flex flex-col ${isSelected
                                            ? 'bg-slate-900 text-white shadow-blue-200 scale-105 z-10'
                                            : 'bg-white text-slate-900 shadow-slate-100 hover:scale-102 hover:shadow-blue-50'
                                            }`}
                                    >
                                        {tier.isFeatured && (
                                            <div className="absolute top-8 right-8">
                                                <Badge className="bg-blue-600 font-black text-[8px] uppercase tracking-widest border-none px-3 italic">Best Value</Badge>
                                            </div>
                                        )}
                                        
                                        <CardHeader className="p-10 pb-0">
                                            <CardTitle className="text-2xl font-black italic uppercase tracking-tighter mb-2">{tier.name}</CardTitle>
                                            <CardDescription className={`text-[9px] font-black uppercase tracking-widest ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>Promotion Plan</CardDescription>
                                        </CardHeader>

                                        <CardContent className="p-10 flex-1 space-y-8">
                                            <div className="space-y-1">
                                                <div className="flex items-baseline gap-2">
                                                    <span className={`text-4xl font-black ${isSelected ? 'text-white' : 'text-slate-900'}`}>${tier.price}</span>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
                                                        /{tier.billingCycle === 'monthly' ? 'mo' : tier.billingCycle === 'yearly' ? 'yr' : 'one-time'}
                                                    </span>
                                                </div>
                                                <p className={`text-[9px] font-bold italic uppercase tracking-widest opacity-40`}>Plan Pricing</p>
                                            </div>

                                            <Separator className={isSelected ? 'bg-white/10' : 'bg-slate-50'} />

                                            <div className="space-y-5">
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${isSelected ? 'border-blue-500 bg-blue-500 text-slate-900' : 'border-slate-100 bg-slate-50 text-blue-600'}`}>
                                                        <Check size={12} strokeWidth={4} />
                                                    </div>
                                                    <p className={`text-[11px] font-black uppercase tracking-tight leading-tight ${isSelected ? 'text-slate-200' : 'text-slate-600'}`}>
                                                        {tier.name.toLowerCase() === 'free' ? 'Up to 1 job post'
                                                            : tier.name.toLowerCase() === 'pro' ? 'Up to 10 active job posts'
                                                                : tier.name.toLowerCase() === 'pro max' ? 'Unlimited active job posts'
                                                                    : `${tier.jobLimit || 'Unlimited'} active jobs`}
                                                    </p>
                                                </div>
                                                {tier.features.map((feature, idx) => (
                                                    <div key={idx} className="flex items-start gap-4">
                                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${isSelected ? 'border-slate-700 bg-slate-800 text-slate-500' : 'border-slate-50 bg-slate-50 text-slate-300'}`}>
                                                            <Check size={12} strokeWidth={4} />
                                                        </div>
                                                        <p className={`text-[10px] font-bold uppercase tracking-tight leading-tight ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
                                                            {feature}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>

                                        <CardFooter className="p-10 pt-0 mt-auto">
                                            <div className={`w-full h-16 rounded-[1.5rem] border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20' : 'border-slate-50 bg-slate-50 text-slate-300 group-hover:border-blue-100 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
                                                <span className="text-[10px] font-black uppercase tracking-widest italic">{isSelected ? 'TIER SELECTED' : 'SELECT TIER'}</span>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                );
                            })}
                        </div>
                    )}

                    {/* Footer Actions */}
                    <footer className="pt-12 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-slate-50">
                        <Button 
                            type="button" 
                            onClick={handleSkip}
                            variant="ghost" 
                            className="h-16 px-10 rounded-2xl text-slate-300 hover:text-red-500 font-black uppercase tracking-widest text-[10px] gap-3"
                        >
                            Skip for Now <X size={14} />
                        </Button>

                        <Button 
                            onClick={handleSubmit}
                            disabled={loading || !selectedTierId}
                            className="h-20 px-16 rounded-[2.5rem] bg-slate-900 hover:bg-blue-600 text-white font-black uppercase tracking-tighter italic text-2xl shadow-2xl transition-all active:scale-95 group"
                        >
                            {loading ? (
                                <div className="flex items-center gap-4">
                                    <Loader2 className="animate-spin" size={28} /> PROCESSING...
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    Continue to Payment <ArrowRight size={28} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            )}
                        </Button>
                    </footer>
                </div>
            </div>
            
            <footer className="pt-20 text-center">
                 <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.8em]">End of Sponsorship Options</p>
            </footer>
        </div>
    );
}
