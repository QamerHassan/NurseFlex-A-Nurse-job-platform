"use client";
import React from 'react';
import Link from 'next/link';

export default function PendingApproval() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-md bg-white p-12 rounded-[3rem] shadow-2xl border border-indigo-100">
        <div className="w-24 h-24 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-8">
          ⏳
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">Application Pending</h2>
        <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed">
          Your request is currently being reviewed by our team. Once approved, you'll be able to <span className="text-pink-600 font-bold">post jobs</span> and manage your hiring from the dashboard.
        </p>
        <Link href="/">
          <button className="text-xs font-bold text-slate-400 hover:text-pink-600 transition-all">
            ← Back to Home
          </button>
        </Link>
        <div className="mt-12 pt-8 border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 mb-4 tracking-tight">Need to refresh your application status?</p>
          <button
            onClick={() => {
              const userStr = localStorage.getItem('business_user');
              if (userStr) {
                const user = JSON.parse(userStr);
                const existing = JSON.parse(localStorage.getItem('pending_business_approvals') || '[]');
                const alreadyPending = existing.some((req: any) => req.email === user.email);
                if (!alreadyPending) {
                  localStorage.setItem('pending_business_approvals', JSON.stringify([...existing, { ...user, status: 'Pending Admin Review', date: new Date().toLocaleDateString() }]));
                }
                alert("Verification requested! Please wait for admin review. ✅");
              } else {
                alert("Error: Business data not found. Please register again.");
              }
            }}
            className="px-6 py-3 bg-slate-100 text-slate-900 rounded-xl font-bold text-xs hover:bg-slate-200 transition-colors"
          >
            Refresh Status
          </button>
        </div>
      </div>
    </div>
  );
}