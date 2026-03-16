"use client";
import React from 'react';
import { 
    Settings, Shield, User, Globe, 
    Bell, Database, Lock, Palette,
    ChevronRight, Save, ShieldCheck
} from 'lucide-react';
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Separator } from "@/app/components/ui/separator";
import { Badge } from "@/app/components/ui/badge";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight italic uppercase">System Settings</h1>
            <p className="text-sm text-slate-500 font-medium tracking-wide">Configure portal branding, security parameters, and admin profiles.</p>
        </div>
        <Button className="bg-[#ec4899] hover:bg-[#db2777] text-white font-bold h-12 px-8 rounded-xl flex items-center gap-2 shadow-lg shadow-pink-100 transition-all active:scale-95">
           <Save size={18} /> Save Changes
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Side Navigation */}
          <div className="lg:col-span-1 space-y-4">
              <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2rem] overflow-hidden">
                  <div className="p-4 space-y-1">
                      {[
                          { icon: Palette, label: 'Portal Branding', active: true },
                          { icon: Shield, label: 'Security & Access', active: false },
                          { icon: User, label: 'Admin Profiles', active: false },
                          { icon: Bell, label: 'Notifications Setup', active: false },
                          { icon: Database, label: 'System Logs', active: false }
                      ].map((item, idx) => (
                          <button 
                            key={idx}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${item.active ? 'bg-pink-50 text-[#ec4899]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                          >
                            <div className="flex items-center gap-3">
                                <item.icon size={18} />
                                <span className="text-sm font-bold tracking-tight">{item.label}</span>
                            </div>
                            {item.active && <div className="w-1.5 h-1.5 bg-[#ec4899] rounded-full" />}
                          </button>
                      ))}
                  </div>
              </Card>

              <Card className="border-none bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                      <ShieldCheck size={80} />
                  </div>
                  <div className="relative z-10 space-y-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink-400">Security Pulse</p>
                      <h3 className="text-xl font-bold tracking-tight italic uppercase">System Level 9</h3>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed">
                          Your administrative session is protected by end-to-end encryption and master bypass tokens.
                      </p>
                  </div>
              </Card>
          </div>

          {/* Main Settings Content */}
          <div className="lg:col-span-2 space-y-8">
              <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2.5rem] p-10">
                  <CardHeader className="p-0 mb-10">
                      <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight italic uppercase">Portal Branding</CardTitle>
                      <CardDescription className="text-sm font-medium text-slate-400">Customize how the portal appears to other administrators.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 space-y-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Portal Name</label>
                              <Input placeholder="NurseFlex Admin Master" className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold text-slate-900" />
                          </div>
                          <div className="space-y-3">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Support Email</label>
                              <Input placeholder="admin@nurseflex.com" className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold text-slate-900" />
                          </div>
                      </div>

                      <Separator className="bg-slate-50" />

                      <div className="space-y-6">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Primary Theme Color</label>
                            <div className="flex flex-wrap gap-4">
                                {['#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#6366f1'].map(color => (
                                    <button 
                                        key={color}
                                        className={`w-14 h-14 rounded-2xl border-4 transition-all hover:scale-110 active:scale-90 ${color === '#ec4899' ? 'border-pink-100 shadow-xl' : 'border-transparent'}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                      </div>

                      <Separator className="bg-slate-50" />

                      <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                          <div className="space-y-1">
                              <p className="text-sm font-bold text-slate-900">Maintenance Mode</p>
                              <p className="text-xs font-medium text-slate-400">Take the portal offline for synchronization.</p>
                          </div>
                          <div className="w-14 h-8 bg-slate-200 rounded-full relative p-1 cursor-pointer">
                              <div className="w-6 h-6 bg-white rounded-full shadow-sm" />
                          </div>
                      </div>
                  </CardContent>
              </Card>

              <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2.5rem] p-10">
                  <CardHeader className="p-0 mb-8 flex flex-row items-center justify-between">
                      <div>
                          <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight italic uppercase">Access Control</CardTitle>
                          <CardDescription className="text-sm font-medium text-slate-400">Manage who can view and edit platform data.</CardDescription>
                      </div>
                      <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold uppercase tracking-widest text-[9px] px-3">Enhanced</Badge>
                  </CardHeader>
                  <CardContent className="p-0">
                      <div className="space-y-4">
                          {[
                              { label: 'Two-Factor Authentication', desc: 'Secure logins with mobile verification.', enabled: true },
                              { label: 'IP Whitelisting', desc: 'Restrict access to specific network clusters.', enabled: false },
                              { label: 'Session Persistence', desc: 'Maintain master credentials across tabs.', enabled: true }
                          ].map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-all rounded-3xl cursor-pointer group">
                                  <div className="space-y-1">
                                      <p className="text-sm font-bold text-slate-900 group-hover:text-[#ec4899] transition-colors">{item.label}</p>
                                      <p className="text-xs font-medium text-slate-400">{item.desc}</p>
                                  </div>
                                  <ChevronRight size={18} className="text-slate-200 group-hover:text-[#ec4899] transition-all" />
                              </div>
                          ))}
                      </div>
                  </CardContent>
              </Card>
          </div>
      </div>
    </div>
  );
}
