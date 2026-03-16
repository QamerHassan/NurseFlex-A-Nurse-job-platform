"use client";
import React, { useEffect, useState } from 'react';
import { 
    Loader2, ShieldCheck, Mail, 
    Building2, CheckCircle, XCircle, 
    FileText, ExternalLink, Gem,
    ShieldAlert, Activity, ChevronRight, 
    X, Check, Download, AlertCircle,
    Search, Filter, MoreVertical,
    MapPin, Globe, CreditCard
} from 'lucide-react';
import api from '@/lib/api';

import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Separator } from "@/app/components/ui/separator";

export default function BusinessReviewPortal() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        const token = sessionStorage.getItem("admin_token");
        if (!token) return;

        setLoading(true);
        try {
            const res = await api.get('/users/pending/BUSINESS');
            setRequests(res.data);
        } catch (err) {
            console.error('Fetch pending businesses error:', err);
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        setActionLoading('APPROVE');
        try {
            await api.patch(`/users/status/${id}`, { status: 'APPROVED' });
            setRequests(requests.filter(r => r.id !== id));
            setSelectedBusiness(null);
        } catch (err) {
            console.error('Approve error:', err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id: string) => {
        if (!confirm("Are you sure you want to reject this business?")) return;
        setActionLoading('REJECT');
        try {
            await api.patch(`/users/status/${id}`, { status: 'REJECTED' });
            setRequests(requests.filter(r => r.id !== id));
            setSelectedBusiness(null);
        } catch (err) {
            console.error('Reject error:', err);
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
            <p className="text-sm font-medium text-slate-400">Loading businesses...</p>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-slate-900">Business Review</h1>
                    <p className="text-sm text-slate-500 font-medium">Verify healthcare provider accounts and profiles.</p>
                </div>

                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm w-full md:w-96 transition-all focus-within:ring-2 focus-within:ring-pink-500/10 focus-within:border-pink-500/30">
                    <Search className="text-slate-400" size={18} />
                    <Input 
                        placeholder="Search businesses..." 
                        className="h-10 border-none focus-visible:ring-0 font-medium text-sm bg-transparent placeholder:text-slate-400 p-0" 
                    />
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* List */}
                <div className="lg:col-span-12 xl:col-span-8 space-y-4">
                    {requests.length > 0 ? (
                        <div className="grid gap-4">
                            {requests.map((biz: any) => (
                                <Card 
                                    key={biz.id}
                                    onClick={() => setSelectedBusiness(biz)}
                                    className={`group cursor-pointer border border-slate-100 shadow-sm transition-all duration-300 rounded-xl overflow-hidden ${selectedBusiness?.id === biz.id ? 'ring-2 ring-pink-500/20 bg-white' : 'bg-white hover:bg-slate-50'}`}
                                >
                                    <CardContent className="p-6 flex items-center justify-between gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-white text-lg font-bold group-hover:bg-pink-600 transition-colors">
                                                {biz.name[0].toUpperCase()}
                                            </div>
                                            <div className="space-y-0.5">
                                                <h3 className="font-bold text-slate-900 group-hover:text-pink-600 transition-colors">{biz.name}</h3>
                                                <p className="text-[10px] font-medium text-slate-400 lowercase">{biz.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="hidden md:block text-right">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Registered</p>
                                                <p className="text-sm font-bold text-slate-700">{biz.date || "Just now"}</p>
                                            </div>
                                            <Badge className="h-7 px-2 rounded-md font-bold text-[9px] uppercase tracking-widest bg-amber-50 text-amber-600 border-none">
                                                {biz.status}
                                            </Badge>
                                            <MoreVertical size={18} className="text-slate-300 group-hover:text-slate-900 transition-all" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="p-20 text-center space-y-4 border border-slate-100 rounded-2xl bg-white">
                            <div className="w-16 h-16 bg-slate-50 rounded-full mx-auto flex items-center justify-center text-slate-300">
                                <Building2 size={32} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-slate-900">All Caught Up</h3>
                                <p className="text-sm text-slate-400 font-medium">No pending business verifications</p>
                            </div>
                            <Button onClick={fetchRequests} variant="ghost" className="text-pink-600 font-bold uppercase text-[10px] tracking-widest">Refresh</Button>
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="lg:col-span-12 xl:col-span-4 lg:sticky lg:top-8">
                    <Card className={`border border-slate-200 shadow-sm bg-slate-900 rounded-2xl overflow-hidden transition-all duration-500 ${!selectedBusiness ? 'h-[300px] opacity-50' : 'opacity-100'}`}>
                        {!selectedBusiness ? (
                            <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
                                <ShieldAlert size={40} className="text-slate-700" />
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Select business profile to review</p>
                            </div>
                        ) : (
                            <div className="flex flex-col h-full animate-in slide-in-from-right-8 duration-500">
                                <CardHeader className="p-8 pb-4 border-b border-white/5 relative bg-white/[0.02]">
                                    <div className="absolute top-6 right-6">
                                        <Button 
                                            variant="ghost" 
                                            size="icon"
                                            onClick={() => setSelectedBusiness(null)}
                                            className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                        >
                                            <X size={16} />
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-4 pt-2">
                                        <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center text-slate-950 text-xl font-bold shadow-lg">
                                            {selectedBusiness.name[0].toUpperCase()}
                                        </div>
                                        <div className="space-y-1">
                                            <h2 className="text-xl font-bold text-white leading-tight">{selectedBusiness.name}</h2>
                                            <Badge className="bg-pink-600 text-white font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 border-none">Healthcare Business</Badge>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-8 space-y-8">
                                    <div className="space-y-4">
                                        {selectedBusiness.subscription && (
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-500">Active Plan</p>
                                                <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                                                    <p className="text-sm font-bold text-white uppercase">{selectedBusiness.subscription.tier.name}</p>
                                                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Price: £{selectedBusiness.subscription.tier.price}</p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Email</p>
                                            <p className="text-sm font-bold text-white truncate">{selectedBusiness.email}</p>
                                        </div>
                                    </div>

                                    <Separator className="bg-white/5" />

                                    <div className="space-y-4">
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Documents</p>
                                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-900 shadow-xl group-hover:scale-110 transition-transform">
                                                    <FileText size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-white truncate max-w-[120px]">{selectedBusiness.document || "Business_Details.pdf"}</p>
                                                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Verification Doc</p>
                                                </div>
                                            </div>
                                            <Download size={16} className="text-slate-500 group-hover:text-white" />
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="p-8 pt-0 mt-auto bg-white/[0.01] border-t border-white/5">
                                    <div className="grid grid-cols-2 gap-4 w-full pt-6">
                                        <Button 
                                            onClick={() => handleApprove(selectedBusiness.id)}
                                            disabled={actionLoading !== null}
                                            className="h-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold uppercase tracking-wider text-[10px] gap-2 shadow-lg transition-all"
                                        >
                                            {actionLoading === 'APPROVE' ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={18} />}
                                            Approve
                                        </Button>
                                        <Button 
                                            onClick={() => handleReject(selectedBusiness.id)}
                                            disabled={actionLoading !== null}
                                            className="h-12 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold uppercase tracking-wider text-[10px] gap-2 shadow-lg transition-all"
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
