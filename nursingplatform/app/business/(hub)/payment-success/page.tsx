"use client";
import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
    CheckCircle, Download, LayoutDashboard, 
    Calendar, CreditCard, Hash, FileText, 
    ArrowRight, ShieldCheck, Loader2,
    Sparkles, Zap, ShieldAlert, FileCheck
} from 'lucide-react';

import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [date, setDate] = useState('');
  const [txnId, setTxnId] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setDate(new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }));
    setTxnId(`TXN-SUB-${Math.random().toString(36).substring(2, 7).toUpperCase()}`);
  }, []);

  const handleDownloadReceipt = async () => {
    setUploading(true);
    try {
      if (!(window as any).jspdf) {
        const s1 = document.createElement('script');
        s1.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        document.head.appendChild(s1);
        await new Promise((resolve) => s1.onload = resolve);
      }

      if (!(window as any).jspdf.jsPDF.prototype.autoTable) {
        const s2 = document.createElement('script');
        s2.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js';
        document.head.appendChild(s2);
        await new Promise((resolve) => s2.onload = resolve);
      }

      const { jsPDF } = (window as any).jspdf;
      const doc = new jsPDF();

      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 210, 50, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(28);
      doc.text('NurseFlex Network', 20, 30);
      doc.setFontSize(10);
      doc.text('SUBSCRIPTION RECEIPT', 20, 40);

      doc.setTextColor(50, 50, 50);
      doc.setFontSize(12);
      doc.text('PAYMENT CONFIRMATION', 20, 70);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Payment Date: ${date}`, 20, 85);
      doc.text(`Transaction ID: ${txnId}`, 20, 92);
      doc.text(`Status: ACTIVE (RENEWAL ENABLED)`, 20, 99);

      (doc as any).autoTable({
        startY: 110,
        head: [['Description', 'Rate', 'Provision', 'Total']],
        body: [['Enterprise Subscription Plan', '£199.00', '£0.00', '£199.00']],
        headStyles: { fillColor: [15, 23, 42], fontStyle: 'bold' },
        theme: 'grid'
      });

      doc.save(`NurseFlex_Receipt_${txnId}.pdf`);
      // Keeping original alert for consistency
      alert("Receipt Generated! Your account is now active.");
    } catch (error) {
      console.error('PDF Generation failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl w-full space-y-12 animate-in fade-in zoom-in-95 duration-1000">
      <Card className="border-none shadow-2xl shadow-blue-100/50 bg-white rounded-[4rem] overflow-hidden">
        <div className="bg-slate-900 p-16 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 rounded-[2rem] mb-10 shadow-2xl border border-white/20 relative z-10 scale-110">
            <CheckCircle size={48} className="text-emerald-400" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter italic mb-4 uppercase relative z-10">Payment Successful</h1>
          <Badge className="bg-blue-600 font-black text-[9px] uppercase tracking-[0.3em] px-4 py-1.5 shadow-lg shadow-blue-950/20 italic relative z-10">Account Active</Badge>
        </div>

        <CardContent className="p-12 space-y-10">
          <div className="bg-blue-50/50 p-8 rounded-[2.5rem] border border-blue-100/50 flex items-start gap-6 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full blur-2xl -mr-12 -mt-12"></div>
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shrink-0 shadow-lg shadow-blue-100 relative z-10">
                <ShieldCheck size={28} />
            </div>
            <div className="space-y-3 relative z-10">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Access Your Receipt</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Your subscription is now active. Please download your receipt below for your records. You can now access all premium features.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleDownloadReceipt}
              disabled={uploading}
              className="w-full h-20 rounded-[2rem] font-bold text-sm transition-all bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 shadow-inner group"
            >
              {uploading ? (
                <div className="flex items-center gap-4">
                    <Loader2 className="animate-spin" size={24} /> Generating Receipt...
                </div>
              ) : (
                <div className="flex items-center gap-4">
                    <Download size={24} className="group-hover:-translate-y-1 transition-transform" /> Download Receipt
                </div>
              )}
            </Button>

            <Separator className="my-8 bg-slate-50" />

            <Button asChild size="lg" className="w-full h-20 rounded-[2rem] bg-slate-900 hover:bg-blue-600 text-white font-black uppercase tracking-tighter italic text-xl shadow-2xl transition-all active:scale-[0.97] group">
              <Link href="/business/dashboard" className="flex items-center justify-center gap-4">
                Go to Dashboard <LayoutDashboard size={24} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50/50 px-12 py-8 border-t border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-600">Subscription Active</span>
            </div>
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">E-ID: {txnId.slice(-5)}</p>
        </CardFooter>
      </Card>
      
      <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.8em]">End of Payment Confirmation</p>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 [background-image:linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] [background-size:24px_24px]">
      <Suspense fallback={
        <Card className="max-w-xl w-full h-96 bg-white rounded-[4rem] shadow-2xl flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <Loader2 className="animate-spin text-blue-600" size={48} />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 italic animate-pulse">Confirming Payment...</p>
            </div>
        </Card>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
