"use client";
import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { clearAllUserData } from '@/lib/auth-utils';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const callbackUrl = searchParams.get('callbackUrl') || '/business/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, user } = response.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userType', 'business');

      router.push(callbackUrl);
    } catch (err: any) {
      console.error('❌ Login Error:', err);
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // 🔍 Wipe old data BEFORE going to Google so the returning session is clean
    clearAllUserData();
    signIn('google', { callbackUrl });
  };

  return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-xl border border-indigo-100">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black mx-auto mb-4 tracking-tighter italic shadow-lg shadow-indigo-100 italic">B</div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 italic">NurseFlex</h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase mt-2 tracking-[0.2em] italic">Business Portal</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-[10px] font-black rounded-2xl border border-red-100 uppercase tracking-widest text-center">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Work Email"
            className="w-full p-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all uppercase tracking-widest text-[10px] mt-2 italic shadow-xl flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : "Enter Dashboard"}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-black text-slate-300 tracking-[0.2em] bg-white px-4">
            OR
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full py-4 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl font-black shadow-sm hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 group italic"
        >
          <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M5.26628414,9.76452905 C6.19908752,6.93863203 8.85444605,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27000254,0 3.19774976,2.69829785 1.24028508,6.62233285 L5.26628414,9.76452905 Z" />
            <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.85444605,19.0909091 6.19908752,17.061368 5.26628414,14.235471 L1.24028508,17.3776671 C3.19774976,21.3017022 7.27000254,24 12,24 C15.0545455,24 17.7818182,22.8545455 19.9090909,21 C19.9090909,21 16.0407269,18.0125889 16.0407269,18.0125889 Z" />
            <path fill="#4285F4" d="M23.8326209,12.2405907 C23.8326209,11.3822162 23.7540236,10.511394 23.5939023,9.66367341 L12,9.66367341 L12,14.3363266 L18.6181818,14.3363266 C18.3327273,15.8858416 17.4309325,17.2148107 16.0407269,18.0125889 L16.0407269,18.0125889 L19.9090909,21 C22.2,18.8727273 24,15.7909091 24,12 C24,11.4554231 23.9454545,10.9272727 23.8326209,10.4 Z" />
            <path fill="#FBBC05" d="M5.26628414,14.235471 C5.01818182,13.4831818 4.88181818,12.6781818 4.88181818,11.8381818 C4.88181818,10.9981818 5.01818182,10.1931818 5.26628414,9.44090909 L1.24028508,6.29871295 C0.447272727,7.88181818 0,9.66545455 0,11.5454545 C0,13.4254545 0.447272727,15.2090909 1.24028508,16.7921818 L5.26628414,14.235471 Z" />
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default function BusinessLogin() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-indigo-50 flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
