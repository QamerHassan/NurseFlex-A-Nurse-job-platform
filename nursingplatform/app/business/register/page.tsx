"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession, signOut } from 'next-auth/react';
import { Loader2, User, UserPlus, ArrowRight, LogOut } from 'lucide-react';
import api from '@/lib/api';
import { clearAllUserData } from '@/lib/auth-utils';

export default function BusinessRegister() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    password: '',
    verificationDoc: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAlreadyLoggedIn, setIsAlreadyLoggedIn] = useState(false);
  const [dbTiers, setDbTiers] = useState<any[]>([]);

  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const res = await api.get('/tiers');
        if (res.data && res.data.length > 0) {
          setDbTiers(res.data);
          // Auto-select first tier if none selected
          if (!selectedTier) setSelectedTier(res.data[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch tiers:', err);
      }
    };
    fetchTiers();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token || (sessionStatus === 'authenticated' && session)) {
      setIsAlreadyLoggedIn(true);
    }
  }, [sessionStatus, session]);

  const handleSignOut = async () => {
    // Wipe every localStorage key so next user starts clean
    clearAllUserData();
    await signOut({ redirect: false });
    setIsAlreadyLoggedIn(false);
  };

  const handleGoogleSignIn = () => {
    // 🔍 Wipe old data BEFORE going to Google so the returning session is clean
    clearAllUserData();
    signIn('google', { callbackUrl: '/business/dashboard' });
  };

  const tiers = [
    { id: 'basic', name: "Starter", price: "49", perks: ["5 Active Job Posts", "Email Support", "Basic Analytics"] },
    { id: 'pro', name: "Pro Max", price: "199", perks: ["Unlimited Job Posts", "Priority Support", "Advanced Analytics", "Featured Posts"] },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFormData({ ...formData, verificationDoc: file.name });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Backend API Call
      const regRes = await api.post('/auth/register', {
        name: formData.businessName,
        email: formData.email,
        password: formData.password,
        role: 'BUSINESS'
      });

      // 🔍 2. Automatically Log In to get token for payment
      const loginRes = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('token', loginRes.data.access_token);
      localStorage.setItem('user', JSON.stringify(loginRes.data.user));

      // 3. Nayi request create karein for LocalStorage (Admin Review relies on this for now)
      const newRequest = {
        id: loginRes.data.user.id,
        name: formData.businessName,
        email: formData.email,
        planId: selectedTier,
        status: 'Pending Admin Review',
        document: formData.verificationDoc,
        date: new Date().toLocaleDateString()
      };

      const existingRequests = JSON.parse(localStorage.getItem('pending_business_approvals') || '[]');
      localStorage.setItem('pending_business_approvals', JSON.stringify([...existingRequests, newRequest]));
      
      // 4. Redirect to Payment instead of Pending
      router.push(`/business/payment?tierId=${selectedTier}`);
    } catch (err: any) {
      console.error('❌ Business Register Error:', err);
      setError(err.response?.data?.message || 'Registration failed. Try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-16">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white mb-6 shadow-xl shadow-indigo-100 rotate-3">
            {isAlreadyLoggedIn ? <User size={32} /> : <UserPlus size={32} />}
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic mb-4">
            {isAlreadyLoggedIn ? 'Already Registered' : 'Scale Your Business'}
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
            {isAlreadyLoggedIn ? `You are signed in as ${session?.user?.email}` : 'Choose a plan to start hiring'}
          </p>
        </header>

        {isAlreadyLoggedIn ? (
          <div className="space-y-6 pt-4 max-w-md mx-auto">
            <button
              onClick={() => router.push('/business/dashboard')}
              className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-2xl shadow-indigo-100 hover:bg-slate-900 transition-all active:scale-95 flex items-center justify-center gap-3 text-lg"
            >
              Go to Dashboard <ArrowRight size={20} />
            </button>
            <button
              onClick={handleSignOut}
              className="w-full py-5 bg-white border-2 border-slate-100 text-slate-900 rounded-[2rem] font-black shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-3 text-lg"
            >
              <LogOut size={20} /> Sign out to register new
            </button>
          </div>
        ) : (
          <>
            {/* Tier Selection */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {(dbTiers.length > 0 ? dbTiers : tiers).map((tier) => (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`p-10 rounded-[3rem] border-4 transition-all cursor-pointer ${selectedTier === tier.id ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 bg-white hover:border-indigo-200'}`}
                >
                  <h3 className="text-2xl font-black mb-2 italic">{tier.name}</h3>
                  <p className="text-5xl font-black text-indigo-600 mb-6">${tier.price}<span className="text-sm text-slate-400">/mo</span></p>
                  <ul className="space-y-3 mb-8">
                    {(tier.features || tier.perks || []).map((perk: string) => (
                      <li key={perk} className="text-slate-600 font-bold text-sm">✅ {perk}</li>
                    ))}
                  </ul>
                  <div className={`w-full py-4 rounded-2xl text-center font-black uppercase text-xs tracking-widest ${selectedTier === tier.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {selectedTier === tier.id ? 'Selected' : 'Select Plan'}
                  </div>
                </div>
              ))}
            </div>

            {/* Registration Form */}
            {selectedTier && (
              <div className="max-w-md mx-auto bg-slate-50 p-10 rounded-[2.5rem] border border-slate-200 shadow-xl animate-in fade-in slide-in-from-bottom-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-xl font-black mb-6 text-center italic">Finalize Registration</h3>

                  {error && (
                    <p className="text-[10px] font-black text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100 uppercase text-center">{error}</p>
                  )}

                  <input
                    type="text"
                    placeholder="Business Name"
                    required
                    className="w-full p-4 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  />
                  <input
                    type="email"
                    placeholder="Business Email"
                    required
                    className="w-full p-4 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <input
                    type="password"
                    placeholder="Create Password"
                    required
                    className="w-full p-4 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Company License (PDF)</label>
                    <input
                      type="file"
                      accept=".pdf"
                      required
                      className="w-full p-4 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-xs bg-white"
                      onChange={handleFileChange}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 py-4 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : "Submit for Registration 📑"}
                  </button>
                </form>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] bg-slate-50 px-4">
                    OR
                  </div>
                </div>

                <button
                  onClick={handleGoogleSignIn}
                  className="w-full py-4 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-black shadow-sm hover:bg-slate-100 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 group italic"
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M5.26628414,9.76452905 C6.19908752,6.93863203 8.85444605,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27000254,0 3.19774976,2.69829785 1.24028508,6.62233285 L5.26628414,9.76452905 Z" />
                    <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.85444605,19.0909091 6.19908752,17.061368 5.26628414,14.235471 L1.24028508,17.3776671 C3.19774976,21.3017022 7.27000254,24 12,24 C15.0545455,24 17.7818182,22.8545455 19.9090909,21 C19.9090909,21 16.0407269,18.0125889 16.0407269,18.0125889 Z" />
                    <path fill="#4285F4" d="M23.8326209,12.2405907 C23.8326209,11.3822162 23.7540236,10.511394 23.5939023,9.66367341 L12,9.66367341 L12,14.3363266 L18.6181818,14.3363266 C18.3327273,15.8858416 17.4309325,17.2148107 16.0407269,18.0125889 L16.0407269,18.0125889 L19.9090909,21 C22.2,18.8727273 24,15.7909091 24,12 C24,11.4554231 23.9454545,10.9272727 23.8326209,10.4 Z" />
                    <path fill="#FBBC05" d="M5.26628414,14.235471 C5.01818182,13.4831818 4.88181818,12.6781818 4.88181818,11.8381818 C4.88181818,10.9981818 5.01818182,10.1931818 5.26628414,9.44090909 L1.24028508,6.29871295 C0.447272727,7.88181818 0,9.66545455 0,11.5454545 C0,13.4254545 0.447272727,15.2090909 1.24028508,16.7921818 L5.26628414,14.235471 Z" />
                  </svg>
                  Register with Google
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
