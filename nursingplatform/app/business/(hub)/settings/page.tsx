"use client";
import React, { useState } from 'react';
import { 
    Settings, Bell, Shield, Trash2, 
    Save, Loader2, CheckCircle2, AlertCircle,
    Zap, Globe, Clock, Smartphone,
    Check, X, Eye, EyeOff, Lock, User, Users,
    Plus, CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { Checkbox } from "@/app/components/ui/checkbox";
import { 
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import { clearAllUserData } from '@/lib/auth-utils';

export default function BusinessSettings() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [teamMembers, setTeamMembers] = useState([
    { name: 'Sarah Wilson', role: 'Administrator', email: 'sarah@manchester-central.io' },
    { name: 'Michael Chen', role: 'Editor', email: 'michael@manchester-central.io' }
  ]);

  const showFeedback = (msg: string) => {
    setSuccessMessage(msg);
    setSuccess(true);
    setTimeout(() => {
        setSuccess(false);
        setSuccessMessage("");
    }, 3000);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
        setSaving(false);
        showFeedback("Settings updated successfully.");
    }, 1500);
  };

  const handleAddMember = () => {
    const newMember = {
        name: 'New Member',
        role: 'Viewer',
        email: `member-${teamMembers.length + 1}@manchester-central.io`
    };
    setTeamMembers([...teamMembers, newMember]);
    showFeedback("New team member invited.");
  };

  const handleRemoveMember = (email: string) => {
    setTeamMembers(teamMembers.filter(m => m.email !== email));
    showFeedback("Team member removed.");
  };

  const handleDeleteAccount = () => {
    setSaving(true);
    setTimeout(() => {
        clearAllUserData();
        router.push('/business/login');
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-slate-100 pb-12">
        <div className="text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start mb-4">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Settings</h1>
          </div>
          <p className="text-slate-500 font-medium text-sm">Manage your business profile, notifications, and security settings</p>
        </div>
        <Button 
            onClick={handleSave} 
            disabled={saving}
            className="h-16 px-10 rounded-2xl bg-[#ec4899] hover:bg-[#db2777] font-bold text-sm shadow-2xl transition-all"
        >
            {saving ? <Loader2 className="animate-spin" /> : <div className="flex items-center gap-3"><Save size={18} /> Save Changes</div>}
        </Button>
      </header>

      {success && (
        <div className="p-6 rounded-[2rem] bg-emerald-50 border border-emerald-100/50 text-emerald-700 flex items-center gap-4 shadow-2xl shadow-emerald-50 animate-in slide-in-from-top-4 sticky top-4 z-50">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                <CheckCircle2 size={20} />
            </div>
            <span className="font-bold text-sm">{successMessage || "Settings updated successfully."}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar Nav Settings (Internal) */}
        <aside className="lg:col-span-3 space-y-4">
            {[
                { label: 'My Profile', icon: User, active: true },
                { label: 'Notifications', icon: Bell, active: false },
                { label: 'Security Settings', icon: Lock, active: false },
                { label: 'Device Settings', icon: Smartphone, active: false },
            ].map((item) => (
                <button 
                    key={item.label}
                    className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all font-bold text-xs ${
                        item.active ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-400 hover:bg-slate-50'
                    }`}
                >
                    <item.icon size={16} />
                    {item.label}
                </button>
            ))}
        </aside>

        {/* Main Settings Body */}
        <div className="lg:col-span-9 space-y-10">
            <Card id="profile" className="border-none shadow-sm bg-white rounded-[3rem] overflow-hidden scroll-mt-10">
                <CardHeader className="p-10 pb-0">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-10 h-10 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center">
                            <User size={20} />
                        </div>
                        <CardTitle className="text-xl font-bold tracking-tight">Business Profile</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-10 space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3 px-2">
                            <Label className="text-xs font-bold text-slate-600">Business Name</Label>
                            <Input defaultValue="Manchester Central Hub" className="h-14 rounded-2xl bg-slate-50/50 border-slate-100 font-bold text-slate-900 focus-visible:ring-0 focus-visible:bg-white transition-all" />
                        </div>
                        <div className="space-y-3 px-2">
                            <Label className="text-xs font-bold text-slate-600">Contact Email</Label>
                            <Input defaultValue="hr@manchester-central.io" className="h-14 rounded-2xl bg-slate-50/50 border-slate-100 font-bold text-slate-900 focus-visible:ring-0 focus-visible:bg-white transition-all" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card id="billing" className="border-none shadow-sm bg-white rounded-[3rem] overflow-hidden scroll-mt-10">
                <CardHeader className="p-10 pb-0">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                            <Shield size={20} />
                        </div>
                        <CardTitle className="text-xl font-bold tracking-tight">Billing & Payments</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-10 space-y-6">
                    <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-50/50 border border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <Zap size={20} className="text-pink-500 fill-pink-500" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">Current Plan: Pro Max</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Renewal on April 12, 2026</p>
                            </div>
                        </div>
                        <Link href="/business/subscriptions">
                            <Button variant="outline" className="h-10 px-6 rounded-lg font-bold text-xs">Manage Plan</Button>
                        </Link>
                    </div>

                    <div className="pt-4">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Saved Payment Methods</h4>
                        <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-100">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-6 bg-slate-900 rounded flex items-center justify-center text-[8px] text-white font-bold italic">VISA</div>
                                <span className="text-sm font-bold text-slate-700">•••• •••• •••• 4242</span>
                             </div>
                             <Badge variant="ghost" className="text-[10px] font-bold text-slate-400">Default</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card id="team" className="border-none shadow-sm bg-white rounded-[3rem] overflow-hidden scroll-mt-10">
                <CardHeader className="p-10 pb-0">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-10 h-10 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center">
                            <Users size={20} />
                        </div>
                        <CardTitle className="text-xl font-bold tracking-tight">Team Management</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-10 space-y-6">
                    <div className="space-y-4">
                        {teamMembers.map((member) => (
                            <div key={member.email} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50/50 border border-slate-100 transition-hover hover:bg-white hover:shadow-lg duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">{member.name[0]}</div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{member.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{member.role}</p>
                                    </div>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleRemoveMember(member.email)}
                                    className="h-8 px-4 rounded-lg text-[10px] font-bold uppercase tracking-tight text-slate-400 hover:text-red-500"
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                    </div>
                    <Button 
                        variant="outline" 
                        onClick={handleAddMember}
                        className="w-full h-14 rounded-2xl border-slate-200 border-dashed hover:border-[#ec4899] hover:bg-pink-50/30 font-bold text-slate-400 hover:text-[#ec4899] transition-all"
                    >
                        <Plus size={18} className="mr-2" /> Add Team Member
                    </Button>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white rounded-[3rem] overflow-hidden">
                <CardHeader className="p-10 pb-0">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-10 h-10 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center">
                            <Bell size={20} />
                        </div>
                        <CardTitle className="text-xl font-bold tracking-tight">Notification Settings</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-10 space-y-6">
                    {[
                        { id: 'n1', label: 'New Applicant Alerts', desc: 'Real-time notification when a high-match nurse applies to your job.' },
                        { id: 'n2', label: 'Weekly Performance Summary', desc: 'Weekly analytical summary of your job posts performance.' },
                        { id: 'n3', label: 'Billing & Subscription Alerts', desc: 'Alerts regarding subscription cycles and payments.' },
                    ].map((pref) => (
                        <div key={pref.id} className="group flex items-start gap-4 p-6 rounded-3xl border border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-all duration-500">
                            <div className="pt-1">
                                <Checkbox id={pref.id} defaultChecked className="h-6 w-6 rounded-lg border-slate-200 data-[state=checked]:bg-[#ec4899] data-[state=checked]:border-[#ec4899] transition-all" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor={pref.id} className="text-sm font-bold text-slate-900 tracking-tight cursor-pointer group-hover:text-[#ec4899] transition-colors">{pref.label}</Label>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">{pref.desc}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white rounded-[3rem] p-10 ring-2 ring-red-500/5 hover:ring-red-500/10 transition-all duration-500">
                <div className="flex items-start gap-8">
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 shrink-0 shadow-inner">
                        <Trash2 size={28} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-red-600 tracking-tight mb-2">Danger Zone</h3>
                        <p className="text-slate-500 text-xs font-medium leading-relaxed mb-8 max-w-md">Deleting your account will permanently remove all your data, including job posts, applicant history, and active subscriptions.</p>
                        
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" className="h-12 px-8 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 font-bold text-xs">
                                    Delete Account Permanently
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-[2rem] border-none shadow-2xl p-8">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-2xl font-bold text-slate-900">Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-slate-500 font-medium">
                                        This action cannot be undone. This will permanently delete your business account and remove all associated data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="mt-8 gap-4">
                                    <AlertDialogCancel className="h-12 rounded-xl font-bold">Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                        onClick={handleDeleteAccount}
                                        className="h-12 rounded-xl bg-red-600 hover:bg-red-700 font-bold"
                                    >
                                        Delete Account
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </Card>
        </div>
      </div>

      <footer className="pt-20 text-center">
         <p className="text-[10px] font-bold text-slate-200 uppercase tracking-[0.4em]">End of Settings</p>
      </footer>
    </div>
  );
}