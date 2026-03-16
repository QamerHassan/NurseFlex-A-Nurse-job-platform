"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Bell, User, MessageSquare,
    ChevronRight, ExternalLink, Zap,
    ShieldCheck, ArrowRight, Loader2,
    Lock, Sparkles, Target
} from 'lucide-react';

import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";

export default function EmployerLandingPage() {
    const [isApproved, setIsApproved] = React.useState(true);

    React.useEffect(() => {
        const userStr = localStorage.getItem('business_user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.status !== 'Active') {
                setIsApproved(false);
            }
        } else {
            setIsApproved(false);
        }
    }, []);

    if (!isApproved) {
        return (
            <div className="h-[90vh] flex items-center justify-center p-6 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:40px_40px]">
                <Card className="max-w-md w-full border-none shadow-2xl shadow-blue-100/50 bg-white rounded-[3.5rem] p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-4xl mx-auto mb-10 shadow-2xl shadow-blue-100 group-hover:rotate-3 transition-transform">
                            <Lock size={40} className="text-white opacity-20" />
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter mb-6 uppercase leading-tight underline decoration-amber-500/20 underline-offset-8">Account Pending Review</h2>
                        <p className="text-slate-500 font-bold text-sm mb-12 leading-relaxed px-4 italic">
                            "Review in progress. Our team is currently reviewing your business credentials. You will have full access to the portal shortly."
                        </p>
                        <div className="space-y-6">
                            <div className="flex items-center justify-center gap-3 py-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <Loader2 className="animate-spin text-amber-600" size={16} />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">Pending Review</span>
                            </div>
                            <Button asChild variant="ghost" className="w-full h-14 rounded-2xl text-slate-400 hover:text-red-500 font-black uppercase tracking-widest text-[10px]">
                                <Link href="/">Log Out</Link>
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex flex-col animate-in fade-in duration-1000">
            <main className="flex-1 max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 items-center gap-20">
                <div className="space-y-12">
                    <div className="space-y-6">
                        <header>
                            <div className="flex items-center gap-4 mb-6">
                                <Badge className="bg-blue-600 font-black text-[9px] uppercase tracking-[0.3em] px-3 shadow-lg shadow-blue-100 italic">Business Portal</Badge>
                                <div className="h-px flex-1 bg-slate-100"></div>
                            </div>
                            <h1 className="text-7xl font-black text-slate-900 leading-[1] tracking-tighter italic uppercase">
                                Manage Your <br />
                                <span className="text-blue-600 underline decoration-blue-100 underline-offset-8 decoration-8 whitespace-nowrap">Healthcare Team.</span>
                            </h1>
                        </header>
                        
                        <p className="text-slate-400 font-bold text-lg uppercase tracking-tight max-w-lg leading-snug">
                            Find and hire qualified healthcare professionals with <span className="text-slate-900">ease</span> and zero friction.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6">
                        <Button asChild size="lg" className="h-20 px-12 rounded-[2rem] bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-tighter italic shadow-2xl shadow-blue-100 transition-all active:scale-95 group">
                            <Link href="/business/post-job" className="flex items-center gap-4 text-xl">
                                Post a Job <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </div>

                    <Card className="border-none shadow-sm bg-white rounded-[3rem] p-10 ring-1 ring-slate-100 relative overflow-hidden group hover:shadow-2xl hover:shadow-blue-50/50 transition-all duration-700">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/30 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex items-start gap-8 relative z-10">
                            <div className="w-16 h-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-blue-600 shrink-0 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                                <Target size={32} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2 italic">Need Quick Staffing?</h3>
                                <p className="text-xs font-bold text-slate-400 leading-relaxed mb-6">Use NurseFlex to find specialized healthcare staff in real-time.</p>
                                <Link href="#" className="text-blue-600 font-black text-xs uppercase tracking-[0.2em] hover:opacity-70 inline-flex items-center gap-2 group/link underline decoration-blue-100 underline-offset-4">
                                    Search for Professionals <ArrowRight size={14} className="group-link/hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="relative group perspective-1000">
                    <div className="absolute inset-0 bg-blue-600/5 rounded-full blur-[120px] scale-110 -z-10 animate-pulse"></div>
                    <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl shadow-blue-100 ring-[20px] ring-white transition-all duration-700 group-hover:rotate-1 group-hover:scale-[1.02]">
                        <Image
                            src="/images/employer_landing_hero.png"
                            alt="Recruiter and Nurse Interview"
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        {/* Status Overlays */}
                        <div className="absolute top-10 left-10 flex flex-col gap-4">
                            <Badge className="h-8 px-4 bg-blue-600/80 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-3">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                                <span className="text-[9px] font-black uppercase tracking-[0.3em]">Network Live</span>
                            </Badge>
                            <Badge className="h-8 px-4 bg-blue-600/90 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-3">
                                <Sparkles size={12} fill="white" />
                                <span className="text-[9px] font-black uppercase tracking-[0.3em]">Verified Candidates</span>
                            </Badge>
                        </div>

                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[80%] bg-white/20 backdrop-blur-3xl rounded-[2.5rem] p-6 border border-white/20 shadow-2xl">
                             <div className="flex items-center justify-between">
                                <div className="flex -space-x-4">
                                    {[1,2,3,4].map(i => (
                                        <div key={i} className="w-12 h-12 rounded-2xl border-4 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black italic">N{i}</div>
                                    ))}
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Active Talent</p>
                                    <p className="text-2xl font-black text-white italic tracking-tighter leading-none">5.7k+</p>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="mt-auto border-t border-slate-100 py-12 px-10 bg-slate-50/50">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em] italic">© 2026 NurseFlex Network</p>
                    <div className="flex gap-10">
                        {['Privacy', 'Terms', 'Security'].map(link => (
                            <Link key={link} href="#" className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">{link}</Link>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}
