"use client";
import React from 'react';
import Link from 'next/link';

export default function ApplicationSuccess() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-[3rem] border border-slate-200 shadow-2xl p-12 text-center">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 animate-bounce">
          🎉
        </div>
        
        <h1 className="text-4xl font-black tracking-tighter text-slate-900">Application Sent!</h1>
        <p className="text-slate-500 font-medium mt-4 leading-relaxed">
          Your profile has been shared with the hospital. You'll get an email notification if they want to interview you.
        </p>

        <div className="mt-10 space-y-4">
          <Link href="/profile" className="block w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-blue-600 transition-all shadow-lg">
            View My Applications
          </Link>
          <Link href="/jobs" className="block w-full py-4 bg-slate-50 text-slate-600 rounded-2xl font-black hover:bg-slate-100 transition-all">
            Browse More Jobs
          </Link>
        </div>
      </div>
    </div>
  );
}