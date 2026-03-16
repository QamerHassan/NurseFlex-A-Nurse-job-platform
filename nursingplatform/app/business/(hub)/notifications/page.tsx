"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
    Bell, MessageSquare, Zap, History, X, 
    ChevronRight, Settings, Loader2, ArrowRight, 
    ShieldCheck, CheckCircle2, AlertCircle, Info,
    MousePointer2
} from 'lucide-react';
import api from '@/lib/api';

import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  isRead: boolean;
}

export default function BusinessNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get<Notification[]>('/notifications');
      setNotifications(response.data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("🔔 Clear Notifications Error:", error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'ISSUE_REPORT': return AlertCircle;
      case 'APPLICATION': return Zap;
      case 'PAYMENT': return ShieldCheck;
      default: return Bell;
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-slate-100 pb-12">
        <div className="text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start mb-4">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Notifications</h1>
          </div>
          <p className="text-slate-500 font-medium text-sm">Stay updated on applications and account activity</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={markAllRead}
            disabled={notifications.length === 0}
            className="h-14 px-6 rounded-2xl text-pink-600 hover:bg-pink-50 font-bold text-sm disabled:opacity-50 transition-all"
          >
            Mark all as read
          </button>
          <Button variant="outline" className="h-14 px-6 rounded-2xl border-slate-100 font-bold text-slate-500 hover:bg-slate-50">
            <Settings size={18} />
          </Button>
        </div>
      </header>

      {loading ? (
        <div className="space-y-6">
            {[1,2,3].map(i => (
                <Card key={i} className="border-none shadow-sm p-8 rounded-[2.5rem] bg-white">
                    <div className="flex gap-6">
                        <Skeleton className="h-14 w-14 rounded-2xl" />
                        <div className="flex-1 space-y-4 pt-1">
                            <Skeleton className="h-5 w-1/3" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
      ) : (
        <div className="space-y-6">
            {notifications.length > 0 ? (
                <>
                    <div className="flex items-center justify-between px-6 mb-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Latest Alerts</p>
                        <Badge variant="outline" className="text-[10px] font-bold border-slate-100 text-slate-400">Live Updates</Badge>
                    </div>
                    {notifications.map((n) => {
                        const Icon = getIcon(n.type);
                        return (
                          <Card 
                              key={n.id} 
                              className={`group cursor-pointer border-none shadow-sm hover:shadow-2xl hover:shadow-pink-100/50 bg-white rounded-[2.5rem] p-8 transition-all duration-300 ${!n.isRead ? 'ring-2 ring-pink-500/10' : 'opacity-60'}`}
                          >
                              <div className="flex items-center gap-8">
                                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform group-hover:scale-110 duration-500 ${!n.isRead ? 'bg-slate-900 text-white shadow-slate-200 group-hover:bg-pink-600' : 'bg-slate-50 text-slate-300'}`}>
                                      <Icon size={28} className={!n.isRead && n.type === 'ISSUE_REPORT' ? 'fill-red-400' : ''} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                      <div className="flex justify-between items-start mb-2">
                                          <div className="space-y-1">
                                              <h3 className="text-xl font-bold text-slate-900 group-hover:text-pink-600 transition-colors tracking-tight">{n.title}</h3>
                                              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tight">{formatTime(n.createdAt)}</p>
                                          </div>
                                          {!n.isRead && <div className="w-2.5 h-2.5 bg-pink-600 rounded-full shadow-xl shadow-pink-500/50"></div>}
                                      </div>
                                      <p className="text-slate-500 font-bold text-sm leading-relaxed max-w-2xl">{n.message}</p>
                                  </div>
                                  <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-200 hover:text-slate-900 rounded-xl">
                                      <ChevronRight size={18} />
                                  </Button>
                              </div>
                          </Card>
                        );
                    })}
                </>
            ) : (
                <Card className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-inner">
                    <div className="w-32 h-32 bg-slate-50 rounded-[4rem] flex items-center justify-center text-slate-200 mb-10 border border-slate-100 shadow-inner">
                        <Zap size={60} className="fill-slate-50" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
                        No Notifications
                    </h2>
                    <p className="text-slate-500 font-medium text-sm mb-12 max-w-xs mx-auto leading-relaxed">
                        Your notification feed is empty. We'll alert you here when you receive new applications or messages.
                    </p>
                    <Button asChild size="lg" className="h-16 px-12 rounded-2xl bg-slate-900 hover:bg-pink-600 font-bold shadow-2xl transition-all">
                        <Link href="/business/dashboard">Return to Dashboard</Link>
                    </Button>
                </Card>
            )}
        </div>
      )}

      <footer className="pt-20 text-center">
         <p className="text-[10px] font-bold text-slate-200 uppercase tracking-[0.4em]">End of Notifications</p>
      </footer>
    </div>
  );
}