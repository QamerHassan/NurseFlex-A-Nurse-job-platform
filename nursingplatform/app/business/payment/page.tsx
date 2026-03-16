"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2, ShieldCheck, CreditCard, Building2, ArrowLeft } from 'lucide-react';
import api from '@/lib/api';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function PaymentForm({ tier }: { tier: any }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage('');

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/auth/pending`,
        },
        redirect: 'if_required'
      });

      if (error) {
        setErrorMessage(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Create subscription in backend
        await api.post('/subscriptions/confirm', {
          tierId: tier.id,
          paymentIntentId: paymentIntent.id
        });
        router.push('/auth/pending');
      }
    } catch (err: any) {
      console.error('Payment Error:', err);
      setErrorMessage('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Selected Plan</span>
          <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black">{tier.name}</span>
        </div>
        <div className="flex justify-between items-end">
          <p className="text-4xl font-black text-slate-900 italic">${tier.price}<span className="text-sm font-normal text-slate-400">/mo</span></p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Billed Monthly</p>
        </div>
      </div>

      <PaymentElement options={{ layout: 'accordion' }} />

      {errorMessage && (
        <p className="text-rose-600 text-xs font-bold bg-rose-50 p-3 rounded-xl border border-rose-100 text-center animate-shake">
          ⚠️ {errorMessage}
        </p>
      )}

      <button
        disabled={!stripe || loading}
        className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-2xl shadow-indigo-100 hover:bg-slate-900 transition-all active:scale-95 flex items-center justify-center gap-3 text-lg disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" size={24} /> : (
          <>Complete Payment <ShieldCheck size={20} /></>
        )}
      </button>

      <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
        🔒 Secure Encrypted Transaction
      </p>
    </form>
  );
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const tierId = searchParams.get('tierId');
  const [tier, setTier] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initPayment = async () => {
      if (!tierId) return;
      try {
        // 1. Fetch Tier details
        const tiersRes = await api.get('/tiers');
        const selected = tiersRes.data.find((t: any) => t.id === tierId);
        if (!selected) return;
        setTier(selected);

        // 2. Create Payment Intent
        const intentRes = await api.post('/subscriptions/create-payment-intent', { tierId });
        setClientSecret(intentRes.data.clientSecret);
      } catch (err) {
        console.error('Failed to init payment:', err);
      } finally {
        setLoading(false);
      }
    };
    initPayment();
  }, [tierId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
        <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Initialising Secure Checkout...</p>
      </div>
    );
  }

  if (!clientSecret || !tier) {
    return (
      <div className="text-center py-20">
        <p className="text-rose-600 font-black">Something went wrong. Please try again.</p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
      <PaymentForm tier={tier} />
    </Elements>
  );
}

export default function BusinessPaymentPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-xl mx-auto">
        <button 
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors font-black uppercase text-[10px] tracking-widest group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Registration
        </button>

        <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600 opacity-5 rounded-bl-[100px]"></div>
          
          <header className="text-center mb-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white mb-6 shadow-xl shadow-indigo-100 rotate-3">
              <CreditCard size={32} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 italic uppercase tracking-tighter">Secure Payment</h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Activate Your Professional Portfolio</p>
          </header>

          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <PaymentContent />
          </Suspense>
        </div>

        <div className="mt-12 flex justify-center items-center gap-8 opacity-40 grayscale">
          <ShieldCheck size={24} />
          <Building2 size={24} />
          <CreditCard size={24} />
        </div>
      </div>
    </div>
  );
}
