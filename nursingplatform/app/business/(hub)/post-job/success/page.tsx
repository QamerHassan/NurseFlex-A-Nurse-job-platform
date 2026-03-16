"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
    CheckCircle, Download, ArrowRight, 
    ShieldCheck, Loader2, Hash, 
    Calendar, CreditCard, FileText, 
    Zap, Share2, Printer, LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';

import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";

function SuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const paymentIntentId = searchParams.get('paymentIntentId');
    const tierId = searchParams.get('tierId');
    const [date, setDate] = useState('');
    const [txnId, setTxnId] = useState('');
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        setDate(new Date().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }));

        if (paymentIntentId) {
            const base = paymentIntentId.replace('pi_', '').slice(0, 6).toUpperCase();
            const random = Math.random().toString(36).substring(2, 6).toUpperCase();
            setTxnId(`TXN-${base}${random}`.slice(0, 10));
        } else {
            setTxnId(`TXN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
        }
    }, [paymentIntentId, tierId]);

    const handleDownloadReceipt = async () => {
        setGenerating(true);
        setTimeout(() => {
            setGenerating(false);
            alert("Receipt downloaded successfully.");
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 py-10 animate-in fade-in zoom-in duration-1000">
            {/* Header / Success Indicator */}
            <div className="text-center space-y-6">
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse"></div>
                    <div className="relative w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white border border-slate-800 shadow-2xl transition-transform hover:rotate-12">
                        <CheckCircle size={48} strokeWidth={2.5} />
                    </div>
                </div>
                <div className="space-y-2">
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase underline decoration-blue-500/20 underline-offset-[12px] decoration-8">Job Post Approved</h1>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.4em]">Your job is now being shared across the network</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Receipt Details Card */}
                <div className="lg:col-span-8">
                    <Card className="border-none shadow-2xl shadow-blue-50 bg-white rounded-[4rem] overflow-hidden">
                        <CardHeader className="p-12 pb-6 border-b border-slate-50 bg-slate-50/30">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-xl border border-slate-100">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-black italic uppercase tracking-tight">Payment Receipt</CardTitle>
                                        <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Transaction Verified</CardDescription>
                                    </div>
                                </div>
                                <Badge className="bg-emerald-50 text-emerald-600 font-black text-[10px] uppercase tracking-widest px-4 py-1.5 border-none italic">PAYMENT SECURE</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-12 space-y-10">
                            <div className="grid md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Plan Subscribed</p>
                                        <p className="text-lg font-black text-slate-900 uppercase italic tracking-tighter">{tierId === 'pro' ? 'Registered Nurse - PRO MAX' : 'Job Posting'}</p>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <Hash className="text-slate-300" size={18} />
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Transaction ID</p>
                                                <p className="text-sm font-black text-slate-700 uppercase tracking-tighter">{txnId}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Calendar className="text-slate-300" size={18} />
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Activation Date</p>
                                                <p className="text-sm font-black text-slate-700 uppercase tracking-tighter">{date}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-2 text-right">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Amount Paid</p>
                                        <p className="text-4xl font-black text-blue-600 italic tracking-tighter">£22.00</p>
                                    </div>
                                    <div className="space-y-4 flex flex-col items-end">
                                        <div className="flex items-center gap-4 text-right">
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Payment Method</p>
                                                <p className="text-sm font-black text-slate-700 uppercase tracking-tighter italic">Visa (**** 4242)</p>
                                            </div>
                                            <CreditCard className="text-slate-300" size={18} />
                                        </div>
                                        <div className="flex items-center gap-4 text-right">
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Status</p>
                                                <Badge className="bg-emerald-500 text-white font-black text-[9px] uppercase tracking-widest border-none px-3 py-1 italic">ACTIVE</Badge>
                                            </div>
                                            <CheckCircle className="text-emerald-500" size={18} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator className="bg-slate-50" />

                            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-6">
                                <div className="flex items-center gap-3 text-blue-600">
                                    <Zap size={18} />
                                    <p className="text-[10px] font-black uppercase tracking-widest italic">Important Notice</p>
                                </div>
                                <p className="text-xs font-bold text-slate-500 uppercase leading-loose tracking-tight italic">
                                    "Your job post is now live. We are notifying qualified candidates about your opening."
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="p-10 pt-0 bg-slate-50/20 border-t border-slate-50/50 flex flex-col md:flex-row gap-6 items-center justify-between">
                            <div className="flex gap-4">
                                <Button variant="ghost" className="h-12 px-6 rounded-xl text-slate-400 hover:text-slate-900 font-black uppercase tracking-widest text-[9px] gap-2">
                                    <Printer size={16} /> Print Receipt
                                </Button>
                                <Button variant="ghost" className="h-12 px-6 rounded-xl text-slate-400 hover:text-slate-900 font-black uppercase tracking-widest text-[9px] gap-2">
                                    <Share2 size={16} /> Share Post
                                </Button>
                            </div>
                            <Button 
                                onClick={handleDownloadReceipt}
                                disabled={generating}
                                className="h-14 px-10 rounded-2xl bg-white border border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white font-black uppercase tracking-widest text-[10px] gap-3 shadow-xl shadow-slate-100 transition-all hover:scale-105 active:scale-95"
                            >
                                {generating ? <Loader2 className="animate-spin" size={16} /> : <Download size={18} />}
                                {generating ? 'Downloading...' : 'Download Receipt'}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Right Column: Path Redirects */}
                <div className="lg:col-span-4 space-y-8">
                     <Card className="border-none shadow-2xl shadow-indigo-50 bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="relative z-10 space-y-8">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/20 transition-transform group-hover:rotate-12 group-hover:scale-110">
                                <ShieldCheck size={32} />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-lg font-black uppercase tracking-widest italic text-blue-400 underline decoration-blue-400/20 underline-offset-8">Next Steps</h3>
                                <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight italic">
                                    "Please complete your profile verification to ensure your job post reaches the maximum number of candidates."
                                </p>
                            </div>
                            <Link href="/business/verify-payment" className="block">
                                <Button className="w-full h-16 rounded-2xl bg-white text-slate-900 hover:bg-blue-600 hover:text-white font-black uppercase tracking-widest text-[10px] gap-3 transition-all group/btn shadow-2xl shadow-white/5">
                                    Verify Account <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
                                </Button>
                            </Link>
                        </div>
                    </Card>

                    <Link href="/business/dashboard" className="block">
                        <Card className="border-none bg-white shadow-xl shadow-slate-100/50 rounded-[2.5rem] p-8 group hover:bg-slate-50 transition-all cursor-pointer border border-slate-100">
                             <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                        <LayoutDashboard size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Return to</p>
                                        <p className="text-sm font-black text-slate-900 uppercase italic tracking-tighter">Dashboard</p>
                                    </div>
                                </div>
                                <ArrowRight size={18} className="text-slate-200 group-hover:text-slate-900 transition-all group-hover:translate-x-1" />
                             </div>
                        </Card>
                    </Link>

                    <div className="text-center p-4">
                        <p className="text-[9px] font-black text-slate-200 uppercase tracking-[0.6em]">Receipt ID: tx_92384_approved</p>
                    </div>
                </div>
            </div>
            
            <footer className="pt-20 text-center">
                 <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.8em]">End of Success Message</p>
            </footer>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-blue-600" size={48} /></div>}>
            <SuccessContent />
        </Suspense>
    );
}
