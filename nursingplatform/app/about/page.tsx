"use client";
import React from 'react';
import Link from 'next/link';
import { Heart, ShieldCheck, TrendingUp, Users } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">

            <main>
                <section className="py-24 px-6 bg-white overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-pink-50 rounded-full blur-[120px] -ml-64 -mt-64 opacity-60"></div>
                    <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-pink-50 text-pink-600 rounded-2xl text-[10px] font-bold uppercase tracking-wider animate-fade-in shadow-sm border border-pink-100/50">
                            Our Story
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] text-slate-900">
                            We help nurses <span className="text-pink-600">find jobs.</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-3xl mx-auto">
                            NurseFlex is the leading community for healthcare professionals. We connect qualified nurses with the best career opportunities.
                        </p>
                        <div className="w-16 h-1 bg-slate-900 mx-auto rounded-full"></div>
                    </div>
                </section>

                {/* 🎯 MISSION */}
                <section className="py-24 px-6">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                        <div className="flex-1 space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-full text-xs font-bold uppercase tracking-wider">
                                <ShieldCheck size={14} /> Our Mission
                            </div>
                            <h2 className="text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                                Our Mission: <span className="text-pink-600">Helping People Get Jobs.</span>
                            </h2>
                            <p className="text-lg text-slate-600 font-medium leading-relaxed">
                                Our goal is simple: to connect the right nurse with the right job. We build tools that make it easier for healthcare professionals to showcase their skills and for employers to find the talent they need.
                            </p>
                            <p className="text-lg text-slate-600 font-medium leading-relaxed">
                                We believe that by creating a transparent, verified community, we can improve the quality of care across the country.
                            </p>
                        </div>
                        <div className="flex-1">
                            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                                <img
                                    src="/nurse_community_mission_1773058421933.png"
                                    alt="Our Mission"
                                    className="w-full h-full object-cover min-h-[400px]"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 📈 GROWTH / SHORTAGE */}
                <section className="py-24 px-6 bg-slate-900 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-20 -z-10"></div>
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center gap-16">
                        <div className="flex-1 space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-pink-400 rounded-full text-xs font-bold uppercase tracking-wider">
                                <TrendingUp size={14} /> Future Facing
                            </div>
                            <h2 className="text-4xl font-bold tracking-tight leading-tight text-white">
                                Connecting talent with <span className="text-pink-400">Opportunity.</span>
                            </h2>
                            <div className="space-y-6 text-lg font-medium text-slate-300 leading-relaxed">
                                <p>
                                    Finding a job shouldn't be a full-time job. We provide nurses with a centralized platform to manage their professional profiles and discover roles that match their expertise and lifestyle.
                                </p>
                                <p>
                                    For healthcare organizations, we offer a streamlined path to hiring verified, qualified professionals, reducing the time and effort required to staff critical care positions.
                                </p>
                            </div>
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="h-40 bg-white/5 rounded-3xl p-6 flex flex-col justify-center border border-white/10">
                                    <h4 className="text-3xl font-bold text-pink-400">200K+</h4>
                                    <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Jobs Posted Monthly</p>
                                </div>
                                <div className="h-60 bg-pink-600 rounded-3xl p-8 flex flex-col justify-end text-white relative group overflow-hidden shadow-2xl shadow-pink-500/20">
                                    <TrendingUp className="absolute top-6 right-6 opacity-20 group-hover:scale-110 transition-transform" size={40} />
                                    <h4 className="font-bold">Success Driven</h4>
                                </div>
                            </div>
                            <div className="space-y-4 pt-12">
                                <div className="h-60 bg-slate-800 rounded-3xl p-8 flex flex-col justify-end text-white relative group overflow-hidden">
                                    <Users className="absolute top-6 right-6 opacity-20 group-hover:scale-110 transition-transform" size={40} />
                                    <h4 className="font-bold">Community Support</h4>
                                </div>
                                <div className="h-40 bg-pink-600 rounded-3xl p-6 flex flex-col justify-center text-white shadow-xl shadow-pink-500/10">
                                    <h4 className="text-3xl font-bold">100%</h4>
                                    <p className="text-[10px] uppercase font-bold tracking-widest opacity-80">Free for Nurses</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 🚀 CALL TO ACTION */}
                <section className="py-32 px-6 text-center">
                    <div className="max-w-3xl mx-auto space-y-10">
                        <h2 className="text-5xl font-bold tracking-tight text-slate-900">Ready to start?</h2>
                        <div className="flex flex-col md:flex-row justify-center gap-4">
                            <Link href="/auth/register" className="bg-pink-600 text-white font-bold px-10 py-5 rounded-2xl text-lg shadow-xl shadow-pink-100 hover:bg-pink-700 active:scale-95 transition-all uppercase tracking-wider">
                                Join the Network
                            </Link>
                            <Link href="/contact" className="bg-slate-900 text-white font-bold px-10 py-5 rounded-2xl text-lg hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                                Partner with Us
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* 📜 FOOTER */}
            <footer className="bg-slate-50 py-12 px-6 border-t border-slate-100 text-center">
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">© 2026 NurseFlex Community. All rights reserved.</p>
            </footer>
        </div>
    );
}
