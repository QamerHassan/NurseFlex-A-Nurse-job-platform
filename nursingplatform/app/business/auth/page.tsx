"use client";
import React from 'react';
import Link from 'next/link';

export default function BusinessAuthChoice() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">
        
        {/* Option 1: Login */}
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl flex flex-col items-center text-center hover:scale-105 transition-all group border border-blue-100">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center text-3xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
            🔑
          </div>
          <h2 className="text-3xl font-black text-slate-900 italic mb-2">Welcome Back</h2>
          <p className="text-slate-500 font-medium mb-8">Already a partner? Sign in to manage your business and shifts.</p>
          <Link href="/business/login" className="w-full">
            <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
              Login to Dashboard
            </button>
          </Link>
        </div>

        {/* Option 2: Register/Tiers */}
        <div className="bg-slate-900 border border-slate-800 p-12 rounded-[3rem] shadow-2xl flex flex-col items-center text-center hover:scale-105 transition-all group">
          <div className="w-20 h-20 bg-slate-800 text-blue-400 rounded-3xl flex items-center justify-center text-3xl mb-6 group-hover:bg-blue-400 group-hover:text-slate-900 transition-all">
            🚀
          </div>
          <h2 className="text-3xl font-black text-white italic mb-2">Get Started</h2>
          <p className="text-slate-400 font-medium mb-8">New to NurseFlex? Choose a plan and start hiring top talent today.</p>
          <Link href="/business/register" className="w-full">
            <button className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-400 transition-all">
              View Pricing & Plans
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}