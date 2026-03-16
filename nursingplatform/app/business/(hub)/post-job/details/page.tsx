"use client";
import React, { useState } from 'react';
import { 
    HelpCircle, ChevronRight, Plus, Check,
    Zap, ArrowRight, Loader2, Info,
    Settings, Target, Users, Clock,
    Layout, Briefcase
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";

const JOB_TYPES = [
    'Full-time',
    'Part-time',
    'Temporary',
    'Contract',
    'Internship',
    'Fresher'
];

export default function JobDetailsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState<string[]>(['Full-time']);

    const toggleType = (type: string) => {
        setSelectedTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedTypes.length === 0) {
            alert("Please select at least one job type.");
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.push('/business/post-job/compensation');
        }, 800);
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 py-10 animate-in fade-in duration-1000">
            <header className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-slate-100 pb-12">
                <div className="text-center md:text-left space-y-4">
                    <div className="flex items-center gap-4 justify-center md:justify-start mb-2">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase underline decoration-blue-500/20 underline-offset-8 decoration-8">Job Requirements</h1>
                        <Badge className="bg-blue-600 font-black text-[9px] uppercase tracking-[0.3em] px-3 shadow-lg shadow-blue-100 italic">Step 04</Badge>
                    </div>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Select the type of job and employment terms</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Protocol Info */}
                <aside className="lg:col-span-4 space-y-8">
                    <Card className="border-none shadow-2xl shadow-blue-50 bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="relative z-10 space-y-6">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 border border-white/20 shadow-2xl transition-transform group-hover:rotate-12">
                                <Briefcase size={28} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-black uppercase tracking-widest italic text-blue-400">Job Type</h3>
                                <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight">
                                    "Selecting multiple job types broadens your reach. Applicants filtering by contract type will see your post based on these settings."
                                </p>
                            </div>
                        </div>
                    </Card>

                    <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 space-y-4">
                        <div className="flex items-center gap-3 text-blue-600">
                            <Info size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest italic">Job Posting Progress</span>
                        </div>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= 4 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                            ))}
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Setting Job Types...</p>
                    </div>
                </aside>

                {/* Main Details Form */}
                <div className="lg:col-span-8">
                    <form onSubmit={handleSubmit} className="space-y-10">
                        <Card className="border-none shadow-2xl shadow-blue-50/50 bg-white rounded-[3rem] overflow-hidden">
                            <CardHeader className="p-10 pb-0 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-black italic uppercase tracking-tight">Job Type</CardTitle>
                                    <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Select relevant job types</CardDescription>
                                </div>
                                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
                                    <Layout size={20} />
                                </div>
                            </CardHeader>
                            <CardContent className="p-10 space-y-10">
                                <div className="space-y-6 px-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Job Categories (Select All That Apply) *</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {JOB_TYPES.map((type) => {
                                            const isSelected = selectedTypes.includes(type);
                                            return (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => toggleType(type)}
                                                    className={`h-20 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 transition-all group relative overflow-hidden ${isSelected
                                                            ? 'border-slate-900 bg-slate-900 text-white shadow-2xl shadow-slate-200'
                                                            : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-blue-100 hover:bg-blue-50 hover:text-blue-600'
                                                        }`}
                                                >
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-200 group-hover:border-blue-200'}`}>
                                                        {isSelected && <Check size={12} className="text-white" />}
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{type}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="p-10 bg-slate-50/30 flex justify-between items-center">
                                <Button 
                                    type="button" 
                                    onClick={handleBack}
                                    variant="ghost" 
                                    className="h-16 px-8 rounded-2xl text-slate-400 hover:text-blue-600 font-bold uppercase tracking-widest text-[10px] gap-2"
                                >
                                    <ChevronRight size={14} className="rotate-180" /> Back to Step 2
                                </Button>
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
                                            Step 05: Compensation <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>
            </div>
            
            <footer className="pt-20 text-center">
                 <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.8em]">End of Job Requirements Setup</p>
            </footer>
        </div>
    );
}
