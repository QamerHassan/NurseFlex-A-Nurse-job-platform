'use client';
import React from 'react';
import Link from 'next/link';
import {
    User, FileText, Star, Settings,
    HelpCircle, Shield, LogOut, LayoutDashboard
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { clearPortalData } from '@/lib/auth-utils';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";

export default function ProfileDropdown({ email }: { email?: string }) {
    const router = useRouter();
    const { data: session } = useSession();

    const getRole = () => {
        if (typeof window === 'undefined') return 'NURSE';
        const isBusinessPortal = window.location.pathname.startsWith('/business');
        const userKey = isBusinessPortal ? 'business_user' : 'user';
        const user = JSON.parse(localStorage.getItem(userKey) || '{}');
        return (session?.user as any)?.role || user.role || (isBusinessPortal ? 'BUSINESS' : 'NURSE');
    };

    const role = getRole();

    const handleSignOut = async () => {
        const isBusinessPortal = window.location.pathname.startsWith('/business');
        const portal = isBusinessPortal ? 'business' : 'nurse';
        clearPortalData(portal);
        if (session) {
            await signOut({ callbackUrl: `/auth/login?portal=${portal}` });
        } else {
            router.push(`/auth/login?portal=${portal}`);
        }
    };

    const displayEmail = session?.user?.email || email || 'Professional User';
    const initials = displayEmail.substring(0, 2).toUpperCase();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden ring-offset-background transition-all hover:ring-2 hover:ring-blue-100 dark:hover:ring-blue-900">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={session?.user?.image || undefined} alt={displayEmail} />
                        <AvatarFallback className="bg-blue-50 text-blue-600 font-bold text-xs">{initials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-2 rounded-2xl border-slate-200 bg-white shadow-2xl z-[200] border shadow-slate-200/50" align="end" forceMount>
                <DropdownMenuLabel className="font-normal px-2 py-3">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-black leading-none text-slate-900 tracking-tight truncate">{displayEmail}</p>
                        <p className="text-[10px] font-bold leading-none text-slate-400 uppercase tracking-widest pt-1">
                            Role: {role} Identity
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-50" />
                <DropdownMenuGroup className="py-2">
                    {role === 'BUSINESS' ? (
                        <DropdownMenuItem asChild>
                            <Link href="/business/dashboard" className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                                <Shield className="w-5 h-5 text-blue-500" />
                                <span className="font-bold text-slate-700">Business Hub</span>
                            </Link>
                        </DropdownMenuItem>
                    ) : (
                        <>
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard" className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                                    <LayoutDashboard className="w-5 h-5 text-blue-500" />
                                    <span className="font-bold text-slate-700">Dashboard</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/nurse/profile" className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                                    <FileText className="w-5 h-5 text-slate-400" />
                                    <span className="font-bold text-slate-700">Medical Profile</span>
                                </Link>
                            </DropdownMenuItem>
                        </>
                    )}

                    <DropdownMenuItem asChild>
                        <Link href="/settings" className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                            <Settings className="w-5 h-5 text-slate-400" />
                            <span className="font-bold text-slate-700">System Settings</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/help" className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                            <HelpCircle className="w-5 h-5 text-slate-400" />
                            <span className="font-bold text-slate-700">Support Center</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-slate-50" />
                <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-3 py-4 rounded-xl cursor-pointer text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors active:scale-[0.98]"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-black uppercase tracking-tighter italic">Terminate Session</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
