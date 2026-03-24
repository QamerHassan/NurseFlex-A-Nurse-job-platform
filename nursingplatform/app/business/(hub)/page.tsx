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
    const [user, setUser] = React.useState<any>(null);

    React.useEffect(() => {
        const userStr = localStorage.getItem('business_user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
    }, []);

    const isPending = user && user.status !== 'Active' && user.status !== 'APPROVED';
    const isLoggedOut = !user;

    if (isPending) {
        return (
            <div className="h-[90vh] flex items-center justify-center p-6">
                <Card className="max-w-md w-full border border-slate-100 shadow-2xl shadow-blue-50 bg-white rounded-3xl p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-blue-100">
                            <Lock size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">Account Under Review</h2>
                        <p className="text-slate-500 font-medium text-sm mb-10 leading-relaxed px-4">
                            Our team is currently verifying your business credentials. You will have full access to the portal once your account is activated.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center justify-center gap-3 py-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                <Loader2 className="animate-spin text-blue-600" size={16} />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Verification in progress</span>
                            </div>
                            <Button asChild variant="ghost" className="w-full h-12 rounded-xl text-slate-400 hover:text-slate-600 font-bold uppercase tracking-widest text-[10px]">
                                <Link href="/">Return to Home</Link>
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex flex-col pt-10">
            <main className="flex-1 max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
                <div className="space-y-10">
                    <div className="space-y-6">
                        <header>
                            <div className="flex items-center gap-4 mb-6">
                                <Badge className="bg-blue-600 font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-lg">Business Portal</Badge>
                                <div className="h-px flex-1 bg-slate-100"></div>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                                Manage your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">Healthcare Team</span>
                            </h1>
                        </header>
                        
                        <p className="text-slate-500 font-medium text-lg max-w-lg leading-relaxed">
                            Find and hire qualified healthcare professionals with <span className="text-slate-900 font-bold">maximum efficiency</span> and zero friction.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        {isLoggedOut ? (
                            <>
                                <Button asChild size="lg" className="h-14 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xl shadow-blue-100 transition-all active:scale-95 group">
                                    <Link href="/business/register" className="flex items-center gap-2 text-base">
                                        Partner with Us <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="h-14 px-8 rounded-xl border border-slate-200 text-slate-900 hover:bg-slate-50 font-bold transition-all active:scale-95">
                                    <Link href="/auth/login?portal=business" className="text-base">
                                        Employer Login
                                    </Link>
                                </Button>
                            </>
                        ) : (
                            <Button asChild size="lg" className="h-14 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xl shadow-blue-100 transition-all active:scale-95 group">
                                <Link href="/business/dashboard" className="flex items-center gap-2 text-base">
                                    Go to Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        )}
                    </div>

                    <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl p-8 relative overflow-hidden group hover:shadow-lg transition-all duration-500">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="flex items-start gap-6 relative z-10">
                            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                                <Target size={28} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-2">Need Staffing?</h3>
                                <p className="text-xs font-medium text-slate-400 leading-relaxed mb-4">Connect with specialized healthcare staff in real-time using our nationwide network.</p>
                                <Link href="#" className="text-blue-600 font-bold text-xs uppercase tracking-widest hover:text-blue-700 inline-flex items-center gap-2 group/link">
                                    Browse Professionals <ArrowRight size={14} className="group-link/hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="relative group">
                    <div className="absolute inset-0 bg-blue-600/5 rounded-full blur-[80px] scale-110 -z-10 animate-pulse"></div>
                    <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-slate-100 transition-all duration-700 group-hover:scale-[1.01]">
                        <Image
                            src="/images/employer_landing_hero.png"
                            alt="Healthcare Recruiting"
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        {/* Status Overlays */}
                        <div className="absolute top-8 left-8 flex flex-col gap-3">
                            <Badge className="h-7 px-4 bg-blue-600/80 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2.5">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                                <span className="text-[9px] font-bold uppercase tracking-widest text-white">Network Live</span>
                            </Badge>
                            <Badge className="h-7 px-4 bg-white/90 backdrop-blur-md rounded-full border border-slate-200/50 flex items-center gap-2 shadow-lg">
                                <Sparkles size={11} className="text-blue-600" />
                                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-900">Verified Talent</span>
                            </Badge>
                        </div>

                        <div className="absolute bottom-8 left-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-white/50 shadow-xl">
                             <div className="flex items-center justify-between">
                                <div className="flex -space-x-3">
                                    {[1,2,3,4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-xl border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 shadow-sm">N{i}</div>
                                    ))}
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Active Talent</p>
                                    <p className="text-2xl font-bold text-slate-900 leading-none">5.7k+</p>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="mt-auto border-t border-slate-100 py-10 px-6 bg-white">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">© 2026 NurseFlex Network</p>
                    <div className="flex gap-8">
                        {['Privacy', 'Terms', 'Security'].map(link => (
                            <Link key={link} href="#" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">{link}</Link>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}
