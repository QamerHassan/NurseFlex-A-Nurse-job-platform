"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    Search, Bookmark, MessageSquare, 
    Bell, User 
} from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: Search, label: 'Search', href: '/dashboard', active: pathname === '/dashboard' },
    { icon: Bookmark, label: 'Saved', href: '/saved-jobs', active: pathname === '/saved-jobs' },
    { icon: MessageSquare, label: 'Messages', href: '/messages', active: pathname === '/messages' },
    { icon: Bell, label: 'Notifications', href: '/notifications', active: pathname === '/notifications' },
    { icon: User, label: 'Profile', href: '/nurse/profile', active: pathname === '/nurse/profile' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-[100] h-[64px] flex items-center justify-around px-2">
      {navItems.map((item) => (
        <Link 
          key={item.label} 
          href={item.href}
          className="flex-1 h-full flex flex-col items-center justify-center relative group"
        >
          {/* Active indicator bar */}
          {item.active && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600 animate-in fade-in duration-300"></div>
          )}
          
          <div className={`flex flex-col items-center transition-colors ${item.active ? 'text-blue-600' : 'text-slate-500'}`}>
            <item.icon size={22} className={item.active ? 'fill-current opacity-20' : ''} />
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">{item.label}</span>
          </div>

          {/* Triangular arrow indicator below */}
          {item.active && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-blue-600"></div>
          )}
        </Link>
      ))}
    </nav>
  );
}
