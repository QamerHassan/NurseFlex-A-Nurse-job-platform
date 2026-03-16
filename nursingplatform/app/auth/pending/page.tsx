"use client";
import React from 'react';
import Link from 'next/link';
import { Clock, ShieldCheck, Mail, ArrowLeft, Home } from 'lucide-react';

export default function PendingApprovalPage() {
    const [isBusiness, setIsBusiness] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        setIsBusiness(user?.role === 'BUSINESS');
        setMounted(true);
    }, []);

    if (!mounted) return null; // Avoid flicker or mismatch during hydration

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-12">
            <div className="max-w-2xl w-full bg-white rounded-[4rem] p-16 border border-slate-100 shadow-2xl relative overflow-hidden text-center">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600 opacity-5 rounded-bl-[100px]"></div>

                <div className="relative z-10">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-blue-600 text-white mb-10 shadow-2xl shadow-blue-100 rotate-3 animate-pulse">
                        <Clock size={48} />
                    </div>

                    <h1 className="text-5xl font-black text-slate-900 italic uppercase tracking-tighter mb-6">
                        Account Under <span className="text-blue-600">Review</span>
                    </h1>

                    <div className="space-y-6 max-w-lg mx-auto mb-12">
                        <p className="text-slate-500 font-bold leading-relaxed text-lg">
                            {isBusiness
                                ? "Thank you for registering your business! We have received your payment and license documents. Our team is now verifying your credentials to activate your Business Hub."
                                : "Thank you for joining the Premier Nursing Network! Your application has been received and is currently being verified by our administrative team."}
                        </p>
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-center gap-4 text-slate-600">
                            <ShieldCheck className="text-blue-600" size={24} />
                            <p className="text-xs font-black uppercase tracking-widest italic">
                                Verification usually takes 24-48 hours
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/"
                            className="px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                        >
                            <Home size={18} /> Back to Home
                        </Link>
                        <Link
                            href="mailto:support@nursingplatform.com"
                            className="px-10 py-5 bg-white border-2 border-slate-100 text-slate-900 rounded-[2rem] font-black shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs italic"
                        >
                            <Mail size={18} /> Contact Support
                        </Link>
                    </div>

                    <p className="mt-12 text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
                        Professional • Verified • Elite
                    </p>
                </div>
            </div>
        </div>
    );
}
