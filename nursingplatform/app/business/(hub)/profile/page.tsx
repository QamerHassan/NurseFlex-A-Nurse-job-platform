"use client";
import React, { useState, useEffect } from 'react';
import {
    User, Building2, MapPin, Phone, Shield,
    Loader2, CheckCircle2, AlertCircle,
    Zap, Globe, Mail, ArrowUpRight,
    Settings, ShieldCheck, Trash2, ChevronDown
} from 'lucide-react';
import api from '@/lib/api';
import { US_STATES, US_HOSPITALS } from '@/app/lib/constants';

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { Skeleton } from "@/app/components/ui/skeleton";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProfileState {
    name: string; phone: string; city: string;
    state: string; postcode: string; bio: string;
    email: string; status: string;
}

export default function BusinessProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [message, setMessage] = useState<{ type: string; text: string }>({ type: '', text: '' });
    const [isCustomFacility, setIsCustomFacility] = useState(false);

    const [profile, setProfile] = useState<ProfileState>({
        name: '', phone: '', city: '', state: '',
        postcode: '', bio: '', email: '', status: '',
    });

    // ── Fetch ──────────────────────────────────────────────────────────────────
    useEffect(() => { fetchProfile(); }, []);

    const fetchProfile = async () => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const localUser = JSON.parse(userStr);
            const res = await api.get(`/users/${localUser.id}`);
            const data = res.data;

            let cityPart = '';
            let statePart = data.profile?.state || '';

            if (data.profile?.location) {
                const parts = data.profile.location.split(',');
                if (parts.length > 0) cityPart = parts[0].trim();
                if (parts.length > 1 && !statePart) statePart = parts[1].trim();
            }

            const fetchedName = data.profile?.name || data.name || '';
            const hospitalExists = US_HOSPITALS.some((h: any) => h.value === fetchedName);

            if (fetchedName && !hospitalExists && fetchedName !== 'Other/Custom Facility') {
                setIsCustomFacility(true);
            }

            setProfile({
                name: fetchedName, phone: data.profile?.phone || '',
                city: cityPart, state: statePart,
                postcode: data.profile?.postcode || '',
                bio: data.profile?.bio || '',
                email: data.email, status: data.status,
            });
        } catch (err) {
            console.error('Failed to fetch profile:', err);
            showMsg('error', 'Failed to load profile data.');
        } finally {
            setLoading(false);
        }
    };

    // ── Save ───────────────────────────────────────────────────────────────────
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile.name.trim()) { showMsg('error', 'Facility name is required.'); return; }
        if (!profile.state) { showMsg('error', 'Please select a state.'); return; }

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
                bio: profile.bio,
            });

            showMsg('success', 'Profile updated successfully.');
            localStorage.setItem('user', JSON.stringify({ ...localUser, name: profile.name }));
        } catch (err) {
            console.error('Update failed:', err);
            showMsg('error', 'Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    // ── Delete ─────────────────────────────────────────────────────────────────
    const handleDelete = async () => {
        if (!confirm('Are you sure? This will permanently delete your account and all data. This cannot be undone.')) return;
        setDeleting(true);
        try {
            const userStr = localStorage.getItem('user');
            const localUser = JSON.parse(userStr || '{}');
            await api.delete(`/users/${localUser.id}`);
            localStorage.clear();
            window.location.href = '/';
        } catch (err) {
            console.error('Delete failed:', err);
            showMsg('error', 'Failed to delete account. Please contact support.');
            setDeleting(false);
        }
    };

    // ── Helpers ────────────────────────────────────────────────────────────────
    const showMsg = (type: string, text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    };

    const set = (field: keyof ProfileState) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
            setProfile(p => ({ ...p, [field]: e.target.value }));

    // ── Loading skeleton ───────────────────────────────────────────────────────
    if (loading) return (
        <div className="space-y-6 max-w-5xl mx-auto p-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid lg:grid-cols-3 gap-6">
                <Skeleton className="h-72 rounded-2xl" />
                <div className="lg:col-span-2 space-y-4">
                    <Skeleton className="h-12 rounded-xl" />
                    <Skeleton className="h-12 rounded-xl" />
                    <Skeleton className="h-12 rounded-xl" />
                    <Skeleton className="h-32 rounded-xl" />
                </div>
            </div>
        </div>
    );

    // ── Page ───────────────────────────────────────────────────────────────────
    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-10 font-sans">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Business Profile</h1>
                    <p className="text-sm text-slate-400 mt-0.5">Manage your company details and account settings.</p>
                </div>
                <Badge className={`px-3 py-1 text-xs font-semibold rounded-lg ${profile.status === 'APPROVED' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                    {profile.status || 'Active'}
                </Badge>
            </div>

            {/* Alert */}
            {message.text && (
                <div className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-medium ${message.type === 'success'
                        ? 'bg-green-50 border-green-100 text-green-700'
                        : 'bg-red-50 border-red-100 text-red-700'
                    }`}>
                    {message.type === 'success'
                        ? <CheckCircle2 size={16} className="shrink-0" />
                        : <AlertCircle size={16} className="shrink-0" />
                    }
                    {message.text}
                </div>
            )}

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* ── LEFT SIDEBAR ── */}
                <div className="lg:col-span-4 space-y-4">

                    {/* Profile card */}
                    <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
                        <div className="bg-slate-900 p-6 text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                                <Building2 size={28} className="text-white" />
                            </div>
                            <p className="font-semibold text-white text-base truncate">
                                {profile.name || 'Your Business'}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">Business Account</p>
                        </div>

                        <CardContent className="p-5 space-y-3">
                            {/* Email */}
                            <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
                                <Mail size={14} className="text-blue-600 shrink-0" />
                                <p className="text-xs text-slate-600 font-medium truncate">{profile.email}</p>
                            </div>
                            {/* Status */}
                            <div className="flex items-center gap-3 p-3 bg-green-50/50 rounded-xl border border-green-100/50">
                                <ShieldCheck size={14} className="text-green-600 shrink-0" />
                                <p className="text-xs text-slate-600 font-medium capitalize">
                                    Status: <span className="text-green-600 font-semibold">{profile.status?.toLowerCase() || 'active'}</span>
                                </p>
                            </div>
                            {/* Location */}
                            {(profile.city || profile.state) && (
                                <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
                                    <MapPin size={14} className="text-blue-500 shrink-0" />
                                    <p className="text-xs text-slate-600 font-medium truncate">
                                        {[profile.city, profile.state].filter(Boolean).join(', ')}
                                    </p>
                                </div>
                            )}
                            {/* Phone */}
                            {profile.phone && (
                                <div className="flex items-center gap-3 p-3 bg-green-50/50 rounded-xl border border-green-100/50">
                                    <Phone size={14} className="text-green-500 shrink-0" />
                                    <p className="text-xs text-slate-600 font-medium">{profile.phone}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Support card */}
                    <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl p-5 space-y-3">
                        <p className="text-sm font-semibold text-slate-700">Need Help?</p>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Contact our support team for any account or billing issues.
                        </p>
                        <button className="w-full h-10 rounded-xl bg-green-50 border border-green-100 text-green-700 hover:bg-green-100 text-sm font-medium flex items-center justify-center gap-2 transition-all">
                            <Zap size={14} className="text-green-600" /> Contact Support
                        </button>
                    </Card>
                </div>

                {/* ── RIGHT MAIN FORM ── */}
                <div className="lg:col-span-8 space-y-5">
                    <form onSubmit={handleUpdate} className="space-y-5">
                        <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
                            <CardHeader className="p-6 pb-0 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-base font-semibold text-slate-900">Basic Details</CardTitle>
                                    <CardDescription className="text-xs text-slate-400 mt-0.5">Update your company information.</CardDescription>
                                </div>
                                <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
                                    <Settings size={16} className="text-green-600" />
                                </div>
                            </CardHeader>

                            <CardContent className="p-6 space-y-5">

                                {/* Facility Name */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-semibold text-slate-600">Hospital / Facility Name</Label>
                                        <button type="button" onClick={() => { setIsCustomFacility(v => !v); setProfile(p => ({ ...p, name: '' })); }}
                                            className="text-[11px] text-green-600 hover:text-green-700 font-medium transition-colors">
                                            {isCustomFacility ? 'Choose from list' : 'Enter custom name'}
                                        </button>
                                    </div>

                                    {!isCustomFacility ? (
                                        <div className="relative">
                                            <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                            <select
                                                required
                                                className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none"
                                                value={US_HOSPITALS.some((h: any) => h.value === profile.name) ? profile.name : ''}
                                                onChange={e => {
                                                    if (e.target.value === 'Other/Custom Facility') {
                                                        setIsCustomFacility(true);
                                                        setProfile(p => ({ ...p, name: '' }));
                                                    } else {
                                                        setProfile(p => ({ ...p, name: e.target.value }));
                                                    }
                                                }}
                                            >
                                                <option value="" disabled>Select facility...</option>
                                                {US_HOSPITALS.map((h: any) => (
                                                    <option key={h.value} value={h.value}>{h.label}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                            <Input
                                                required
                                                value={profile.name}
                                                onChange={set('name')}
                                                placeholder="Enter facility name..."
                                                className="h-11 pl-10 rounded-xl bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-sm transition-all"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Phone */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-slate-600">Phone Number</Label>
                                    <div className="relative">
                                        <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        <Input
                                            value={profile.phone}
                                            onChange={set('phone')}
                                            placeholder="+1-XXX-XXX-XXXX"
                                            className="h-11 pl-10 rounded-xl bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-sm transition-all"
                                        />
                                    </div>
                                </div>

                                {/* City + State */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-slate-600">City</Label>
                                        <div className="relative">
                                            <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                            <Input
                                                value={profile.city}
                                                onChange={set('city')}
                                                placeholder="e.g. Dallas"
                                                className="h-11 pl-10 rounded-xl bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-sm transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-slate-600">State</Label>
                                        <div className="relative">
                                            <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                                            <select
                                                required
                                                className="w-full h-11 pl-10 pr-8 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none"
                                                value={profile.state}
                                                onChange={set('state')}
                                            >
                                                <option value="" disabled>Select state...</option>
                                                {US_STATES.map((s: any) => (
                                                    <option key={s.value} value={s.value}>{s.label}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                {/* Postcode */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-slate-600">ZIP / Postcode</Label>
                                    <Input
                                        value={profile.postcode}
                                        onChange={set('postcode')}
                                        placeholder="e.g. 75201"
                                        className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-sm transition-all"
                                    />
                                </div>

                                {/* Bio */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-slate-600">Business Description</Label>
                                    <Textarea
                                        rows={4}
                                        value={profile.bio}
                                        onChange={set('bio')}
                                        placeholder="Tell nurses about your facility and what makes it a great place to work..."
                                        className="rounded-xl bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-sm transition-all resize-none leading-relaxed p-3"
                                    />
                                    <p className="text-[11px] text-slate-400">{profile.bio.length} / 500 characters</p>
                                </div>
                            </CardContent>

                            <CardFooter className="p-6 pt-0 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="h-11 px-8 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold text-sm rounded-xl flex items-center gap-2 transition-all shadow-lg disabled:opacity-60"
                                >
                                    {saving
                                        ? <><Loader2 size={15} className="animate-spin" /> Saving...</>
                                        : <><ArrowUpRight size={15} /> Save Changes</>
                                    }
                                </button>
                            </CardFooter>
                        </Card>
                    </form>

                    {/* Danger Zone */}
                    <Card className="border border-red-100 shadow-sm bg-white rounded-2xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                                <Trash2 size={18} className="text-red-500" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-red-600 text-sm">Delete Account</p>
                                <p className="text-xs text-slate-400 mt-1 mb-4 leading-relaxed">
                                    Permanently deletes your account, all job posts, and business data. This cannot be undone.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="h-9 px-5 rounded-xl bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 font-medium text-xs transition-all flex items-center gap-2 disabled:opacity-60"
                                >
                                    {deleting
                                        ? <><Loader2 size={13} className="animate-spin" /> Deleting...</>
                                        : <><Trash2 size={13} /> Delete Account</>
                                    }
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <p className="text-center text-[10px] text-slate-300 uppercase tracking-widest">
                NurseFlex Business Portal
            </p>
        </div>
    );
}