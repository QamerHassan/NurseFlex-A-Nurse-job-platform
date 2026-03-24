"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Loader2, CheckCircle2, XCircle, FileText, Users, Clock,
    Flame, Zap, MessageSquare, TrendingUp, AlertCircle,
    ArrowUpRight, Filter, MoreHorizontal, MousePointer2,
    Calendar, Building2, Share2, ClipboardList, ChevronRight, Bell,
    RefreshCw
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Separator } from "@/app/components/ui/separator";
import {
    DropdownMenu, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

// ─── Gradient defs for chart ──────────────────────────────────────────────────
const ChartGradient = () => (
    <defs>
        <linearGradient id="blueGreen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#16a34a" stopOpacity={0.02} />
        </linearGradient>
    </defs>
);

export default function BusinessDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [applicants, setApplicants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [analytics, setAnalytics] = useState<any>(null);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState('All time');
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => { setMounted(true); }, []);

    // ── Fetch ──────────────────────────────────────────────────────────────────
    const fetchData = async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);
        try {
            const [statsRes, appsRes, analyticsRes, notifsRes] = await Promise.all([
                api.get('/applications/business/stats').catch(() => ({ data: null })),
                api.get('/applications/business/applicants').catch(() => ({ data: [] })),
                api.get('/analytics/business').catch(() => ({ data: null })),
                api.get('/notifications/my').catch(() => ({ data: [] })),
            ]);
            setStats(statsRes.data);
            setApplicants(Array.isArray(appsRes.data) ? appsRes.data : []);
            setAnalytics(analyticsRes.data);
            setNotifications(Array.isArray(notifsRes.data) ? notifsRes.data.slice(0, 5) : []);
        } catch (err) {
            console.error('Dashboard fetch error:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // ── Status update ──────────────────────────────────────────────────────────
    const handleStatusUpdate = async (applicationId: string, status: string) => {
        setActionLoading(applicationId);
        try {
            await api.post('/applications/update-status', { applicationId, status });
            // Optimistic update
            setApplicants(prev =>
                prev.map(a => a.id === applicationId ? { ...a, status } : a)
            );
        } catch (err) {
            console.error('Status update error:', err);
        } finally {
            setActionLoading(null);
        }
    };

    // ── Message start ──────────────────────────────────────────────────────────
    const handleMessage = async (userId: string, appId: string) => {
        setActionLoading(appId);
        try {
            await api.post('/messages/start', { participantId: userId });
            router.push('/business/messages');
        } catch (err) {
            console.error('Message error:', err);
        } finally {
            setActionLoading(null);
        }
    };

    // ── Notification read ──────────────────────────────────────────────────────
    const handleNotifClick = async (n: any) => {
        if (!n.isRead) {
            try {
                await api.patch(`/notifications/${n.id}/read`);
                setNotifications(prev =>
                    prev.map(x => x.id === n.id ? { ...x, isRead: true } : x)
                );
            } catch (err) {
                console.error('Notif read error:', err);
            }
        }
    };

    const notifHref = (n: any) => {
        switch (n.type) {
            case 'BLOG': case 'BLOG_POST': return '/blogs';
            case 'APPLICATION': return '/business/applicants';
            default: return '/business/dashboard';
        }
    };

    // ── Loading ────────────────────────────────────────────────────────────────
    if (loading) return (
        <div className="space-y-6 font-sans">
            <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
            </div>
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-72 rounded-2xl" />
        </div>
    );

    const sub = stats?.subscription;
    const remainingCredits = sub ? sub.jobsLimit - sub.jobsPosted : 0;
    const pendingApps = applicants.filter(a => a.status === 'Pending');
    const unreadCount = notifications.filter(n => !n.isRead).length;

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6 pb-10 font-sans">

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-0.5">
                        <h1 className="text-2xl font-bold text-slate-900">Employer Dashboard</h1>
                        <Badge className="bg-green-50 text-green-700 border border-green-100 text-[10px] font-semibold">
                            Active
                        </Badge>
                    </div>
                    <p className="text-sm text-slate-400">Review applicants and manage your job postings.</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Refresh */}
                    <button onClick={() => fetchData(true)} disabled={refreshing}
                        className="h-10 w-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all disabled:opacity-50">
                        <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
                    </button>

                    {/* Filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="h-10 px-4 rounded-xl border border-slate-200 flex items-center gap-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all">
                                <Filter size={14} className={activeFilter !== 'All time' ? 'text-blue-600' : ''} />
                                {activeFilter}
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-xl border-slate-100 p-1 z-50">
                            {['All time', 'Last 7 Days', 'Last 30 Days', 'This Month'].map(f => (
                                <DropdownMenuItem key={f} onClick={() => { setActiveFilter(f); fetchData(); }}
                                    className={`rounded-lg text-sm cursor-pointer ${activeFilter === f ? 'text-blue-600 bg-blue-50' : ''}`}>
                                    {f}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Post job */}
                    <Link href="/business/post-job"
                        className="h-10 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold text-sm flex items-center gap-2 transition-all shadow-md shadow-blue-100">
                        <Zap size={14} className="fill-white text-white" />
                        Post a Job
                    </Link>
                </div>
            </div>

            {/* ── KPI Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Plan card */}
                <Link href="/business/settings">
                    <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group cursor-pointer h-full">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white group-hover:scale-105 transition-transform shrink-0">
                                <Zap size={17} className="fill-white text-white" />
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Active Plan</p>
                                <p className="font-bold text-slate-900 text-sm">{sub?.planName || 'Enterprise'}</p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                            <p className="text-[11px] text-slate-400">{remainingCredits} posts left</p>
                            <ChevronRight size={13} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                        </div>
                    </Card>
                </Link>

                {[
                    { label: 'Active Listings', value: stats?.activeShifts ?? 0, icon: Clock, color: 'text-green-600', bg: 'bg-green-50', href: '/business/manage-shifts', sub: 'Live postings' },
                    { label: 'Total Applicants', value: stats?.totalApplicants ?? 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', href: '/business/applicants', sub: 'All candidates' },
                    { label: 'Total Hires', value: stats?.hiredToday ?? 0, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', href: '/business/applicants', sub: 'Successful hires' },
                ].map((kpi, i) => (
                    <Link key={i} href={kpi.href}>
                        <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group cursor-pointer h-full">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 ${kpi.bg} rounded-xl flex items-center justify-center ${kpi.color} group-hover:scale-105 transition-transform shrink-0`}>
                                    <kpi.icon size={17} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{kpi.label}</p>
                                    <p className="font-bold text-slate-900 text-2xl leading-none mt-0.5">{kpi.value}</p>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                                <p className="text-[11px] text-slate-400">{kpi.sub}</p>
                                <ChevronRight size={13} className="text-slate-300 group-hover:text-green-500 group-hover:translate-x-0.5 transition-all" />
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* ── Notifications ── */}
            <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
                <div className="p-5 flex items-center justify-between border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center relative">
                            <Bell size={16} className="text-blue-600" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900 text-sm">Recent Updates</p>
                            <p className="text-[11px] text-slate-400">{unreadCount} unread</p>
                        </div>
                    </div>
                    <Link href="/notifications" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
                        View all <ChevronRight size={13} />
                    </Link>
                </div>

                <div className="divide-y divide-slate-50">
                    {notifications.length > 0 ? notifications.map(n => (
                        <Link key={n.id} href={notifHref(n)} onClick={() => handleNotifClick(n)}
                            className={`flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors group ${!n.isRead ? 'bg-blue-50/30' : ''}`}>
                            <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.isRead ? 'bg-slate-200' : 'bg-blue-500 animate-pulse'}`} />
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate group-hover:text-blue-600 transition-colors ${n.type === 'ISSUE_REPORT' ? 'text-red-600' : 'text-slate-800'}`}>
                                    {n.title}
                                </p>
                                <p className="text-xs text-slate-400 truncate mt-0.5">{n.message}</p>
                            </div>
                            <span className="text-[11px] text-slate-400 shrink-0">
                                {mounted ? new Date(n.createdAt).toLocaleDateString() : '...'}
                            </span>
                        </Link>
                    )) : (
                        <div className="py-10 text-center">
                            <p className="text-sm text-slate-400">No new notifications.</p>
                        </div>
                    )}
                </div>
            </Card>

            {/* ── Analytics ── */}
            {analytics && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* Chart */}
                    <Card className="lg:col-span-8 border border-slate-100 shadow-sm bg-white rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <p className="font-semibold text-slate-900 text-sm">Application Trends</p>
                                <p className="text-xs text-slate-400 mt-0.5">7-day activity summary</p>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
                                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />Applications</span>
                                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />Hires</span>
                            </div>
                        </div>
                        <div className="h-56">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analytics.weeklyData || []}>
                                    <ChartGradient />
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                                    />
                                    <Area type="monotone" dataKey="applications" stroke="#2563eb" strokeWidth={2.5} fill="url(#blueGreen)" dot={{ r: 3, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Stats card */}
                    <Card className="lg:col-span-4 border border-slate-100 shadow-sm bg-slate-900 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl -mr-10 -mt-10" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl -ml-8 -mb-8" />
                        <div className="relative z-10 space-y-5">
                            <div>
                                <p className="text-[10px] font-semibold text-green-400 uppercase tracking-widest mb-1">Approval Rate</p>
                                <p className="text-5xl font-bold text-white">{analytics.applications.approvalRate}%</p>
                            </div>
                            <div className="space-y-3 pt-4 border-t border-white/10">
                                {[
                                    { label: 'Total Applications', value: analytics.applications.total, color: 'text-white' },
                                    { label: 'Approved', value: analytics.applications.approved, color: 'text-blue-400' },
                                    { label: 'Rejected', value: analytics.applications.rejected, color: 'text-red-400' },
                                ].map(r => (
                                    <div key={r.label} className="flex justify-between items-center">
                                        <span className="text-xs font-medium text-slate-400">{r.label}</span>
                                        <span className={`font-bold text-base ${r.color}`}>{r.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Link href="/business/applicants"
                            className="relative z-10 mt-5 h-10 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-medium text-sm flex items-center justify-center gap-2 transition-all">
                            View Analytics <ArrowUpRight size={15} />
                        </Link>
                    </Card>
                </div>
            )}

            {/* ── Recent Applications ── */}
            <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-50 flex items-center justify-between">
                    <div>
                        <p className="font-semibold text-slate-900 text-sm">Recent Applications</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                            {pendingApps.length} pending review
                        </p>
                    </div>
                    <Link href="/business/applicants"
                        className="text-xs font-semibold text-green-600 hover:text-green-700 flex items-center gap-1 transition-colors">
                        View all <ChevronRight size={13} />
                    </Link>
                </div>

                <div className="divide-y divide-slate-50">
                    {pendingApps.slice(0, 5).length > 0 ? pendingApps.slice(0, 5).map(app => (
                        <div key={app.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors group">
                            {/* Left — applicant info */}
                            <div className="flex items-center gap-4">
                                <Avatar className="h-11 w-11 rounded-xl shrink-0 shadow-sm ring-2 ring-white">
                                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-green-500 text-white font-bold text-sm rounded-xl">
                                        {(app.user?.profile?.name || app.user?.email || '?')[0].toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                                        {app.user?.profile?.name || 'Applicant'}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Applied for: <span className="text-green-600 font-medium">{app.job?.title}</span>
                                    </p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        {mounted ? new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                                    </p>
                                </div>
                            </div>

                            {/* Right — actions */}
                            <div className="flex items-center gap-2 shrink-0 ml-auto">
                                {/* CV link */}
                                {app.resumeUrl && (
                                    <a href={`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001'}${app.resumeUrl}`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="h-9 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 flex items-center gap-1.5 transition-all">
                                        <FileText size={13} /> CV
                                    </a>
                                )}

                                {/* Message */}
                                <button
                                    onClick={() => handleMessage(app.userId, app.id)}
                                    disabled={actionLoading === app.id}
                                    className="h-9 w-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all disabled:opacity-50">
                                    {actionLoading === app.id ? <Loader2 size={14} className="animate-spin" /> : <MessageSquare size={14} />}
                                </button>

                                {/* Reject */}
                                <button
                                    onClick={() => handleStatusUpdate(app.id, 'Rejected')}
                                    disabled={!!actionLoading}
                                    className="h-9 px-4 rounded-lg border border-slate-200 text-xs font-semibold text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all disabled:opacity-50">
                                    {actionLoading === app.id ? '...' : 'Reject'}
                                </button>

                                {/* Approve */}
                                <button
                                    onClick={() => handleStatusUpdate(app.id, 'Approved')}
                                    disabled={!!actionLoading}
                                    className="h-9 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white text-xs font-semibold transition-all shadow-sm disabled:opacity-50">
                                    {actionLoading === app.id ? '...' : 'Approve'}
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="py-16 text-center space-y-3">
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto border border-slate-100">
                                <Users size={22} className="text-slate-300" />
                            </div>
                            <p className="font-semibold text-slate-700 text-sm">No pending applications</p>
                            <p className="text-xs text-slate-400">New applications will appear here.</p>
                            <Link href="/business/post-job"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors mt-1">
                                Post a job to get started <ArrowUpRight size={13} />
                            </Link>
                        </div>
                    )}
                </div>
            </Card>

            <p className="text-center text-[10px] text-slate-300 uppercase tracking-widest">
                NurseFlex Business Portal
            </p>
        </div>
    );
}