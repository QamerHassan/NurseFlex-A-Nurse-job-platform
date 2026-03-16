"use client";
import React, { useState } from 'react';
import { 
    HelpCircle, ChevronRight, Plus, Minus,
    Zap, ArrowRight, Loader2, Info,
    Settings, Target, Users, Clock,
    Layout, Briefcase, CreditCard,
    DollarSign, PoundSterling
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
} from "../../../../components/ui/select";
import { Separator } from "@/app/components/ui/separator";

export default function CompensationPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.push('/business/post-job/description');
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
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase underline decoration-blue-500/20 underline-offset-8 decoration-8">Compensation & Benefits</h1>
                        <Badge className="bg-blue-600 font-black text-[9px] uppercase tracking-[0.3em] px-3 shadow-lg shadow-blue-100 italic">Step 05</Badge>
                    </div>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Define pay rates and benefits for this position</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Protocol Info */}
                <aside className="lg:col-span-4 space-y-8">
                    <Card className="border-none shadow-2xl shadow-blue-50 bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="relative z-10 space-y-6">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 border border-white/20 shadow-2xl transition-transform group-hover:rotate-12">
                                <DollarSign size={28} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-black uppercase tracking-widest italic text-blue-400">Salary & Rates</h3>
                                <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight">
                                    "Transparent pay rates increase applicant interest by 40%. Ensure rates align with market benchmarks."
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
                                <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= 5 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                            ))}
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Setting Pay Rates...</p>
                    </div>
                </aside>

                {/* Main Compensation Form */}
                <div className="lg:col-span-8">
                    <form onSubmit={handleSubmit} className="space-y-10">
                        <Card className="border-none shadow-2xl shadow-blue-50/50 bg-white rounded-[3rem] overflow-hidden">
                            <CardHeader className="p-10 pb-0 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-black italic uppercase tracking-tight">Salary Details</CardTitle>
                                    <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Pay Rates & Compensation</CardDescription>
                                </div>
                                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
                                    <CreditCard size={20} />
                                </div>
                            </CardHeader>
                            <CardContent className="p-10 space-y-10">
                                <div className="space-y-8">
                                    <div className="space-y-4 px-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pay Format (Show Pay By)</Label>
                                        <Select defaultValue="Range">
                                            <SelectTrigger className="h-16 px-6 rounded-[2rem] bg-slate-50/50 border-slate-100 font-black text-slate-900 focus:ring-0 focus:bg-white transition-all text-sm uppercase">
                                                <SelectValue placeholder="SELECT PAY MODE" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                                                <SelectItem value="Range" className="font-bold text-[10px] uppercase h-12">Salary Range</SelectItem>
                                                <SelectItem value="Starting amount" className="font-bold text-[10px] uppercase h-12">Starting From</SelectItem>
                                                <SelectItem value="Maximum amount" className="font-bold text-[10px] uppercase h-12">Maximum Up To</SelectItem>
                                                <SelectItem value="Exact amount" className="font-bold text-[10px] uppercase h-12">Exact Amount</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8 items-end">
                                        <div className="space-y-4 px-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Minimum Rate</Label>
                                            <div className="relative">
                                                <PoundSterling className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                                <Input type="number" placeholder="0.00" className="h-20 pl-16 rounded-[2rem] bg-slate-50/50 border-slate-100 font-black text-2xl text-slate-900 focus-visible:ring-0 focus-visible:bg-white transition-all uppercase" />
                                            </div>
                                        </div>

                                        <div className="space-y-4 px-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Maximum Rate</Label>
                                            <div className="relative">
                                                <PoundSterling className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                                <Input type="number" placeholder="0.00" className="h-20 pl-16 rounded-[2rem] bg-slate-50/50 border-slate-100 font-black text-2xl text-slate-900 focus-visible:ring-0 focus-visible:bg-white transition-all uppercase" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 px-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pay Period (Rate)</Label>
                                        <Select defaultValue="per hour">
                                            <SelectTrigger className="h-16 px-6 rounded-[2rem] bg-slate-50/50 border-slate-100 font-black text-slate-900 focus:ring-0 focus:bg-white transition-all text-sm uppercase">
                                                <SelectValue placeholder="SELECT RATE" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                                                <SelectItem value="per hour" className="font-bold text-[10px] uppercase h-12">Per Hour</SelectItem>
                                                <SelectItem value="per day" className="font-bold text-[10px] uppercase h-12">Per Day</SelectItem>
                                                <SelectItem value="per week" className="font-bold text-[10px] uppercase h-12">Per Week</SelectItem>
                                                <SelectItem value="per month" className="font-bold text-[10px] uppercase h-12">Per Month</SelectItem>
                                                <SelectItem value="per year" className="font-bold text-[10px] uppercase h-12">Per Year</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                    <ChevronRight size={14} className="rotate-180" /> Back to Step 4
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
                                            Next Step: Job Description <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>
            </div>
            
            <footer className="pt-20 text-center">
                 <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.8em]">End of Compensation Setup</p>
            </footer>
        </div>
    );
}
