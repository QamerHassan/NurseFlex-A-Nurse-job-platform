'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
    FileText, CreditCard, Users, Settings,
    LogOut, ExternalLink, User
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { clearAllUserData } from '@/lib/auth-utils';

export default function EmployerProfileDropdown({ email }: { email?: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignOut = () => {
        // Wipe every localStorage key so next user starts clean
        clearAllUserData();
        router.push('/business/login');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-pink-100 text-[#ec4899] ring-2 ring-pink-200' : 'bg-slate-50 text-slate-400 hover:bg-pink-50 hover:text-[#ec4899] border border-slate-100 hover:border-pink-100 shadow-sm'}`}
            >
                <User size={18} className="transition-transform group-hover:scale-110" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[200] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    {/* User Email Header */}
                    <div className="px-6 py-5 border-b border-slate-100">
                        <p className="text-slate-900 font-bold text-sm tracking-tight truncate">
                            {email || 'qamerhassan6@gmail.com'}
                        </p>
                    </div>

                    <div className="py-2 max-h-[70vh] overflow-y-auto">
                        {/* Billing Section */}
                        <div className="px-6 py-2">
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Billing</h3>
                            <Link href="/business/settings#billing" onClick={() => setIsOpen(false)} className="flex items-center gap-3 py-2 text-slate-700 hover:text-pink-600 transition-colors group">
                                <FileText size={18} className="text-slate-400 group-hover:text-pink-600" />
                                <span className="font-bold text-sm">Invoices</span>
                            </Link>
                            <Link href="/business/settings#billing" onClick={() => setIsOpen(false)} className="flex items-center gap-3 py-2 text-slate-700 hover:text-pink-600 transition-colors pl-[30px]">
                                <span className="font-bold text-sm">Payment method</span>
                            </Link>
                        </div>

                        <div className="h-px bg-slate-100 my-2 mx-6"></div>

                        {/* Team Section */}
                        <div className="px-6 py-2">
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Team</h3>
                            <Link href="/business/settings#team" onClick={() => setIsOpen(false)} className="flex items-center gap-3 py-2 text-slate-700 hover:text-pink-600 transition-colors group">
                                <Users size={18} className="text-slate-400 group-hover:text-pink-600" />
                                <span className="font-bold text-sm">Manage access</span>
                            </Link>
                        </div>

                        <div className="h-px bg-slate-100 my-2 mx-6"></div>

                        {/* Account Section */}
                        <div className="px-6 py-2">
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Account</h3>
                            <Link href="/business/settings#profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 py-2 text-slate-700 hover:text-pink-600 transition-colors group">
                                <Settings size={18} className="text-slate-400 group-hover:text-pink-600" />
                                <span className="font-bold text-sm">My settings</span>
                            </Link>
                        </div>

                        <div className="h-px bg-slate-100 my-2 mx-6"></div>

                        {/* Switch Link */}
                        <Link href="/dashboard" className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors group">
                            <span className="font-bold text-slate-700 text-sm">Visit NurseFlex for job seekers</span>
                            <ExternalLink size={14} className="text-slate-400 group-hover:text-pink-600" />
                        </Link>
                    </div>

                    {/* Sign Out */}
                    <div className="border-t border-slate-100 p-2">
                        <button
                            onClick={handleSignOut}
                            className="w-full text-left px-4 py-3 text-slate-700 font-bold text-sm hover:bg-slate-50 rounded-xl transition-all"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
