"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NurseLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [nurseName, setNurseName] = useState<string | null>(null);

  useEffect(() => {
    setNurseName(localStorage.getItem('nurseName'));
  }, []);

  const isProfile = pathname.startsWith('/nurse/profile');

  return (
    <>
      {!isProfile && (
        <nav className="fixed top-0 left-0 right-0 h-20 bg-white/95 backdrop-blur-md border-b border-blue-50 z-[100] flex items-center shadow-sm">
          <div className="max-w-7xl mx-auto w-full px-6 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-md shadow-blue-200">N</div>
              <span className="text-2xl font-black text-blue-900 tracking-tight">Nurse<span className="text-blue-500">Flex</span></span>
            </Link>
            <div className="hidden lg:flex items-center space-x-8 font-bold text-blue-900/70">
              <Link href="/jobs" className="hover:text-blue-600 transition-colors">Find Shifts</Link>
              <Link href="/saved-jobs" className="hover:text-blue-600 transition-colors">Saved Jobs</Link>
              <Link href="/my-applications" className="hover:text-blue-600 transition-colors">My Applications</Link>
            </div>
            <div className="px-5 py-2.5 bg-blue-50 text-blue-700 rounded-full font-bold text-xs uppercase tracking-wide">
              👤 {nurseName || 'Guest'}
            </div>
          </div>
        </nav>
      )}
      <main className={!isProfile ? "pt-20 min-h-screen" : "min-h-screen"}>{children}</main>
    </>
  );
}