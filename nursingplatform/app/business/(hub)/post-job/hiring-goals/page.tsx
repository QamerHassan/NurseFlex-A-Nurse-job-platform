"use client";
import React, { useState } from 'react';
import { 
    HelpCircle, ChevronRight, Plus, Minus,
    Zap, ArrowRight, Loader2, Info,
    Settings, Target, Users, Clock,
    Calendar
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

export default function HiringGoalsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [hireCount, setHireCount] = useState<number>(5);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.push('/business/post-job/details');
        }, 800);
    };

    const handleBack = () => {
        router.back();
    };

    const decrementLocal = () => setHireCount(Math.max(1, hireCount - 1));
    const incrementLocal = () => setHireCount(hireCount + 1);

    return (
        <div className="max-w-4xl mx-auto space-y-12 py-10 animate-in fade-in duration-1000">
            <header className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-slate-100 pb-12">
                <div className="text-center md:text-left space-y-4">
                    <div className="flex items-center gap-4 justify-center md:justify-start mb-2">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase underline decoration-blue-500/20 underline-offset-8 decoration-8">Hiring Goals</h1>
                        <Badge className="bg-blue-600 font-black text-[9px] uppercase tracking-[0.3em] px-3 shadow-lg shadow-blue-100 italic">Step 02</Badge>
                    </div>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Define how many people you need to hire and by when</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Protocol Info */}
                <aside className="lg:col-span-4 space-y-8">
                    <Card className="border-none shadow-2xl shadow-blue-50 bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="relative z-10 space-y-6">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 border border-white/20 shadow-2xl transition-transform group-hover:rotate-12">
                                <Users size={28} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-black uppercase tracking-widest italic text-blue-400">Number of Hires</h3>
                                <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight">
                                    "Specify the number of healthcare professionals you need for this position to help us find the best matches."
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
                                <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= 3 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                            ))}
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Setting Goals...</p>
                    </div>
                </aside>

                {/* Main Hiring Goals Form */}
                <div className="lg:col-span-8">
                    <form onSubmit={handleSubmit} className="space-y-10">
                        <Card className="border-none shadow-2xl shadow-blue-50/50 bg-white rounded-[3rem] overflow-hidden">
                            <CardHeader className="p-10 pb-0 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-black italic uppercase tracking-tight">Hiring Goals</CardTitle>
                                    <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Timeline and hire counts</CardDescription>
                                </div>
                                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
                                    <Clock size={20} />
                                </div>
                            </CardHeader>
                            <CardContent className="p-10 space-y-10">
                                <div className="space-y-4 px-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Hiring Timeline *</Label>
                                    <Select defaultValue="1_to_3_days">
                                        <SelectTrigger className="h-16 px-6 rounded-[1.5rem] bg-slate-50/50 border-slate-100 font-black text-slate-900 focus:ring-0 focus:bg-white transition-all text-sm uppercase">
                                            <SelectValue placeholder="SELECT TIMELINE" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                                            <SelectItem value="1_to_3_days" className="font-bold text-[10px] uppercase h-12 italic">1 to 3 Days</SelectItem>
                                            <SelectItem value="3_to_7_days" className="font-bold text-[10px] uppercase h-12 italic">3 to 7 Days</SelectItem>
                                            <SelectItem value="1_to_2_weeks" className="font-bold text-[10px] uppercase h-12 italic">1 to 2 Weeks</SelectItem>
                                            <SelectItem value="2_to_4_weeks" className="font-bold text-[10px] uppercase h-12 italic">2 to 4 Weeks</SelectItem>
                                            <SelectItem value="more_than_4_weeks" className="font-bold text-[10px] uppercase h-12 italic">More than 4 Weeks</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Separator className="bg-slate-50" />

                                <div className="space-y-4 px-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Number of Hires *</Label>
                                    <div className="flex items-center gap-6">
                                        <div className="flex-1 bg-slate-50 border border-slate-100 rounded-[1.5rem] h-20 flex items-center px-8">
                                            <Input 
                                                type="number" 
                                                value={hireCount}
                                                onChange={(e) => setHireCount(parseInt(e.target.value) || 1)}
                                                className="bg-transparent border-none font-black text-2xl text-slate-900 focus-visible:ring-0 text-center"
                                            />
                                        </div>
                                        <div className="flex gap-4">
                                            <Button type="button" onClick={decrementLocal} className="w-16 h-16 rounded-[1.2rem] bg-white border border-slate-100 text-slate-900 hover:bg-slate-900 hover:text-white shadow-xl shadow-slate-100">
                                                <Minus size={24} />
                                            </Button>
                                            <Button type="button" onClick={incrementLocal} className="w-16 h-16 rounded-[1.2rem] bg-white border border-slate-100 text-slate-900 hover:bg-slate-900 hover:text-white shadow-xl shadow-slate-100">
                                                <Plus size={24} />
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest ml-1 italic">Total number of hires needed for this position.</p>
                                </div>
                            </CardContent>
                            <CardFooter className="p-10 bg-slate-50/30 flex justify-between items-center">
                                 <Button 
                                    type="button" 
                                    onClick={handleBack}
                                    variant="ghost" 
                                    className="h-16 px-8 rounded-2xl text-slate-400 hover:text-blue-600 font-bold uppercase tracking-widest text-[10px] gap-2"
                                >
                                    <ChevronRight size={14} className="rotate-180" /> Back to Step 1
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
                                            Next Step: Job Requirements <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>
            </div>
            
            <footer className="pt-20 text-center">
                 <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.8em]">Next Step: Job Requirements</p>
            </footer>
        </div>
    );
}
