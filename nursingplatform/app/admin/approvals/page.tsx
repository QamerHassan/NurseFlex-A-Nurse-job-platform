"use client";
import React, { useEffect, useState } from 'react';
import { 
    Loader2, ShieldCheck, Mail, 
    Phone, Trash2, Activity,
    ShieldAlert, Search, Filter,
    Building2, Users, Download,
    CheckCircle, Globe, Zap,
    Database, ArrowUpRight, MoreVertical
} from 'lucide-react';

import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Separator } from "@/app/components/ui/separator";

export default function VerifiedDirectoryPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    const businesses = JSON.parse(localStorage.getItem('active_business_accounts') || '[]');
    const nurses = JSON.parse(localStorage.getItem('verified_nurses') || '[]');

    const unified = [
      ...businesses.map((b: any) => ({ ...b, type: 'Business', title: b.name, category: 'Healthcare Facility' })),
      ...nurses.map((n: any) => ({ ...n, type: 'Nurse', title: n.name, category: n.specialization || 'Registered Nurse' }))
    ];

    setProviders(unified);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    window.addEventListener('storage', fetchData);
    return () => window.removeEventListener('storage', fetchData);
  }, []);

  const generateDemoValues = () => {
    const demoNurses = [
      { id: 'd1', name: "Sarah Jenkins", email: "sarah.j@flex.com", specialization: "Critical Care", type: 'Nurse' },
      { id: 'd2', name: "Marcus Wright", email: "m.wright@icu.net", specialization: "ICU Specialist", type: 'Nurse' }
    ];
    const demoBusiness = [
      { id: 'b1', name: "St. Mary's Hospital", email: "admin@stmarys.org", type: 'Business' },
      { id: 'b2', name: "City Care Clinic", email: "ops@citycare.com", type: 'Business' }
    ];

    localStorage.setItem('verified_nurses', JSON.stringify(demoNurses));
    localStorage.setItem('active_business_accounts', JSON.stringify(demoBusiness));
    fetchData();
  };

  const removeEntry = (id: any, type: string) => {
    if (!confirm("Are you sure you want to remove this verified account?")) return;
    const key = type === 'Business' ? 'active_business_accounts' : 'verified_nurses';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = existing.filter((item: any) => item.id !== id);
    localStorage.setItem(key, JSON.stringify(updated));
    fetchData();
  };

  if (loading) return (
    <div className="flex h-[60vh] flex-col items-center justify-center space-y-6">
        <div className="relative">
            <div className="absolute inset-0 bg-pink-500 blur-2xl opacity-10 animate-pulse"></div>
            <Loader2 className="animate-spin text-pink-500 relative z-10" size={48} />
        </div>
        <p className="text-sm font-medium text-slate-400">Loading directory...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900">Verified Network</h1>
            <p className="text-sm text-slate-500 font-medium">Directory of verified healthcare providers and nurses.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <Button 
                onClick={generateDemoValues}
                variant="outline" 
                className="h-10 px-4 rounded-xl border-slate-200 font-bold uppercase tracking-wider text-[10px] gap-2 text-slate-500 hover:text-pink-600 hover:border-pink-200 transition-all"
            >
                Add Demo Data <Zap size={14} />
            </Button>
            <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-xl shadow-md">
                <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center text-white">
                    <ShieldCheck size={18} />
                </div>
                <div>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-slate-500">Verified Total</p>
                    <p className="text-lg font-bold text-white leading-none">{providers.length}</p>
                </div>
            </div>
        </div>
      </header>

      {/* Main Grid Directory */}
      <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="p-8 border-b border-slate-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
                <CardTitle className="text-xl font-bold text-slate-900">Active Records</CardTitle>
                <CardDescription className="text-xs font-medium text-slate-400">Manage all verified accounts on the platform</CardDescription>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 w-full md:w-80">
                <Search className="text-slate-400" size={16} />
                <Input 
                    placeholder="Search records..." 
                    className="border-none focus-visible:ring-0 font-medium text-sm bg-transparent placeholder:text-slate-400 p-0 h-8"
                />
            </div>
        </CardHeader>
        <CardContent className="p-0">
          {providers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-50 bg-slate-50/30">
                    <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-400">Account</th>
                    <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-400">Type</th>
                    <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {providers.map((req) => (
                    <tr key={`${req.type}-${req.id}`} className="group hover:bg-slate-50/50 transition-all">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-sm ${req.type === 'Business' ? 'bg-indigo-600' : 'bg-pink-600'}`}>
                                {req.type === 'Business' ? <Building2 size={20} /> : <Users size={20} />}
                            </div>
                            <div className="space-y-0.5">
                                <p className="font-bold text-slate-900 group-hover:text-pink-600 transition-colors">{req.title}</p>
                                <p className="text-xs text-slate-500 font-medium">{req.email}</p>
                            </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge className={`h-7 px-3 rounded-lg font-bold text-[9px] uppercase tracking-widest border-none ${req.type === 'Business' ? 'bg-indigo-50 text-indigo-600' : 'bg-pink-50 text-pink-600'}`}>
                          {req.type}
                        </Badge>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex justify-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeEntry(req.id, req.type)}
                                className="h-10 w-10 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                                <Trash2 size={18} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg text-slate-300 hover:text-slate-900">
                                <MoreVertical size={18} />
                            </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
             <div className="p-20 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full mx-auto flex items-center justify-center text-slate-200">
                    <Globe size={32} />
                </div>
                <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900">Directory is empty</h3>
                    <p className="text-sm text-slate-400 font-medium">Verify some accounts to see them here.</p>
                </div>
                <Button onClick={generateDemoValues} variant="ghost" className="text-pink-600 font-bold uppercase text-[10px] tracking-widest">Load Sample Data</Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-8 border-t border-slate-50 bg-slate-50/20 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                <span>Network Live</span>
             </div>
             <p className="text-slate-300">NurseFlex Admin</p>
        </CardFooter>
      </Card>

      <footer className="pt-10 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">End of Directory</p>
      </footer>
    </div>
  );
}
