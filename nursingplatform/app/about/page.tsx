"use client";
import React from 'react';
import Link from 'next/link';
import { Heart, ShieldCheck, TrendingUp, Users } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">

            <main>
                {/* ── HERO ── */}
                <section className="py-10 sm:py-12 px-4 sm:px-6 bg-white overflow-hidden relative border-b border-slate-50">
                    <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-blue-50 rounded-full blur-[80px] -ml-36 -mt-36 opacity-50"></div>
                    <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[9px] font-bold uppercase tracking-wider shadow-sm border border-green-100/50">
                            Our Story
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight text-slate-900">
                            We help nurses <span className="text-blue-600">find jobs.</span>
                        </h1>
                        <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
                            NurseFlex is a community for healthcare professionals. We connect nurses with career opportunities.
                        </p>
                    </div>
                </section>

                {/* ── MISSION ── */}
                <section className="py-10 sm:py-12 px-4 sm:px-6">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
                        <div className="w-full md:flex-1 space-y-4">
                            <div className="inline-flex items-center gap-2 px-2 py-1 bg-green-50 text-green-600 rounded-md text-[9px] font-bold uppercase tracking-wider">
                                <ShieldCheck size={10} /> Our Mission
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-tight">
                                Helping People <span className="text-blue-600">Get Jobs.</span>
                            </h2>
                            <div className="space-y-3 text-slate-600 font-medium leading-relaxed text-[13px] sm:text-sm">
                                <p>
                                    Our goal is simple: to connect the right nurse with the right job. We build tools that make it easier for healthcare professionals to showcase their skills.
                                </p>
                            </div>
                        </div>
                        <div className="w-full md:flex-1">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3]">
                                <img
                                    src="/nurse_community_mission_1773058421933.png"
                                    alt="Our Mission"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── GROWTH / STATS ── */}
                <section className="py-10 sm:py-12 px-4 sm:px-6 bg-slate-900 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600 rounded-full blur-[120px] opacity-10 -z-10"></div>
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center gap-8">
                        <div className="w-full md:flex-1 space-y-4">
                            <div className="inline-flex items-center gap-2 px-2 py-1 bg-white/10 text-green-400 rounded-md text-[9px] font-bold uppercase tracking-wider">
                                <TrendingUp size={10} /> Future Facing
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight text-white">
                                Connecting talent with <span className="text-green-400">Opportunity.</span>
                            </h2>
                            <div className="space-y-3 text-[13px] sm:text-sm font-medium text-slate-400 leading-relaxed">
                                <p>
                                    We provide nurses with a centralized platform to discover roles that match their expertise and lifestyle.
                                </p>
                            </div>
                        </div>

                        {/* Stats grid — on mobile: 2 compact rows, on desktop: original bento */}
                        <div className="w-full md:flex-1 grid grid-cols-2 gap-3">
                            <div className="space-y-3">
                                <div className="h-24 sm:h-28 bg-white/5 rounded-2xl p-4 flex flex-col justify-center border border-white/10">
                                    <h4 className="text-lg sm:text-xl font-bold text-green-400">200K+</h4>
                                    <p className="text-[8px] uppercase font-bold tracking-widest opacity-60">Jobs Posted</p>
                                </div>
                                <div className="h-36 sm:h-48 bg-blue-600 rounded-2xl p-4 sm:p-6 flex flex-col justify-end text-white relative group overflow-hidden shadow-2xl shadow-blue-500/20">
                                    <TrendingUp className="absolute top-4 right-4 opacity-20 group-hover:scale-110 transition-transform" size={28} />
                                    <h4 className="font-bold text-sm">Success Driven</h4>
                                </div>
                            </div>
                            <div className="space-y-3 pt-6 sm:pt-8">
                                <div className="h-36 sm:h-48 bg-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col justify-end text-white relative group overflow-hidden">
                                    <Users className="absolute top-4 right-4 opacity-20 group-hover:scale-110 transition-transform" size={28} />
                                    <h4 className="font-bold text-sm">Community Support</h4>
                                </div>
                                <div className="h-24 sm:h-32 bg-green-600 rounded-2xl p-4 sm:p-5 flex flex-col justify-center text-white shadow-xl shadow-green-500/10">
                                    <h4 className="text-xl sm:text-2xl font-bold">100%</h4>
                                    <p className="text-[9px] uppercase font-bold tracking-widest opacity-80">Free for Nurses</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── CALL TO ACTION ── */}
                <section className="py-12 sm:py-16 px-4 sm:px-6 text-center bg-white border-t border-slate-50">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Ready to start?</h2>
                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <Link href="/auth/register" className="w-full sm:w-auto bg-blue-600 text-white font-bold px-6 py-3 rounded-lg text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all uppercase tracking-wider text-center">
                                Join Now
                            </Link>
                            <Link href="/contact" className="w-full sm:w-auto bg-slate-900 text-white font-bold px-6 py-3 rounded-lg text-sm hover:bg-slate-800 transition-all shadow-lg active:scale-95 uppercase tracking-wider text-center">
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* ── FOOTER ── */}
            <footer className="bg-slate-50 py-10 sm:py-12 px-4 sm:px-6 border-t border-slate-100 text-center">
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">© 2026 NurseFlex Community. All rights reserved.</p>
            </footer>
        </div>
    );
}