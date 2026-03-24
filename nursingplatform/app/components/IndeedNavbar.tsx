"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    Bell, MessageSquare, Bookmark, 
    Search, User, Menu,
    Briefcase
} from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';
import { Button } from "@/app/components/ui/button";
import { useSession } from 'next-auth/react';

export default function IndeedNavbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navLinks = [
    { label: 'Home', href: '/dashboard', active: pathname === '/dashboard' },
  ];

  return (
    <header className="fixed top-0 w-full h-[72px] bg-white border-b border-slate-200 z-[100] flex items-center">
      <div className="max-w-[1440px] mx-auto w-full px-4 md:px-8 flex items-center justify-between">
        
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-lg">N</div>
            <span className="text-xl font-bold text-blue-600 tracking-tight hidden sm:block">NurseFlex</span>
          </Link>

          {/* Primary Nav */}
          <nav className="hidden lg:flex items-center">
            {navLinks.map((link) => (
              <Link 
                key={link.label}
                href={link.href}
                className={`px-4 py-6 text-sm font-bold border-b-4 transition-colors ${
                  link.active 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Actions Cluster */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center border-r border-slate-200 pr-2 md:pr-4 mr-2 md:mr-4 gap-1 md:gap-2">
            <Button variant="ghost" size="icon" asChild className="h-10 w-10 text-slate-600 hover:bg-slate-100 rounded-full">
                <Link href="/messages"><MessageSquare size={20} /></Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="h-10 w-10 text-slate-600 hover:bg-slate-100 rounded-full">
                <Link href="/notifications"><Bell size={20} /></Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="h-10 w-10 text-slate-600 hover:bg-slate-100 rounded-full">
                <Link href="/saved-jobs"><Bookmark size={20} /></Link>
            </Button>
          </div>

          <div className="flex items-center gap-4">
             <ProfileDropdown email={session?.user?.email || undefined} />
             <div className="hidden xl:block h-6 w-px bg-slate-200 mx-2"></div>
             <Link href="/business" className="hidden xl:block text-sm font-bold text-slate-600 hover:text-blue-600 hover:underline">
                Employers / Post Job
             </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <Button variant="ghost" size="icon" className="lg:hidden h-10 w-10 text-slate-600">
            <Menu size={24} />
          </Button>
        </div>

      </div>
    </header>
  );
}
