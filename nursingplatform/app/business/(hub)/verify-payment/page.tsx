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
            <div className="h-[90vh] flex items-center justify-center p-6">
                <Card className="max-w-md w-full border border-slate-100 shadow-2xl shadow-blue-50 bg-white rounded-3xl p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-50/50 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-green-100">
                           <CheckCircle size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">Verification Sent</h2>
                        <p className="text-slate-500 font-medium text-sm mb-10 leading-relaxed px-4">
                            Your payment receipt has been received and is being verified. Your dashboard features will be unlocked as soon as the review is complete.
                        </p>
                        <Button asChild size="lg" className="w-full h-14 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-100">
                            <Link href="/business/dashboard">Go to Dashboard</Link>
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50/50">
            <Card className="max-w-xl w-full border border-slate-100 shadow-2xl shadow-blue-50 bg-white rounded-3xl p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <header className="text-center mb-10 relative z-10">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-blue-100">
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Account Verification</h2>
                    <p className="text-slate-400 font-medium text-xs mt-3 uppercase tracking-widest">Secure Document Upload</p>
                </header>

                <div className="space-y-8 relative z-10">
                    <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex items-start gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                            <Info size={20} />
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                            To activate your account, please upload the PDF Receipt from your checkout. Our team will verify it within 24 hours.
                        </p>
                    </div>

                    <form onSubmit={handleUpload} className="space-y-6">
                        <div className="relative group">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                required
                            />
                            <div className={`p-12 border-2 border-dashed rounded-2xl transition-all flex flex-col items-center justify-center gap-4 ${file ? 'border-green-500 bg-green-50/30' : 'border-slate-200 group-hover:border-blue-500 group-hover:bg-slate-50 bg-slate-50/20'}`}>
                                <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl transition-all duration-500 shadow-lg ${file ? 'bg-green-500 text-white shadow-green-100' : 'bg-white text-slate-300 shadow-slate-50'}`}>
                                    {file ? <CheckCircle size={28} /> : <Upload size={28} />}
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-slate-900 text-sm">
                                        {file ? file.name : 'Upload Receipt PDF'}
                                    </p>
                                    <Badge variant="outline" className="mt-2 border-slate-200 text-[9px] font-bold text-slate-400">PDF ONLY • MAX 5MB</Badge>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={uploading || !file}
                            className={`w-full h-14 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${uploading ? 'bg-slate-100 text-slate-300' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100 active:scale-95'}`}
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} /> Processing...
                                </>
                            ) : (
                                <>
                                    Verify Account <ArrowRight size={18} />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="text-center pt-2">
                        <Button asChild variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors gap-2">
                            <Link href="/business/payment-success" className="flex items-center">
                                <ChevronLeft size={14} /> Back to Receipt
                            </Link>
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
