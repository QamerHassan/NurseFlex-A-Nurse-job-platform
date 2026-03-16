"use client";
import React, { useState, useEffect } from 'react';
import {
  Loader2, Search, Users,
  Trash2, CheckCircle2, MapPin,
  Mail, Briefcase, Activity,
  ShieldCheck, Globe, Database,
  MoreVertical, UserCircle, Shield,
  ArrowUpRight, Fingerprint, Calendar,
  Navigation, UserPlus, Download
} from 'lucide-react';

import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Separator } from "@/app/components/ui/separator";

import api from '@/lib/api';

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const token = sessionStorage.getItem("admin_token");
      const res = await api.get('/users/all-nurses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete user "${name}"?`)) return;
    setDeleting(id);
    try {
      const token = sessionStorage.getItem("admin_token");
      const res = await api.delete(`/users/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 200 || res.status === 204) {
        setUsers(prev => prev.filter(u => u.id !== id));
      }
    } catch (err) {
      alert("Failed to delete user.");
    } finally {
      setDeleting(null);
    }
  };

  const filtered = users.filter(u =>
    (u.name || u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex h-[60vh] flex-col items-center justify-center space-y-6">
        <div className="relative">
            <div className="absolute inset-0 bg-pink-500 blur-2xl opacity-10 animate-pulse"></div>
            <Loader2 className="animate-spin text-pink-500 relative z-10" size={48} />
        </div>
        <p className="text-sm font-medium text-slate-400">Loading users...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900">User Directory</h1>
            <p className="text-sm text-slate-500 font-medium">Manage and view all registered users and their activity.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm w-full sm:w-80 transition-all focus-within:ring-2 focus-within:ring-pink-500/10 focus-within:border-pink-500/30">
                <Search className="text-slate-400" size={18} />
                <Input 
                    placeholder="Search by name or email..." 
                    className="h-10 border-none focus-visible:ring-0 font-medium text-sm bg-transparent placeholder:text-slate-400 p-0" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <Button 
                variant="outline"
                className="h-12 px-6 rounded-xl border-slate-200 font-bold text-sm gap-2 text-slate-600 hover:text-slate-900 transition-all"
            >
                <Download size={18} /> Export List
            </Button>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl">
            <CardContent className="p-8 space-y-4">
                <div className="flex justify-between items-center">
                    <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600">
                        <Users size={24} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Users</span>
                </div>
                <div>
                    <p className="text-4xl font-bold text-slate-900">{users.length}</p>
                    <p className="text-xs text-slate-400 font-medium">Registered members</p>
                </div>
            </CardContent>
        </Card>
        <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl">
            <CardContent className="p-8 space-y-4">
                <div className="flex justify-between items-center">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                        <CheckCircle2 size={24} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Onboarded</span>
                </div>
                <div>
                    <p className="text-4xl font-bold text-green-600">{users.filter(u => u.isOnboarded).length}</p>
                    <p className="text-xs text-slate-400 font-medium">Completed profiles</p>
                </div>
            </CardContent>
        </Card>
        <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl">
            <CardContent className="p-8 space-y-4">
                <div className="flex justify-between items-center">
                    <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600">
                        <Activity size={24} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Applications</span>
                </div>
                <div>
                    <p className="text-4xl font-bold text-pink-600">
                        {users.reduce((acc, u) => acc + (u.applicationCount || 0), 0)}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">Total job interest</p>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* User Table */}
      <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-900">Registered Users</CardTitle>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time Data</span>
            </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/30">
                  <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-400">User</th>
                  <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-400">Location</th>
                  <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-400">Applications</th>
                  <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">Status</th>
                  <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-20 text-center text-slate-400 font-medium">
                      No users found.
                    </td>
                  </tr>
                ) : filtered.map((user) => (
                  <tr key={user.id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white text-lg font-bold">
                             {(user.name || user.email || '?')[0].toUpperCase()}
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900 group-hover:text-pink-600 transition-colors">{user.name || "Unnamed User"}</p>
                          <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                         <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <MapPin size={14} className="text-slate-400" />
                            {user.location || "Not set"}
                         </span>
                    </td>
                    <td className="px-8 py-6">
                        <Badge variant="outline" className="h-8 px-3 rounded-lg border-slate-100 text-pink-600 text-xs font-bold bg-pink-50/30 gap-2">
                            <Briefcase size={12} /> {user.applicationCount || 0}
                        </Badge>
                    </td>
                    <td className="px-8 py-6 text-center">
                        <Badge className={`h-8 px-4 rounded-lg font-bold text-[10px] uppercase tracking-wider ${user.isOnboarded ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                            {user.isOnboarded ? 'Onboarded' : 'Pending'}
                        </Badge>
                    </td>
                    <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(user.id, user.name || user.email)}
                                disabled={deleting === user.id}
                                className="h-10 w-10 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            >
                                {deleting === user.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={18} />}
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
        </CardContent>
        <CardFooter className="p-8 border-t border-slate-50 bg-slate-50/20 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
             <div>User Directory • Cloud Synced</div>
             <div className="flex items-center gap-4">
                 <span>Status: Optimized</span>
             </div>
        </CardFooter>
      </Card>
    </div>
  );
}

