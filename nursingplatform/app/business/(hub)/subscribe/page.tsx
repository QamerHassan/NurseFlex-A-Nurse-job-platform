"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { CheckCircle2, Loader2, Star, Zap, ArrowRight, Lock } from 'lucide-react';

interface Tier {
  id: string;
  name: string;
  price: number;
  jobsLimit: number;
  features: string[];
  isPopular: boolean;
}

export default function SubscribePage() {
  const router = useRouter();
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tiers')
      .then(res => setTiers(Array.isArray(res.data) ? res.data : []))
      .catch(() => setTiers([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (tier: Tier) => {
    router.push(`/business/payment?tier=${tier.id}&price=${tier.price}&name=${encodeURIComponent(tier.name)}`);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 font-sans">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-green-500 rounded-2xl shadow-lg mb-5">
          <Lock size={28} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">You've used your free job post</h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Choose a plan below to continue posting jobs and reach thousands of verified nurses.
        </p>
      </div>

      {/* Free post reminder */}
      <div className="flex items-center justify-center gap-3 mb-8 p-4 bg-green-50 border border-green-100 rounded-2xl max-w-md mx-auto">
        <CheckCircle2 size={18} className="text-green-600 shrink-0" />
        <p className="text-sm text-green-700 font-medium">
          Your first job post was free. Subscribe to unlock more.
        </p>
      </div>

      {/* Tiers */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={36} className="animate-spin text-blue-500" />
        </div>
      ) : tiers.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-sm">No plans available. Please contact support.</p>
        </div>
      ) : (
        <div className={`grid gap-6 ${tiers.length === 1 ? 'max-w-sm mx-auto' : tiers.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
          {tiers.map(tier => (
            <div key={tier.id} className={`relative bg-white border rounded-3xl p-7 flex flex-col shadow-sm transition-all hover:shadow-md ${tier.isPopular ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-100 hover:border-slate-200'}`}>
              {/* Popular badge */}
              {tier.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-600 to-green-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full shadow uppercase tracking-wider">
                    <Star size={10} className="fill-white" /> Most Popular
                  </span>
                </div>
              )}

              {/* Plan name + price */}
              <div className="mb-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{tier.name}</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-slate-900">${tier.price}</span>
                  <span className="text-slate-400 text-sm mb-1">/month</span>
                </div>
                <p className="text-sm text-slate-500 mt-1">Up to <strong className="text-slate-700">{tier.jobsLimit}</strong> job posts</p>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-7 flex-1">
                {(tier.features || []).map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <CheckCircle2 size={15} className="text-green-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => handleSelect(tier)}
                className={`w-full h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                  tier.isPopular
                    ? 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-md'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                Get Started <ArrowRight size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-center text-[10px] text-slate-300 uppercase tracking-widest mt-10">
        NurseFlex Business · Secure Checkout
      </p>
    </div>
  );
}
