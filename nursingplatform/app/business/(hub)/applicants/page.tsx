"use client";
import React, { useEffect, useState } from 'react';
import { 
    Loader2, FileText, MessageSquare, Star, 
    Search, Filter, ArrowUpRight, ChevronRight,
    Users, ShieldCheck, Zap, Download, MoreVertical,
    CheckCircle2, XCircle, Clock, AlertCircle, Calendar
} from 'lucide-react';
import api from '@/lib/api';

import Link from 'next/link';

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/app/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Skeleton } from "@/app/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchApplicants = async () => {
    try {
      const response = await api.get('/applications/business/applicants');
      setApplicants(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Fetch Applicants Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (applicationId: string, newStatus: string) => {
    setUpdatingId(applicationId);
    try {
      await api.post('/applications/business/update-status', { applicationId, status: newStatus });
      setApplicants(prev => prev.map(a => a.id === applicationId ? { ...a, status: newStatus } : a));
    } catch (err) {
      console.error("Update Status Error:", err);
      alert("Status update failed. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const filteredApplicants = applicants.filter(a => 
    (a.user?.profile?.name || a.user?.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.job?.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="space-y-8">
        <header className="flex justify-between items-end">
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-48 rounded-xl" />
        </header>
        <div className="space-y-3">
            {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
        </div>
    </div>
  );

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Applicants</h1>
            <p className="text-sm text-slate-500 font-medium">Manage candidates and streamline your hiring process.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={16} />
                <Input 
                    placeholder="Search candidates..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 pl-10 pr-4 rounded-xl bg-white border-slate-100 font-bold text-slate-900 focus-visible:ring-2 focus-visible:ring-blue-500/10 focus-visible:border-blue-500/30 shadow-sm transition-all text-sm"
                />
            </div>
            <Button className="h-12 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-widest gap-2 shadow-lg shadow-slate-200 w-full sm:w-auto">
                <Download size={16} /> Export
            </Button>
        </div>
      </header>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden p-6 space-y-4">
              <div className="flex justify-between items-center text-blue-600">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Users size={18} />
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-black uppercase tracking-widest">+12%</Badge>
              </div>
              <div>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">{applicants.length}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Applicants</p>
              </div>
          </Card>
          <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden p-6 space-y-4">
              <div className="flex justify-between items-center text-blue-600">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Zap size={18} />
                  </div>
              </div>
              <div>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">{applicants.filter(a => a.status === 'Interview').length}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Interviews</p>
              </div>
          </Card>
          <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden p-6 space-y-4">
              <div className="flex justify-between items-center text-emerald-600">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                      <CheckCircle2 size={18} />
                  </div>
              </div>
              <div>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">{applicants.filter(a => a.status === 'Approved').length}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Hired Professionals</p>
              </div>
          </Card>
          <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden p-6 space-y-4">
              <div className="flex justify-between items-center text-orange-600">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                      <Clock size={18} />
                  </div>
              </div>
              <div>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">{applicants.filter(a => a.status === 'Pending').length}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Pending Review</p>
              </div>
          </Card>
      </div>

      <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-slate-100 hover:bg-transparent">
              <TableHead className="px-6 py-4 text-[10px] font-bold text-slate-400 h-12 uppercase tracking-wider">Healthcare Professional</TableHead>
              <TableHead className="px-6 py-4 text-[10px] font-bold text-slate-400 h-12 uppercase tracking-wider">Job Link</TableHead>
              <TableHead className="px-6 py-4 text-[10px] font-bold text-slate-400 h-12 uppercase tracking-wider">Status</TableHead>
              <TableHead className="px-6 py-4 text-[10px] font-bold text-slate-400 h-12 uppercase tracking-wider">Applied Date</TableHead>
              <TableHead className="px-6 py-4 text-[10px] font-bold text-slate-400 h-12 uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplicants.length > 0 ? filteredApplicants.map((a) => (
              <TableRow key={a.id} className="border-slate-50 hover:bg-blue-50/20 transition-all group">
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 rounded-xl shadow-md shadow-slate-100 ring-2 ring-white transition-transform group-hover:scale-105 duration-300">
                        <AvatarFallback className="bg-slate-900 text-white font-black italic text-sm">{(a.user?.profile?.name || a.user?.email || '?')[0]}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-0.5">
                      <Link href={`/nurse/${a.userId}`} className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors block">
                        {a.user?.profile?.name || a.user?.email}
                      </Link>
                        <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                           <ShieldCheck size={10} className="text-blue-600" /> Verified
                        </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{a.job?.title}</p>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">Active Job</p>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Badge variant="secondary" className={`h-6 px-3 font-bold text-[10px] rounded-lg shadow-sm ${
                    a.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                    a.status === 'Rejected' ? 'bg-red-50 text-red-700' :
                    a.status === 'Interview' ? 'bg-blue-50 text-blue-700' :
                    'bg-blue-50 text-blue-700'
                  }`}>
                    {a.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                    <Calendar size={12} className="opacity-40" />
                    {mounted ? new Date(a.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '...'}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    {a.status === 'Pending' && (
                        <Button 
                            onClick={() => handleUpdateStatus(a.id, 'Approved')}
                            disabled={updatingId === a.id}
                            className="h-9 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest gap-2 shadow-sm shadow-emerald-100"
                        >
                            {updatingId === a.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={14} />}
                            Approve
                        </Button>
                    )}

                    <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-9 w-9 rounded-xl border-slate-100 shadow-sm text-slate-400 hover:text-blue-600 hover:bg-white group-hover:border-blue-100 transition-all"
                        onClick={() => {
                            const event = new CustomEvent('startChat', { detail: { participantId: a.userId } });
                            window.dispatchEvent(event);
                        }}
                    >
                        <MessageSquare size={16} />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-slate-900 transition-all">
                                <MoreVertical size={18} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 p-1.5 rounded-xl border-slate-100 shadow-2xl">
                            <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-3 py-2">Manage</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {a.resumeUrl ? (
                                <DropdownMenuItem className="p-2.5 font-bold text-xs rounded-lg cursor-pointer" asChild>
                                    <a href={`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001'}${a.resumeUrl}`} target="_blank" rel="noopener noreferrer">
                                        <FileText className="mr-2 w-3.5 h-3.5 text-blue-500" /> View CV
                                    </a>
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem disabled className="p-2.5 font-bold text-xs rounded-lg">
                                    <AlertCircle className="mr-2 w-3.5 h-3.5 text-slate-300" /> No CV
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="p-2.5 font-bold text-xs rounded-lg cursor-pointer" onClick={() => handleUpdateStatus(a.id, 'Interview')}>
                                <Zap className="mr-2 w-3.5 h-3.5 text-blue-500" /> Interview
                            </DropdownMenuItem>
                            <DropdownMenuItem className="p-2.5 font-bold text-xs rounded-lg cursor-pointer" onClick={() => handleUpdateStatus(a.id, 'Approved')}>
                                <CheckCircle2 className="mr-2 w-3.5 h-3.5 text-emerald-500" /> Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem className="p-2.5 font-bold text-xs rounded-lg cursor-pointer text-red-500" onClick={() => handleUpdateStatus(a.id, 'Rejected')}>
                                <XCircle className="mr-2 w-3.5 h-3.5 text-red-500" /> Reject
                            </DropdownMenuItem>
                             <DropdownMenuSeparator />
                            <DropdownMenuItem className="p-2.5 font-bold text-xs rounded-lg cursor-pointer">
                                <ArrowUpRight className="mr-2 w-3.5 h-3.5 text-blue-500" /> Full Profile
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="p-2.5 font-bold text-[11px] rounded-lg cursor-pointer text-slate-400 focus:text-slate-600 focus:bg-slate-50" onClick={() => handleUpdateStatus(a.id, 'Pending')}>
                                <Clock className="mr-2 w-3.5 h-3.5" /> Move to Pending
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="px-6 py-24 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-200 border border-slate-100 shadow-inner">
                        <Users size={24} />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900">No Applicants</h4>
                    <p className="text-xs font-medium text-slate-400 mt-2">No candidates have applied yet.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <footer className="pt-12 text-center">
         <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.6em]">End of List</p>
      </footer>
    </div>
  );
}