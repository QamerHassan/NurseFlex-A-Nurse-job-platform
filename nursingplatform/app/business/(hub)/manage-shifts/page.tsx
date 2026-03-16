"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
    Loader2, Edit3, Trash2, Users, Calendar, 
    DollarSign, MapPin, Search, ChevronRight, 
    MoreHorizontal, ArrowUpRight, Filter, AlertCircle,
    Copy, Archive, CheckCircle2, Zap
} from 'lucide-react';
import api from '@/lib/api';

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

export default function ManageShiftsPage() {
  const [shifts, setShifts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchShifts = async () => {
    try {
      const response = await api.get('/jobs/business');
      setShifts(response.data);
    } catch (err) {
      console.error("Fetch Shifts Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this job post? This action is irreversible.")) return;
    try {
      await api.delete(`/jobs/${id}`);
      setShifts(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error("Delete Shift Error:", err);
    }
  };

  const filteredShifts = shifts.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="space-y-12">
        <header className="flex justify-between items-end">
            <div className="space-y-4">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-14 w-64 rounded-2xl" />
        </header>
        <div className="space-y-6">
            {[1,2,3].map(i => <Skeleton key={i} className="h-48 rounded-[3rem]" />)}
        </div>
    </div>
  );

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-slate-100 pb-12">
        <div className="text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start mb-4">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Job Posts</h1>
          </div>
          <p className="text-slate-500 font-medium text-sm">Manage and track your active job postings</p>
        </div>
        <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-pink-600 transition-colors" size={18} />
            <Input 
                placeholder="Search jobs..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-16 pl-12 pr-6 rounded-2xl bg-white border-slate-100 font-bold text-slate-900 focus-visible:ring-0 focus-visible:bg-white shadow-sm transition-all text-base"
            />
        </div>
      </header>

      <div className="grid gap-8">
        {filteredShifts.length > 0 ? (
          filteredShifts.map((shift) => (
            <Card key={shift.id} className="group border-none shadow-sm hover:shadow-2xl hover:shadow-pink-100/50 bg-white rounded-[3rem] p-10 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-pink-50 transition-all duration-700"></div>
                
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative z-10">
                    <div className="space-y-6 flex-1">
                        <div className="flex items-center gap-4">
                            <h3 className="text-3xl font-bold text-slate-900 tracking-tight transition-colors group-hover:text-pink-600 leading-none">{shift.title}</h3>
                            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold text-[10px] px-3 shadow-none">Live</Badge>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-8">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-pink-50 group-hover:text-pink-400 transition-colors">
                                    <MapPin size={14} />
                                </div>
                                <span className="text-xs font-bold text-slate-500">{shift.location}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-400 transition-colors">
                                    <DollarSign size={14} />
                                </div>
                                <span className="text-xs font-bold text-slate-500">${shift.salary} /hr <span className="text-slate-300 ml-1 font-medium">Base Pay</span></span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-400 transition-colors">
                                    <Calendar size={14} />
                                </div>
                                <span className="text-xs font-bold text-slate-500">Posted: {new Date(shift.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-12 lg:pl-12 lg:border-l border-slate-100">
                        <div className="text-center group-hover:scale-110 transition-transform duration-500">
                            <div className="flex items-center justify-center mb-1 gap-1">
                                <p className="text-5xl font-black text-slate-900 tracking-tighter">{shift._count?.applications || 0}</p>
                                <ArrowUpRight className="text-emerald-500 w-6 h-6" />
                            </div>
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Applicants</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button asChild size="lg" className="h-16 px-10 rounded-2xl bg-pink-600 hover:bg-pink-700 font-bold text-base shadow-xl transition-all">
                                <Link href={`/business/applicants?jobId=${shift.id}`}>View Applicants</Link>
                            </Button>
                            
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon" className="h-16 w-16 rounded-2xl border-slate-100 shadow-sm text-slate-400 hover:text-slate-900 transition-all">
                                        <MoreHorizontal size={24} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-slate-100 shadow-2xl">
                                    <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-slate-400 p-3">Job Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="p-3 font-bold text-sm rounded-xl cursor-pointer">
                                        <Edit3 className="mr-3 w-4 h-4 text-pink-500" /> Edit Job
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="p-3 font-bold text-sm rounded-xl cursor-pointer">
                                        <Copy className="mr-3 w-4 h-4 text-pink-500" /> Duplicate Job
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="p-3 font-bold text-sm rounded-xl cursor-pointer">
                                        <Archive className="mr-3 w-4 h-4 text-pink-500" /> Archive Job
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                        className="p-3 font-bold text-sm rounded-xl cursor-pointer text-red-500 focus:text-red-600 focus:bg-red-50"
                                        onClick={() => handleDelete(shift.id)}
                                    >
                                        <Trash2 className="mr-3 w-4 h-4" /> Delete Job
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </Card>
          ))
        ) : (
          <Card className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-inner overflow-hidden relative">
            <div className="w-32 h-32 bg-slate-50 rounded-[4rem] flex items-center justify-center text-slate-200 mb-10 border border-slate-100 shadow-inner">
                <Zap size={60} className="fill-slate-50" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
                No Active Jobs
            </h2>
            <p className="text-slate-500 font-medium text-sm mb-12 max-w-xs mx-auto leading-relaxed">
                You haven't posted any jobs yet. Post a new job to start finding candidates.
            </p>

            <Button asChild size="lg" className="h-16 px-12 rounded-2xl bg-slate-900 hover:bg-pink-600 font-bold text-lg shadow-2xl shadow-slate-200 transition-all active:scale-[0.98]">
                <Link href="/business/post-job" className="gap-3">
                    Post a New Job <ArrowUpRight size={20} />
                </Link>
            </Button>
          </Card>
        )}
      </div>
      
      <footer className="pt-20 text-center">
         <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.8em]">End of Job List</p>
      </footer>
    </div>
  );
}
