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
        <div className="min-h-screen flex items-center justify-center bg-white px-6 py-12">
            <div className="max-w-md w-full bg-white rounded-3xl p-10 border border-slate-100 shadow-xl relative overflow-hidden text-center mx-4">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-50 to-transparent rounded-bl-full opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-50 to-transparent rounded-tr-full opacity-60"></div>

                <div className="relative z-10">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-green-500 text-white mb-8 shadow-md">
                        <ShieldCheck size={36} />
                    </div>

                    <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                        Account Under Review
                    </h1>

                    <div className="space-y-4 max-w-sm mx-auto mb-8">
                        <p className="text-slate-500 text-sm leading-relaxed">
                            {isBusiness
                                ? "Thank you for partnering with NurseFlex. Our team is verifying your business details and payment information to ensure a secure network."
                                : "Thank you for joining NurseFlex. We are quickly reviewing your details to ensure the highest quality network."}
                        </p>
                        
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center justify-center gap-3">
                            <Clock className="text-blue-600 animate-pulse" size={18} />
                            <p className="text-xs font-semibold text-blue-800">
                                Usually completed within 24 hours
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Link
                            href="/"
                            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold shadow hover:from-blue-700 hover:to-green-700 transition-all flex items-center justify-center gap-2 text-sm"
                        >
                            <Home size={16} /> Return to Homepage
                        </Link>
                        <Link
                            href="mailto:support@nursingplatform.com"
                            className="w-full py-3.5 bg-slate-50 text-slate-600 rounded-xl font-semibold hover:bg-slate-100 transition-all flex items-center justify-center gap-2 text-sm"
                        >
                            <Mail size={16} /> Contact Support
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
