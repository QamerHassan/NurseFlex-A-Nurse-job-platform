"use client";
import React, { useState, useEffect } from 'react';
import { 
    Loader2, CheckCircle2, XCircle, 
    Clock, Building2, MapPin, 
    DollarSign, Calendar, Activity,
    ShieldAlert, ChevronRight, X,
    Check, Download, AlertCircle,
    Search, Filter, MoreVertical,
    Briefcase, Zap, Database,
    UserCircle, History
} from 'lucide-react';

import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Separator } from "@/app/components/ui/separator";

import api from '@/lib/api';

export default function JobReviewPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState<string | null>(null);

    const fetchPendingJobs = async () => {
        try {
            const token = sessionStorage.getItem("admin_token");
            const res = await api.get('/jobs/admin/pending', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setJobs(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Failed to fetch pending jobs:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingJobs();
    }, []);

    const handleStatusUpdate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        if (!confirm(`Are you sure you want to ${status.toLowerCase()} this job post?`)) return;
        
        setActionId(id);
        try {
            const token = sessionStorage.getItem("admin_token");
            const res = await api.patch(`/jobs/status/${id}`, { status }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.status === 200) {
                setJobs(prev => prev.filter(j => j.id !== id));
            } else {
                alert("Failed to update status.");
            }
        } catch (err) {
            alert("Error connecting to server.");
        } finally {
            setActionId(null);
        }
    };

    if (loading) return (
    <div className="flex h-[60vh] flex-col items-center justify-center space-y-6">
        <div className="relative">
            <div className="absolute inset-0 bg-pink-500 blur-2xl opacity-10 animate-pulse"></div>
            <Loader2 className="animate-spin text-pink-500 relative z-10" size={48} />
        </div>
        <p className="text-sm font-medium text-slate-400">Loading job posts...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900">Job Review</h1>
            <p className="text-sm text-slate-500 font-medium">Verify and approve healthcare job listings.</p>
        </div>

        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm w-full md:w-96 transition-all focus-within:ring-2 focus-within:ring-pink-500/10 focus-within:border-pink-500/30">
            <Search className="text-slate-400" size={18} />
            <Input 
                placeholder="Search jobs..." 
                className="h-10 border-none focus-visible:ring-0 font-medium text-sm bg-transparent placeholder:text-slate-400 p-0" 
            />
        </div>
      </header>

      {jobs.length === 0 ? (
           <div className="p-20 text-center space-y-4 border border-slate-100 rounded-2xl bg-white">
              <div className="w-16 h-16 bg-slate-50 rounded-full mx-auto flex items-center justify-center text-slate-300">
                  <Briefcase size={32} />
              </div>
              <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">Queue is empty</h3>
                  <p className="text-sm text-slate-400 font-medium">No pending job posts found</p>
              </div>
              <Button onClick={fetchPendingJobs} variant="ghost" className="text-pink-600 font-bold uppercase text-[10px] tracking-widest">Refresh List</Button>
          </div>
      ) : (
          <div className="grid grid-cols-1 gap-8">
              {jobs.map((job) => (
                  <Card key={job.id} className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden group hover:shadow-md transition-all duration-300">
                      <CardContent className="p-0 flex flex-col lg:flex-row">
                          <div className="p-8 lg:p-10 lg:w-2/3 space-y-8">
                              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                  <div className="space-y-2">
                                      <div className="flex items-center gap-3">
                                          <Badge className="bg-pink-50 text-pink-600 border-none font-bold text-[10px] uppercase tracking-wider px-3 shadow-none">Review Needed</Badge>
                                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                              Posted: {new Date(job.createdAt).toLocaleDateString()}
                                          </p>
                                      </div>
                                      <h2 className="text-2xl font-bold text-slate-900">{job.title}</h2>
                                  </div>
                                  <div className="bg-slate-900 px-6 py-4 rounded-xl text-center min-w-[140px]">
                                      <p className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Hourly Rate</p>
                                      <p className="text-2xl font-bold text-white leading-tight">£{job.salary}<span className="text-xs text-slate-400 ml-1">/hr</span></p>
                                  </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                  <div className="space-y-1">
                                      <div className="flex items-center gap-2 text-slate-400">
                                          <Building2 size={14} />
                                          <p className="text-[9px] font-bold uppercase tracking-widest">Business</p>
                                      </div>
                                      <p className="text-sm font-bold text-slate-800">{job.hospital}</p>
                                  </div>
                                  <div className="space-y-1">
                                      <div className="flex items-center gap-2 text-slate-400">
                                          <MapPin size={14} />
                                          <p className="text-[9px] font-bold uppercase tracking-widest">Location</p>
                                      </div>
                                      <p className="text-sm font-bold text-slate-800">{job.location}</p>
                                  </div>
                                  <div className="space-y-1">
                                      <div className="flex items-center gap-2 text-slate-400">
                                          <Clock size={14} />
                                          <p className="text-[9px] font-bold uppercase tracking-widest">Type</p>
                                      </div>
                                      <p className="text-sm font-bold text-slate-800">{job.type}</p>
                                  </div>
                              </div>

                              <div className="space-y-3">
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Job Description</p>
                                  <div className="bg-white p-6 rounded-xl border border-slate-100">
                                      <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                          {job.description}
                                      </p>
                                  </div>
                              </div>
                          </div>

                          <CardFooter className="bg-slate-900 p-8 lg:w-1/3 flex flex-col justify-center gap-4">
                              <Button 
                                  onClick={() => handleStatusUpdate(job.id, 'APPROVED')}
                                  disabled={!!actionId}
                                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold uppercase tracking-wider text-[10px] gap-2 shadow-lg transition-all"
                              >
                                  {actionId === job.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={18} />}
                                  Approve Listing
                              </Button>
                              <Button 
                                  onClick={() => handleStatusUpdate(job.id, 'REJECTED')}
                                  disabled={!!actionId}
                                  variant="ghost"
                                  className="w-full h-12 bg-white/5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg font-bold uppercase tracking-wider text-[10px] gap-2 border border-white/5 transition-all"
                              >
                                  <XCircle size={18} />
                                  Reject Listing
                              </Button>
                              <div className="pt-4 text-center">
                                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                       ID: {job.id.slice(0, 12)}
                                   </p>
                              </div>
                          </CardFooter>
                      </CardContent>
                  </Card>
              ))}
          </div>
      )}

      <footer className="pt-10 text-center">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin Portal</p>
      </footer>
    </div>
  );
}
