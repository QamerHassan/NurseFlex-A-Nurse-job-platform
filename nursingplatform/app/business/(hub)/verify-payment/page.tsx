"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
    ShieldCheck, Upload, FileText, 
    CheckCircle, Loader2, Info, 
    ArrowRight, Lock, FileSearch,
    ChevronLeft, ShieldAlert
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";

export default function VerifyPaymentPage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkStatus = () => {
            const userStr = localStorage.getItem('business_user');
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user.status === 'Active') {
                    router.push('/business/dashboard');
                }
            }
        };

        const interval = setInterval(checkStatus, 1500);
        window.addEventListener('storage', checkStatus);
        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', checkStatus);
        };
    }, [router]);

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);

        try {
            const userStr = localStorage.getItem('business_user');
            const user = userStr ? JSON.parse(userStr) : { email: "user@example.com", name: "Business User" };

            const existing = JSON.parse(localStorage.getItem('pending_business_approvals') || '[]');

            const newRequest = {
                id: Date.now(),
                name: user.name || user.businessName || "Business User",
                email: user.email,
                status: 'Pending Admin Review',
                document: "Business_License.pdf",
                paymentProof: file.name,
                date: new Date().toLocaleDateString()
            };

            localStorage.setItem('pending_business_approvals', JSON.stringify([...existing, newRequest]));
            localStorage.setItem('business_user', JSON.stringify({ ...user, status: 'Pending Admin Review' }));
            window.dispatchEvent(new Event('storage'));

            setIsSubmitted(true);
        } catch (err) {
            alert("Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="h-[90vh] flex items-center justify-center p-6 bg-slate-900 perspective-1000">
                <Card className="max-w-md w-full border-none shadow-2xl shadow-pink-500/20 bg-white rounded-[4rem] p-12 text-center relative overflow-hidden ring-[20px] ring-white/5">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-5xl mx-auto mb-10 shadow-2xl shadow-slate-950/20 animate-bounce">
                           <CheckCircle size={40} className="text-emerald-400" />
                        </div>
                        <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">Receipt<br/>Submitted</h2>
                        <p className="text-slate-500 font-medium text-sm mb-12 leading-relaxed px-4">
                            Your payment receipt has been received and is being verified by our team. Your dashboard features will be unlocked as soon as the review is complete.
                        </p>
                        <Button asChild size="lg" className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs shadow-2xl transition-all">
                            <Link href="/business/dashboard">Go to Dashboard</Link>
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900 [background-size:40px_40px] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)]">
            <Card className="max-w-xl w-full border-none shadow-2xl shadow-blue-500/10 bg-white rounded-[4rem] p-12 relative overflow-hidden border-b-[20px] border-blue-600">
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
                <header className="text-center mb-12 relative z-10">
                    <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-slate-300 group-hover:rotate-6 transition-transform">
                        <ShieldCheck size={36} className="text-pink-400" />
                    </div>
                    <h2 className="text-4xl font-bold text-slate-900 tracking-tight leading-tight">Verify Payment</h2>
                    <p className="text-slate-500 font-medium text-xs mt-4">Upload your verification receipt</p>
                </header>

                <div className="space-y-10 relative z-10">
                    <div className="bg-pink-50/50 p-8 rounded-[2.5rem] border border-pink-100 flex items-start gap-6 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <FileSearch size={80} />
                        </div>
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-pink-600 shadow-lg shadow-pink-100 shrink-0">
                            <Info size={24} />
                        </div>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                            To activate your account, please upload the PDF Receipt you downloaded after checkout. This helps us verify your payment and grant full access.
                        </p>
                    </div>

                    <form onSubmit={handleUpload} className="space-y-8">
                        <div className="relative group">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                required
                            />
                            <div className={`p-16 border-4 border-dashed rounded-[3.5rem] transition-all flex flex-col items-center justify-center gap-6 ${file ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-100 group-hover:border-blue-500 group-hover:bg-slate-50 bg-slate-50/50'}`}>
                                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-4xl transition-all duration-700 shadow-2xl ${file ? 'bg-emerald-500 text-white scale-110 shadow-emerald-100' : 'bg-white text-slate-300 group-hover:scale-110 shadow-slate-100'}`}>
                                    {file ? <CheckCircle size={40} /> : <Upload size={40} />}
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-slate-900 text-base">
                                        {file ? file.name : 'Upload Receipt PDF'}
                                    </p>
                                    <Badge variant="outline" className="mt-2 border-slate-200 text-[10px] font-bold text-slate-400">Max File Size 5MB</Badge>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={uploading || !file}
                            className={`w-full h-20 rounded-[2rem] font-black uppercase tracking-tighter italic text-xl transition-all flex items-center justify-center gap-4 ${uploading ? 'bg-slate-100 text-slate-300' : 'bg-slate-900 hover:bg-pink-600 text-white shadow-2xl active:scale-[0.98]'}`}
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="animate-spin" size={24} /> Validating...
                                </>
                            ) : (
                                <>
                                    Submit for Verification <ArrowRight size={24} />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="text-center">
                        <Button asChild variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-pink-600 transition-colors gap-3">
                            <Link href="/business/payment-success">
                                <ChevronLeft size={14} /> Back to Receipt
                            </Link>
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
