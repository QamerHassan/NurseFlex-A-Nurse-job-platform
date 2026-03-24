"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
    Bell, MessageSquare, Zap, History, X, 
    ChevronRight, Settings, Loader2, ArrowRight, 
    ShieldCheck, CheckCircle2, AlertCircle, Info,
    ShieldAlert, Activity, FileText
} from 'lucide-react';
import api from '@/lib/api';

import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  isRead: boolean;
}

export default function AdminNotificationsPage() {
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
      case 'ISSUE_REPORT': 
      case 'ISSUE_REPORT_ADMIN': return ShieldAlert;
      case 'APPLICATION': return Activity;
      case 'PAYMENT': return ShieldCheck;
      case 'BLOG': return FileText;
      default: return Bell;
    }
  };

  const getNotificationHref = (n: Notification) => {
    switch (n.type) {
      case 'BLOG': 
      case 'BLOG_POST': return '/admin/blogs';
      case 'APPLICATION': return '/admin/applications';
      case 'ISSUE_REPORT': 
      case 'ISSUE_REPORT_ADMIN': return '/admin/dashboard';
      case 'FEEDBACK_CONFIRMATION': return '/admin/dashboard';
      default: return '/admin/dashboard';
    }
  };

  const handleNotificationClick = async (n: Notification) => {
    if (!n.isRead) {
      try {
        await api.patch(`/notifications/${n.id}/read`);
        setNotifications(prev => prev.map(notif => 
          notif.id === n.id ? { ...notif, isRead: true } : notif
        ));
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
      }
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
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight italic uppercase">System Notifications</h1>
            <p className="text-sm text-slate-500 font-medium tracking-wide">Stay updated with platform activities and alerts.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <Button 
            variant="ghost" 
            onClick={markAllRead}
            disabled={notifications.length === 0}
            className="h-12 px-6 rounded-xl text-blue-600 hover:bg-blue-50 font-bold uppercase text-[10px] tracking-widest disabled:opacity-50 transition-all active:scale-95"
          >
            Mark All as Read <History size={16} className="ml-2" />
          </Button>
          <Button variant="outline" className="h-12 w-12 rounded-xl border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all p-0 flex items-center justify-center">
            <Settings size={18} />
          </Button>
        </div>
      </header>

      {loading ? (
        <div className="space-y-6">
            {[1,2,3,4].map(i => (
                <Card key={i} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 rounded-[2.5rem] bg-white">
                    <div className="flex gap-6">
                        <Skeleton className="h-16 w-16 rounded-2xl" />
                        <div className="flex-1 space-y-4 pt-1">
                            <Skeleton className="h-5 w-1/3" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
      ) : (
        <div className="space-y-8">
            {notifications.length > 0 ? (
                <>
                    <div className="flex items-center justify-between px-2">
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">Audit Timeline</p>
                        <Badge variant="outline" className="text-[9px] font-bold uppercase border-slate-100 text-slate-400 px-3 py-1 rounded-full">Active Events: {notifications.length}</Badge>
                    </div>
                    
                    <div className="space-y-4">
                        {notifications.map((n) => {
                            const Icon = getIcon(n.type);
                            const isNew = !n.isRead;
                            return (
                              <Link 
                                  key={n.id} 
                                  href={getNotificationHref(n)}
                                  onClick={() => handleNotificationClick(n)}
                                  className={`block group cursor-pointer border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] bg-white rounded-[2.5rem] p-8 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden ${!isNew ? 'opacity-60' : ''}`}
                              >
                                  {/* Interaction Hover Glow */}
                                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                  
                                  <div className="flex items-center gap-8 relative z-10">
                                      {/* Icon Container */}
                                      <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-sm transition-all duration-500 ${isNew ? 'bg-blue-600 text-white group-hover:scale-110 group-hover:rotate-3' : 'bg-slate-50 text-slate-300'}`}>
                                          <Icon size={28} className={isNew ? 'animate-in zoom-in-50 duration-500' : ''} />
                                      </div>

                                      {/* Content */}
                                      <div className="flex-1 min-w-0">
                                          <div className="flex justify-between items-start mb-2">
                                              <div className="space-y-1">
                                              <h3 className={`text-xl font-bold tracking-tight transition-colors ${isNew ? 'text-slate-900 group-hover:text-blue-600' : 'text-slate-400'}`}>
                                                      {n.title}
                                                  </h3>
                                                  <div className="flex items-center gap-2">
                                                      <span className={`text-[10px] font-bold uppercase tracking-widest ${isNew ? 'text-blue-600' : 'text-slate-300'}`}>
                                                          {n.type.replace('_', ' ')}
                                                      </span>
                                                      <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                                      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none shrink-0">{formatTime(n.createdAt)}</p>
                                                  </div>
                                              </div>
                                              {isNew && (
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">New Event</span>
                                                    <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
                                                </div>
                                              )}
                                          </div>
                                          <p className={`font-medium text-sm leading-relaxed max-w-2xl transition-colors ${isNew ? 'text-slate-500 group-hover:text-slate-700' : 'text-slate-300'}`}>
                                              {n.message}
                                          </p>
                                      </div>

                                      <div className="h-10 w-10 text-slate-200 group-hover:text-blue-600 group-hover:bg-blue-50 rounded-xl transition-all flex items-center justify-center">
                                          <ChevronRight size={18} />
                                      </div>
                                  </div>
                              </Link>
                            );
                        })}
                    </div>
                </>
            ) : (
                <Card className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-100 shadow-inner overflow-hidden relative">
                    <div className="absolute top-10 right-10 opacity-5 rotate-12 scale-150 text-blue-500">
                        <Bell size={120} />
                    </div>
                    <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mb-8 border border-slate-50 shadow-inner relative z-10 transition-transform hover:scale-105 duration-500">
                        <Zap size={48} className="fill-slate-50" />
                    </div>
                    <div className="space-y-2 relative z-10 mb-10">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight italic uppercase">Silence is Gold</h2>
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] max-w-xs mx-auto leading-relaxed">
                            No active alerts found. All systems reporting optimal clearance.
                        </p>
                    </div>
                    <Button asChild className="h-14 px-10 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white font-black uppercase text-[11px] tracking-widest shadow-xl transition-all active:scale-95 relative z-10">
                        <Link href="/admin/dashboard" className="flex items-center gap-3">
                            Check Dashboard <ArrowRight size={16} />
                        </Link>
                    </Button>
                </Card>
            )}
        </div>
      )}

      <footer className="pt-20 text-center">
         <p className="text-[10px] font-bold text-slate-200 uppercase tracking-[0.6em] italic italic">NurseFlex Event Stream v1.2.0</p>
      </footer>
    </div>
  );
}
