"use client";
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './components/Navbar';
import IndeedNavbar from './components/IndeedNavbar';
import BottomNav from './components/BottomNav';
import NotificationBell from './components/NotificationBell';
import { Providers } from './components/Providers';
import GoogleOneTap from './components/GoogleOneTap';
import './globals.css';

import FloatingNotifications from './components/FloatingNotifications';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const googleId = localStorage.getItem('x-google-user-id');
    setIsLoggedIn(!!token || !!googleId);
    
    // Sync NextAuth session to localStorage as a backup for api.ts
    const syncSession = async () => {
      const { getSession } = await import('next-auth/react');
      const session = await getSession();
      if (session?.user && (session.user as any).id) {
        localStorage.setItem('x-google-user-id', (session.user as any).id);
        setIsLoggedIn(true);
      }
    };
    syncSession();
  }, [pathname]);

  const isPortal = pathname.startsWith('/business') || pathname.startsWith('/admin');
  const isAuthPage = pathname.startsWith('/auth');
  const isOnboarding = pathname.startsWith('/onboarding');
  const isDashboard = pathname.startsWith('/dashboard') || pathname === '/dashboard';
  const isSavedJobs = pathname.startsWith('/saved-jobs');
  const isMessages = pathname.startsWith('/messages');
  const isNotifications = pathname.startsWith('/notifications');
  const isProfile = pathname.startsWith('/nurse/profile');
  const isLandingPage = pathname === '/';

  const isSettings = pathname.startsWith('/settings');
  const isHelp = pathname.startsWith('/help');
  const isApplyFlow = pathname.includes('/apply');
  const isIndeedPage = isDashboard || isSavedJobs || isMessages || isNotifications || isProfile || isSettings || isHelp || isApplyFlow;

  const isAdminPortal = pathname.startsWith('/admin');

  return (
    <html lang="en" className="scroll-smooth antialiased">
      <body className="bg-white text-slate-900 selection:bg-pink-50 selection:text-pink-600" style={{ fontFamily: "'Poppins', sans-serif" }}>
        <Providers>
          {mounted && !isAdminPortal && <GoogleOneTap />}
          {mounted && isLoggedIn && !isAdminPortal && <FloatingNotifications />}
          {!isPortal && !isAuthPage && !isOnboarding && !isIndeedPage && <Navbar />}
          {mounted && isIndeedPage && !isPortal && <IndeedNavbar />}
          <main className={(!isPortal && !isAuthPage && !isOnboarding && !isIndeedPage) || isIndeedPage ? "pt-[72px] md:pt-24 min-h-screen pb-[64px] md:pb-0" : "min-h-screen"}>
            {children}
          </main>
          {mounted && isIndeedPage && !isPortal && <BottomNav />}
        </Providers>
      </body>
    </html>
  );
}