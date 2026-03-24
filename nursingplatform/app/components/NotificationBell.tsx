"use client";
import React, { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Bell, ChevronRight, Zap, Info, ShieldCheck } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  isRead: boolean;
}

interface NotificationBellProps {
  portal?: 'nurse' | 'business' | 'admin';
}

export default function NotificationBell({ portal = 'nurse' }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await api.get<Notification[]>('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error("🔔 NotificationBell Fetch Error:", error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("🔔 MarkAllRead Error:", error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

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

  const viewAllPath = portal === 'business' ? '/business/notifications' : 
                    portal === 'admin' ? '/admin/notifications' : '/notifications';

  const getNotificationHref = (n: Notification) => {
    const isAdmin = portal === 'admin';
    const isBusiness = portal === 'business';

    switch (n.type) {
      case 'BLOG': 
      case 'BLOG_POST': return isAdmin ? '/admin/blogs' : '/blogs';
      case 'APPLICATION': 
        if (isAdmin) return '/admin/applications';
        if (isBusiness) return '/business/applicants';
        return '/dashboard';
      case 'ISSUE_REPORT': 
      case 'ISSUE_REPORT_ADMIN': 
        if (isAdmin) return '/admin/dashboard';
        if (isBusiness) return '/business/dashboard';
        return '/dashboard';
      case 'FEEDBACK_CONFIRMATION':
        return '/dashboard';
      default: 
        if (isAdmin) return '/admin/dashboard';
        if (isBusiness) return '/business/dashboard';
        return '/dashboard';
    }
  };

  const handleNotificationClick = async (n: Notification) => {
    setIsOpen(false);
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

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all group border border-transparent hover:border-slate-200"
      >
        <Bell size={22} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-blue-500 border-2 border-white rounded-full animate-pulse shadow-lg shadow-blue-200" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-96 bg-white rounded-[2rem] shadow-2xl border border-slate-100 z-[500] overflow-hidden animate-in fade-in slide-in-from-top-2">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
            <h4 className="font-bold text-[10px] uppercase tracking-[0.3em] text-slate-900">Notifications</h4>
            {unreadCount > 0 && (
              <button 
                onClick={markAllRead}
                className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4"
              >
                Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-[32rem] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-200">
                    <Zap size={32} />
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">No updates at the moment.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <Link 
                  key={n.id} 
                  href={getNotificationHref(n)}
                  onClick={() => handleNotificationClick(n)}
                  className={`block p-6 border-b border-slate-50 hover:bg-slate-50 transition-all cursor-pointer group/item ${!n.isRead ? 'bg-blue-50/20' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${!n.isRead ? 'bg-blue-600 shadow-lg shadow-blue-200' : 'bg-transparent'}`} />
                        <p className="font-bold text-[11px] text-slate-900 uppercase tracking-tight group-hover/item:text-blue-600 transition-colors">{n.title}</p>
                    </div>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{formatTime(n.createdAt)}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-bold leading-relaxed line-clamp-2 px-5">{n.message}</p>
                </Link>
              ))
            )}
          </div>
          
          <Link 
            href={viewAllPath}
            onClick={() => setIsOpen(false)}
            className="block w-full text-center p-5 text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 hover:text-blue-600 transition-all border-t border-slate-50 bg-slate-50/30 hover:bg-blue-50/50"
          >
            View all notifications <ChevronRight size={14} className="inline ml-1" />
          </Link>
        </div>
      )}
    </div>
  );
}