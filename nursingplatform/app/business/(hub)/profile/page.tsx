"use client";
import React, { useState, useEffect } from 'react';
import { 
    User, Building2, MapPin, Phone, Shield, 
    Save, Loader2, CheckCircle2, AlertCircle,
    Zap, Globe, Mail, Info, ArrowUpRight,
    Settings, ShieldCheck, Trash2, Edit3, ChevronDown
} from 'lucide-react';
import api from '@/lib/api';
import { US_STATES, US_HOSPITALS } from '@/app/lib/constants';

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Separator } from "@/app/components/ui/separator";
import { Skeleton } from "@/app/components/ui/skeleton";

export default function BusinessProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isCustomFacility, setIsCustomFacility] = useState(false);
    const [profile, setProfile] = useState({
        name: '',
        phone: '',
        city: '',
        state: '',
        postcode: '',
        bio: '',
        email: '',
        status: '',
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const localUser = JSON.parse(userStr);
            
            const res = await api.get(`/users/${localUser.id}`);
            const data = res.data;
            
            let cityPart = '';
            let statePart = data.profile?.state || '';
            
            // Try to split old 'City, State' format if applicable
            if (data.profile?.location) {
                const parts = data.profile.location.split(',');
                if (parts.length > 0) cityPart = parts[0].trim();
                if (parts.length > 1 && !statePart) statePart = parts[1].trim();
            }

            const fetchedName = data.profile?.name || data.name || '';
            const hospitalExists = US_HOSPITALS.some(h => h.value === fetchedName);
            
            // Auto-switch to custom input if they had a name that wasn't in our curated list
            if (fetchedName && !hospitalExists && fetchedName !== 'Other/Custom Facility') {
                setIsCustomFacility(true);
            }

            setProfile({
                name: fetchedName,
                phone: data.profile?.phone || '',
                city: cityPart,
                state: statePart,
                postcode: data.profile?.postcode || '',
                bio: data.profile?.bio || '',
                email: data.email,
                status: data.status,
            });
        } catch (err) {
            console.error('Failed to fetch profile:', err);
            setMessage({ type: 'error', text: 'Failed to load profile data.' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const userStr = localStorage.getItem('user');
            const localUser = JSON.parse(userStr || '{}');
            
            await api.patch(`/users/profile/${localUser.id}`, {
                name: profile.name,
                phone: profile.phone,
                location: `${profile.city}, ${profile.state}`,
                country: 'USA',
                state: profile.state,
                postcode: profile.postcode,
                bio: profile.bio
            });

            setMessage({ type: 'success', text: 'Profile updated successfully.' });
            const updatedUser = { ...localUser, name: profile.name };
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (err) {
            console.error('Update failed:', err);
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="space-y-12">
            <header className="flex justify-between items-end">
                <div className="space-y-4">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
            </header>
            <div className="grid grid-cols-3 gap-8">
                <Skeleton className="h-96 rounded-[3rem]" />
                <Skeleton className="col-span-2 h-[600px] rounded-[3rem]" />
            </div>
        </div>
    );

    return (
        <div className="space-y-12 pb-20 max-w-6xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-slate-100 pb-12">
                <div className="text-center md:text-left">
                    <div className="flex items-center gap-4 justify-center md:justify-start mb-4">
                        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Profile</h1>
                    </div>
                    <p className="text-slate-500 font-medium text-sm">Manage your business details and account information</p>
                </div>
            </header>

            {message.text && (
                <div className={`p-6 rounded-[2rem] flex items-center gap-4 border shadow-2xl transition-all animate-in slide-in-from-top-4 ${
                    message.type === 'success' ? 'bg-emerald-50 border-emerald-100/50 text-emerald-700 shadow-emerald-50' : 'bg-red-50 border-red-100/50 text-red-700 shadow-red-50'
                }`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                        {message.type === 'success' ? <ShieldCheck size={20} /> : <AlertCircle size={20} />}
                    </div>
                    <span className="font-bold text-sm">{message.text}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Hub Overview Column */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="border-none shadow-2xl shadow-blue-50/50 bg-white rounded-[3rem] overflow-hidden group">
                        <CardHeader className="bg-slate-900 pt-12 pb-16 px-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="flex flex-col items-center text-center relative z-10">
                                <Avatar className="h-24 w-24 rounded-[2rem] shadow-2xl shadow-slate-950 ring-4 ring-white/10 mb-6 group-hover:scale-105 transition-transform duration-500">
                                    <AvatarFallback className="bg-white text-slate-900 font-bold text-3xl">
                                        <Building2 size={40} />
                                    </AvatarFallback>
                                </Avatar>
                                <CardTitle className="text-2xl font-bold text-white tracking-tight truncate w-full">{profile.name || "Business Name"}</CardTitle>
                                <div className="flex items-center gap-2 mt-4">
                                    <Badge variant="outline" className="h-6 border-white/20 text-blue-400 font-bold text-[10px] uppercase bg-white/5">Business Profile</Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="px-10 py-10 pt-0 -mt-8 relative z-20">
                            <div className="space-y-4">
                                <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-50 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Account Status</span>
                                        <Badge className="h-5 px-3 bg-emerald-500 font-bold text-[10px]">Active</Badge>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail size={14} className="text-pink-600" />
                                        <span className="text-xs font-bold text-slate-700 truncate">{profile.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck size={14} className="text-emerald-500" />
                                        <span className="text-xs font-bold text-slate-700">Type: <span className="text-emerald-600 font-bold capitalize">{profile.status.toLowerCase()}</span></span>
                                    </div>
                                </div>

                                <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100/50 space-y-2">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Business ID</p>
                                    <p className="text-xs font-mono font-bold text-slate-500 truncate">BF-BUS-5707</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-white rounded-[2.5rem] p-8 border border-slate-100 relative overflow-hidden">
                          <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-50/30 rounded-full blur-2xl"></div>
                          <h3 className="font-bold text-sm text-slate-700 mb-6 px-2">Support</h3>
                          <div className="space-y-4">
                             <p className="text-xs text-slate-500 font-medium leading-relaxed px-2">Need help with your account? Our support team is here to assist you with any enterprise-level issues.</p>
                             <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-100 font-bold text-sm hover:bg-slate-50 gap-2">
                                 <Zap size={14} className="text-amber-500 fill-amber-500" /> Contact Support
                             </Button>
                          </div>
                    </Card>
                </div>

                {/* Primary Config Column */}
                <div className="lg:col-span-8 space-y-10">
                    <form onSubmit={handleUpdate} className="space-y-10">
                        <Card className="border-none shadow-2xl shadow-blue-50/50 bg-white rounded-[3rem] overflow-hidden">
                            <CardHeader className="p-10 pb-0 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-bold tracking-tight">Basic Details</CardTitle>
                                    <CardDescription className="text-xs font-medium text-slate-500 mt-2">Manage your company information and contact details</CardDescription>
                                </div>
                                <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-pink-100">
                                    <Settings size={20} />
                                </div>
                            </CardHeader>
                            <CardContent className="p-10 space-y-10">
                                <div className="grid md:grid-cols-2 gap-10">
                                    <div className="md:col-span-2 space-y-4">
                                        <div className="flex justify-between items-center px-1">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hospital / Company Name</Label>
                                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Public Directory Name</span>
                                        </div>
                                        <div className="relative">
                                            <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 z-10" size={18} />
                                            {!isCustomFacility ? (
                                                <div className="relative">
                                                    <select
                                                        required
                                                        className="w-full h-16 pl-16 pr-12 rounded-[1.5rem] bg-slate-50/50 border border-slate-100 font-bold text-slate-900 focus-visible:ring-0 focus-visible:bg-white transition-all text-base appearance-none cursor-pointer outline-none"
                                                        value={US_HOSPITALS.some(h => h.value === profile.name) ? profile.name : ''}
                                                        onChange={(e) => {
                                                            if (e.target.value === 'Other/Custom Facility') {
                                                                setIsCustomFacility(true);
                                                                setProfile({...profile, name: ''});
                                                            } else {
                                                                setProfile({...profile, name: e.target.value});
                                                            }
                                                        }}
                                                    >
                                                        <option value="" disabled>Select Core Facility</option>
                                                        {US_HOSPITALS.map((hospital) => (
                                                            <option key={hospital.value} value={hospital.value}>
                                                                {hospital.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                                </div>
                                            ) : (
                                                <Input 
                                                    value={profile.name}
                                                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                                                    className="h-16 pl-16 rounded-[1.5rem] bg-slate-50/50 border-slate-100 font-bold text-slate-900 focus-visible:ring-[3px] focus-visible:ring-pink-100 focus-visible:bg-white transition-all text-base"
                                                    placeholder="Enter Custom Facility Name"
                                                />
                                            )}
                                            
                                            {isCustomFacility && (
                                                <button 
                                                    type="button" 
                                                    onClick={() => {
                                                        setIsCustomFacility(false);
                                                        setProfile({...profile, name: ''});
                                                    }}
                                                    className="absolute right-0 top-18 text-[10px] font-bold text-blue-500 hover:text-blue-700 uppercase tracking-widest mt-2 px-1"
                                                >
                                                    Back to standard list
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-xs font-bold text-slate-600 ml-1">Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <Input 
                                                value={profile.phone}
                                                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                                                className="h-16 pl-16 rounded-[1.5rem] bg-slate-50/50 border-slate-100 font-bold text-slate-900 focus-visible:ring-0 focus-visible:bg-white transition-all text-base"
                                                placeholder="+1-XXX-XXX-XXXX"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-xs font-bold text-slate-600 ml-1">City</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <Input 
                                                value={profile.city}
                                                onChange={(e) => setProfile({...profile, city: e.target.value})}
                                                className="h-16 pl-16 rounded-[1.5rem] bg-slate-50/50 border-slate-100 font-bold text-slate-900 focus-visible:ring-0 focus-visible:bg-white transition-all text-base"
                                                placeholder="e.g. Dallas"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-xs font-bold text-slate-600 ml-1">State</Label>
                                        <div className="relative">
                                            <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 z-10" size={18} />
                                            <select
                                                required
                                                className="w-full h-16 pl-16 pr-12 rounded-[1.5rem] bg-slate-50/50 border border-slate-100 font-bold text-slate-900 focus-visible:ring-0 focus-visible:bg-white transition-all text-base appearance-none cursor-pointer outline-none"
                                                value={profile.state}
                                                onChange={(e) => setProfile({...profile, state: e.target.value})}
                                            >
                                                <option value="" disabled>Select State</option>
                                                {US_STATES.map((state) => (
                                                    <option key={state.value} value={state.value}>
                                                        {state.label}
                                                    </option>
                                                ))}
                                            </select>
                                           <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-4">
                                        <Label className="text-xs font-bold text-slate-600 ml-1">Business Description</Label>
                                        <Textarea 
                                            rows={4}
                                            value={profile.bio}
                                            onChange={(e) => setProfile({...profile, bio: e.target.value})}
                                            className="min-h-[160px] rounded-[2rem] bg-slate-50/50 border-slate-100 font-medium text-slate-900 focus-visible:ring-0 p-8 leading-relaxed resize-none transition-all focus:bg-white"
                                            placeholder="Tell us about your business and hiring needs..."
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="p-10 bg-slate-50/30 flex justify-end">
                                <Button 
                                    type="submit" 
                                    disabled={saving}
                                    className="h-16 px-12 rounded-[1.5rem] bg-[#ec4899] hover:bg-[#db2777] font-bold text-lg shadow-2xl transition-all active:scale-95"
                                >
                                    {saving ? (
                                        <div className="flex items-center gap-3">
                                            <Loader2 className="animate-spin" size={20} /> Saving...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            Update Profile <ArrowUpRight size={20} />
                                        </div>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>

                    {/* Danger Module */}
                    <Card className="border-none shadow-sm bg-white rounded-[3rem] p-10 ring-2 ring-red-500/5 hover:ring-red-500/10 transition-all duration-500">
                        <div className="flex items-start gap-8">
                            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 shrink-0 shadow-inner">
                                <Trash2 size={28} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-red-600 tracking-tight mb-2">Danger Zone</h3>
                                <p className="text-slate-500 text-xs font-medium leading-relaxed mb-8 max-w-md">Deleting your account will permanently remove all your data, job posts, and account history. This action cannot be undone.</p>
                                <Button variant="ghost" className="h-12 px-8 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 font-bold text-xs">
                                    Delete Account
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            
            <footer className="pt-20 text-center">
                 <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.8em]">End of Profile Settings</p>
            </footer>
        </div>
    );
}
