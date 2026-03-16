'use client';
import React from 'react';
import Link from 'next/link';
import {
    Search, Bookmark, MessageSquare, Bell,
    ChevronRight, Facebook, Twitter, Youtube, Instagram
} from 'lucide-react';
import ProfileDropdown from '@/app/components/ProfileDropdown';

export default function HelpPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            {/* 🚀 TOP NAV (Standard Indeed Header) */}
            <nav className="border-b bg-white sticky top-0 z-[100] px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/dashboard" className="text-blue-600 text-3xl font-black tracking-tighter italic">NurseFlex</Link>
                    <div className="hidden md:flex gap-6 font-bold text-slate-600 text-sm">
                        <Link href="/dashboard" className="hover:text-blue-600 transition-colors pb-2 border-b-2 border-transparent">Home</Link>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/saved-jobs" className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                        <Bookmark size={22} />
                    </Link>
                    <Link href="/messages" className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                        <MessageSquare size={22} />
                    </Link>
                    <Link href="/notifications" className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                        <Bell size={22} />
                    </Link>
                    <ProfileDropdown />
                    <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>
                    <Link href="/business" className="text-sm font-bold text-slate-600 hover:underline">Employers / Post Job</Link>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-12">
                {/* Indeed Logo in context */}
                <div className="flex justify-center mb-12">
                    <span className="text-blue-600 text-5xl font-black tracking-tighter italic">NurseFlex</span>
                </div>

                {/* Hero Cards */}
                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    <div className="bg-slate-50 p-10 rounded-2xl border border-slate-100 group cursor-pointer hover:shadow-lg transition-all">
                        <h2 className="text-3xl font-bold mb-6">Help for Job Seekers</h2>
                        <Link href="#" className="text-blue-600 font-bold hover:underline inline-flex items-center gap-2">
                            Job Seeker Help Center <ChevronRight size={18} />
                        </Link>
                    </div>

                    <div className="bg-slate-50 p-10 rounded-2xl border border-slate-100 group cursor-pointer hover:shadow-lg transition-all">
                        <h2 className="text-3xl font-bold mb-6">Help for Employers</h2>
                        <Link href="#" className="text-blue-600 font-bold hover:underline inline-flex items-center gap-2">
                            Employer Help Center <ChevronRight size={18} />
                        </Link>
                    </div>
                </div>

                {/* Support Section */}
                <div className="text-center py-20 border-t border-slate-100">
                    <h2 className="text-4xl font-bold mb-4">We're here to help</h2>
                    <p className="text-slate-500 font-medium mb-10 text-lg">Visit our Help Center for answers to common questions or contact us directly.</p>

                    <div className="flex flex-col md:flex-row justify-center gap-4">
                        <button className="px-10 py-4 bg-white border-2 border-slate-200 font-bold rounded-2xl hover:bg-slate-50 transition-all text-blue-600">
                            Help center
                        </button>
                        <button className="px-10 py-4 bg-white border-2 border-slate-200 font-bold rounded-2xl hover:bg-slate-50 transition-all text-blue-600">
                            Contact support
                        </button>
                    </div>
                </div>
            </main>

            {/* 🚀 EXPANDED FOOTER */}
            <footer className="bg-slate-50 border-t border-slate-100 px-8 pt-16 pb-10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                        <div>
                            <h4 className="font-bold mb-6 text-slate-900">NurseFlex</h4>
                            <ul className="space-y-4 text-sm font-medium text-slate-500">
                                <li><Link href="#" className="hover:text-blue-600">About NurseFlex</Link></li>
                                <li><Link href="#" className="hover:text-blue-600">Press</Link></li>
                                <li><Link href="#" className="hover:text-blue-600">Security</Link></li>
                                <li><Link href="#" className="hover:text-blue-600">Terms</Link></li>
                                <li><Link href="#" className="hover:text-blue-600">Privacy Center and Ad Choices</Link></li>
                                <li><Link href="#" className="hover:text-blue-600">About ESG</Link></li>
                                <li><Link href="#" className="hover:text-blue-600">Accessibility at NurseFlex</Link></li>
                                <li><Link href="#" className="hover:text-blue-600">Work at NurseFlex</Link></li>
                                <li><Link href="#" className="hover:text-blue-600">Countries</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-6 text-slate-900">Job Seekers</h4>
                            <ul className="space-y-4 text-sm font-medium text-slate-500">
                                <li><Link href="#" className="hover:text-blue-600">Salaries</Link></li>
                                <li><Link href="#" className="hover:text-blue-600">Browse jobs</Link></li>
                            </ul>
                        </div>

                        {/* Empty columns to match Indeed spacing */}
                        <div className="hidden md:block"></div>

                        <div className="flex items-start justify-end gap-6 text-slate-400">
                            <Link href="#" className="hover:text-slate-900"><Facebook size={24} /></Link>
                            <Link href="#" className="hover:text-slate-900"><Twitter size={24} /></Link>
                            <Link href="#" className="hover:text-slate-900"><Youtube size={24} /></Link>
                            <Link href="#" className="hover:text-slate-900"><Instagram size={24} /></Link>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">© 2026 NurseFlex</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
