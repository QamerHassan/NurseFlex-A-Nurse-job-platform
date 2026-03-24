"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
                <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-start">

                    {/* 📞 LEFT: INFO */}
                    <div className="w-full md:flex-1 space-y-6 sm:space-y-8">
                        <div className="space-y-3 sm:space-y-4">
                            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
                                Contact Us
                            </h1>
                            <p className="text-[13px] text-slate-500 font-medium leading-relaxed max-w-lg">
                                We are here to help you with your account or any questions.
                            </p>
                        </div>

                        <div className="space-y-5 sm:space-y-6">

                            {/* ── Email ── */}
                            <a
                                href="mailto:qamerhassan445@gmail.com"
                                className="flex items-start gap-4 group no-underline"
                            >
                                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm border border-blue-100/50">
                                    <Mail size={18} />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-bold text-slate-900 text-xs">Email</h4>
                                    <p className="text-blue-600 font-bold text-[11px] mt-0.5 tracking-wider group-hover:underline break-all">
                                        qamerhassan445@gmail.com
                                    </p>
                                </div>
                            </a>

                            {/* ── Phone ── */}
                            <a
                                href="tel:03034519490"
                                className="flex items-start gap-4 group no-underline"
                            >
                                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm border border-emerald-100/50">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-xs">Phone</h4>
                                    <p className="text-emerald-600 font-bold text-[11px] mt-0.5 tracking-wider group-hover:underline">
                                        03034519490
                                    </p>
                                </div>
                            </a>

                            {/* ── Contact Person ── */}
                            <div className="flex items-start gap-4 group">
                                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-slate-50 text-slate-900 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-all border border-slate-100">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-xs tracking-tight">Contact Person</h4>
                                    <p className="text-slate-500 font-bold text-[11px] mt-0.5 leading-relaxed">Qamer Hassan</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 bg-blue-600 rounded-2xl text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-8 -mt-8"></div>
                            <h4 className="text-lg font-bold">Business Portal</h4>
                            <p className="text-blue-100 font-bold text-[8px] uppercase tracking-wider mb-4">Post jobs and find talent</p>
                            <Link href="/business" className="inline-block bg-white text-blue-600 font-bold px-5 py-2 rounded-lg text-[9px] hover:bg-blue-50 active:scale-95 transition-all uppercase tracking-wider">Start Now</Link>
                        </div>
                    </div>

                    {/* 📝 RIGHT: FORM */}
                    <div className="w-full md:flex-1 bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 md:p-10 border border-slate-100 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>

                        {!submitted ? (
                            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Name</label>
                                        <input type="text" required placeholder="Qamer Hassan" className="w-full p-3.5 sm:p-4 rounded-xl border-2 border-slate-50 focus:border-blue-500 outline-none transition-all font-bold text-slate-900 bg-slate-50 shadow-sm text-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Email</label>
                                        <input type="email" required placeholder="qamerhassan445@gmail.com" className="w-full p-3.5 sm:p-4 rounded-xl border-2 border-slate-50 focus:border-blue-500 outline-none transition-all font-bold text-slate-900 bg-slate-50 shadow-sm text-sm" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Phone</label>
                                        <input type="tel" placeholder="03034519490" className="w-full p-3.5 sm:p-4 rounded-xl border-2 border-slate-50 focus:border-blue-500 outline-none transition-all font-bold text-slate-900 bg-slate-50 shadow-sm text-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Subject</label>
                                        <input type="text" required placeholder="General Inquiry" className="w-full p-3.5 sm:p-4 rounded-xl border-2 border-slate-50 focus:border-blue-500 outline-none transition-all font-bold text-slate-900 bg-slate-50 shadow-sm text-sm" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Message</label>
                                    <textarea rows={4} required placeholder="How can we help?" className="w-full p-4 sm:p-5 rounded-2xl border-2 border-slate-50 focus:border-blue-500 outline-none transition-all font-bold text-slate-900 bg-slate-50 shadow-sm resize-none text-sm"></textarea>
                                </div>

                                <button type="submit" className="w-full bg-blue-600 hover:bg-slate-900 text-white font-black py-3.5 sm:py-4 rounded-xl text-sm transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider">
                                    Submit
                                </button>
                            </form>
                        ) : (
                            <div className="py-12 sm:py-20 text-center space-y-5 sm:space-y-6">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 animate-bounce">
                                    <CheckCircle2 size={36} />
                                </div>
                                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Message Sent!</h2>
                                <p className="text-slate-500 font-medium pb-4">Thank you for reaching out. Our team will get back to you shortly.</p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="bg-green-600 text-white font-black px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl hover:bg-slate-900 transition-all active:scale-95 shadow-xl"
                                >
                                    Send Another
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* 📜 FOOTER */}
            <footer className="bg-slate-50 py-10 sm:py-12 px-4 sm:px-6 border-t border-slate-100 text-center mt-12 sm:mt-20">
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">© 2026 NurseFlex Community. All rights reserved.</p>
            </footer>
        </div>
    );
}