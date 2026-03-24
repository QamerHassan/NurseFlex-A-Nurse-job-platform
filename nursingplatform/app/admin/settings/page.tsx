"use client";
import React, { useState } from 'react';
import {
    Shield, User, Bell, Database,
    Palette, Save, ShieldCheck, Check,
    Server, RefreshCw, Trash2, Download,
    Key, Lock, AlertTriangle, CheckCircle2,
    ChevronDown, Eye, EyeOff, Copy,
    Activity, X, Info
} from 'lucide-react';
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Separator } from "@/app/components/ui/separator";

// ─── Types ────────────────────────────────────────────────────────────────────
interface BrandingForm {
    portalName: string; supportEmail: string;
    portalUrl: string; timezone: string; accentColor: string;
}
interface ProfileForm {
    adminName: string; adminEmail: string;
    currentPassword: string; newPassword: string; confirmPassword: string;
}
interface NotifSettings {
    emailAlerts: boolean; browserPush: boolean; newUserAlert: boolean;
    reportAlert: boolean; systemAlert: boolean; weeklyDigest: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
    { icon: Palette, label: 'Branding', id: 'branding' },
    { icon: Shield, label: 'Security', id: 'security', badge: 'Active' },
    { icon: User, label: 'Admin Profile', id: 'profile' },
    { icon: Bell, label: 'Notifications', id: 'notifs', badge: '3' },
    { icon: Database, label: 'System Logs', id: 'logs' },
    { icon: Server, label: 'API & Integrations', id: 'api' },
];

const ACCENT_COLORS = [
    { hex: '#2563eb', label: 'Blue', ring: 'ring-blue-300' },
    { hex: '#16a34a', label: 'Green', ring: 'ring-green-300' },
    { hex: '#0891b2', label: 'Cyan', ring: 'ring-cyan-300' },
    { hex: '#7c3aed', label: 'Violet', ring: 'ring-violet-300' },
    { hex: '#0f172a', label: 'Slate', ring: 'ring-slate-300' },
];

const TIMEZONES = [
    'America/New_York (EST)', 'America/Chicago (CST)',
    'America/Denver (MST)', 'America/Los_Angeles (PST)',
    'Europe/London (GMT)', 'Asia/Karachi (PKT)',
];

const SECURITY_TOGGLES = [
    { label: 'Two-Factor Authentication', desc: 'Secure logins with OTP verification', key: '2fa' },
    { label: 'IP Whitelisting', desc: 'Restrict to specific network ranges', key: 'ip' },
    { label: 'Session Persistence', desc: 'Keep admin logged in across tabs', key: 'session' },
    { label: 'Audit Logging', desc: 'Record all admin actions to logs', key: 'audit' },
    { label: 'Maintenance Mode', desc: 'Take portal offline for updates', key: 'maintenance' },
];

