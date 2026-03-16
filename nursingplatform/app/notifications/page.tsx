'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Bell, MessageSquare,
    Search, History, X, ChevronRight, Settings, Loader2, Zap, ArrowRight, AlertCircle, CheckCircle2,
    Calendar, Inbox
} from 'lucide-react';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';

import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Separator } from "@/app/components/ui/separator";

export default function NotificationsPage() {
    const { data: session } = useSession();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [notifRes, profileRes] = await Promise.all([
                    api.get('/notifications').catch(() => ({ data: [] })),
                    api.get('/profile').catch(() => ({ data: null }))
                ]);
                setNotifications(notifRes.data);
                setUserProfile(notifRes.data);
            } catch (err) {
                console.error("Failed to fetch notifications or profile", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const location = userProfile?.location?.split(',')[0] || 'your area';

    return (
        <div className="min-h-screen bg-white">
            <main className="max-w-4xl mx-auto px-4 md:px-8 py-12">
                <header className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Notifications</h1>
                        <p className="text-slate-600 text-sm">Manage your activities and message alerts</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400">
                        <Settings size={20} />
                    </Button>
                </header>

                <div className="space-y-4">
                    {loading ? (
                        <div className="space-y-4">
                            {[1,2,3].map(i => (
                                <Card key={i} className="border-slate-200 p-6 rounded-xl shadow-none">
                                    <div className="flex gap-4">
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-1/4" />
                                            <Skeleton className="h-4 w-3/4" />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : notifications.length > 0 ? (
                        <div className="divide-y border-t border-b border-slate-200">
                            {notifications.map((n) => (
                                <div 
                                    key={n.id} 
                                    className={`py-6 flex gap-6 transition-all group ${n.isRead ? 'opacity-60' : 'bg-pink-50/10'}`}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border transition-all ${n.isRead ? 'bg-slate-50 border-slate-200 text-slate-400' : 'bg-pink-50 border-pink-100 text-[#2557a7]'}`}>
                                        {n.type === 'MESSAGE' ? <MessageSquare size={20} /> : <Bell size={20} />}
                                    </div>
                                    <div className="flex-1 pr-4">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className={`text-base tracking-tight ${n.isRead ? 'font-medium text-slate-600' : 'font-bold text-slate-900'}`}>{n.title}</h3>
                                            <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap ml-4">Just now</span>
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed mb-3">{n.message}</p>
                                        <div className="flex gap-4">
                                            <Button variant="link" className="text-xs font-bold text-[#ec4899] p-0 h-auto">View Details</Button>
                                            {!n.isRead && <Button variant="link" className="text-xs font-bold text-slate-400 p-0 h-auto hover:text-slate-600">Mark as read</Button>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border-2 border-dashed border-slate-200">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6 border border-slate-100 shadow-inner">
                                <Inbox size={32} className="opacity-50" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">No new notifications</h2>
                            <p className="text-slate-500 text-sm mb-8 max-w-xs mx-auto">
                                Check back later for new updates and job alerts.
                            </p>
                            <Button asChild className="bg-pink-600 hover:bg-pink-700 h-12 px-8 rounded-lg font-bold text-white shadow-none">
                                <Link href="/dashboard">Return to jobs</Link>
                            </Button>
                        </div>
                    )}
                </div>

                <div className="mt-16 text-center">
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                        NurseFlex • Pro Career Network
                    </p>
                </div>
            </main>
        </div>
    );
}

function Skeleton({ className }: { className?: string }) {
    return <div className={`animate-pulse bg-slate-100 rounded ${className}`} />;
}
