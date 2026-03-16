"use client";
import React, { useState, useEffect } from 'react';
import { 
    Loader2, Zap, ShieldCheck, 
    DollarSign, Briefcase, CheckCircle2, 
    XCircle, Plus, Trash2, 
    Activity, Globe, Database,
    MoreVertical, Save, Trash,
    BarChart3, Layers, Star,
    ArrowUpRight, ChevronRight
} from 'lucide-react';

import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Separator } from "@/app/components/ui/separator";
import { Checkbox } from "../../components/ui/checkbox";

import api from '@/lib/api';

export default function AdminTiersPage() {
  const [tiers, setTiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchTiers = async () => {
    try {
      const res = await api.get('/tiers');
      setTiers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTiers(); }, []);

  const addTier = async () => {
    try {
      const token = sessionStorage.getItem("admin_token");
      const res = await api.post('/tiers', {
        name: "Premium Plus",
        price: 99,
        jobsLimit: 10,
        features: ["Priority Listing", "Direct Support"],
        isPopular: false
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 201 || res.status === 200) fetchTiers();
    } catch (err) {
      alert("Failed to create tier.");
    }
  };

  const deleteTier = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subscription tier?")) return;
    try {
      const token = sessionStorage.getItem("admin_token");
      const res = await api.delete(`/tiers/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 200 || res.status === 204) setTiers(tiers.filter(t => t.id !== id));
    } catch (err) {
      alert("Error deleting tier.");
    }
  };

  const handleUpdate = (id: string, field: string, value: any) => {
    setTiers(prev => prev.map(t => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const saveChanges = async (tier: any) => {
    setSavingId(tier.id);
    try {
      const token = sessionStorage.getItem("admin_token");
      await api.put(`/tiers/${tier.id}`, {
        name: tier.name,
        price: Number(tier.price),
        jobsLimit: Number(tier.jobsLimit),
        isPopular: Boolean(tier.isPopular),
        features: typeof tier.features === 'string' ? tier.features.split(',').map((s: string) => s.trim()) : tier.features
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      alert("Save Failed.");
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return (
    <div className="flex h-[60vh] flex-col items-center justify-center space-y-6">
        <div className="relative">
            <div className="absolute inset-0 bg-pink-500 blur-2xl opacity-10 animate-pulse"></div>
            <Loader2 className="animate-spin text-pink-500 relative z-10" size={48} />
        </div>
        <p className="text-sm font-medium text-slate-400">Loading plans...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900">Subscription Plans</h1>
            <p className="text-sm text-slate-500 font-medium">Manage business pricing and job posting limits.</p>
        </div>

        <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active</span>
            </div>
            <Button 
                onClick={addTier}
                className="h-12 px-6 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm gap-2 transition-all active:scale-95"
            >
                <Plus size={18} /> Add New Plan
            </Button>
        </div>
      </header>

      {/* Main Table */}
      <div className="grid grid-cols-1 gap-6">
        {tiers.length > 0 ? (
          tiers.map((tier) => (
            <Card 
                key={tier.id} 
                className={`border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white transition-all duration-300 hover:shadow-md ${tier.isPopular ? 'ring-2 ring-pink-500/20' : ''}`}
            >
                <CardContent className="p-8 flex flex-col xl:flex-row gap-8 items-start xl:items-center">
                    {/* Identifier Block */}
                    <div className="flex-1 w-full flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tier.isPopular ? 'bg-pink-600 text-white' : 'bg-slate-900 text-white'}`}>
                            {tier.isPopular ? <Star size={20} /> : <Layers size={20} />}
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Plan Name</p>
                            <Input 
                                value={tier.name}
                                onChange={(e) => handleUpdate(tier.id, 'name', e.target.value)}
                                className="h-8 p-0 border-none bg-transparent text-xl font-bold text-slate-900 focus-visible:ring-0"
                            />
                        </div>
                    </div>

                    {/* Inputs */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full xl:w-auto">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price ($)</p>
                            <div className="relative">
                               <DollarSign size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400" />
                               <Input 
                                    type="number"
                                    value={tier.price}
                                    onChange={(e) => handleUpdate(tier.id, 'price', e.target.value)}
                                    className="h-9 pl-5 border-none bg-transparent text-base font-bold text-slate-900 focus-visible:ring-0"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Job Limit</p>
                            <div className="relative">
                               <Briefcase size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400" />
                               <Input 
                                    type="number"
                                    value={tier.jobsLimit}
                                    onChange={(e) => handleUpdate(tier.id, 'jobsLimit', e.target.value)}
                                    className="h-9 pl-5 border-none bg-transparent text-base font-bold text-slate-900 focus-visible:ring-0"
                                />
                            </div>
                        </div>
                        <div className="space-y-1 col-span-2 lg:col-span-1 min-w-[180px]">
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Features (Comma Sep)</p>
                             <Input 
                                type="text"
                                value={Array.isArray(tier.features) ? tier.features.join(', ') : tier.features}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdate(tier.id, 'features', e.target.value)}
                                className="h-9 p-0 border-none bg-transparent text-xs font-semibold text-slate-600 focus-visible:ring-0"
                                placeholder="Edit features..."
                            />
                        </div>
                        <div className="flex items-center gap-4">
                             <div className="flex flex-col gap-1.5">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Highlight</p>
                                <div className="flex items-center gap-2">
                                    <Checkbox 
                                        id={`pop-${tier.id}`}
                                        checked={tier.isPopular}
                                        onCheckedChange={(checked: boolean) => handleUpdate(tier.id, 'isPopular', checked)}
                                        className="w-5 h-5 rounded-md border-slate-200"
                                    />
                                    <label htmlFor={`pop-${tier.id}`} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer">Popular</label>
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 w-full xl:w-auto">
                        <Button 
                            onClick={() => saveChanges(tier)}
                            disabled={savingId === tier.id}
                            className="h-12 flex-1 xl:w-40 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm shadow-xl shadow-pink-100 gap-2 transition-all active:scale-95"
                        >
                            {savingId === tier.id ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            {savingId === tier.id ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => deleteTier(tier.id)}
                            className="h-12 w-12 rounded-xl text-slate-300 hover:text-red-600 hover:bg-red-50"
                        >
                            <Trash2 size={20} />
                        </Button>
                    </div>
                </CardContent>
            </Card>
          ))
        ) : (
          <div className="p-20 text-center space-y-4 border-2 border-dashed border-slate-100 rounded-3xl">
            <p className="text-slate-400 font-medium">No subscription plans found.</p>
            <Button onClick={addTier} variant="outline" className="text-pink-600 border-pink-100 hover:bg-pink-50 rounded-xl">Create My First Plan</Button>
          </div>
        )}
      </div>

      <footer className="pt-10 text-center">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">NurseFlex Subscription Management</p>
      </footer>
    </div>
  );
}