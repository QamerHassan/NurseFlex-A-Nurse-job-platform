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
      <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">Applications Management Shifted</h2>
      <p className="text-slate-500 font-medium max-w-md mx-auto">
        Individual application management has been moved to the **Business Dashboard**. Business owners are now responsible for reviewing, and approving/rejecting all candidates for their own job posts.
      </p>
      <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest pt-4">
        <Loader2 className="animate-spin" size={14} />
        Redirecting to dashboard...
      </div>
    </div>
  );
}

