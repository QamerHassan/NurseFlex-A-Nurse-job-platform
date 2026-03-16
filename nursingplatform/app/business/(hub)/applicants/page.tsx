"use client";
import React, { useEffect, useState } from 'react';
import { 
    Loader2, FileText, MessageSquare, Star, 
    Search, Filter, ArrowUpRight, ChevronRight,
    Users, ShieldCheck, Zap, Download, MoreVertical,
    CheckCircle2, XCircle, Clock, AlertCircle
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


  const fetchApplicants = async () => {
    try {
      const response = await api.get('/applications/business/applicants');
      setApplicants(response.data);
    } catch (err) {
      console.error("Fetch Applicants Error:", err);
    } finally {
      setLoading(false);
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
    <div className="space-y-12">
        <header className="flex justify-between items-end">
            <div className="space-y-4">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-14 w-64 rounded-2xl" />
        </header>
        <div className="space-y-4">
            {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
        </div>
    </div>
  );

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-slate-100 pb-12">
        <div className="text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start mb-4">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Applicants</h1>
          </div>
          <p className="text-slate-500 font-medium text-sm">Review healthcare professionals who applied to your job posts.</p>
        </div>
        <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-pink-600 transition-colors" size={18} />
            <Input 
                placeholder="Search applicants..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-16 pl-12 pr-6 rounded-2xl bg-white border-slate-100 font-bold text-slate-900 focus-visible:ring-0 focus-visible:bg-white shadow-sm transition-all text-base"
            />
        </div>
      </header>

      <Card className="border-none shadow-sm bg-white rounded-[3rem] overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-slate-100 hover:bg-transparent">
              <TableHead className="px-10 py-6 text-xs font-bold text-slate-500 h-16">Healthcare Professional</TableHead>
              <TableHead className="px-10 py-6 text-xs font-bold text-slate-500 h-16">Job Link</TableHead>
              <TableHead className="px-10 py-6 text-xs font-bold text-slate-500 h-16">Status</TableHead>
              <TableHead className="px-10 py-6 text-xs font-bold text-slate-500 h-16">Applied Date</TableHead>
              <TableHead className="px-10 py-6 text-xs font-bold text-slate-500 h-16 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplicants.length > 0 ? filteredApplicants.map((a) => (
              <TableRow key={a.id} className="border-slate-50 hover:bg-pink-50/30 transition-all group">
                <TableCell className="px-10 py-8">
                  <div className="flex items-center gap-6">
                    <Avatar className="h-14 w-14 rounded-2xl shadow-xl shadow-slate-100 ring-4 ring-white transition-transform group-hover:scale-110 duration-500">
                        <AvatarFallback className="bg-slate-900 text-white font-black italic text-lg">{(a.user?.profile?.name || a.user?.email || '?')[0]}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <Link href={`/nurse/${a.userId}`} className="text-base font-bold text-slate-900 hover:text-pink-600 transition-colors block">
                        {a.user?.profile?.name || a.user?.email}
                      </Link>
                        <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                           <ShieldCheck size={12} className="text-pink-600" /> Professional Verified
                        </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-10 py-8">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-700 group-hover:text-pink-600 transition-colors">{a.job?.title}</p>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-tight">Job Detail Port</p>
                  </div>
                </TableCell>
                <TableCell className="px-10 py-8">
                  <Badge className={`h-8 px-4 font-bold text-xs rounded-full shadow-lg ${
                    a.status === 'Approved' ? 'bg-emerald-600 shadow-emerald-100' :
                    a.status === 'Rejected' ? 'bg-red-500 shadow-red-100' :
                    'bg-pink-600 shadow-pink-100'
                  }`}>
                    {a.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-10 py-8">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <Clock size={14} className="opacity-40" />
                    {new Date(a.appliedAt).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell className="px-10 py-8 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-12 w-12 rounded-2xl border-slate-100 shadow-sm text-slate-400 hover:text-pink-600 hover:bg-white group-hover:border-pink-100 transition-all"
                        onClick={() => {
                            const event = new CustomEvent('startChat', { detail: { participantId: a.userId } });
                            window.dispatchEvent(event);
                        }}
                    >
                        <MessageSquare size={18} />
                    </Button>
                    


                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl text-slate-300 hover:text-slate-900 transition-all">
                                <MoreVertical size={20} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-slate-100 shadow-2xl">
                            <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-slate-400 p-3">Manage Application</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {a.resumeUrl ? (
                                <DropdownMenuItem className="p-3 font-bold text-sm rounded-xl cursor-pointer" asChild>
                                    <a href={`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001'}${a.resumeUrl}`} target="_blank" rel="noopener noreferrer">
                                        <FileText className="mr-3 w-4 h-4 text-pink-500" /> View CV
                                    </a>
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem disabled className="p-3 font-bold text-sm rounded-xl">
                                    <AlertCircle className="mr-3 w-4 h-4 text-slate-300" /> No CV Uploaded
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="p-3 font-bold text-sm rounded-xl cursor-pointer">
                                <ArrowUpRight className="mr-3 w-4 h-4 text-pink-500" /> View Profile
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="p-3 font-bold text-sm rounded-xl cursor-pointer text-red-500 focus:text-red-600 focus:bg-red-50">
                                <XCircle className="mr-3 w-4 h-4" /> Remove Application
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="px-10 py-32 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-slate-200 border border-slate-100 shadow-inner">
                        <Users size={32} />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900">No Applicants</h4>
                    <p className="text-sm font-medium text-slate-400 mt-4">No candidates have applied yet.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <footer className="pt-20 text-center">
         <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.8em]">End of Applicant List</p>
      </footer>


    </div>
  );
}