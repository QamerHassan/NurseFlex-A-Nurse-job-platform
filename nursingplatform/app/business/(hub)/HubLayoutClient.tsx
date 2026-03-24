"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, PlusCircle, ClipboardList, Users,
  Settings, LogOut, ChevronRight, Building2, Loader2,
  Bell, MessageSquare, Zap, ShieldCheck, HelpCircle,
  Menu, X
} from 'lucide-react';
import api from '@/lib/api';
import { signOut } from 'next-auth/react';
import { clearPortalData } from '@/lib/auth-utils';
import ChatWidget from '@/app/components/ChatWidget';
import NotificationBell from '@/app/components/NotificationBell';
import EmployerProfileDropdown from '@/app/components/EmployerProfileDropdown';

import { Button } from "@/app/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/business/dashboard', icon: LayoutDashboard },
  { label: 'Post a Job', href: '/business/post-job', icon: PlusCircle },
  { label: 'Job Posts', href: '/business/manage-shifts', icon: ClipboardList },
  { label: 'Applicants', href: '/business/applicants', icon: Users },
  { label: 'Profile', href: '/business/profile', icon: Building2 },
  { label: 'Settings', href: '/business/settings', icon: Settings },
];

export default function HubLayoutClient({ children, initialUser }: { children: React.ReactNode, initialUser: any }) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeChatParticipant, setActiveChatParticipant] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState(initialUser?.name || 'Employer Hub');
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const isExpanded = isPinned || isHovered;

  useEffect(() => {
    const handleStartChat = (e: any) => {
      if (e.detail?.participantId) setActiveChatParticipant(e.detail.participantId);
    };
    window.addEventListener('startChat', handleStartChat);
    return () => window.removeEventListener('startChat', handleStartChat);
  }, []);

  // Sync session/user to localStorage if missing (for legacy client-side code)
  useEffect(() => {
    if (initialUser) {
        const user = { id: initialUser.id, role: initialUser.role || 'BUSINESS', status: initialUser.status || 'APPROVED', name: initialUser.name };
        localStorage.setItem('business_user', JSON.stringify(user));
        // Note: we don't have the token here readily available from session in a way we can just 'get' for localStorage
        // but the app should ideally use session cookies now.
    }
  }, [initialUser]);

  const SidebarContent = ({ isExpanded, showPin = false }: { isExpanded: boolean, showPin?: boolean }) => (
    <div className="flex flex-col h-full bg-white text-slate-500 overflow-hidden w-full">
      <div className={`p-6 border-b border-slate-100 flex items-center ${!isExpanded ? 'justify-center' : 'justify-between'}`}>
        <Link href="/business/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 shrink-0 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">N</div>
            {isExpanded && (
                <div className="whitespace-nowrap animate-in fade-in slide-in-from-left-2">
                    <h2 className="text-lg font-bold text-blue-600 tracking-tight">Employer Hub</h2>
                </div>
            )}
        </Link>
        {isExpanded && showPin && (
            <Button
                variant="ghost" 
                size="icon"
                onClick={() => setIsPinned(!isPinned)}
                className="h-8 w-8 text-slate-400 hover:text-blue-600 transition-all rounded-md"
            >
                {!isPinned ? <Menu size={18} /> : <X size={18} />}
            </Button>
        )}
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-6">
            <div>
               {isExpanded && <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 px-3">Menu</p>}
               <nav className="space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const active = pathname === item.href || (item.href !== '/business/dashboard' && pathname.startsWith(item.href));
                        return (
                            <Link key={item.href} href={item.href}>
                                <div className={`flex items-center gap-3 h-11 ${!isExpanded ? 'px-0 justify-center' : 'px-3'} rounded-lg transition-all duration-200 group ${active ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 rounded-l-none' : 'hover:bg-slate-50 hover:text-slate-900'}`}>
                                    <item.icon size={18} className={`${active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} transition-colors shrink-0`} />
                                    {isExpanded && <span className="font-semibold text-sm">{item.label}</span>}
                                </div>
                            </Link>
                        );
                    })}
               </nav>
            </div>

            <div>
               {isExpanded && <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 px-3">Quick Links</p>}
               <nav className="space-y-1">
                    <Link href="/help">
                        <div className={`flex items-center gap-3 h-11 ${!isExpanded ? 'px-0 justify-center' : 'px-3'} rounded-lg transition-all hover:bg-slate-50 hover:text-slate-900 group`}>
                            <HelpCircle size={18} className="text-slate-400 group-hover:text-slate-600 shrink-0" />
                            {isExpanded && <span className="font-semibold text-sm">Help Center</span>}
                        </div>
                    </Link>
                    <Link href="/">
                        <div className={`flex items-center gap-3 h-11 ${!isExpanded ? 'px-0 justify-center' : 'px-3'} rounded-lg transition-all hover:bg-slate-50 hover:text-slate-900 group`}>
                            <PlusCircle size={18} className="text-slate-400 group-hover:text-slate-600 shrink-0" />
                            {isExpanded && <span className="font-semibold text-sm">Find Jobs</span>}
                        </div>
                    </Link>
               </nav>
            </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-slate-100">
        <div className={`flex items-center ${!isExpanded ? 'justify-center font-bold' : 'gap-3'} transition-all`}>
            <Avatar className="h-8 w-8 shrink-0 rounded-md">
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-bold">{businessName[0]}</AvatarFallback>
            </Avatar>
            {isExpanded && (
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{businessName}</p>
                    <p className="text-[10px] text-slate-400">Employer</p>
                </div>
            )}
        </div>
        
        <div className={`mt-3 flex items-center ${!isExpanded ? 'justify-center' : 'justify-start'}`}>
            <Button 
                variant="ghost" 
                size="sm" 
                className={`h-9 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all ${!isExpanded ? 'w-9 p-0' : 'w-full flex gap-3 px-3 justify-start'}`}
                onClick={async () => {
                    clearPortalData('business');
                    await signOut({ callbackUrl: '/auth/login?portal=business' });
                }}
            >
                <LogOut size={16} className="shrink-0" />
                {isExpanded && <span className="font-semibold text-xs">Sign out</span>}
            </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`hidden lg:block fixed h-full z-[100] transition-all duration-300 ease-in-out border-r border-slate-200 ${!isExpanded ? 'w-[4.5rem]' : 'w-64'} bg-white`}
      >
         <SidebarContent isExpanded={isExpanded} showPin={true} />
      </aside>

      <div className="flex-1 flex flex-col lg:ml-[4.5rem] transition-all duration-300 ease-in-out">
        <header className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-4 lg:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-600">
                            <Menu size={20} />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64 border-none">
                        <SidebarContent isExpanded={true} showPin={false} />
                    </SheetContent>
                </Sheet>
                <h1 className="text-sm font-bold text-blue-600">Employer Hub</h1>
            </div>

            <div className="hidden lg:flex items-center gap-4">
                <Badge variant="outline" className="text-[10px] text-slate-500 border-slate-200 bg-slate-50 px-2 py-0.5 font-medium">Employer Dashboard</Badge>
            </div>

            <div className="flex items-center gap-4">
                <NotificationBell portal="business" />
                <div className="h-5 w-px bg-slate-100 mx-1"></div>
                <EmployerProfileDropdown email={initialUser?.email} />
            </div>
        </header>

        <main className="flex-1 p-6 md:p-8 lg:p-10">
            <div className="max-w-6xl mx-auto">
                {children}
            </div>
        </main>
      </div>

      <ChatWidget
        initialParticipantId={activeChatParticipant || undefined}
        onClose={() => setActiveChatParticipant(null)}
      />
    </div>
  );
}
