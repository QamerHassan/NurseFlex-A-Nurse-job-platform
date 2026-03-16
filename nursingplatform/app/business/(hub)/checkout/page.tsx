"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
    Loader2, ShieldCheck, CreditCard, Lock, 
    ArrowRight, Check, Zap, Globe, Cpu,
    ChevronLeft, Info
} from 'lucide-react';

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";

import api from '@/lib/api';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tierId = searchParams.get('tierId');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tierId) router.push('/business/subscriptions');
  }, [tierId, router]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/subscriptions/checkout', { tierId, paymentMethod: 'card' });

      if (response.status === 201 || response.status === 200) {
        router.push('/business/payment-success');
      } else {
        alert("Payment processing failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Payment error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in zoom-in-95 duration-700">
      {/* Left: Transaction Details */}
      <div className="space-y-8">
        <header className="space-y-4">
            <button className="p-0 h-auto text-slate-400 hover:text-pink-600 font-bold text-xs gap-2 flex items-center transition-colors" onClick={() => router.back()}>
                <ChevronLeft size={14} /> Back to Plans
            </button>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Checkout</h2>
            <p className="text-slate-500 font-medium text-sm">Securely finalize your subscription plan</p>
        </header>

        <Card className="border-none shadow-2xl shadow-pink-50 bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="relative z-10 space-y-8">
                <div className="flex justify-between items-center">
                    <Badge variant="outline" className="border-white/20 text-pink-400 font-black text-[9px] uppercase tracking-widest bg-white/5">Order Summary</Badge>
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white"><Info size={18} /></div>
                </div>
                
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Selected Plan</p>
                    <h3 className="text-3xl font-bold tracking-tight">Enterprise</h3>
                </div>

                <Separator className="bg-white/5" />

                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Monthly Total</span>
                        <span className="text-3xl font-bold tracking-tight">$199.00</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tax</span>
                        <span className="text-sm font-bold text-slate-400">Included</span>
                    </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 shrink-0">
                        <ShieldCheck size={20} />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400 leading-relaxed">Secure payment processing. Your transaction is protected with industry-standard encryption.</p>
                </div>
            </div>
        </Card>
      </div>

      {/* Right: Payment Input */}
      <Card className="border-none shadow-2xl shadow-pink-100/50 bg-white rounded-[4rem] p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-full blur-[80px] -mr-24 -mt-24 pointer-events-none opacity-50"></div>
        <CardHeader className="px-0 pt-0 mb-8 relative z-10">
            <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
                    <CreditCard size={20} />
                </div>
                <CardTitle className="text-xl font-bold tracking-tight">Payment Details</CardTitle>
            </div>
            <CardDescription className="text-xs font-medium text-slate-500 ps-14">Card Information</CardDescription>
        </CardHeader>

        <form onSubmit={handlePayment} className="space-y-8 relative z-10">
            <div className="space-y-4">
                <Label className="text-xs font-bold text-slate-600 ml-2">Cardholder Name</Label>
                <Input required placeholder="E.G. HARVEY SPECTER" className="h-14 rounded-2xl bg-slate-50/50 border-slate-100 font-bold text-slate-900 focus-visible:ring-0 focus-visible:bg-white transition-all text-base uppercase" />
            </div>

            <div className="space-y-4">
                <Label className="text-xs font-bold text-slate-600 ml-2">Card Number</Label>
                <div className="relative">
                    <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <Input required placeholder="XXXX XXXX XXXX 4242" className="h-14 pl-16 rounded-2xl bg-slate-50/50 border-slate-100 font-bold text-slate-900 focus-visible:ring-0 focus-visible:bg-white transition-all text-base" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                    <Label className="text-xs font-bold text-slate-600 ml-2">Expiry Date</Label>
                    <Input required placeholder="MM/YY" className="h-14 rounded-2xl bg-slate-50/50 border-slate-100 font-bold text-slate-900 focus-visible:ring-0 focus-visible:bg-white transition-all text-base" />
                </div>
                <div className="space-y-4">
                    <Label className="text-xs font-bold text-slate-600 ml-2">CVV</Label>
                    <div className="relative">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <Input required placeholder="XXX" className="h-14 pl-14 rounded-2xl bg-slate-50/50 border-slate-100 font-bold text-slate-900 focus-visible:ring-0 focus-visible:bg-white transition-all text-base" />
                    </div>
                </div>
            </div>

            <Button
                type="submit"
                disabled={loading}
                className="w-full h-20 mt-4 bg-slate-900 hover:bg-pink-600 text-white rounded-[2rem] font-bold text-lg shadow-2xl transition-all active:scale-[0.98]"
            >
                {loading ? (
                    <div className="flex items-center gap-3">
                        <Loader2 className="animate-spin" size={24} /> Processing...
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        Pay Now <ArrowRight size={24} />
                    </div>
                )}
            </Button>
            
            <p className="text-center text-[9px] font-bold text-slate-300 uppercase tracking-widest">Industry standard encryption active</p>
        </form>
      </Card>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-[90vh] flex items-center justify-center p-6 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px]">
      <Suspense fallback={
        <Card className="max-w-xl w-full h-96 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <Loader2 className="animate-spin text-pink-600" size={48} />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 italic">Loading secure checkout...</p>
            </div>
        </Card>
      }>
        <CheckoutContent />
      </Suspense>
    </div>
  );
}