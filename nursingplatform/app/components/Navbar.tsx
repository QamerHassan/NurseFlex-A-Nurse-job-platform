"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Bell, Menu, X, Bookmark, MessageSquare } from 'lucide-react';
import { useSession } from 'next-auth/react';
import ProfileDropdown from './ProfileDropdown';
import NotificationBell from './NotificationBell';
import { Button } from "@/app/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const isBusinessPortal = pathname.startsWith('/business');
    const tokenKey = isBusinessPortal ? 'business_token' : 'token';
    const token = localStorage.getItem(tokenKey);
    setIsLoggedIn(!!token || status === 'authenticated');
  }, [pathname, status]);

  const getRole = () => {
    if (typeof window === 'undefined') return 'NURSE';
    const isBusinessPortal = pathname.startsWith('/business');
    const userKey = isBusinessPortal ? 'business_user' : 'user';
    const user = JSON.parse(localStorage.getItem(userKey) || '{}');
    return (session?.user as any)?.role || user.role || 'NURSE';
  };

  const role = mounted ? getRole() : 'NURSE';

  const navLinks = [
    { label: 'Home', href: isLoggedIn ? '/dashboard' : '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Find Jobs', href: '/jobs' },
    { label: 'Blogs', href: '/blogs' }
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'py-3 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm' : 'py-6 bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-pink-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-pink-200 group-hover:scale-105 transition-transform duration-500">
            <Shield size={20} className="fill-white" />
          </div>
          <span className="font-black text-slate-900 text-2xl tracking-tighter italic uppercase">NurseFlex</span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              asChild
              className={`text-sm font-bold tracking-tight rounded-xl px-4 ${
                pathname === link.href ? 'text-pink-600 bg-pink-50/50' : 'text-slate-500 hover:text-pink-600 hover:bg-pink-50/30'
              }`}
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}

          <div className="h-4 w-px bg-slate-100 mx-4"></div>

          {role === 'BUSINESS' ? (
            <Button asChild className="h-10 px-6 rounded-xl font-black uppercase tracking-tighter italic bg-pink-600 group shadow-md shadow-pink-200 hover:bg-pink-700 transition-all text-white">
               <Link href="/business/dashboard">Business Hub</Link>
            </Button>
          ) : (
            <Button variant="outline" asChild className="h-10 px-6 rounded-xl font-bold border-pink-100 text-pink-600 hover:bg-pink-50">
               <Link href="/business">Business Portal</Link>
            </Button>
          )}
        </nav>

        {/* ACTIONS */}
        <div className="hidden lg:flex items-center gap-4">
          {mounted && (isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild className="h-10 w-10 rounded-xl text-slate-400 hover:text-pink-600 hover:bg-pink-50 transition-colors">
                <Link href="/messages"><MessageSquare size={20} /></Link>
              </Button>
              <Button variant="ghost" size="icon" asChild className="h-10 w-10 rounded-xl text-slate-400 hover:text-pink-600 hover:bg-pink-50 transition-colors">
                <Link href="/saved-jobs"><Bookmark size={20} /></Link>
              </Button>
              <NotificationBell />
              <ProfileDropdown email={session?.user?.email || undefined} />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild className="h-11 px-6 rounded-xl font-bold text-pink-600 hover:bg-pink-50">
                <Link href={pathname.startsWith('/business') ? '/auth/login?portal=business' : '/auth/login'}>Sign In</Link>
              </Button>
              <Button asChild className="h-11 px-7 rounded-2xl font-black uppercase tracking-tighter italic bg-pink-600 shadow-md shadow-pink-200 hover:bg-pink-700 transition-all active:scale-[0.98] text-white">
                <Link href={pathname.startsWith('/business') ? '/auth/register?portal=business' : '/auth/register'}>Get Started</Link>
              </Button>
            </div>
          ))}
        </div>

        {/* MOBILE MENU */}
        <div className="lg:hidden flex items-center gap-3">
            {mounted && isLoggedIn && (
                <Button variant="ghost" size="icon" asChild className="h-10 w-10 rounded-xl">
                    <Link href="/notifications"><Bell size={20} className="text-slate-400" /></Link>
                </Button>
            )}
            {mounted && (
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl">
                            <Menu size={24} />
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-xs p-8 rounded-l-3xl border-none shadow-2xl">
                        <SheetHeader className="mb-10 text-left">
                            <SheetTitle className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-pink-600 rounded-2xl flex items-center justify-center text-white">
                                    <Shield size={20} />
                                </div>
                                <span className="font-black text-2xl tracking-tighter italic uppercase">NurseFlex</span>
                            </SheetTitle>
                        </SheetHeader>
                        <nav className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Button key={link.href} variant="ghost" asChild className="justify-start h-14 px-4 rounded-xl font-bold text-lg text-slate-600">
                                    <Link href={link.href}>{link.label}</Link>
                                </Button>
                            ))}
                            <Button variant="ghost" asChild className="justify-start h-14 px-4 rounded-xl font-bold text-lg text-slate-600">
                                <Link href="/business">Business Portal</Link>
                            </Button>
                        </nav>
                        <div className="mt-10 pt-10 border-t border-slate-50 space-y-4">
                            {isLoggedIn ? (
                                <Button asChild size="lg" className="w-full h-16 rounded-2xl font-black uppercase tracking-tighter italic bg-pink-600 shadow-xl shadow-pink-100 hover:bg-pink-700">
                                    <Link href="/dashboard">Access Dashboard</Link>
                                </Button>
                            ) : (
                                <>
                                    <Button asChild size="lg" className="w-full h-16 rounded-2xl font-black uppercase tracking-tighter italic bg-pink-600 shadow-xl shadow-pink-100 hover:bg-pink-700">
                                        <Link href="/auth/register">Join Network</Link>
                                    </Button>
                                    <Button variant="outline" asChild size="lg" className="w-full h-16 rounded-2xl font-bold border-slate-100">
                                        <Link href="/auth/login">Sign In</Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
            )}
        </div>
      </div>
    </header>
  );
}