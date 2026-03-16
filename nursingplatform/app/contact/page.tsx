"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">

            <main className="max-w-7xl mx-auto px-6 py-24">
                <div className="flex flex-col md:flex-row gap-16 items-start">

                    {/* 📞 LEFT: INFO */}
                    <div className="flex-1 space-y-12">
                        <div className="space-y-6">
                            <h1 className="text-6xl font-bold tracking-tight leading-tight text-slate-900">
                                How can we <span className="text-pink-600 underline decoration-pink-500/10 underline-offset-8">help?</span>
                            </h1>
                            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg">
                                Our support team is here to assist with your account, registration, or any questions.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-start gap-6 group">
                                <div className="w-14 h-14 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-pink-600 group-hover:text-white transition-all shadow-sm">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Email Support</h4>
                                    <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-wider text-pink-600 border-b border-pink-200 inline-block">support@nurseflex.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6 group">
                                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Call Us</h4>
                                    <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-wider text-emerald-600 border-b border-emerald-200 inline-block">+1 (800) NURSE-FLX</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6 group">
                                <div className="w-14 h-14 bg-slate-100 text-slate-900 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 tracking-tight">Office HQ</h4>
                                    <p className="text-slate-500 font-bold text-sm mt-1 leading-relaxed">7500 Lexington Ave, <br />New York City, NY</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-pink-600 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>
                            <h4 className="text-2xl font-bold mb-1">Hiring?</h4>
                            <p className="text-pink-100 font-bold text-[10px] uppercase tracking-wider mb-6">Find the best talent in nursing</p>
                            <Link href="/business" className="inline-block bg-white text-pink-600 font-bold px-8 py-3 rounded-xl text-xs hover:bg-pink-50 active:scale-95 transition-all uppercase tracking-wider">Post a Job</Link>
                        </div>
                    </div>

                    {/* 📝 RIGHT: FORM */}
                    <div className="flex-1 w-full max-w-2xl bg-white rounded-[4rem] p-12 border border-slate-100 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-[#ec4899]"></div>

                        {!submitted ? (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Full Name</label>
                                        <input type="text" required placeholder="John Carter" className="w-full p-4 rounded-2xl border-2 border-slate-50 focus:border-[#ec4899] outline-none transition-all font-bold text-slate-900 bg-slate-50 shadow-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Email Address</label>
                                        <input type="email" required placeholder="john@example.com" className="w-full p-4 rounded-2xl border-2 border-slate-50 focus:border-[#ec4899] outline-none transition-all font-bold text-slate-900 bg-slate-50 shadow-sm" />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Phone Number</label>
                                        <input type="tel" placeholder="+1 (555) 000-0000" className="w-full p-4 rounded-2xl border-2 border-slate-50 focus:border-[#ec4899] outline-none transition-all font-bold text-slate-900 bg-slate-50 shadow-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Subject</label>
                                        <input type="text" required placeholder="Partnership Inquiry" className="w-full p-4 rounded-2xl border-2 border-slate-50 focus:border-[#ec4899] outline-none transition-all font-bold text-slate-900 bg-slate-50 shadow-sm" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Message</label>
                                    <textarea rows={5} required placeholder="Tell us how we can help you..." className="w-full p-6 rounded-[2rem] border-2 border-slate-50 focus:border-[#ec4899] outline-none transition-all font-bold text-slate-900 bg-slate-50 shadow-sm resize-none"></textarea>
                                </div>

                                <button type="submit" className="w-full bg-[#ec4899] hover:bg-slate-900 text-white font-black py-5 rounded-3xl text-lg shadow-2xl shadow-pink-100 transition-all active:scale-95 flex items-center justify-center gap-3">
                                    Send Message <Send size={20} />
                                </button>
                            </form>
                        ) : (
                            <div className="py-20 text-center space-y-6">
                                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Message Sent!</h2>
                                <p className="text-slate-500 font-medium pb-4">Thank you for reaching out. Our team will get back to you shortly.</p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="bg-[#ec4899] text-white font-black px-10 py-4 rounded-2xl hover:bg-slate-900 transition-all active:scale-95 shadow-xl"
                                >
                                    Send Another
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* 📜 FOOTER */}
            <footer className="bg-slate-50 py-12 px-6 border-t border-slate-100 text-center mt-20">
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">© 2026 NurseFlex Community. All rights reserved.</p>
            </footer>
        </div>
    );
}
