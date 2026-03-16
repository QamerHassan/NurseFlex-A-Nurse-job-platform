"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
    Loader2, CheckCircle2, XCircle, FileText, Users, Clock, 
    Flame, Zap, MessageSquare, TrendingUp, AlertCircle,
    ArrowUpRight, Filter, MoreHorizontal, MousePointer2,
    Calendar, Building2, Share2, ClipboardList, ChevronRight, Bell
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Separator } from "@/app/components/ui/separator";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/app/components/ui/dropdown-menu";

export default function BusinessDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All time');
  const router = useRouter();

  const fetchData = async () => {
    try {
      const [statsRes, appsRes, analyticsRes, notificationsRes] = await Promise.all([
        api.get('/applications/business/stats').catch(() => ({ data: null })),
        api.get('/applications/business/applicants').catch(() => ({ data: [] })),
        api.get('/analytics/business').catch(() => ({ data: null })),
        api.get('/notifications/my').catch(() => ({ data: [] }))
      ]);
      setStats(statsRes.data);
      setApplicants(appsRes.data);
      setAnalytics(analyticsRes.data);
      setNotifications(Array.isArray(notificationsRes.data) ? notificationsRes.data.slice(0, 5) : []);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (applicationId: string, status: string) => {
    setActionLoading(applicationId);
    try {
      await api.post('/applications/update-status', { applicationId, status });
      await fetchData();
    } catch (err) {
      console.error("Status Update Error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const getNotificationHref = (n: any) => {
    switch (n.type) {
      case 'BLOG': 
      case 'BLOG_POST': return '/blogs';
      case 'APPLICATION': return '/business/applicants';
      case 'ISSUE_REPORT': 
      case 'ISSUE_REPORT_ADMIN': return '/business/dashboard';
      case 'FEEDBACK_CONFIRMATION': return '/dashboard';
      default: return '/business/dashboard';
    }
  };

  const handleNotificationClick = async (n: any) => {
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

  if (loading) return (
    <div className="space-y-12">
        <header className="flex justify-between items-end">
            <div className="space-y-4">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-14 w-40 rounded-2xl" />
        </header>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 rounded-3xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <Skeleton className="lg:col-span-8 h-[400px] rounded-[40px]" />
            <Skeleton className="lg:col-span-4 h-[400px] rounded-[40px]" />
        </div>
    </div>
  );

  const sub = stats?.subscription;
  const remainingCredits = sub ? sub.jobsLimit - sub.jobsPosted : 0;

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-slate-100 pb-12">
        <div className="text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start mb-4">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Employer Dashboard</h1>
            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold text-[10px] px-3 shadow-none">Active Account</Badge>
          </div>
          <p className="text-slate-500 font-medium text-sm">Review applicants and manage your job postings quickly.</p>
        </div>
        <div className="flex gap-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-14 px-6 rounded-xl border-slate-200 font-bold text-slate-600 shadow-sm hover:bg-slate-50 gap-3 group">
                        <Filter size={18} className={activeFilter !== 'All time' ? 'text-pink-500' : ''} /> 
                        {activeFilter}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-2xl border-slate-100 z-[500]">
                    <div className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Period</div>
                    <DropdownMenuItem onClick={() => { setActiveFilter('All time'); fetchData(); }} className="rounded-xl font-bold text-sm py-3 cursor-pointer">All time</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setActiveFilter('Last 7 Days'); fetchData(); }} className="rounded-xl font-bold text-sm py-3 cursor-pointer">Last 7 Days</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setActiveFilter('Last 30 Days'); fetchData(); }} className="rounded-xl font-bold text-sm py-3 cursor-pointer">Last 30 Days</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setActiveFilter('This Month'); fetchData(); }} className="rounded-xl font-bold text-sm py-3 cursor-pointer">This Month</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Button asChild className="h-14 px-8 rounded-xl bg-[#ec4899] hover:bg-[#db2777] font-bold text-white shadow-sm transition-all duration-300 active:scale-[0.98] border-0">
              <Link href="/business/post-job" className="flex items-center gap-3">
                <Zap size={16} className="fill-white text-white" />
                Post a Job
                <ArrowUpRight size={18} className="opacity-70" />
              </Link>
            </Button>
        </div>

      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/business/settings" className="block">
            <Card className="border border-slate-200 shadow-sm bg-white rounded-2xl p-6 hover:shadow-xl hover:shadow-pink-500/5 hover:-translate-y-1 hover:border-pink-100 transition-all duration-500 group cursor-pointer">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white group-hover:bg-[#ec4899] transition-colors duration-500">
                        <Zap size={20} className="fill-white" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tight mb-1 group-hover:text-[#ec4899] transition-colors">Active Plan</p>
                        <p className="text-lg font-bold text-slate-900 tracking-tight">{sub?.planName || 'Enterprise'}</p>
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center group/footer">
                    <p className="text-xs font-bold text-slate-400 group-hover/footer:text-slate-600 transition-colors">{remainingCredits} job posts remaining</p>
                    <ChevronRight size={14} className="text-slate-200 group-hover:text-pink-500 transition-all transform group-hover:translate-x-1" />
                </div>
            </Card>
        </Link>

        {/* Existing KPIs */}
        {[
            { label: 'Active Hiring', value: stats?.activeShifts ?? 0, icon: Clock, color: 'text-[#ec4899]', bg: 'bg-pink-50', sub: 'Live postings', href: '/business/manage-shifts' },
            { label: 'Total Applicants', value: stats?.totalApplicants ?? 0, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50', sub: 'Qualified candidates', href: '/business/applicants' },
            { label: 'Total Hires', value: stats?.hiredToday ?? 0, icon: CheckCircle2, color: 'text-pink-600', bg: 'bg-pink-50', sub: 'Successful hires', href: '/business/applicants' }
        ].map((kpi, i) => (
            <Link key={i} href={kpi.href} className="block">
                <Card className="border border-slate-200 shadow-sm bg-white rounded-2xl p-6 hover:shadow-xl hover:shadow-pink-500/5 hover:-translate-y-1 hover:border-pink-100 transition-all duration-500 group cursor-pointer h-full">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${kpi.bg} rounded-xl flex items-center justify-center ${kpi.color} transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                            <kpi.icon size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 group-hover:text-pink-600 transition-colors uppercase">{kpi.label}</p>
                            <p className="text-2xl font-bold text-slate-900 tracking-tight">{kpi.value}</p>
                        </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center group/footer">
                        <p className="text-xs font-bold text-slate-400 group-hover/footer:text-slate-600 transition-colors">{kpi.sub}</p>
                        <ChevronRight size={14} className="text-slate-200 group-hover:text-pink-500 transition-all transform group-hover:translate-x-1" />
                    </div>
                </Card>
            </Link>
        ))}
      </div>

      {/* NOTIFICATIONS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-3 border border-slate-200 shadow-sm bg-white rounded-2xl p-8 overflow-hidden relative">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-[#ec4899]">
                        <Bell size={22} className={notifications.some(n => !n.isRead) ? "animate-bounce" : ""} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Recent Updates</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tight mt-1">Latest activity and alerts</p>
                    </div>
                </div>
                <Button variant="ghost" asChild className="text-xs font-bold uppercase tracking-tight text-[#ec4899] hover:bg-pink-50">
                    <Link href="/notifications">View All <ChevronRight size={14} className="ml-1" /></Link>
                </Button>
            </div>

            <div className="space-y-4">
                {notifications.length > 0 ? notifications.map((notif) => (
                    <Link 
                        key={notif.id} 
                        href={getNotificationHref(notif)}
                        onClick={() => handleNotificationClick(notif)}
                        className={`block p-4 rounded-2xl flex items-start gap-4 transition-all hover:bg-slate-50 border border-transparent group/notif ${notif.type === 'ISSUE_REPORT' ? 'bg-red-50/50 border-red-100 hover:bg-red-50' : 'bg-slate-50/30'} ${!notif.isRead ? 'ring-1 ring-pink-100' : 'opacity-70'}`}
                    >
                        <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${notif.isRead ? 'bg-slate-200' : 'bg-pink-500 shadow-lg shadow-pink-200 animate-pulse'}`}></div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start gap-2">
                                <h4 className={`text-sm font-bold tracking-tight group-hover/notif:text-pink-600 transition-colors ${notif.type === 'ISSUE_REPORT' ? 'text-red-700' : 'text-slate-900'}`}>{notif.title}</h4>
                                <span className="text-xs font-bold text-slate-400 whitespace-nowrap">{new Date(notif.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1 line-clamp-1">{notif.message}</p>
                        </div>
                        <ChevronRight size={14} className="text-slate-300 transition-all transform group-hover/notif:translate-x-1 group-hover/notif:text-pink-600 self-center" />
                    </Link>
                )) : (
                    <div className="py-12 text-center text-slate-300">
                        <p className="text-sm font-medium">No new alerts.</p>
                    </div>
                )}
            </div>
        </Card>
      </div>

      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <Card className="lg:col-span-8 border border-slate-200 shadow-sm rounded-2xl bg-white p-10 overflow-hidden relative">
                <header className="flex justify-between items-center mb-10 relative z-10">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Application Trends</h3>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-tight mt-4">7-Day Activity Summary</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 px-4 rounded-full text-xs font-bold uppercase tracking-tight text-slate-400">Applications</Button>
                        <Button variant="ghost" size="sm" className="h-8 px-4 rounded-full text-xs font-bold uppercase tracking-tight text-[#ec4899] bg-pink-50">Job Posts</Button>
                    </div>
                </header>
                <div className="h-72 w-full mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                            <Area type="monotone" name="Applications" dataKey="applications" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" dot={{r: 4, fill: '#ec4899', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card className="lg:col-span-4 border border-slate-200 shadow-sm rounded-2xl bg-slate-900 p-10 flex flex-col justify-between text-white relative overflow-hidden group">
                <div className="relative z-10">
                    <header className="mb-12">
                        <p className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-4">Approval Rate</p>
                        <h4 className="text-6xl font-bold tracking-tight">{analytics.applications.approvalRate}%</h4>
                    </header>
 
                    <div className="space-y-6 pt-10 border-t border-white/10">
                        <div className="flex justify-between items-center group/item cursor-default">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-tight group-hover/item:text-white transition-colors">Total Applications</span>
                            <span className="font-bold text-xl">{analytics.applications.total}</span>
                        </div>
                        <div className="flex justify-between items-center group/item cursor-default">
                            <span className="text-xs font-bold text-emerald-500 uppercase tracking-tight group-hover/item:text-emerald-400 transition-colors">Approved</span>
                            <span className="font-bold text-xl text-emerald-500">{analytics.applications.approved}</span>
                        </div>
                        <div className="flex justify-between items-center group/item cursor-default">
                            <span className="text-xs font-bold text-red-500 uppercase tracking-tight group-hover/item:text-red-400 transition-colors">Rejected</span>
                            <span className="font-bold text-xl text-red-500">{analytics.applications.rejected}</span>
                        </div>
                    </div>
                </div>
                <Button className="mt-12 h-14 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-all relative z-10">
                    View Analytics <ArrowUpRight className="ml-2 w-5 h-5" />
                </Button>
            </Card>
        </div>
      )}

      <Card className="border border-slate-200 shadow-sm bg-white rounded-2xl p-10">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <div>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Recent Applications</h3>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-tight mt-4">Awaiting review</p>
            </div>
            <Button asChild variant="ghost" className="h-10 px-4 rounded-lg font-bold uppercase text-xs tracking-tight text-[#ec4899] hover:bg-pink-50">
                <Link href="/business/applicants">View All Applicants <ChevronRight size={14} className="ml-1" /></Link>
            </Button>
        </header>

        <div className="space-y-6">
            {applicants.length > 0 ? applicants.filter(a => a.status === 'Pending').slice(0, 5).map((app) => (
                <Card key={app.id} className="group border-none shadow-none bg-slate-50/50 rounded-2xl p-6 hover:bg-white hover:shadow-xl transition-all duration-500">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6 text-center lg:text-left">
                            <Avatar className="h-16 w-16 rounded-xl shadow-sm ring-2 ring-white transition-transform group-hover:scale-105 duration-500">
                                <AvatarFallback className="bg-slate-900 text-white font-bold text-xl">{(app.user?.profile?.name || app.user?.email || '?')[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h4 className="font-bold text-xl text-slate-900 tracking-tight">{app.user?.profile?.name || "Applicant"}</h4>
                                <div className="flex items-center gap-4 justify-center lg:justify-start mt-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Applied for: <span className="text-[#ec4899]">{app.job?.title}</span></p>
                                    <Separator orientation="vertical" className="h-3 bg-slate-200" />
                                    <Badge variant="outline" className="text-[10px] border-slate-200 text-slate-400 font-bold uppercase tracking-tight">Pending Review</Badge>
                                </div>
                                {app.resumeUrl && (
                                    <Button asChild variant="ghost" size="sm" className="h-6 p-0 mt-3 text-xs font-bold text-pink-600 hover:text-pink-700 hover:bg-transparent uppercase tracking-tight">
                                        <a href={`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001'}${app.resumeUrl}`} target="_blank" rel="noopener noreferrer">
                                            <FileText size={12} className="mr-1" /> View CV
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 w-full lg:w-auto">
                            <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-14 w-14 rounded-xl border-slate-200 shadow-sm hover:bg-white hover:text-[#ec4899] shrink-0 transition-all"
                                onClick={async () => {
                                    setActionLoading(app.id);
                                    try {
                                        await api.post('/messages/start', { participantId: app.userId });
                                        router.push('/business/messages');
                                    } catch (err) {
                                        console.error(err);
                                    } finally {
                                        setActionLoading(null);
                                    }
                                }}
                            >
                                <MessageSquare size={20} />
                            </Button>
                            <Button 
                                variant="outline" 
                                className="flex-1 lg:flex-none h-14 px-8 rounded-xl border-slate-200 font-bold text-slate-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50/30 transition-all"
                                onClick={() => handleStatusUpdate(app.id, 'Rejected')}
                                disabled={!!actionLoading}
                            >
                                {actionLoading === app.id ? "..." : "Reject"}
                            </Button>
                            <Button 
                                className="flex-1 lg:flex-none h-14 px-10 rounded-xl bg-slate-900 hover:bg-emerald-600 font-bold text-white transition-all"
                                onClick={() => handleStatusUpdate(app.id, 'Approved')}
                                disabled={!!actionLoading}
                            >
                                {actionLoading === app.id ? "..." : "Approve"}
                            </Button>
                        </div>
                    </div>
                </Card>
            )) : null}
            
            {applicants.filter(a => a.status === 'Pending').length === 0 && (
                <div className="py-24 text-center border border-dashed border-slate-200 rounded-3xl">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-200 border border-slate-100">
                        <Users size={28} />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900">No New Applications</h4>
                    <p className="text-xs font-medium text-slate-400 mt-2">You have no pending applications to review.</p>
                </div>
            )}
            
            <footer className="pt-16 pb-4 text-center">
                <p className="text-[10px] font-bold text-slate-200 uppercase tracking-[0.4em]">End of Dashboard</p>
            </footer>
        </div>
      </Card>
    </div>
  );
}