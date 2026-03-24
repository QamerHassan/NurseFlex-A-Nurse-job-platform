'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    User, Shield, Bell, Smartphone, Lock,
    ChevronRight, Bookmark, MessageSquare
} from 'lucide-react';
import ProfileDropdown from '@/app/components/ProfileDropdown';
import api from '@/lib/api';

interface SettingsLayoutProps {
    children: React.ReactNode;
    title: string;
}

export default function SettingsLayout({ children, title }: SettingsLayoutProps) {
    const pathname = usePathname();
    const [userProfile, setUserProfile] = useState<any>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/profile');
                setUserProfile(res.data);
            } catch (err) {
                console.error("Settings profile fetch error");
            }
        };
        fetchProfile();
    }, []);

    const menuItems = [
        {
            id: 'account',
            label: 'Account settings',
            sublabel: 'Your contact information',
            icon: <User size={22} />,
            href: '/settings'
        },
        {
            id: 'security',
            label: 'Security settings',
            sublabel: 'Manage your account security',
            icon: <Lock size={22} />,
            href: '/settings/security',
            isNew: true
        },
        {
            id: 'communications',
            label: 'Communications settings',
            sublabel: 'Manage notifications and message settings',
            icon: <Bell size={22} />,
            href: '/settings/communications'
        },
        {
            id: 'devices',
            label: 'Device management',
            sublabel: 'Manage your active devices and sessions',
            icon: <Smartphone size={22} />,
            href: '/settings/devices'
        },
        {
            id: 'privacy',
            label: 'Privacy settings',
            sublabel: 'Information about your privacy on NurseFlex',
            icon: <Shield size={22} />,
            href: '/settings/privacy'
        }
    ];

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            {/* 🚀 TOP NAV */}
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
                    <ProfileDropdown email={userProfile?.user?.email} />
                    <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>
                    <Link href="/business" className="text-sm font-bold text-slate-600 hover:underline">Employers / Post Job</Link>
                </div>
            </nav>

            {/* 🛠️ SETTINGS LAYOUT */}
            <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-12">

                {/* LEFT SIDEBAR: MENU */}
                <aside className="md:w-72 shrink-0">
                    <h1 className="text-3xl font-bold mb-8">Settings</h1>
                    <nav className="space-y-1">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={`w-full flex items-center justify-between p-4 rounded-r-xl transition-all group ${isActive
                                        ? "bg-slate-50 border-l-4 border-blue-600"
                                        : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={isActive ? "text-slate-900" : ""}>{item.icon}</div>
                                        <div className="text-left">
                                            <div className="flex items-center gap-2">
                                                <p className={`font-bold leading-tight ${isActive ? "text-slate-900" : ""}`}>{item.label}</p>
                                                {item.isNew && (
                                                    <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter">New</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium italic">{item.sublabel}</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className={`text-slate-400 group-hover:translate-x-1 transition-transform ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* RIGHT CONTENT */}
                <main className="flex-1 max-w-2xl">
                    <h2 className="text-2xl font-bold mb-10">{title}</h2>
                    {children}
                </main>
            </div>

            {/* FOOTER */}
            <footer className="mt-20 border-t border-slate-100 px-8 py-10 bg-slate-50">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">© 2026 NurseFlex • Accessibility at NurseFlex • Privacy Center and Ad Choices • Terms</p>
                    <div className="flex gap-6 text-slate-400 font-black text-[10px] uppercase tracking-tighter">
                        <Link href="#" className="hover:text-blue-600 underline">Privacy</Link>
                        <Link href="#" className="hover:text-blue-600 underline">Terms</Link>
                        <Link href="#" className="hover:text-blue-600 underline">Help</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
