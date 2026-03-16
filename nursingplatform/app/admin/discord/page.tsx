"use client";
import React, { useState } from 'react';
import { 
    Loader2, MessageSquare, Users, 
    ShieldCheck, Zap, Activity,
    Globe, Database, ExternalLink,
    MoreVertical, RefreshCw, Smartphone,
    Lock, CheckCircle2, XCircle,
    UserPlus, Hash, Send
} from 'lucide-react';

import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Separator } from "@/app/components/ui/separator";

export default function AdminDiscordManager() {
  const DISCORD_SERVER_ID = "1346424355554627685"; 
  const DISCORD_CHANNEL_ID = "1346424356028842130"; 

  const [members, setMembers] = useState([
    { id: 1, name: "Bilal Sherazi", discordTag: "Bilal#1234", status: "Verified", role: "Elite Nurse", joined: "2 mins ago" },
    { id: 2, name: "Sara Ahmed", discordTag: "Sara_RN", status: "Pending Sync", role: "None", joined: "1 hour ago" },
    { id: 3, name: "John Doe", discordTag: "JD_Health", status: "Verified", role: "Business Owner", joined: "Yesterday" },
  ]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Header Hub */}
      <header className="flex flex-col lg:flex-row justify-between items-end gap-12 border-b border-slate-100 pb-12">
        <div className="text-center lg:text-left space-y-4">
            <div className="flex items-center gap-6 justify-center lg:justify-start mb-2">
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Discord Community</h1>
                <Badge className="bg-[#5865F2] font-bold text-[10px] px-3 shadow-lg border-none text-white">Discord Integration</Badge>
            </div>
            <p className="text-slate-500 font-medium text-sm">Manage Discord server members and integration settings</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
            <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full border border-slate-100 shadow-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-[10px] font-bold text-slate-400">Bot Status: Active</span>
            </div>
            <Button 
                className="h-16 px-8 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm gap-3 shadow-2xl transition-all active:scale-95 group"
            >
                Sync Members <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
            </Button>
        </div>
      </header>

      {/* Primary Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* LEFT: Discord Live Interface */}
        <div className="xl:col-span-5 space-y-8">
            <Card className="border-none shadow-[0_64px_128px_-32px_rgba(0,0,0,0.1)] bg-slate-950 rounded-[4rem] overflow-hidden sticky top-24">
                <CardHeader className="p-10 border-b border-white/5 bg-slate-950 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/10">
                            <MessageSquare size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold tracking-tight text-white">Discord Live</CardTitle>
                            <CardDescription className="text-xs font-medium text-slate-400">Communication Hub</CardDescription>
                        </div>
                    </div>
                    <Badge variant="outline" className="border-emerald-500/20 text-emerald-500 text-[10px] font-bold bg-emerald-500/5 px-3 py-1">Authorized</Badge>
                </CardHeader>
                <CardContent className="p-8 h-[650px] relative">
                    <div className="absolute top-12 right-12 z-10 pointer-events-none">
                         <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-2xl">
                            <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                            <span className="text-[10px] font-bold text-white">Live</span>
                         </div>
                    </div>
                    <div className="w-full h-full rounded-[2.5rem] overflow-hidden border-8 border-slate-900 shadow-inner bg-slate-900">
                        <iframe 
                            src={`https://e.widgetbot.io/channels/${DISCORD_SERVER_ID}/${DISCORD_CHANNEL_ID}`} 
                            className="w-full h-full"
                            allow="clipboard-write; fullscreen"
                        ></iframe>
                    </div>
                </CardContent>
                <CardFooter className="p-8 border-t border-white/5 bg-slate-900/30 flex items-center justify-center">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] italic uppercase">End of communication buffer</p>
                </CardFooter>
            </Card>
        </div>

        {/* RIGHT: Member Matrix & Analytics */}
        <div className="xl:col-span-7 space-y-10">
            {/* Sector Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-none shadow-2xl shadow-slate-100 bg-white rounded-[3rem] overflow-hidden group hover:scale-[1.02] transition-all">
                    <CardContent className="p-10 space-y-6">
                        <div className="flex justify-between items-center">
                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-[#5865F2] shadow-xl shadow-pink-100 transition-transform group-hover:rotate-12">
                                <Users size={28} strokeWidth={2.5} />
                            </div>
                            <Badge variant="ghost" className="text-[9px] font-black uppercase italic text-slate-300">Total Nodes</Badge>
                        </div>
                        <div>
                            <p className="text-5xl font-bold tracking-tight text-slate-900">1,240</p>
                            <p className="text-xs font-bold text-slate-400">Integrated Members</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-2xl shadow-slate-100 bg-white rounded-[3rem] overflow-hidden group hover:scale-[1.02] transition-all">
                    <CardContent className="p-10 space-y-6">
                        <div className="flex justify-between items-center">
                            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-xl shadow-emerald-100 transition-transform group-hover:rotate-12">
                                <Activity size={28} strokeWidth={2.5} />
                            </div>
                            <Badge variant="ghost" className="text-[10px] font-bold text-slate-300">Sync Rate</Badge>
                        </div>
                        <div>
                            <p className="text-5xl font-bold tracking-tight text-emerald-600">98%</p>
                            <p className="text-xs font-bold text-slate-400">Success Rate</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Member Manifest Matrix */}
            <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] bg-white rounded-[4rem] overflow-hidden">
                <CardHeader className="p-12 border-b border-slate-50 flex flex-row items-center justify-between bg-slate-50/30">
                    <div>
                        <CardTitle className="text-2xl font-bold tracking-tight">Member Sync</CardTitle>
                        <CardDescription className="text-xs font-medium text-slate-500">View and manage synchronized community members</CardDescription>
                    </div>
                    <Button variant="ghost" className="h-12 w-12 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400">
                        <Hash size={18} />
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="px-10 py-6 text-xs font-bold text-slate-400">Member</th>
                                    <th className="px-10 py-6 text-xs font-bold text-slate-400 text-center">Status</th>
                                    <th className="px-10 py-6 text-xs font-bold text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {members.map((member) => (
                                    <tr key={member.id} className="group hover:bg-slate-50/50 transition-all">
                                        <td className="px-10 py-10">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white text-xl font-black italic shadow-xl group-hover:rotate-6 transition-transform overflow-hidden relative">
                                                     <div className="absolute inset-0 bg-[#5865F2]/20 blur-xl"></div>
                                                     <span className="relative z-10">{member.name[0]}</span>
                                                </div>
                                                 <div className="space-y-1">
                                                    <p className="font-bold text-slate-900 text-base">{member.name}</p>
                                                    <p className="text-xs font-medium text-pink-600 flex items-center gap-2">
                                                        <Hash size={12} className="text-slate-300" /> {member.discordTag}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-10 text-center">
                                            <div className="flex justify-center">
                                                 <Badge className={`h-10 px-6 rounded-2xl font-bold text-xs border shadow-sm ${
                                                    member.status === 'Verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                                                }`}>
                                                    {member.status}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="px-10 py-10 text-right">
                                            <div className="flex justify-end gap-3 items-center">
                                                 <Button
                                                    variant="ghost"
                                                    className="h-14 px-6 bg-slate-50 text-slate-400 rounded-2xl font-bold text-xs hover:text-slate-900 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-100"
                                                >
                                                    <RefreshCw size={18} className="mr-2" /> Sync
                                                </Button>
                                                 <Button
                                                    variant="ghost"
                                                    className="h-14 px-6 bg-red-50 text-red-500 rounded-2xl font-bold text-xs hover:text-white hover:bg-red-600 transition-all border border-red-50 hover:border-red-600"
                                                >
                                                    <XCircle size={18} className="mr-2" /> Remove
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl text-slate-200 hover:text-slate-900 transition-all">
                                                    <MoreVertical size={20} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
                <CardFooter className="p-12 border-t border-slate-50 bg-slate-50/20 flex items-center justify-between">
                     <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full border border-slate-100 shadow-sm">
                        <Lock size={12} className="text-slate-300" />
                        <span className="text-[10px] font-bold text-slate-400">Secure connection active</span>
                     </div>
                </CardFooter>
            </Card>
        </div>
      </div>

      <footer className="pt-20 text-center">
            <p className="text-[10px] font-bold text-slate-200 uppercase tracking-[0.4em]">Discord Management Portal</p>
      </footer>
    </div>
  );
}