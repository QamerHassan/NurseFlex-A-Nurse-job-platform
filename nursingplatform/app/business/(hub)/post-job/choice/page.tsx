"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
    HelpCircle, ArrowRight, User, 
    Briefcase, Sparkles, Zap,
    Target, Building2, Search
} from 'lucide-react';

import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";

export default function PostJobChoicePage() {
    return (
        <div className="max-w-6xl mx-auto space-y-16 py-10 animate-in fade-in duration-1000">
            <header className="text-center space-y-4">
                <div className="flex items-center gap-4 justify-center mb-6">
                    <Badge className="bg-blue-600 font-black text-[9px] uppercase tracking-[0.3em] px-3 shadow-lg shadow-blue-100 italic">Directive Choice</Badge>
                </div>
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase underline decoration-blue-500/20 underline-offset-8 decoration-8">Define Your Node Mission</h1>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Select institutional orientation for this session</p>
            </header>

            <div className="grid md:grid-cols-2 gap-12 w-full">
                {/* Choice 1: Recruitment Node */}
                <Card className="group border-none shadow-2xl shadow-blue-50 bg-white rounded-[4rem] overflow-hidden hover:scale-[1.02] transition-all duration-700 relative">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl -mr-24 -mt-24 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="p-12 pb-6 text-center">
                        <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-slate-200 group-hover:rotate-6 transition-transform duration-500">
                            <Building2 size={40} className="text-blue-400" />
                        </div>
                        <CardTitle className="text-3xl font-black italic uppercase tracking-tighter mb-2">Hiring Protocol</CardTitle>
                        <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400">Initialize Talent Acquisition Manifest</CardDescription>
                    </CardHeader>
                    <CardContent className="px-12 pb-12 text-center space-y-8">
                        <div className="relative aspect-square max-w-[240px] mx-auto rounded-[2rem] overflow-hidden shadow-2xl ring-8 ring-slate-50">
                            <Image
                                src="/images/employer_choice.png"
                                alt="Hiring an employee"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-1000"
                            />
                        </div>
                        <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-tight px-4">
                            "Deploy institutional resources to secure qualified healthcare professionals within the network."
                        </p>
                    </CardContent>
                    <CardFooter className="p-12 pt-0">
                        <Button asChild size="lg" className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white font-black uppercase tracking-widest text-[11px] shadow-2xl transition-all">
                            <Link href="/business/post-job/setup" className="flex items-center gap-3">
                                Initialize Hiring <ArrowRight size={18} />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>

                {/* Choice 2: Talent Node */}
                <Card className="group border-none shadow-2xl shadow-slate-100 bg-white rounded-[4rem] overflow-hidden hover:scale-[1.02] transition-all duration-700 relative">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl -mr-24 -mt-24 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="p-12 pb-6 text-center">
                        <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center text-slate-900 mx-auto mb-8 shadow-2xl shadow-slate-100 group-hover:-rotate-6 transition-transform duration-500 ring-2 ring-slate-50">
                            <Search size={40} className="text-blue-600" />
                        </div>
                        <CardTitle className="text-3xl font-black italic uppercase tracking-tighter mb-2">Search Protocol</CardTitle>
                        <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400">Locate Active Deployment Opportunities</CardDescription>
                    </CardHeader>
                    <CardContent className="px-12 pb-12 text-center space-y-8">
                        <div className="relative aspect-square max-w-[240px] mx-auto rounded-[2rem] overflow-hidden shadow-2xl ring-8 ring-slate-50">
                            <Image
                                src="/images/job_seeker_choice.png"
                                alt="Looking for a job"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-1000"
                            />
                        </div>
                        <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-tight px-4">
                            "Scan the network for active institutional manifests requiring qualified healthcare intervention."
                        </p>
                    </CardContent>
                    <CardFooter className="p-12 pt-0">
                        <Button asChild variant="outline" size="lg" className="w-full h-16 rounded-2xl border-slate-200 hover:border-blue-600 hover:bg-blue-50 text-slate-900 font-black uppercase tracking-widest text-[11px] transition-all">
                            <Link href="/dashboard" className="flex items-center gap-3 text-blue-600">
                                Engage Search <Target size={18} />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            <footer className="pt-20 text-center">
                 <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.8em]">Operational Choice Terminal 2.0</p>
            </footer>
        </div>
    );
}
