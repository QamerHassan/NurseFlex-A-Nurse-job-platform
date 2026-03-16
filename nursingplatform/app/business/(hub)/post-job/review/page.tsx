"use client";
import React, { useState } from 'react';
import { 
    HelpCircle, ChevronRight, Plus, Pencil, 
    Zap, ArrowRight, Loader2, Info,
    Settings, Target, Users, Clock,
    Layout, Briefcase, Eye, ShieldCheck,
    Globe, MapPin, DollarSign, FileText,
    Mail, Phone, Building2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";

export default function ReviewJobPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.push('/business/post-job/sponsor');
        }, 800);
    };

    const handleBack = () => {
        router.back();
    };

    const ReviewItem = ({ icon: Icon, label, value, isAction = false }: { icon: any, label: string, value: string | React.ReactNode, isAction?: boolean }) => (
        <div className="group flex items-start gap-6 py-8 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-all px-4 rounded-[1.5rem]">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-blue-600 shadow-sm border border-slate-50 transition-all group-hover:rotate-6 group-hover:scale-110">
                <Icon size={20} />
            </div>
            <div className="flex-1 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
                <div className={`text-sm font-black italic uppercase tracking-tighter ${isAction ? 'text-blue-600 cursor-pointer hover:underline' : 'text-slate-900'}`}>
                    {value}
                </div>
            </div>
            <Button variant="ghost" size="sm" className="h-10 w-10 rounded-xl text-slate-200 hover:text-blue-600 hover:bg-blue-50 opacity-0 group-hover:opacity-100 transition-all">
                <Pencil size={16} />
            </Button>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-12 py-10 animate-in fade-in duration-1000">
            <header className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-slate-100 pb-12">
                <div className="text-center md:text-left space-y-4">
                    <div className="flex items-center gap-4 justify-center md:justify-start mb-2">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase underline decoration-blue-500/20 underline-offset-8 decoration-8">Finalize Posting</h1>
                        <Badge className="bg-blue-600 font-black text-[9px] uppercase tracking-[0.3em] px-3 shadow-lg shadow-blue-100 italic">Verification</Badge>
                    </div>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Final review of job details before posting to the network</p>
                </div>
                <Button variant="outline" className="h-14 px-8 rounded-2xl border-slate-200 font-black uppercase tracking-widest text-[10px] gap-3 text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm">
                    Live Preview <Eye size={18} />
                </Button>
            </header>

            <div className="grid grid-cols-1 gap-12">
                {/* Deployment Metrics */}
                <Card className="border-none shadow-2xl shadow-blue-50/50 bg-white rounded-[4rem] overflow-hidden">
                    <CardHeader className="p-12 pb-6 border-b border-slate-50">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-slate-200">
                                <Target size={24} />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black italic uppercase tracking-tighter">Job Summary</CardTitle>
                                <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1 focus:ring-opacity-40">Core job information</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-12 space-y-4">
                        <ReviewItem icon={Briefcase} label="Job Title" value="Senior Registered Nurse (RN)" />
                        <ReviewItem icon={Users} label="Number of Openings" value="5 Active Positions" />
                        <ReviewItem icon={Globe} label="Language" value="English" />
                        <ReviewItem icon={MapPin} label="Location" value="London, UK" />
                        <ReviewItem icon={Layout} label="Job Type" value="Full-time" />
                        <ReviewItem icon={DollarSign} label="Compensation" value="£35,000 - £45,000 / Year" />
                        <ReviewItem icon={FileText} label="Job Description" value={
                            <div className="space-y-4 pt-2">
                                <p className="line-clamp-2 text-slate-500 font-bold normal-case italic">"DEPLOYMENT OF SPECIALIZED NURSING NODES FOR HIGH-INTENSITY CLINICAL INTERVENTION..."</p>
                                <Badge variant="outline" className="border-blue-100 text-blue-600 text-[8px] font-black px-3 py-1">COMPLETE</Badge>
                            </div>
                        } />
                    </CardContent>
                </Card>

                {/* Operational Settings */}
                <Card className="border-none shadow-2xl shadow-slate-100/50 bg-white rounded-[4rem] overflow-hidden">
                    <CardHeader className="p-12 pb-6 border-b border-slate-50">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-2xl shadow-slate-100 ring-2 ring-slate-50">
                                <Settings size={24} />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black italic uppercase tracking-tighter">Application Settings</CardTitle>
                                <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">How candidates apply</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-12 space-y-4">
                        <ReviewItem icon={Mail} label="Application Method" value="Email Link" />
                        <ReviewItem icon={FileText} label="Resume Requirement" value="CV Required" />
                        <ReviewItem icon={Clock} label="Hiring Timeline" value="2 to 4 Weeks" />
                    </CardContent>
                </Card>

                {/* Signatory Logic */}
                <Card className="border-none shadow-2xl shadow-slate-50 bg-white rounded-[4rem] overflow-hidden">
                    <CardHeader className="p-12 pb-6 border-b border-slate-50">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-xl shadow-blue-50">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black italic uppercase tracking-tighter">Contact Information</CardTitle>
                                <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Who candidates can contact</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-12 space-y-4">
                        <ReviewItem icon={Users} label="Contact Person" value="Qamer Hassan" />
                        <ReviewItem icon={Phone} label="Phone Number" value="+44 20 7123 4567" />
                        <ReviewItem icon={Building2} label="Company Name" value="NurseFlex Network Hospital" />
                    </CardContent>
                </Card>
            </div>

            {/* Footer Actions */}
            <footer className="pt-16 space-y-12">
                <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 text-center space-y-6">
                    <p className="text-[11px] text-slate-500 font-bold leading-relaxed uppercase tracking-tight max-w-2xl mx-auto">
                        "By clicking <span className="text-slate-900 font-black">Finalize Job Post</span>, you certify that this job posting adheres to professional standards and network security policies. The post will be shared across the NurseFlex network."
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 text-[9px] font-black text-slate-300 uppercase tracking-widest italic">
                        <Link href="#" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-blue-600 transition-colors">Data Protection</Link>
                    </div>
                </div>

                <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 px-4">
                    <Button 
                        type="button" 
                        onClick={handleBack}
                        variant="ghost" 
                        className="h-16 px-10 rounded-2xl text-slate-400 hover:text-blue-600 font-bold uppercase tracking-widest text-[10px] gap-3"
                    >
                        <ChevronRight size={14} className="rotate-180" /> Back to Previous Step
                    </Button>

                    <Button 
                        onClick={handleSubmit}
                        disabled={loading}
                        className="h-20 px-16 rounded-[2.5rem] bg-slate-900 hover:bg-blue-600 text-white font-black uppercase tracking-tighter italic text-2xl shadow-2xl transition-all active:scale-95 group"
                    >
                        {loading ? (
                            <div className="flex items-center gap-4">
                                <Loader2 className="animate-spin" size={28} /> PROCESSING...
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                Finalize Job Post <ArrowRight size={28} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        )}
                    </Button>
                </div>
            </footer>
            
            <footer className="pt-20 text-center">
                 <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.8em]">End of Job Review</p>
            </footer>
        </div>
    );
}
