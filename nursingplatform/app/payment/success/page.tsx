"use client";
import React from 'react';
import Link from 'next/link';

export default function PaymentSuccess() {
  
  const handlePrintPDF = () => {
    // Ye command user ke browser ka print dialog kholegi jahan se wo "Save as PDF" kar sakta hai
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      {/* Ye section sirf screen par dikhega, print mein formatting change ho jayegi */}
      <div className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-2xl border border-emerald-100 text-center print:shadow-none print:border-none">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl print:hidden">
          ✓
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Payment Received!</h1>
        <p className="text-slate-500 font-medium mb-8">Download your official receipt for account activation.</p>
        
        {/* Printable Area Start */}
        <div className="hidden print:block text-left border-2 border-slate-100 p-8 rounded-3xl mb-10">
           <h2 className="text-2xl font-black text-blue-600 mb-4">NurseFlex Official Receipt</h2>
           <p className="text-sm text-slate-600 mb-2"><b>Transaction ID:</b> NF-{Math.random().toString(36).toUpperCase().substring(2, 10)}</p>
           <p className="text-sm text-slate-600 mb-2"><b>Date:</b> {new Date().toLocaleDateString()}</p>
           <p className="text-sm text-slate-600 mb-6"><b>Amount Paid:</b> $49.00 (Pro Business Plan)</p>
           <div className="bg-slate-50 p-4 rounded-xl text-[10px] text-slate-400 font-bold uppercase">
             Verified Digital Document
           </div>
        </div>
        {/* Printable Area End */}

        <div className="space-y-3 mb-10 print:hidden">
          <button 
            onClick={handlePrintPDF}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            📥 Generate & Save PDF Receipt
          </button>
        </div>

        <Link 
          href="/business/register" 
          className="print:hidden block w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-black transition-all"
        >
          Finish Registration →
        </Link>
      </div>
    </div>
  );
}