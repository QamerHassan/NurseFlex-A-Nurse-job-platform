"use client";
import React, { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { Bell, X, Info, CheckCircle, AlertCircle } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  isRead: boolean;
  metadata?: {
    blogId?: string;
    [key: string]: any;
  };
}

export default function FloatingNotifications() {
  const [activeToasts, setActiveToasts] = useState<Notification[]>([]);
  const [lastCheckedId, setLastCheckedId] = useState<string | null>(null);

  // Initialize from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedId = localStorage.getItem('last_floating_notif_id');
      if (savedId) {
        setLastCheckedId(savedId);
        console.log("🔔 Notifications: Initialized lastCheckedId from storage:", savedId);
      }
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    // Auth Check: Skip if not logged in
    const token = localStorage.getItem('token') || localStorage.getItem('business_token');
    if (!token) return;

    try {
      const response = await api.get<Notification[]>('/notifications');
      const allNotifs = response.data;
      
      if (allNotifs.length > 0) {
        // Sirf unread notifications jo naye hon (previously shown na hon)
        // String comparison work for MongoDB ObjectIDs because they are timestamp-prefixed and sequential enough
        const unreadNew = allNotifs.filter(n => !n.isRead && (!lastCheckedId || n.id > lastCheckedId));
        
        if (unreadNew.length > 0) {
          console.log(`🔔 Notifications: Showing ${unreadNew.length} new toasts`);
          setActiveToasts(prev => [...prev, ...unreadNew]);
          
          unreadNew.forEach(n => {
            setTimeout(() => {
              removeToast(n.id);
            }, 5000);
          });
          
          // Update last checked id and persist
          const latestId = allNotifs[0].id;
          setLastCheckedId(latestId);
          localStorage.setItem('last_floating_notif_id', latestId);
        }
      }
    } catch (error) {
       // Silent fail
    }
  }, [lastCheckedId]);

  useEffect(() => {
    // Initial sync to get the latest ID if we don't have one, without showing older toasts
    const syncLatest = async () => {
        if (lastCheckedId) return;
        const token = localStorage.getItem('token') || localStorage.getItem('business_token');
        if (!token) return;

        try {
            const resp = await api.get<Notification[]>('/notifications');
            if (resp.data.length > 0) {
                const latestId = resp.data[0].id;
                setLastCheckedId(latestId);
                localStorage.setItem('last_floating_notif_id', latestId);
                console.log("🔔 Notifications: Seeded initial lastCheckedId:", latestId);
            }
        } catch (e) {}
    };
    syncLatest();

    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [fetchNotifications, lastCheckedId]);

  const removeToast = (id: string) => {
    setActiveToasts(prev => prev.filter(t => t.id !== id));
  };

  if (activeToasts.length === 0) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-sm px-4 space-y-3 pointer-events-none">
      {activeToasts.map((toast) => (
        <div 
          key={toast.id}
          onClick={() => {
            if (toast.type === 'BLOG_POST' && toast.metadata?.blogId) {
              window.open(`/blogs/${toast.metadata.blogId}`, '_blank');
              removeToast(toast.id);
            }
          }}
          className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-100 p-4 flex gap-4 animate-in slide-in-from-top-4 duration-500 hover:scale-[1.02] transition-transform cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-100">
            <Bell size={20} />
          </div>
          
          <div className="flex-1 min-w-0 pr-6">
            <h4 className="font-extrabold text-slate-900 text-sm truncate">{toast.title}</h4>
            <p className="text-slate-500 text-xs mt-1 leading-relaxed line-clamp-2">
              {toast.message}
            </p>
            {toast.type === 'BLOG_POST' && toast.metadata?.blogId && (
              <p className="text-blue-600 text-[10px] font-black mt-2 uppercase">Click to view article →</p>
            )}
          </div>

          <button 
            onClick={() => removeToast(toast.id)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={16} />
          </button>

          <div className="absolute bottom-0 left-0 h-1 bg-blue-600/20 rounded-full w-full overflow-hidden">
            <div className="h-full bg-blue-600 animate-[progress_5s_linear_forwards]"></div>
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
