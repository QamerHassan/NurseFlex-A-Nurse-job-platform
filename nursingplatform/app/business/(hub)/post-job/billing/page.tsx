"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { 
    HelpCircle, ChevronRight, Check, Star,
    Zap, ArrowRight, Loader2, Info,
    Settings, Target, Users, Clock,
    Layout, Briefcase, CreditCard,
    DollarSign, PoundSterling, ShieldCheck,
    Edit3, Globe, MapPin, Receipt,
    Lock, Calendar, X
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BaseUrl } from '@/lib/constants';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import EmployerProfileDropdown from '@/app/components/EmployerProfileDropdown';

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ clientSecret, tierId, onCancel }: { clientSecret: string, tierId: string, onCancel: () => void }) {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;
        setLoading(true);
        setError(null);

        const { error: submitError } = await elements.submit();
        if (submitError) {
            setError(submitError.message || "An error occurred");
            setLoading(false);
            return;
        }

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: `${window.location.origin}/business/dashboard`,
            },
            redirect: 'if_required',
        });

        if (error) {
            setError(error.message || "Payment Failed");
            setLoading(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            try {
                const token = localStorage.getItem("hospital_token");
                const res = await fetch(`${BaseUrl}/subscriptions/confirm`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ tierId, paymentIntentId: paymentIntent.id })
                });

                if (res.ok) {
                    router.push(`/business/post-job/success?paymentIntentId=${paymentIntent.id}&tierId=${tierId}`);
                } else {
                    setError("Failed to verify payment with the network. Please contact support.");
                    setLoading(false);
                }
            } catch (err) {
                setError("Network error confirming payment.");
                setLoading(false);
            }
        } else {
            setError("Unexpected payment status.");
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-10">
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-inner">
                <PaymentElement />
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex items-center gap-4 text-red-600 animate-in slide-in-from-top-4">
                    <X size={20} className="shrink-0" />
                    <p className="text-[11px] font-black uppercase tracking-widest">{error}</p>
                </div>
            )}

            <div className="space-y-8">
                  <p className="text-[9px] text-slate-400 font-black leading-relaxed uppercase tracking-[0.1em] px-2 italic">
                    "By clicking 'Finalize Payment', you authorize NurseFlex to process your payment under the established Terms of Service and Privacy Policy."
                </p>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-6">
                    <Button 
                        type="button" 
                        onClick={onCancel}
                        variant="ghost" 
                        className="h-16 px-10 rounded-2xl text-slate-400 hover:text-blue-600 font-black uppercase tracking-widest text-[10px] gap-3"
                    >
                        <ChevronRight size={14} className="rotate-180" /> Change Plan
                    </Button>
                    <Button 
                        type="submit" 
                        disabled={!stripe || loading}
                        className="h-20 px-16 rounded-[2.5rem] bg-slate-900 hover:bg-blue-600 text-white font-black uppercase tracking-tighter italic text-2xl shadow-2xl transition-all active:scale-95 group"
                    >
                        {loading ? (
                            <div className="flex items-center gap-4">
                                <Loader2 className="animate-spin" size={28} /> PROCESSING...
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                Finalize Payment <ArrowRight size={28} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        )}
                    </Button>
                </div>
            </div>
        </form>
    );
}

function BillingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tierIdParam = searchParams.get('tierId');
    const [tierLoading, setTierLoading] = useState(true);
    const [tierName, setTierName] = useState('...');
    const [tierPrice, setTierPrice] = useState(0);
    const [clientSecret, setClientSecret] = useState('');
    const [isFree, setIsFree] = useState(false);
    const [initError, setInitError] = useState<string | null>(null);

    useEffect(() => {
        const initCheckout = async () => {
            if (!tierIdParam) {
                setInitError("Please select a promotion plan");
                setTierLoading(false);
                return;
            }
            try {
                const token = localStorage.getItem("hospital_token");
                if (!token) {
                    const callbackUrl = encodeURIComponent(window.location.pathname + window.location.search);
                    router.push(`/business/login?callbackUrl=${callbackUrl}`);
                    return;
                }

                const tierRes = await fetch(`${BaseUrl}/tiers`);
                if (tierRes.ok) {
                    const tiers = await tierRes.json();
                    const selectedTier = tiers.find((t: any) => t.id == tierIdParam);
                    if (selectedTier) {
                        setTierName(selectedTier.name);
                        setTierPrice(selectedTier.price);
                    }
                }

                const res = await fetch(`${BaseUrl}/subscriptions/create-payment-intent`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ tierId: tierIdParam, currency: 'gbp' })
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.isFree) setIsFree(true);
                    else setClientSecret(data.clientSecret);
                } else {
                    setInitError("FAILED TO INITIALIZE PAYMENT");
                }
            } catch (error) {
                setInitError("NETWORK ERROR");
            } finally {
                setTierLoading(false);
            }
        };
        initCheckout();
    }, [tierIdParam, router]);

    const handleFreeSubmit = async () => {
        setTierLoading(true);
        try {
            const token = localStorage.getItem("hospital_token");
            const res = await fetch(`${BaseUrl}/subscriptions/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ tierId: tierIdParam, paymentMethod: 'free' })
            });
            if (res.ok) {
                router.push(`/business/post-job/success?paymentIntentId=free_${Date.now()}&tierId=${tierIdParam}`);
            } else {
                setInitError("FAILED TO ACTIVATE FREE PLAN");
            }
        } catch (err) {
            setInitError("NETWORK SYNC FAILURE");
        } finally {
            setTierLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-12 py-10 animate-in fade-in duration-1000 px-4">
            <header className="flex flex-col md:flex-row justify-between items-end gap-12 border-b border-slate-100 pb-16">
                <div className="text-center md:text-left space-y-6">
                    <div className="flex items-center gap-6 justify-center md:justify-start mb-2">
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase underline decoration-blue-500/20 underline-offset-[12px] decoration-8">Payment Details</h1>
                        <Badge className="bg-blue-600 font-black text-[10px] uppercase tracking-[0.4em] px-4 py-1.5 shadow-xl shadow-blue-100 italic">Step 09</Badge>
                    </div>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.3em] max-w-2xl">Finalize your payment to post your job</p>
                </div>
                <div className="hidden lg:flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100 shadow-sm">
                    <Lock className="text-blue-600" size={24} />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-tight">Secure SSL<br/>Encryption</p>
                </div>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Left Column: Settlement Form */}
                <div className="lg:col-span-8 space-y-12">
                     {initError ? (
                        <div className="bg-red-50 border border-red-100 p-8 rounded-[2.5rem] flex items-center gap-6 text-red-600">
                            <ShieldCheck size={32} />
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest italic">Payment Initialization Error</p>
                                <p className="text-lg font-black uppercase tracking-tighter">{initError}</p>
                            </div>
                        </div>
                    ) : tierLoading ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-6">
                            <Loader2 className="animate-spin text-blue-600" size={64} />
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">Loading payment details...</p>
                        </div>
                    ) : (
                        <div className="space-y-16">
                            {/* Billing Identity */}
                            <section className="space-y-10">
                                <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                                        <Globe size={18} strokeWidth={3} />
                                    </div>
                                    <h2 className="text-xl font-black italic uppercase tracking-tight text-slate-900">Billing Address</h2>
                                </div>

                                <div className="grid md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Country *</Label>
                                        <div className="h-16 px-8 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-all cursor-pointer">
                                            <span className="font-black text-slate-900 uppercase italic tracking-tighter">United States</span>
                                            <Edit3 size={16} className="text-blue-600 opacity-40 group-hover:opacity-100 transition-all" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Currency</Label>
                                        <div className="h-16 px-8 rounded-2xl bg-slate-100/50 border border-slate-100 flex items-center gap-4 text-slate-400">
                                            <DollarSign size={18} />
                                            <span className="font-black uppercase italic tracking-tighter">USD / US Dollar</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <div className="grid md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Address Line 1 *</Label>
                                            <Input required className="h-16 px-8 rounded-2xl bg-slate-50/50 border-slate-100 font-bold focus-visible:ring-4 focus-visible:ring-blue-50 focus-visible:bg-white focus-visible:border-blue-200 transition-all" />
                                        </div>
                                        <div className="space-y-4">
                                            <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Address Line 2 (Optional)</Label>
                                            <Input className="h-16 px-8 rounded-2xl bg-slate-50/50 border-slate-100 font-bold focus-visible:ring-4 focus-visible:ring-blue-50 focus-visible:bg-white focus-visible:border-blue-200 transition-all" />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-10">
                                        <div className="lg:col-span-2 space-y-4">
                                            <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">City *</Label>
                                            <Input required className="h-16 px-8 rounded-2xl bg-slate-50/50 border-slate-100 font-bold focus-visible:ring-4 focus-visible:ring-blue-50 focus-visible:bg-white focus-visible:border-blue-200 transition-all" />
                                        </div>
                                        <div className="space-y-4">
                                            <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Postcode *</Label>
                                            <Input required className="h-16 px-8 rounded-2xl bg-slate-50/50 border-slate-100 font-bold focus-visible:ring-4 focus-visible:ring-blue-50 focus-visible:bg-white focus-visible:border-blue-200 transition-all" />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <Separator className="bg-slate-50" />

                            {/* Payment Matrix */}
                            <section className="space-y-10">
                                <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                                        <CreditCard size={18} strokeWidth={3} />
                                    </div>
                                    <h2 className="text-xl font-black italic uppercase tracking-tight text-slate-900">Payment Method</h2>
                                </div>

                                {isFree ? (
                                    <Card className="border-none bg-blue-50/50 rounded-[2.5rem] p-12 text-center space-y-6">
                                        <div className="w-20 h-20 bg-white rounded-3xl mx-auto flex items-center justify-center text-blue-600 shadow-2xl shadow-blue-100 border border-white">
                                            <Check size={40} strokeWidth={3} />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-blue-900 italic">Free Plan Selected</h3>
                                            <p className="text-[11px] font-black uppercase tracking-widest text-blue-400 italic">You have selected a free plan. No payment required.</p>
                                        </div>
                                        <Button 
                                            onClick={handleFreeSubmit}
                                            className="h-20 px-16 rounded-[2.5rem] bg-slate-900 hover:bg-blue-600 text-white font-black uppercase tracking-tighter italic text-2xl shadow-2xl transition-all active:scale-95 group"
                                        >
                                            Activate Free Plan <ArrowRight size={28} className="ml-4 group-hover:translate-x-1 transition-all" />
                                        </Button>
                                    </Card>
                                ) : (
                                    clientSecret && (
                                        <Elements stripe={stripePromise} options={{ clientSecret, appearance: { 
                                            theme: 'flat',
                                            variables: {
                                                colorPrimary: '#2563eb',
                                                colorBackground: '#f8fafc',
                                                colorText: '#0f172a',
                                                borderRadius: '32px',
                                                fontFamily: 'system-ui, sans-serif'
                                            }
                                        } }}>
                                            <CheckoutForm clientSecret={clientSecret} tierId={tierIdParam!.toString()} onCancel={() => router.back()} />
                                        </Elements>
                                    )
                                )}
                            </section>
                        </div>
                    )}
                </div>

                {/* Right Column: Manifest Summary */}
                <aside className="lg:col-span-4 space-y-10">
                    <Card className="border-none shadow-2xl shadow-blue-50/50 bg-white rounded-[4rem] overflow-hidden sticky top-32">
                        <CardHeader className="p-10 pb-6 border-b border-slate-50 bg-slate-50/30">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 border border-slate-100 shadow-xl">
                                    <Receipt size={22} />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-black italic uppercase tracking-tight">Order Summary</CardTitle>
                                    <CardDescription className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">Review your plan</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-10 space-y-12">
                            <div className="space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Selected Plan</p>
                                        <p className="text-xl font-black italic uppercase tracking-tighter text-slate-900">{tierName}</p>
                                    </div>
                                    <Badge className="bg-blue-50 text-blue-600 font-black text-[8px] uppercase tracking-widest px-3 border-none italic">SELECTED</Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Job Location</p>
                                    <p className="text-sm font-black uppercase tracking-tight text-slate-600 flex items-center gap-2">
                                        <MapPin size={14} className="text-blue-500" /> New York, NY (Primary Hub)
                                    </p>
                                </div>
                            </div>

                            <Separator className="bg-slate-50" />

                            <div className="space-y-8">
                                <div className="flex items-start gap-4 group cursor-pointer" onClick={() => router.back()}>
                                    <Calendar className="text-blue-600 shrink-0 mt-0.5" size={18} />
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Posting Duration</p>
                                        <p className="text-sm font-black uppercase tracking-tight text-slate-700 group-hover:text-blue-600 transition-all italic underline decoration-blue-100 underline-offset-4 decoration-2">Published until filled</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <CreditCard className="text-blue-600 shrink-0 mt-0.5" size={18} />
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Total Amount</p>
                                        <div className="flex items-baseline gap-2">
                                            <p className="text-3xl font-black italic tracking-tighter text-slate-900">£{tierPrice}</p>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">One-time payment</span>
                                        </div>
                                        <p className="text-[9px] font-bold text-slate-300 uppercase italic tracking-widest">* All fees are included in the price.</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="p-10 pt-0">
                            <Link href="#" className="w-full h-12 flex items-center justify-center border-2 border-slate-50 text-slate-300 font-black uppercase tracking-[0.3em] text-[8px] italic rounded-2xl hover:border-blue-100 hover:text-blue-600 transition-all">Terms of Service & Privacy Policy</Link>
                        </CardFooter>
                    </Card>
                </aside>
            </main>
        </div>
    );
}

export default function BillingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-blue-600" size={48} /></div>}>
            <BillingContent />
        </Suspense>
    );
}
