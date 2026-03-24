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
    const router = require('next/navigation').useRouter();
    
    React.useEffect(() => {
        const timer = setTimeout(() => router.push('/admin/dashboard'), 3000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="flex h-[60vh] flex-col items-center justify-center space-y-6 text-center p-10">
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 shadow-sm">
                <ShieldAlert size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">Approved Workflow Shifted</h2>
            <p className="text-slate-500 font-medium max-w-md mx-auto">
                Job reviews and application approvals have been moved to the **Business Dashboard**. Business owners are now responsible for reviewing and approving their own job posts and applicants.
            </p>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest pt-4">
                <Loader2 className="animate-spin" size={14} />
                Redirecting to dashboard...
            </div>
        </div>
    );
}
