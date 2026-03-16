"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import {
    HelpCircle, ChevronRight, Building2,
    Globe, User, Phone, Zap,
    ShieldCheck, ArrowRight, Loader2,
    Settings, Info
} from 'lucide-react';
import { useRouter } from 'next/navigation';

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

export default function EmployerAccountSetupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.push('/business/post-job/basics');
        }, 800);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 py-10 animate-in fade-in duration-1000">
            <header className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-slate-100 pb-12">
                <div className="text-center md:text-left space-y-4">
                    <div className="flex items-center gap-4 justify-center md:justify-start mb-2">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase underline decoration-blue-500/20 underline-offset-8 decoration-8">Initialize Node</h1>
                        <Badge className="bg-blue-600 font-black text-[9px] uppercase tracking-[0.3em] px-3 shadow-lg shadow-blue-100 italic">Phase 01</Badge>
                    </div>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Configuring institutional credentials and synchronization</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Protocol Info */}
                <aside className="lg:col-span-4 space-y-8">
                    <Card className="border-none shadow-2xl shadow-blue-50 bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="relative z-10 space-y-6">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 border border-white/20 shadow-2xl transition-transform group-hover:rotate-12">
                                <ShieldCheck size={28} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-black uppercase tracking-widest italic text-blue-400">Security Clearance</h3>
                                <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight">
                                    "Institutional data is encrypted using Node-Protocol 7. Credentials are only used for network synchronization and cluster identification."
                                </p>
                            </div>
                        </div>
                    </Card>

                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-4">
                        <div className="flex items-center gap-3 text-blue-600">
                            <Info size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest italic">Mission Progress</span>
                        </div>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className={`h-1.5 flex-1 rounded-full ${i === 1 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                            ))}
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Awaiting Parameter Input...</p>
                    </div>
                </aside>

                {/* Main Setup Form */}
                <div className="lg:col-span-8">
                    <form onSubmit={handleSubmit} className="space-y-10">
                        <Card className="border-none shadow-2xl shadow-blue-50/50 bg-white rounded-[3rem] overflow-hidden">
                            <CardHeader className="p-10 pb-0 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-black italic uppercase tracking-tight">Entity Identification</CardTitle>
                                    <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Essential Institutional Parameters</CardDescription>
                                </div>
                                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
                                    <Settings size={20} />
                                </div>
                            </CardHeader>
                            <CardContent className="p-10 space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2 space-y-4 px-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Institutional Designation *</Label>
                                        <div className="relative">
                                            <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <Input required placeholder="E.G. METRO HEALTH TRUST" className="h-16 pl-16 rounded-[1.5rem] bg-slate-50/50 border-slate-100 font-black text-slate-900 focus-visible:ring-0 focus-visible:bg-white transition-all text-base uppercase" />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-4 px-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Node Domain (Website)</Label>
                                        <div className="relative">
                                            <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <Input type="url" placeholder="HTTPS://WWW.HEALTH-NET.IO" className="h-16 pl-16 rounded-[1.5rem] bg-slate-50/50 border-slate-100 font-black text-slate-900 focus-visible:ring-0 focus-visible:bg-white transition-all text-base uppercase" />
                                        </div>
                                    </div>

                                    <div className="space-y-4 px-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Signatory First Name *</Label>
                                        <div className="relative">
                                            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <Input required defaultValue="Qamer" className="h-16 pl-16 rounded-[1.5rem] bg-slate-50/50 border-slate-100 font-black text-slate-900 focus-visible:ring-0 focus-visible:bg-white transition-all text-base uppercase" />
                                        </div>
                                    </div>
                                    <div className="space-y-4 px-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Signatory Last Name *</Label>
                                        <div className="relative">
                                            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <Input required defaultValue="Hassan" className="h-16 pl-16 rounded-[1.5rem] bg-slate-50/50 border-slate-100 font-black text-slate-900 focus-visible:ring-0 focus-visible:bg-white transition-all text-base uppercase" />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-4 px-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Discovery Origin</Label>
                                        <Select>
                                            <SelectTrigger className="h-16 px-6 rounded-[1.5rem] bg-slate-50/50 border-slate-100 font-black text-slate-900 focus:ring-0 focus:bg-white transition-all text-sm uppercase">
                                                <SelectValue placeholder="SELECT CHANNEL" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                                                <SelectItem value="search" className="font-bold text-[10px] uppercase h-12">Online Search Cluster</SelectItem>
                                                <SelectItem value="social" className="font-bold text-[10px] uppercase h-12">Social Node Network</SelectItem>
                                                <SelectItem value="referral" className="font-bold text-[10px] uppercase h-12">Institutional Referral</SelectItem>
                                                <SelectItem value="other" className="font-bold text-[10px] uppercase h-12">Alternate Signal</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="md:col-span-2 space-y-4 px-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Frequency Uplink (Phone)</Label>
                                        <div className="flex gap-4">
                                            <div className="w-32">
                                                <Input defaultValue="+1" className="h-16 text-center rounded-[1.5rem] bg-slate-100 border-none font-black text-slate-900" />
                                            </div>
                                            <div className="flex-1 relative">
                                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                                <Input required type="tel" placeholder="UPLINK NUMBER" className="h-16 pl-16 rounded-[1.5rem] bg-slate-50/50 border-slate-100 font-black text-slate-900 focus-visible:ring-0 focus-visible:bg-white transition-all text-base uppercase" />
                                            </div>
                                        </div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Used for institutional verification cycles. Private encrypted data.</p>
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
                                            <Loader2 className="animate-spin" size={20} /> SYNCING...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            Phase 02: Initial Basics <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>

                    <div className="mt-12 text-center">
                        <Link href="/dashboard" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
                            Switch Terminal to Job Seeker <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>

            <footer className="pt-20 text-center">
                <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.8em]">End of Identification Protocol</p>
            </footer>
        </div>
    );
}
