"use client";
import React, { useEffect, useState } from 'react';
import {
  Loader2, Users, FileText, Clock,
  ShieldCheck, Briefcase, CheckCircle2,
  MapPin, ChevronRight, Activity,
  TrendingUp, AlertTriangle, Zap,
  Database, Network, Globe, Filter,
  MoreHorizontal, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentApps, setRecentApps] = useState<any[]>([]);
  const [issueReports, setIssueReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (showRefreshLoader = false) => {
    if (showRefreshLoader) setRefreshing(true);
    try {
      const token = sessionStorage.getItem("admin_token");
      const headers = { 'Authorization': `Bearer ${token}` };

      const [statsRes, jobsRes, usersRes, issuesRes] = await Promise.all([
        api.get('/service-requests/dashboard-summary', { headers }),
        api.get('/jobs', { headers }),
        api.get('/users/all-nurses', { headers }),
        api.get('/issue-reports', { headers }),
      ]);

      const statsData = statsRes.data;
      const allJobs = Array.isArray(jobsRes.data) ? jobsRes.data : [];
      const issuesData = issuesRes.data;

      setStats({
        ...statsData,
        totalJobs: allJobs.length,
        pendingJobs: allJobs.filter((j: any) => j.status === 'PENDING').length,
        totalIssues: Array.isArray(issuesData) ? issuesData.length : 0,
        totalNurses: Array.isArray(usersRes.data) ? usersRes.data.length : (statsData.totalNurses || 0)
      });
      setIssueReports(Array.isArray(issuesData) ? issuesData.slice(0, 10) : []);
    } catch (err) {
      console.error("Dashboard Stats Error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExport = () => {
    if (!stats || !recentApps.length) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Category,Value\n";
    csvContent += `Total Nurses,${stats.totalNurses}\n`;
    csvContent += `Total Applications,${stats.totalApplications}\n`;
    csvContent += `Pending Review,${stats.pendingApplications}\n`;
    csvContent += `Total Blogs,${stats.totalBlogs}\n\n`;

    csvContent += "Recent Applications\n";
    csvContent += "Candidate,Email,Position,Status\n";
    recentApps.forEach(app => {
      csvContent += `"${app.user?.profile?.name || 'Unknown'}","${app.user?.email || 'N/A'}","${app.job?.title || 'N/A'}","${app.status}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NurseFlex_Admin_Summary_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return (
    <div className="flex h-[60vh] flex-col items-center justify-center space-y-4 font-sans">
      <Loader2 className="animate-spin text-blue-600" size={32} />
      <p className="text-xs font-semibold text-slate-400">Loading dashboard...</p>
    </div>
  );

  const statsCards = [
    { label: "Total Nurses", value: stats?.totalNurses ?? 0, icon: Users, trend: "+12.5%", isUp: true, color: "text-blue-600", bg: "bg-blue-50", href: "/admin/users" },
    { label: "Active Jobs", value: stats?.totalJobs ?? 0, icon: Briefcase, trend: "+8.2%", isUp: true, color: "text-green-600", bg: "bg-green-50", href: "/admin/dashboard" },
    { label: "System Reports", value: stats?.totalIssues ?? 0, icon: AlertTriangle, trend: "Stable", isUp: true, color: "text-red-600", bg: "bg-red-50", href: "/admin/dashboard" },
    { label: "Blog Posts", value: stats?.totalBlogs ?? 0, icon: FileText, trend: "Stable", isUp: true, color: "text-slate-600", bg: "bg-slate-50", href: "/admin/blogs" },
  ];

  const statusColors: Record<string, string> = {
    Pending: 'bg-amber-50 text-amber-700 border-amber-100',
    Approved: 'bg-green-50 text-green-700 border-green-100',
    Rejected: 'bg-red-50 text-red-700 border-red-100',
    Interview: 'bg-blue-50 text-blue-600 border-blue-100',
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Overview</h1>
          <p className="text-sm text-slate-500 font-medium">Real-time stats and platform activity.</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleExport}
            className="h-10 px-4 rounded-lg border-slate-200 font-bold text-xs gap-2 text-slate-600 hover:bg-slate-50 transition-all"
          >
            <FileText size={16} /> Export
          </Button>
          <Button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="h-10 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-2 transition-all disabled:opacity-50"
          >
            {refreshing ? <Loader2 size={16} className="animate-spin" /> : <Activity size={16} />}
            {refreshing ? "Updating..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((s, i) => (
          <Link key={i} href={s.href} className="block group">
            <Card className="border border-slate-200 bg-white rounded-2xl shadow-sm group-hover:shadow-[0_20px_50px_rgb(0,0,0,0.06)] group-hover:-translate-y-1 transition-all duration-300 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight size={14} className="text-blue-600" />
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                    <s.icon className={s.color} size={20} />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${s.isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {s.isUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    {s.trend}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                  <p className="text-3xl font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Activity Table */}
        <Card className="lg:col-span-8 border border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col items-center justify-center p-20 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200">
            <Globe size={32} />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">Platform Status: Healthy</h2>
            <p className="text-sm text-slate-500 font-medium">All systems are operational. Applicant management has been handed over to Business Users.</p>
          </div>
        </Card>

        {/* User Reports & Logs */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="border border-red-100 bg-white rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="p-6 bg-red-50/50 flex flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold text-red-900 flex items-center gap-2">
                  <AlertTriangle size={18} /> Reports
                </CardTitle>
                <p className="text-[10px] text-red-600 font-bold uppercase tracking-wider">Needs Attention</p>
              </div>
              {issueReports.length > 0 && (
                <Badge className="bg-red-600 text-white text-[10px] font-bold rounded-full h-6 px-2">{issueReports.length}</Badge>
              )}
            </CardHeader>
            <CardContent className="p-4">
              {issueReports.length > 0 ? (
                <div className="space-y-3">
                  {issueReports.slice(0, 5).map((report: any) => (
                    <div key={report.id} className="p-3 bg-white border border-slate-100 rounded-xl hover:shadow-sm transition-shadow space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black uppercase text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{report.category}</span>
                        <span className="text-[9px] text-slate-400 font-medium">#{report.id.slice(-4)}</span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">"{report.message}"</p>
                      <div className="pt-2 flex justify-between items-center text-[9px] font-bold uppercase text-slate-400">
                        <span className="font-bold">{report.user?.name || 'User'}</span>
                        <Button variant="ghost" className="h-6 px-2 text-green-600 hover:bg-green-50 text-[9px] font-bold">Resolve</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center space-y-3">
                  <CheckCircle2 className="mx-auto text-green-500" size={32} />
                  <p className="text-xs font-bold text-slate-400">System Healthy</p>
                </div>
              )}
            </CardContent>
            {issueReports.length > 5 && (
              <CardFooter className="p-4 pt-0">
                <Button variant="ghost" className="w-full text-xs font-bold text-slate-500 hover:text-slate-900">View All Reports</Button>
              </CardFooter>
            )}
          </Card>

          <Card className="border border-slate-200 bg-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin Tools</p>
                  <p className="text-sm font-bold text-slate-900">Maintenance</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold uppercase">
                  <span className="text-slate-400">Server Status</span>
                  <span className="text-emerald-500">Online</span>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl h-11">
                Check Updates
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}