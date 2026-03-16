"use client";
import React, { useEffect, useState } from 'react';
import { 
    Loader2, Check, Zap, ShieldCheck, 
    ArrowRight, Sparkles, Target, 
    Clock, Cpu, Globe, Rocket
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { Skeleton } from "@/app/components/ui/skeleton";

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [currentSub, setCurrentSub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTiersAndSub = async () => {
      try {
        const token = localStorage.getItem("hospital_token");
        const headers = { 'Authorization': `Bearer ${token}` };

        // Keeping original fetch logic for connectivity
        const [tiersRes, subRes] = await Promise.all([
          api.get('/tiers').then(r => r.data),
          token ? api.get('/subscriptions/my').then(r => r.data) : Promise.resolve(null)
        ]);

        setPlans(Array.isArray(tiersRes) ? tiersRes : []);
        setCurrentSub(subRes || null);
      } catch (err) {
        console.error("Error fetching plans:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTiersAndSub();
  }, []);

  const handleSelectPlan = (tierId: string, isCurrent: boolean) => {
    if (isCurrent) return;
    router.push(`/business/checkout?tierId=${tierId}`);
  };

  if (loading) return (
    <div className="space-y-12">
        <header className="text-center space-y-4">
            <Skeleton className="h-10 w-64 mx-auto" />
            <Skeleton className="h-4 w-96 mx-auto" />
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1,2,3].map(i => <Skeleton key={i} className="h-[600px] rounded-[3.5rem]" />)}
        </div>
    </div>
  );

  return (
    <div className="space-y-16 pb-20 animate-in fade-in duration-1000">
      <header className="text-center md:text-left space-y-4 border-b border-slate-100 pb-12">
        <div className="flex items-center gap-4 justify-center md:justify-start mb-4">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Plans & Pricing</h1>
        </div>
        <p className="text-slate-500 font-medium text-sm">Choose the right plan to scale your hiring needs</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {plans.map((plan) => {
          const isCurrent = currentSub?.tierId === plan.id;
          const isPopular = plan.isPopular;

          return (
            <Card
              key={plan.id}
              className={`group flex flex-col border-none rounded-[3.5rem] transition-all duration-700 relative overflow-hidden ${
                isCurrent 
                ? 'shadow-2xl shadow-pink-50 ring-4 ring-pink-500/10 bg-white' 
                : isPopular 
                    ? 'bg-slate-900 text-white shadow-[0_40px_100px_-15px_rgba(15,23,42,0.3)] scale-[1.05] z-10' 
                    : 'bg-white shadow-sm hover:shadow-2xl hover:shadow-slate-100 border border-slate-50'
              }`}
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/5 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none"></div>
              
              <CardHeader className="p-10 pb-6 relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl ${
                        isPopular ? 'bg-white text-slate-900 shadow-slate-950' : 'bg-slate-900 text-white shadow-slate-200'
                    }`}>
                        {plan.name.toLowerCase().includes('enterprise') ? <Globe size={28} /> : 
                         plan.name.toLowerCase().includes('pro') ? <Zap size={28} /> : <Cpu size={28} />}
                    </div>
                    {isCurrent && (
                        <Badge className="bg-emerald-500 font-bold text-[10px] px-3 py-1 shadow-lg shadow-emerald-100">Current Plan</Badge>
                    )}
                    {isPopular && !isCurrent && (
                        <Badge className="bg-pink-600 font-bold text-[10px] px-3 py-1 shadow-lg shadow-pink-100">Most Popular</Badge>
                    )}
                </div>
                <CardTitle className={`text-3xl font-bold tracking-tight ${isPopular ? 'text-white' : 'text-slate-900'}`}>{plan.name}</CardTitle>
                <CardDescription className={`text-xs font-medium pt-2 ${isPopular ? 'text-slate-400' : 'text-slate-500'}`}>Hiring capacity and features</CardDescription>
              </CardHeader>

              <CardContent className="p-10 pt-0 flex-1 relative z-10 flex flex-col">
                <div className="flex items-baseline gap-2 mb-8">
                    <span className={`text-6xl font-bold tracking-tight ${isPopular ? 'text-white' : 'text-slate-900'}`}>${plan.price}</span>
                    <span className={`text-sm font-bold ${isPopular ? 'text-slate-500' : 'text-slate-400'}`}>/ month</span>
                </div>

                <div className={`mb-10 p-5 rounded-2xl border ${isPopular ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="flex items-center gap-3">
                        <Target size={14} className={isPopular ? 'text-pink-400' : 'text-pink-600'} />
                        <span className={`text-xs font-bold leading-tight ${isPopular ? 'text-slate-300' : 'text-slate-700'}`}>
                            {plan.jobsLimit} Active Job Posts
                        </span>
                    </div>
                </div>

                <div className="space-y-4 flex-1">
                    {plan.features?.map((feature: string, fIndex: number) => (
                        <div key={fIndex} className="flex gap-4 items-start group/item">
                            <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                isPopular ? 'bg-white/10 text-emerald-400 group-hover/item:bg-emerald-500 group-hover/item:text-white' : 'bg-pink-50 text-pink-600 group-hover/item:bg-pink-600 group-hover/item:text-white'
                            }`}>
                                <Check size={12} />
                            </div>
                            <span className={`text-xs font-bold leading-relaxed ${isPopular ? 'text-slate-300' : 'text-slate-500'}`}>{feature}</span>
                        </div>
                    ))}
                </div>
              </CardContent>

              <CardFooter className="p-10 border-t border-slate-50/10">
                <Button
                    onClick={() => handleSelectPlan(plan.id, isCurrent)}
                    disabled={isCurrent}
                    className={`w-full h-16 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] ${
                        isCurrent 
                        ? 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100' 
                        : isPopular 
                            ? 'bg-white text-slate-900 hover:bg-[#ec4899] hover:text-white shadow-2xl shadow-slate-950' 
                            : 'bg-slate-900 text-white hover:bg-[#ec4899] shadow-xl shadow-slate-100'
                    }`}
                >
                    {isCurrent ? (
                        <div className="flex items-center gap-3">
                            <ShieldCheck size={18} /> Current Active Plan
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            {Number(plan.price) === 0 ? 'Start Free Trial' : `Select ${plan.name} Plan`} <ArrowRight size={18} />
                        </div>
                    )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Card className="border-none shadow-2xl shadow-pink-50 bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-600/5 rounded-full blur-[120px] -mr-64 -mt-64 group-hover:bg-pink-600/10 transition-all duration-1000"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
            <div className="space-y-6 text-center md:text-left">
                <Badge className="bg-white/10 text-pink-400 border-white/10 font-bold text-[10px] px-4 py-1">Enterprise Solutions</Badge>
                <h4 className="text-4xl font-bold tracking-tight leading-none">Custom Enterprise Plan</h4>
                <p className="text-slate-400 font-bold max-w-xl leading-relaxed">
                    Scaling beyond standard limits? Contact our team for custom job posting limits, volume hiring, and dedicated account management.
                </p>
            </div>
            <Button size="lg" className="h-20 px-12 rounded-[2rem] bg-white text-slate-900 hover:bg-[#ec4899] hover:text-white font-bold text-lg shadow-2xl transition-all active:scale-[0.95] group shrink-0">
                Contact Sales <Rocket size={24} className="ml-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            </Button>
        </div>
      </Card>

      <footer className="pt-20 text-center">
         <p className="text-[10px] font-bold text-slate-200 uppercase tracking-[0.4em]">End of Subscription Plans</p>
      </footer>
    </div>
  );
}