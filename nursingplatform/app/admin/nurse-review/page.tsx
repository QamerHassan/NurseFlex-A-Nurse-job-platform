"use client";
import React, { useState, useEffect } from 'react';
import { 
    ShieldCheck, User, Search, Filter, 
    CheckCircle2, XCircle, MoreVertical, 
    FileText, Mail, Phone, MapPin, 
    Award, ShieldAlert, Loader2, 
    Activity, ChevronRight, X,
    Check, Download, ExternalLink,
    AlertCircle, Clock
} from 'lucide-react';
import api from '@/lib/api';

import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Separator } from "@/app/components/ui/separator";

export default function AdminNurseReview() {
    const [nurses, setNurses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedNurse, setSelectedNurse] = useState<any>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchNurses = async () => {
        const token = sessionStorage.getItem("admin_token");
        if (!token) return;

        setLoading(true);
        try {
            const res = await api.get('/users/pending/NURSE');
            setNurses(res.data);
        } catch (err) {
            console.error('Fetch pending nurses error:', err);
            setNurses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNurses();
    }, []);

    const approveNurse = async (id: string) => {
        setActionLoading('APPROVE');
        try {
            await api.patch(`/users/status/${id}`, { status: 'APPROVED' });
            setNurses(nurses.filter(n => n.id !== id));
            setSelectedNurse(null);
        } catch (err) {
            console.error('Approve nurse error:', err);
        } finally {
            setActionLoading(null);
        }
    };

    const rejectNurse = async (id: string) => {
        if (!confirm("Are you sure you want to reject this nurse profile?")) return;
        setActionLoading('REJECT');
        try {
            await api.patch(`/users/status/${id}`, { status: 'REJECTED' });
            setNurses(nurses.filter(n => n.id !== id));
            setSelectedNurse(null);
        } catch (err) {
            console.error('Reject nurse error:', err);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return (
        <div className="flex h-[60vh] flex-col items-center justify-center space-y-6">
            <div className="relative">
                <div className="absolute inset-0 bg-pink-500 blur-2xl opacity-10 animate-pulse"></div>
                <Loader2 className="animate-spin text-pink-500 relative z-10" size={48} />
            </div>
            <p className="text-sm font-medium text-slate-400">Loading registrations...</p>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-slate-900">Nurse Review</h1>
                    <p className="text-sm text-slate-500 font-medium">Verify professional credentials and profiles.</p>
                </div>

                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm w-full md:w-96 transition-all focus-within:ring-2 focus-within:ring-pink-500/10 focus-within:border-pink-500/30">
                    <Search className="text-slate-400" size={18} />
                    <Input 
                        placeholder="Search by name..." 
                        className="h-10 border-none focus-visible:ring-0 font-medium text-sm bg-transparent placeholder:text-slate-400 p-0" 
                    />
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* List */}
                <div className="lg:col-span-12 xl:col-span-8 space-y-4">
                    {nurses.length > 0 ? (
                        <div className="grid gap-4">
                            {nurses.map((nurse: any) => (
                                <Card 
                                    key={nurse.id}
                                    onClick={() => setSelectedNurse(nurse)}
                                    className={`group cursor-pointer border border-slate-100 shadow-sm transition-all duration-300 rounded-xl overflow-hidden ${selectedNurse?.id === nurse.id ? 'ring-2 ring-pink-500/20 bg-white' : 'bg-white hover:bg-slate-50'}`}
                                >
                                    <CardContent className="p-6 flex items-center justify-between gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-white text-lg font-bold">
                                                {nurse.name[0].toUpperCase()}
                                            </div>
                                            <div className="space-y-0.5">
                                                <h3 className="font-bold text-slate-900 group-hover:text-pink-600 transition-colors">{nurse.name}</h3>
                                                <div className="flex items-center gap-2">
                                                    <Badge className="bg-pink-50 text-pink-600 border-none font-bold text-[8px] uppercase tracking-wider px-2 shadow-none">
                                                        {nurse.specialization}
                                                    </Badge>
                                                    <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">
                                                        ID: {nurse.id.slice(0, 8)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="hidden md:block text-right">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">License</p>
                                                <p className="text-sm font-bold text-slate-700">{nurse.licenseNumber || nurse.license}</p>
                                            </div>
                                            <Badge className="h-7 px-2 rounded-md font-bold text-[9px] uppercase tracking-widest bg-amber-50 text-amber-600 border-none">
                                                {nurse.status}
                                            </Badge>
                                            <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-900 transition-all" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="p-20 text-center space-y-4 border border-slate-100 rounded-2xl bg-white">
                            <div className="w-16 h-16 bg-slate-50 rounded-full mx-auto flex items-center justify-center text-slate-300">
                                <ShieldCheck size={32} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-slate-900">Queue Processed</h3>
                                <p className="text-sm text-slate-400 font-medium">No pending nurse registrations found</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="lg:col-span-12 xl:col-span-4 lg:sticky lg:top-8">
                    <Card className={`border border-slate-200 shadow-sm bg-slate-900 rounded-2xl overflow-hidden transition-all duration-700 ${!selectedNurse ? 'h-[300px] opacity-50' : 'opacity-100'}`}>
                        {!selectedNurse ? (
                            <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
                                <ShieldAlert size={40} className="text-slate-700" />
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Select nurse Case to review</p>
                            </div>
                        ) : (
                            <div className="flex flex-col h-full animate-in slide-in-from-right-8 duration-700">
                                <CardHeader className="p-8 pb-4 border-b border-white/5 relative bg-white/[0.02]">
                                    <div className="absolute top-6 right-6">
                                        <Button 
                                            variant="ghost" 
                                            size="icon"
                                            onClick={() => setSelectedNurse(null)}
                                            className="h-10 w-10 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                                        >
                                            <X size={20} />
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-6 pt-2">
                                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-slate-950 text-2xl font-bold shadow-lg">
                                            {selectedNurse.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                                        </div>
                                        <div className="space-y-1">
                                            <h2 className="text-2xl font-bold text-white tracking-tight leading-none">{selectedNurse.name}</h2>
                                            <Badge className="bg-[#ec4899] text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 border-none">
                                                {selectedNurse.specialization}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-8 space-y-8">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Location</p>
                                            <p className="text-sm font-bold text-white">{selectedNurse.state}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">License</p>
                                            <p className="text-sm font-bold text-white">{selectedNurse.license}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Separator className="bg-white/5" />
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Documents</p>
                                            <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-900 shadow-xl group-hover:scale-110 transition-transform">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-white truncate">Credentials.pdf</p>
                                                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Resume</p>
                                                    </div>
                                                </div>
                                                <Download size={16} className="text-slate-500 group-hover:text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="p-8 pt-0 mt-auto bg-white/[0.01] border-t border-white/5">
                                    <div className="grid grid-cols-2 gap-4 w-full pt-6">
                                        <Button 
                                            onClick={() => approveNurse(selectedNurse.id)}
                                            disabled={actionLoading !== null}
                                            className="h-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold uppercase tracking-wider text-[10px] gap-2 shadow-lg transition-all"
                                        >
                                            {actionLoading === 'APPROVE' ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={18} />}
                                            Approve
                                        </Button>
                                        <Button 
                                            onClick={() => rejectNurse(selectedNurse.id)}
                                            disabled={actionLoading !== null}
                                            className="h-12 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold uppercase tracking-wider text-[10px] gap-2 shadow-lg transition-all"
                                        >
                                            {actionLoading === 'REJECT' ? <Loader2 className="animate-spin" size={16} /> : <XCircle size={18} />}
                                            Reject
                                        </Button>
                                    </div>
                                </CardFooter>
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            <footer className="pt-20 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">NurseFlex Admin Portal</p>
            </footer>
        </div>
    );
}
