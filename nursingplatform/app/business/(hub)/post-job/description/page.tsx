"use client";
import React, { useState } from 'react';
import { 
    HelpCircle, ChevronRight, Bold, Italic, 
    List, Trash2, Zap, ArrowRight, 
    Loader2, Info, Settings, FileText,
    Type, AlignLeft, Hash
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from "@/app/components/ui/button";
import { Textarea } from "../../../../components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";

export default function JobDescriptionPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const defaultText = `JOB SUMMARY
We are seeking a highly qualified Registered Nurse (RN) to join our clinical team. Responsibilities include providing high-quality patient care, administering medications, and collaborating with our multi-disciplinary team to optimize patient outcomes.

RESPONSIBILITIES
- Patient Care: Monitor and assess patient vitals and overall health.
- Medication Management: Administer medications and treatments with precision.
- Team Collaboration: Work within the healthcare team to develop comprehensive care plans.
- Documentation: Maintain accurate Electronic Health Records (EHR) and logs.

QUALIFICATIONS
- Valid RN License.
- +2 years of clinical experience.
- BLS/ACLS certification required.
- Strong critical thinking and compassion.`;

    const [description, setDescription] = useState(defaultText);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim()) {
            alert("Please enter a job description.");
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.push('/business/post-job/review'); // Keeping path for now to avoid broken links, but UI will say "Verify"
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
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase underline decoration-blue-500/20 underline-offset-8 decoration-8">Verify Job Details</h1>
                        <Badge className="bg-blue-600 font-black text-[9px] uppercase tracking-[0.3em] px-3 shadow-lg shadow-blue-100 italic">Step 03</Badge>
                    </div>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Write a clear description of the job and requirements</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Protocol Info */}
                <aside className="lg:col-span-4 space-y-8">
                    <Card className="border-none shadow-2xl shadow-blue-50 bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="relative z-10 space-y-6">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 border border-white/20 shadow-2xl transition-transform group-hover:rotate-12">
                                <AlignLeft size={28} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-black uppercase tracking-widest italic text-blue-400">Writing Tips</h3>
                                <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight">
                                    "Descriptions with clear bullet points achieve higher engagement. Clearly define requirements for optimal candidate matching."
                                </p>
                            </div>
                        </div>
                    </Card>

                    <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 space-y-4 shadow-sm">
                        <div className="flex items-center gap-3 text-blue-600">
                            <Info size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest italic">Job Posting Progress</span>
                        </div>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= 6 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                            ))}
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Writing Description...</p>
                    </div>
                </aside>

                {/* Main Description Form */}
                <div className="lg:col-span-8">
                    <form onSubmit={handleSubmit} className="space-y-10">
                        <Card className="border-none shadow-2xl shadow-blue-50/50 bg-white rounded-[3rem] overflow-hidden">
                            <CardHeader className="p-10 pb-0 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-black italic uppercase tracking-tight">Job Details</CardTitle>
                                    <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Enter job description and requirements</CardDescription>
                                </div>
                                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
                                    <Type size={20} />
                                </div>
                            </CardHeader>
                            <CardContent className="p-10 space-y-8">
                                <div className="space-y-4 px-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Job Description *</Label>
                                    
                                    <div className="border border-slate-100 rounded-[2rem] overflow-hidden focus-within:ring-4 focus-within:ring-blue-50 focus-within:border-blue-200 transition-all bg-white flex flex-col shadow-inner">
                                        {/* Premium Toolbar */}
                                        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-50 bg-slate-50/30">
                                            <div className="flex items-center gap-6">
                                                <button type="button" className="text-slate-400 hover:text-slate-900 hover:scale-110 transition-all">
                                                    <Bold size={16} strokeWidth={3} />
                                                </button>
                                                <button type="button" className="text-slate-400 hover:text-slate-900 hover:scale-110 transition-all">
                                                    <Italic size={16} />
                                                </button>
                                                <button type="button" className="text-slate-400 hover:text-slate-900 hover:scale-110 transition-all">
                                                    <List size={18} />
                                                </button>
                                                <Separator orientation="vertical" className="h-4 bg-slate-100 mx-2" />
                                                <button type="button" className="text-slate-400 hover:text-slate-900 hover:scale-110 transition-all">
                                                    <Hash size={16} />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <button type="button" onClick={() => setDescription('')} className="text-slate-300 hover:text-red-500 hover:rotate-12 transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <Textarea
                                            value={description}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                                            className="w-full h-[500px] p-10 outline-none border-none resize-none text-slate-700 font-bold text-sm leading-relaxed focus-visible:ring-0 bg-white selection:bg-blue-100 uppercase"
                                            placeholder="Enter job summary and responsibilities..."
                                            required
                                        />
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest ml-1 italic text-right px-4">Drafting...</p>
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
                                            Finalize Job Post <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>
            </div>
            
            <footer className="pt-20 text-center">
                 <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.8em]">Next Step: Review Job Post</p>
            </footer>
        </div>
    );
}
