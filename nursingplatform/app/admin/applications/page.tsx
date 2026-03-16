"use client";
import React, { useEffect, useState } from 'react';
import {
  Loader2, Search, CheckCircle,
  XCircle, Clock, Briefcase,
  MapPin, Mail, ChevronDown,
  Activity, ShieldAlert, Filter,
  MoreHorizontal, Download,
  ArrowUpRight, Users, Calendar,
  ExternalLink
} from 'lucide-react';
import api from '@/lib/api';

import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Separator } from "@/app/components/ui/separator";

const STATUS_OPTIONS = ['Pending', 'Interview', 'Approved', 'Rejected'];
const STATUS_COLORS: Record<string, string> = {
  Pending: 'bg-orange-50 text-orange-600 border-orange-100',
  Approved: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  Rejected: 'bg-red-50 text-red-600 border-red-100',
  Interview: 'bg-blue-50 text-blue-600 border-blue-100',
};

export default function AdminApplications() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchApps = async () => {
    try {
      const token = sessionStorage.getItem("admin_token");
      const res = await api.get('/applications/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setApps(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApps(); }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const token = sessionStorage.getItem("admin_token");
      const res = await api.post('/applications/update-status', { applicationId: id, status: newStatus }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 200 || res.status === 201) {
        setApps(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
      }
    } catch (err) {
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = apps.filter(app => {
    const name = (app.user?.profile?.name || app.user?.email || '').toLowerCase();
    const title = (app.job?.title || '').toLowerCase();
    const hosp = (app.job?.hospital || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = name.includes(query) || title.includes(query) || hosp.includes(query);
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return (
    <div className="flex h-[60vh] flex-col items-center justify-center space-y-6">
      <div className="relative">
        <div className="absolute inset-0 bg-pink-500 blur-2xl opacity-10 animate-pulse"></div>
        <Loader2 className="animate-spin text-pink-500 relative z-10" size={48} />
      </div>
      <p className="text-sm font-medium text-slate-400">Loading applications...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">Applications</h1>
          <p className="text-sm text-slate-500 font-medium">Review and manage all job applications.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm w-full sm:w-80 transition-all focus-within:ring-2 focus-within:ring-pink-500/10 focus-within:border-pink-500/30">
            <Search className="text-slate-400" size={18} />
            <Input
              placeholder="Search candidate or job..."
              className="h-10 border-none focus-visible:ring-0 font-medium text-sm bg-transparent placeholder:text-slate-400 p-0"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative group w-full sm:w-auto">
            <select
              className="appearance-none h-12 bg-slate-900 text-white border-none rounded-xl pl-6 pr-12 outline-none font-bold text-xs shadow-sm cursor-pointer hover:bg-slate-800 transition-all w-full sm:w-auto"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" size={14} />
          </div>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {STATUS_OPTIONS.map(s => {
          const count = apps.filter(a => a.status === s).length;
          const isActive = statusFilter === s;
          return (
            <Card
              key={s}
              onClick={() => setStatusFilter(isActive ? 'All' : s)}
              className={`cursor-pointer border border-slate-100 shadow-sm transition-all duration-300 rounded-2xl overflow-hidden group hover:shadow-md ${isActive ? 'ring-2 ring-pink-500/20 bg-slate-900 text-white' : 'bg-white'}`}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div className={`w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center ${STATUS_COLORS[s]?.split(' ')[1]}`}>
                    <Activity size={18} />
                  </div>
                  <Badge variant="ghost" className={`text-[8px] font-bold uppercase ${isActive ? 'text-white/40' : 'text-slate-300'}`}>{count > 0 ? 'Active' : 'Empty'}</Badge>
                </div>
                <div>
                  <p className={`text-3xl font-bold tracking-tight ${isActive ? 'text-white' : 'text-slate-900'}`}>{count}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-slate-500' : 'text-slate-400'}`}>{s}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Applications Table */}
      <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold text-slate-900">Application Records</CardTitle>
          <Button variant="ghost" className="h-10 px-4 rounded-xl text-pink-600 hover:bg-pink-50 font-bold uppercase tracking-wider text-[10px] gap-2">
            Export <Download size={14} />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/30">
                  <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-400">Applicant</th>
                  <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-400">Position</th>
                  <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-400">Applied Date</th>
                  <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">Status</th>
                  <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-20 text-center text-slate-400 font-medium">
                      No applications found.
                    </td>
                  </tr>
                ) : filtered.map((app) => (
                  <tr key={app.id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white text-lg font-bold">
                          {(app.user?.profile?.name || app.user?.email || '?')[0].toUpperCase()}
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900 group-hover:text-pink-600 transition-colors">{app.user?.profile?.name || "Unnamed Candidate"}</p>
                          <p className="text-xs text-slate-500 font-medium">{app.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-slate-900">{app.job?.title}</p>
                        <p className="text-xs text-slate-500 font-medium">{app.job?.hospital} • {app.job?.location}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-medium text-slate-700">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <Badge className={`h-8 px-4 rounded-lg font-bold text-[10px] uppercase tracking-wider border ${STATUS_COLORS[app.status]}`}>
                        {app.status}
                      </Badge>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        {app.status !== 'Approved' && (
                          <Button
                            onClick={() => updateStatus(app.id, 'Approved')}
                            className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] uppercase tracking-wider"
                          >
                            Approve
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-300 hover:text-slate-900 rounded-lg">
                          <MoreHorizontal size={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="p-8 border-t border-slate-50 bg-slate-50/20 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <div>Live Data • Applications Hub</div>
          <p className="text-slate-300">NurseFlex Admin</p>
        </CardFooter>
      </Card>
    </div>
  );
}