const MOCK_LOGS = [
    { id: 1, action: 'Admin Login', user: 'admin@nurseflex.com', time: '2 min ago', status: 'success' },
    { id: 2, action: 'User Approved', user: 'admin@nurseflex.com', time: '14 min ago', status: 'success' },
    { id: 3, action: 'Failed Login Attempt', user: 'unknown@x.com', time: '1 hr ago', status: 'error' },
    { id: 4, action: 'Blog Post Created', user: 'admin@nurseflex.com', time: '3 hr ago', status: 'success' },
    { id: 5, action: 'Settings Updated', user: 'admin@nurseflex.com', time: '1 day ago', status: 'success' },
    { id: 6, action: 'Tier Deleted', user: 'admin@nurseflex.com', time: '2 days ago', status: 'warning' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'info'; onClose: () => void }) {
    const cfg = {
        success: { bg: 'bg-green-600', Icon: CheckCircle2 },
        error: { bg: 'bg-red-600', Icon: AlertTriangle },
        info: { bg: 'bg-blue-600', Icon: Info },
    }[type];
    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl text-white font-bold text-sm shadow-2xl animate-in slide-in-from-bottom-4 duration-300 ${cfg.bg}`}>
            <cfg.Icon size={16} /> {message}
            <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X size={14} /></button>
        </div>
    );
}

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
    return (
        <div onClick={onChange} className={`w-12 h-6 rounded-full relative transition-all duration-300 cursor-pointer shrink-0 ${value ? 'bg-blue-600' : 'bg-slate-200'}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${value ? 'left-7' : 'left-1'}`} />
        </div>
    );
}

function SectionHeader({ icon, bg, title, desc }: { icon: React.ReactNode; bg: string; title: string; desc: string }) {
    return (
        <div className="space-y-1">
            <div className="flex items-center gap-3 mb-1">
                <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center`}>{icon}</div>
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">{title}</h2>
            </div>
            <p className="text-xs font-medium text-slate-400 ml-11">{desc}</p>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState('branding');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [saving, setSaving] = useState(false);

    // Branding state
    const [branding, setBranding] = useState<BrandingForm>({
        portalName: 'NurseFlex Admin', supportEmail: 'admin@nurseflex.com',
        portalUrl: 'https://nurseflex.com/admin', timezone: 'America/New_York (EST)', accentColor: '#2563eb',
    });
    const [tzOpen, setTzOpen] = useState(false);

    // Security state
    const [secToggles, setSecToggles] = useState<Record<string, boolean>>({
        '2fa': true, ip: false, session: true, audit: true, maintenance: false,
    });

    // Profile state
    const [profile, setProfile] = useState<ProfileForm>({
        adminName: 'Super Admin', adminEmail: 'admin@nurseflex.com',
        currentPassword: '', newPassword: '', confirmPassword: '',
    });
    const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });

    // Notifications state
    const [notifs, setNotifs] = useState<NotifSettings>({
        emailAlerts: true, browserPush: false, newUserAlert: true,
        reportAlert: true, systemAlert: true, weeklyDigest: false,
    });

    // API state
    const [apiKey] = useState('nf_live_sk_8ETj7Zvxxxxxxxxxxxxxxxxxxxxxx');
    const [apiKeyCopied, setApiKeyCopied] = useState(false);

    // ── Helpers ────────────────────────────────────────────────────────────────
    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSave = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 900));
        setSaving(false);
        showToast('Settings saved successfully!', 'success');
    };

    const handleReset = () => {
        if (!confirm('Reset all settings to default? This cannot be undone.')) return;
        setBranding({ portalName: 'NurseFlex Admin', supportEmail: 'admin@nurseflex.com', portalUrl: 'https://nurseflex.com/admin', timezone: 'America/New_York (EST)', accentColor: '#2563eb' });
        setSecToggles({ '2fa': true, ip: false, session: true, audit: true, maintenance: false });
        showToast('Settings reset to defaults.', 'info');
    };

    const handleExport = () => {
        const config = JSON.stringify({ branding, secToggles, notifs }, null, 2);
        const blob = new Blob([config], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'nurseflex_admin_config.json'; a.click();
        URL.revokeObjectURL(url);
        showToast('Config exported as JSON.', 'success');
    };

    const handleClearData = () => {
        if (!confirm('⚠️ This will clear ALL session data. You will be logged out!')) return;
        sessionStorage.clear();
        showToast('Session data cleared. Redirecting...', 'error');
        setTimeout(() => window.location.reload(), 1500);
    };

    const handlePasswordChange = () => {
        if (!profile.currentPassword) { showToast('Enter your current password.', 'error'); return; }
        if (profile.newPassword.length < 6) { showToast('New password must be ≥ 6 characters.', 'error'); return; }
        if (profile.newPassword !== profile.confirmPassword) { showToast('Passwords do not match.', 'error'); return; }
        showToast('Password updated successfully!', 'success');
        setProfile(p => ({ ...p, currentPassword: '', newPassword: '', confirmPassword: '' }));
    };

    const copyApiKey = () => {
        navigator.clipboard.writeText(apiKey);
        setApiKeyCopied(true);
        setTimeout(() => setApiKeyCopied(false), 2000);
        showToast('API key copied to clipboard.', 'info');
    };

    const exportLogs = () => {
        const csv = 'Action,User,Time,Status\n' + MOCK_LOGS.map(l => `"${l.action}","${l.user}","${l.time}","${l.status}"`).join('\n');
        const b = new Blob([csv], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(b); a.download = 'admin_logs.csv'; a.click();
        showToast('Logs exported as CSV.', 'success');
    };

    // ── Tab Content ────────────────────────────────────────────────────────────
    const renderContent = () => {
        switch (activeTab) {

            // BRANDING
            case 'branding': return (
                <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
                    <CardHeader className="p-8 pb-0">
                        <SectionHeader icon={<Palette size={16} className="text-blue-600" />} bg="bg-blue-50" title="Portal Branding" desc="Customize portal identity and visual settings." />
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { label: 'Portal Name', key: 'portalName', placeholder: 'NurseFlex Admin' },
                                { label: 'Support Email', key: 'supportEmail', placeholder: 'admin@nurseflex.com' },
                                { label: 'Portal URL', key: 'portalUrl', placeholder: 'https://...' },
                            ].map(f => (
                                <div key={f.key} className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{f.label}</label>
                                    <Input
                                        value={(branding as any)[f.key]}
                                        onChange={e => setBranding(p => ({ ...p, [f.key]: e.target.value }))}
                                        placeholder={f.placeholder}
                                        className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-500 transition-all font-bold text-slate-900 text-sm"
                                    />
                                </div>
                            ))}

                            {/* Timezone dropdown */}
                            <div className="space-y-2 relative">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Timezone</label>
                                <button
                                    onClick={() => setTzOpen(o => !o)}
                                    className="w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-500 transition-all font-bold text-slate-900 text-sm flex items-center justify-between"
                                >
                                    {branding.timezone}
                                    <ChevronDown size={16} className={`text-slate-400 transition-transform ${tzOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {tzOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-xl z-20 overflow-hidden">
                                        {TIMEZONES.map(tz => (
                                            <button key={tz} onClick={() => { setBranding(p => ({ ...p, timezone: tz })); setTzOpen(false); }}
                                                className={`w-full px-4 py-3 text-left text-sm font-bold transition-colors hover:bg-blue-50 hover:text-blue-700 ${branding.timezone === tz ? 'bg-blue-50 text-blue-700' : 'text-slate-700'}`}>
                                                {tz}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <Separator className="bg-slate-50" />

                        {/* Color Picker */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Accent Color</label>
                            <div className="flex items-center gap-3 flex-wrap">
                                {ACCENT_COLORS.map(c => {
                                    const active = branding.accentColor === c.hex;
                                    return (
                                        <button key={c.hex} onClick={() => setBranding(p => ({ ...p, accentColor: c.hex }))} title={c.label}
                                            className={`w-12 h-12 rounded-xl transition-all hover:scale-110 active:scale-90 flex items-center justify-center ${active ? `ring-4 ${c.ring} shadow-lg scale-105` : 'opacity-60 hover:opacity-100'}`}
                                            style={{ backgroundColor: c.hex }}>
                                            {active && <Check size={16} className="text-white" />}
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="text-xs text-slate-400 font-medium">
                                Selected: <span className="font-black text-slate-700">{ACCENT_COLORS.find(c => c.hex === branding.accentColor)?.label}</span>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            );

            // SECURITY
            case 'security': return (
                <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
                    <CardHeader className="p-8 pb-0">
                        <div className="flex items-start justify-between">
                            <SectionHeader icon={<Shield size={16} className="text-green-600" />} bg="bg-green-50" title="Security Controls" desc="Manage access control and session security." />
                            <Badge className="bg-green-50 text-green-600 border-none font-black text-[9px] uppercase tracking-widest px-3 shrink-0">Enhanced</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-3">
                        {SECURITY_TOGGLES.map(item => (
                            <div key={item.key} onClick={() => setSecToggles(p => ({ ...p, [item.key]: !p[item.key] }))}
                                className="flex items-center justify-between p-5 rounded-xl border border-slate-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all cursor-pointer group">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{item.label}</p>
                                    <p className="text-xs font-medium text-slate-400">{item.desc}</p>
                                </div>
                                <Toggle value={secToggles[item.key]} onChange={() => setSecToggles(p => ({ ...p, [item.key]: !p[item.key] }))} />
                            </div>
                        ))}
                        {secToggles.maintenance && (
                            <div className="mt-2 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-3">
                                <AlertTriangle size={16} className="text-amber-500 shrink-0" />
                                <p className="text-xs font-bold text-amber-700">⚠️ Maintenance Mode is ON — portal is offline for regular users.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            );

            // PROFILE
            case 'profile': return (
                <div className="space-y-6">
                    {/* Basic Info */}
                    <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
                        <CardHeader className="p-8 pb-0">
                            <SectionHeader icon={<User size={16} className="text-blue-600" />} bg="bg-blue-50" title="Admin Profile" desc="Update your admin display name and email." />
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                                    <Input value={profile.adminName} onChange={e => setProfile(p => ({ ...p, adminName: e.target.value }))}
                                        className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-500 font-bold text-slate-900 text-sm" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                                    <Input value={profile.adminEmail} onChange={e => setProfile(p => ({ ...p, adminEmail: e.target.value }))}
                                        className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-500 font-bold text-slate-900 text-sm" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Password */}
                    <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
                        <CardHeader className="p-8 pb-0">
                            <SectionHeader icon={<Lock size={16} className="text-green-600" />} bg="bg-green-50" title="Change Password" desc="Must be at least 6 characters." />
                        </CardHeader>
                        <CardContent className="p-8 space-y-5">
                            {([
                                { label: 'Current Password', key: 'currentPassword', vis: showPwd.current, toggle: () => setShowPwd(p => ({ ...p, current: !p.current })) },
                                { label: 'New Password', key: 'newPassword', vis: showPwd.new, toggle: () => setShowPwd(p => ({ ...p, new: !p.new })) },
                                { label: 'Confirm Password', key: 'confirmPassword', vis: showPwd.confirm, toggle: () => setShowPwd(p => ({ ...p, confirm: !p.confirm })) },
                            ] as any[]).map(f => (
                                <div key={f.key} className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{f.label}</label>
                                    <div className="relative">
                                        <Input
                                            type={f.vis ? 'text' : 'password'}
                                            value={(profile as any)[f.key]}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                                            placeholder="••••••••"
                                            className="h-12 rounded-xl border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-500 font-bold text-slate-900 text-sm pr-12"
                                        />
                                        <button onClick={f.toggle} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors">
                                            {f.vis ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Match indicator */}
                            {profile.newPassword && profile.confirmPassword && (
                                <div className={`flex items-center gap-2 text-xs font-bold ${profile.newPassword === profile.confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
                                    {profile.newPassword === profile.confirmPassword
                                        ? <><CheckCircle2 size={14} /> Passwords match</>
                                        : <><AlertTriangle size={14} /> Passwords do not match</>
                                    }
                                </div>
                            )}

                            <button onClick={handlePasswordChange}
                                className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-blue-100">
                                Update Password
                            </button>
                        </CardContent>
                    </Card>
                </div>
            );

            // NOTIFICATIONS
            case 'notifs': return (
                <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
                    <CardHeader className="p-8 pb-0">
                        <SectionHeader icon={<Bell size={16} className="text-blue-600" />} bg="bg-blue-50" title="Notification Preferences" desc="Choose what alerts you receive and how." />
                    </CardHeader>
                    <CardContent className="p-8 space-y-3">
                        {([
                            { label: 'Email Alerts', desc: 'Receive important updates via email', key: 'emailAlerts' },
                            { label: 'Browser Push', desc: 'Get push notifications in browser', key: 'browserPush' },
                            { label: 'New User Registered', desc: 'Alert when a new user signs up', key: 'newUserAlert' },
                            { label: 'Issue Reports', desc: 'Alert when a new report is submitted', key: 'reportAlert' },
                            { label: 'System Alerts', desc: 'Critical system and security alerts', key: 'systemAlert' },
                            { label: 'Weekly Digest', desc: 'Summary email every Monday morning', key: 'weeklyDigest' },
                        ] as { label: string; desc: string; key: keyof NotifSettings }[]).map(item => (
                            <div key={item.key} onClick={() => setNotifs(p => ({ ...p, [item.key]: !p[item.key] }))}
                                className="flex items-center justify-between p-5 rounded-xl border border-slate-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all cursor-pointer group">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{item.label}</p>
                                    <p className="text-xs font-medium text-slate-400">{item.desc}</p>
                                </div>
                                <Toggle value={notifs[item.key]} onChange={() => setNotifs(p => ({ ...p, [item.key]: !p[item.key] }))} />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            );

            // LOGS
            case 'logs': return (
                <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
                    <CardHeader className="p-8 pb-4 flex flex-row items-start justify-between">
                        <SectionHeader icon={<Database size={16} className="text-green-600" />} bg="bg-green-50" title="Activity Logs" desc="Recent admin actions and system events." />
                        <button onClick={exportLogs}
                            className="flex items-center gap-2 h-9 px-4 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 font-bold text-xs transition-all shrink-0">
                            <Download size={14} /> Export CSV
                        </button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-50">
                            {MOCK_LOGS.map(log => (
                                <div key={log.id} className="flex items-center justify-between px-8 py-4 hover:bg-slate-50/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full shrink-0 ${log.status === 'success' ? 'bg-green-500' : log.status === 'error' ? 'bg-red-500' : 'bg-amber-400'}`} />
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{log.action}</p>
                                            <p className="text-[11px] font-medium text-slate-400">{log.user}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{log.time}</span>
                                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${log.status === 'success' ? 'bg-green-50 text-green-600' : log.status === 'error' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                                            {log.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            );

            // API
            case 'api': return (
                <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
                    <CardHeader className="p-8 pb-0">
                        <SectionHeader icon={<Key size={16} className="text-blue-600" />} bg="bg-blue-50" title="API & Integrations" desc="Manage live API keys and connected services." />
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live API Key</label>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-12 px-4 bg-slate-900 rounded-xl font-mono text-green-400 text-sm flex items-center overflow-hidden">
                                    <span className="truncate">{apiKey}</span>
                                </div>
                                <button onClick={copyApiKey}
                                    className={`h-12 px-5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shrink-0 ${apiKeyCopied ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                                    {apiKeyCopied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy</>}
                                </button>
                            </div>
                            <p className="text-[11px] font-medium text-slate-400">⚠️ Keep your API key secret. Never expose it in public code.</p>
                        </div>

                        <Separator className="bg-slate-50" />

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Connected Services</label>
                            {[
                                { name: 'Google OAuth', status: 'Connected', color: 'green' },
                                { name: 'Prisma DB', status: 'Connected', color: 'green' },
                                { name: 'Discord Bot', status: 'Disconnected', color: 'red' },
                                { name: 'Email (SMTP)', status: 'Connected', color: 'green' },
                            ].map(svc => (
                                <div key={svc.name} className="flex items-center justify-between p-4 rounded-xl border border-slate-50 hover:bg-slate-50/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${svc.color === 'green' ? 'bg-green-500' : 'bg-red-400'}`} />
                                        <p className="text-sm font-bold text-slate-900">{svc.name}</p>
                                    </div>
                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${svc.color === 'green' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                                        {svc.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            );

            default: return null;
        }
    };

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="space-y-8 animate-in fade-in duration-500 font-sans">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">System Online</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Settings</h1>
                    <p className="text-sm text-slate-400 font-medium mt-0.5">Configure security, branding, and system preferences.</p>
                </div>
                <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-2 h-12 px-8 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 disabled:opacity-70">
                    {saving ? <><Activity size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> Save Changes</>}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Sidebar */}
                <div className="lg:col-span-3 space-y-4">
                    <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
                        <div className="p-3 space-y-1">
                            {NAV_ITEMS.map(item => {
                                const active = activeTab === item.id;
                                return (
                                    <button key={item.id} onClick={() => setActiveTab(item.id)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                                        <div className="flex items-center gap-3">
                                            <item.icon size={16} className={active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'} />
                                            <span className="text-sm font-bold">{item.label}</span>
                                        </div>
                                        {(item as any).badge && (
                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${active ? 'bg-white/20 text-white' : 'bg-green-100 text-green-600'}`}>
                                                {(item as any).badge}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </Card>

                    {/* Status Card */}
                    <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-600/20 rounded-full blur-xl" />
                        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-green-500/10 rounded-full blur-xl" />
                        <div className="relative z-10 space-y-4">
                            <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
                                <ShieldCheck size={20} className="text-blue-400" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-green-400 uppercase tracking-widest mb-1">Security Status</p>
                                <h3 className="text-lg font-black">Level 9 Protected</h3>
                                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">E2E encrypted with master bypass tokens.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                                    <p className="text-lg font-black text-green-400">99%</p>
                                    <p className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">Uptime</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                                    <p className="text-lg font-black text-blue-400">0</p>
                                    <p className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">Threats</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-9 space-y-6">
                    {renderContent()}

                    {/* Danger Zone */}
                    <Card className="border border-red-100 shadow-sm bg-white rounded-2xl overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                                    <AlertTriangle size={16} className="text-red-500" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-black text-red-900 uppercase tracking-tight">Danger Zone</CardTitle>
                                    <CardDescription className="text-xs font-medium text-red-400">Irreversible system actions — proceed with caution.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 flex flex-col sm:flex-row gap-4">
                            <button onClick={handleReset}
                                className="flex-1 h-12 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                                <RefreshCw size={16} /> Reset Settings
                            </button>
                            <button onClick={handleExport}
                                className="flex-1 h-12 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:border-green-300 hover:text-green-600 hover:bg-green-50 transition-all flex items-center justify-center gap-2">
                                <Download size={16} /> Export Config
                            </button>
                            <button onClick={handleClearData}
                                className="flex-1 h-12 rounded-xl bg-red-50 border-2 border-red-100 text-red-600 font-bold text-sm hover:bg-red-100 transition-all flex items-center justify-center gap-2">
                                <Trash2 size={16} /> Clear All Data
                            </button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}