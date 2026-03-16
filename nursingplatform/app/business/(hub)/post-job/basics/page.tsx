"use client";
import React, { useState } from 'react';
import { 
    HelpCircle, ChevronRight, Briefcase, 
    MapPin, Globe, Pencil, Zap,
    ArrowRight, Loader2, Info,
    Settings, Target, Layout
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/ui/select";
import { Separator } from "@/app/components/ui/separator";

export default function AddJobBasicsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.push('/business/post-job/hiring-goals');
        }, 800);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 py-10 animate-in fade-in duration-1000">
            <header className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-slate-100 pb-12">
                <div className="text-center md:text-left space-y-4">
                    <div className="flex items-center gap-4 justify-center md:justify-start mb-2">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase underline decoration-blue-500/20 underline-offset-8 decoration-8">Job Basics</h1>
                        <Badge className="bg-blue-600 font-black text-[9px] uppercase tracking-[0.3em] px-3 shadow-lg shadow-blue-100 italic">Step 01</Badge>
                    </div>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Define the core details for your job posting</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Protocol Info */}
                <aside className="lg:col-span-4 space-y-8">
                    <Card className="border-none shadow-2xl shadow-blue-50 bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="relative z-10 space-y-6">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 border border-white/20 shadow-2xl transition-transform group-hover:rotate-12">
                                <Target size={28} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-black uppercase tracking-widest italic text-blue-400">Target Location</h3>
                                <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight">
                                    "Your job will be shown to qualified nurses in the specified location. Make sure the details are correct."
                                </p>
                            </div>
                        </div>
                    </Card>

                    <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 space-y-6 shadow-sm">
                         <div className="flex items-center gap-3">
                            <Globe size={18} className="text-blue-600" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Global Language</span>
                         </div>
                         <Separator />
                         <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base: <span className="text-slate-900">English</span></span>
                            <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full text-blue-600 hover:bg-blue-50">
                                <Pencil size={12} />
                            </Button>
                         </div>
                    </div>

                    <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 space-y-4">
                        <div className="flex items-center gap-3 text-blue-600">
                            <Info size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest italic">Progress</span>
                        </div>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= 2 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                            ))}
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Setting Up Job...</p>
                    </div>
                </aside>

                {/* Main Basics Form */}
                <div className="lg:col-span-8">
                    <form onSubmit={handleSubmit} className="space-y-10">
                        <Card className="border-none shadow-2xl shadow-blue-50/50 bg-white rounded-[3rem] overflow-hidden">
                            <CardHeader className="p-10 pb-0 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-black italic uppercase tracking-tight">Main Details</CardTitle>
                                    <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Basic role identification</CardDescription>
                                </div>
                                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
                                    <Layout size={20} />
                                </div>
                            </CardHeader>
                            <CardContent className="p-10 space-y-8">
                                <div className="grid grid-cols-1 gap-8">
                                    <div className="space-y-4 px-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Job Title *</Label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <Input required placeholder="E.G. SENIOR REGISTERED NURSE" className="h-16 pl-16 rounded-[1.5rem] bg-slate-50/50 border-slate-100 font-black text-slate-900 focus-visible:ring-0 focus-visible:bg-white transition-all text-base uppercase" />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-4 px-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Work Type *</Label>
                                            <Select defaultValue="in_person">
                                                <SelectTrigger className="h-16 px-6 rounded-[1.5rem] bg-slate-50/50 border-slate-100 font-black text-slate-900 focus:ring-0 focus:bg-white transition-all text-sm uppercase">
                                                    <SelectValue placeholder="LOCATION TYPE" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                                                    <SelectItem value="in_person" className="font-bold text-[10px] uppercase h-12">On-Site</SelectItem>
                                                    <SelectItem value="remote" className="font-bold text-[10px] uppercase h-12">Remote</SelectItem>
                                                    <SelectItem value="hybrid" className="font-bold text-[10px] uppercase h-12">Hybrid</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-4 px-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Location *</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                                <Input required placeholder="CITY OR POSTAL HUB" className="h-16 pl-16 rounded-[1.5rem] bg-slate-50/50 border-slate-100 font-black text-slate-900 focus-visible:ring-0 focus-visible:bg-white transition-all text-base uppercase" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="p-10 bg-slate-50/30 flex justify-end">
                                <Button 
                                    type="submit" 
                                    disabled={loading}
                                    className="h-16 px-12 rounded-[1.5rem] bg-slate-900 hover:bg-blue-600 font-black uppercase tracking-tighter italic shadow-2xl transition-all active:scale-95 group"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-3">
                                            <Loader2 className="animate-spin" size={20} /> SAVING...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            Next Step: Hiring Goals <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>

                    <div className="mt-12 text-center">
                         <Link href="/business/post-job/setup" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
                             <ChevronRight size={14} className="rotate-180" /> Back to Setup
                         </Link>
                    </div>
                </div>
            </div>
            
            <footer className="pt-20 text-center">
                 <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.8em]">End of Job Basics</p>
            </footer>
        </div>
    );
}
