'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Bookmark, Bell, User, MessageSquare,
  Mail, Phone, MapPin, ChevronRight,
  Eye, FileText, MoreHorizontal, History,
  Plus, Settings, Loader2, Check, X, Edit2,
  ShieldCheck, Award
} from 'lucide-react';
import api from '@/lib/api';
import ProfileDropdown from '@/app/components/ProfileDropdown';
import { Badge } from "@/app/components/ui/badge";
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function NurseProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // 1. Ghost Session Check
    // @ts-ignore
    if (session?.error === 'UserNotFound') {
      import('next-auth/react').then(({ signOut }) => {
        signOut({ callbackUrl: '/auth/login' });
      });
      return;
    }

    if (status === 'loading') return;

    // 2. Basic Auth Check
    const hasLocalToken = typeof window !== 'undefined' && !!localStorage.getItem('token');
    if (!hasLocalToken && !session) {
      router.replace('/auth/login');
      return;
    }

    // 3. Role Guard
    const localUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
    const userRole = (session?.user as any)?.role || localUser?.role;
    if (userRole === 'BUSINESS') {
        router.replace('/business/dashboard');
        return;
    }

    fetchData();
  }, [status, session, router]);

  const fetchData = async () => {
    const hasToken = typeof window !== 'undefined' && localStorage.getItem('token');
    if (!hasToken && !session) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get('/profile');
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (field: string, value: string) => {
    setEditingField(field);
    setEditValue(value || '');
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditValue('');
  };

  const saveEdit = async () => {
    if (!editingField) return;
    setSaving(true);
    try {
      await api.patch('/profile/update', {
        [editingField]: editValue
      });
      setEditingField(null);
      await fetchData(); // Refresh
    } catch (err) {
      console.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading && !profile) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  const displayName = profile?.name || session?.user?.name || 'Your Name';
  const displayEmail = profile?.user?.email || session?.user?.email || 'email@example.com';
  const initials = displayName !== 'Your Name' ? displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'N';

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* 🚀 INDEED-STYLE TOP NAV */}
      <nav className="border-b bg-white sticky top-0 z-[100] px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-blue-600 text-3xl font-black tracking-tighter italic">NurseFlex</Link>
          <div className="hidden md:flex gap-6 font-bold text-slate-600 text-sm">
            <Link href="/dashboard" className="hover:text-blue-600 transition-colors pb-2 border-b-2 border-transparent">Find Jobs</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/saved-jobs" className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
            <Bookmark size={22} />
          </Link>
          <Link href="/messages" className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
            <MessageSquare size={22} />
          </Link>
          <Link href="/notifications" className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
            <Bell size={22} />
          </Link>
          <ProfileDropdown email={displayEmail} />
          <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>
          <Link href="/business" className="text-sm font-bold text-slate-600 hover:underline">Employers / Post Job</Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto w-full px-6 py-12 flex-1">
        {/* USER INFO SECTION */}
        <section className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
          <div className="flex-1 order-2 md:order-1 w-full">
            {editingField === 'name' ? (
              <div className="flex items-center gap-2 mb-6">
                <input
                  className="text-4xl font-black text-slate-900 bg-slate-50 border-b-2 border-blue-600 outline-none w-full tracking-tight italic"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  autoFocus
                />
                <button onClick={saveEdit} disabled={saving} className="p-2 bg-blue-600 text-white rounded-lg"><Check size={20} /></button>
                <button onClick={cancelEditing} className="p-2 bg-slate-100 text-slate-400 rounded-lg"><X size={20} /></button>
              </div>
            ) : (
              <h1
                onClick={() => startEditing('name', displayName)}
                className="text-4xl font-black text-slate-900 mb-6 tracking-tight group cursor-pointer flex items-center gap-3"
              >
                {displayName}
                {profile?.user?.status === 'APPROVED' && (
                  <Badge className="bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest px-3 py-1 italic border-none shadow-lg flex items-center gap-2">
                    <ShieldCheck size={12} /> Verified
                  </Badge>
                )}
                <Edit2 size={18} className="text-slate-200 group-hover:text-blue-600 transition-colors" />
              </h1>
            )}

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-slate-600">
                <Mail size={18} className="text-slate-400" />
                <span className="font-bold text-sm tracking-tight">{displayEmail}</span>
              </div>

              <div className="group cursor-pointer">
                {editingField === 'phone' ? (
                  <div className="flex items-center gap-2">
                    <Phone size={18} className="text-blue-600" />
                    <input
                      className="font-bold text-sm tracking-tight border-b border-blue-600 outline-none flex-1 bg-slate-50 p-1"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                    />
                    <button onClick={saveEdit} disabled={saving} className="text-blue-600"><Check size={16} /></button>
                    <button onClick={cancelEditing} className="text-slate-400"><X size={16} /></button>
                  </div>
                ) : (
                  <div onClick={() => startEditing('phone', profile?.phone)} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4 text-slate-600">
                      <Phone size={18} className="text-slate-400" />
                      <span className="font-bold text-sm tracking-tight">{profile?.phone || 'Add phone number'}</span>
                    </div>
                    <Edit2 size={14} className="text-slate-200 group-hover:text-blue-600 transition-colors" />
                  </div>
                )}
              </div>

              <div className="group cursor-pointer">
                {editingField === 'specialization' ? (
                  <div className="flex items-center gap-2">
                    <Award size={18} className="text-blue-600" />
                    <input
                      className="font-bold text-sm tracking-tight border-b border-blue-600 outline-none flex-1 bg-slate-50 p-1"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                    />
                    <button onClick={saveEdit} disabled={saving} className="text-blue-600"><Check size={16} /></button>
                    <button onClick={cancelEditing} className="text-slate-400"><X size={16} /></button>
                  </div>
                ) : (
                  <div onClick={() => startEditing('specialization', profile?.specialization)} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4 text-slate-600">
                      <Award size={18} className="text-slate-400" />
                      <span className="font-bold text-sm tracking-tight">{profile?.specialization || 'Add specialization'}</span>
                    </div>
                    <Edit2 size={14} className="text-slate-200 group-hover:text-blue-600 transition-colors" />
                  </div>
                )}
              </div>

              <div className="group cursor-pointer">
                {editingField === 'yearsOfExperience' ? (
                  <div className="flex items-center gap-2">
                    <History size={18} className="text-blue-600" />
                    <input
                      className="font-bold text-sm tracking-tight border-b border-blue-600 outline-none flex-1 bg-slate-50 p-1"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                      type="number"
                    />
                    <button onClick={saveEdit} disabled={saving} className="text-blue-600"><Check size={16} /></button>
                    <button onClick={cancelEditing} className="text-slate-400"><X size={16} /></button>
                  </div>
                ) : (
                  <div onClick={() => startEditing('yearsOfExperience', profile?.yearsOfExperience)} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4 text-slate-600">
                      <History size={18} className="text-slate-400" />
                      <span className="font-bold text-sm tracking-tight">{profile?.yearsOfExperience || profile?.experience || '0'} Years Experience</span>
                    </div>
                    <Edit2 size={14} className="text-slate-200 group-hover:text-blue-600 transition-colors" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-white text-2xl font-black order-1 md:order-2 self-start md:self-auto shadow-lg">
            {initials}
          </div>
        </section>

        {/* STATUS BAR */}
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center justify-between mb-12 group cursor-pointer hover:bg-blue-100/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
              <ShieldCheck size={16} />
            </div>
            <span className="text-sm font-black text-slate-800 italic uppercase tracking-tighter">Your profile is Verified</span>
          </div>
          <ChevronRight size={20} className="text-slate-400" />
        </div>

        {/* RESUME SECTION */}
        <section className="mb-12">
          <h2 className="text-xl font-black text-slate-900 mb-6 uppercase italic tracking-tighter leading-none border-b border-slate-100 pb-4">Resume</h2>
          <div className="p-6 border border-slate-200 rounded-2xl flex items-center justify-between group hover:border-blue-200 transition-all shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-14 bg-slate-50 border border-slate-100 rounded-lg flex flex-col items-center justify-between py-2 shrink-0">
                <FileText size={20} className="text-slate-300" />
                <div className="bg-blue-600 text-[8px] text-white font-black px-1.5 py-0.5 rounded uppercase">PDF</div>
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-sm tracking-tight group-hover:text-blue-600 transition-colors">
                  {profile?.name || 'Resume'}_CV.pdf
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Added today</p>
              </div>
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </section>

        {/* IMPROVE MATCHES SECTION */}
        <section className="mb-12">
          <h2 className="text-xl font-black text-slate-900 mb-6 uppercase italic tracking-tighter leading-none border-b border-slate-100 pb-4">Improve your job matches</h2>
          <div className="divide-y divide-slate-100">
            <div className="py-6 flex justify-between items-center group cursor-pointer">
              <div>
                <h3 className="font-black text-slate-900 text-sm uppercase italic tracking-tighter mb-1">Qualifications</h3>
                <p className="text-xs font-bold text-slate-400">Highlight your skills and experience.</p>
              </div>
              <ChevronRight size={20} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
            </div>
            <div className="py-6 flex justify-between items-center group cursor-pointer">
              <div>
                <h3 className="font-black text-slate-900 text-sm uppercase italic tracking-tighter mb-1">Job preferences</h3>
                <p className="text-xs font-bold text-slate-400">Save specific details like minimum desired pay and schedule.</p>
              </div>
              <ChevronRight size={20} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
            </div>
            <div className="py-6 flex justify-between items-center group cursor-pointer">
              <div>
                <h3 className="font-black text-slate-900 text-sm uppercase italic tracking-tighter mb-1">Hide jobs with these details</h3>
                <p className="text-xs font-bold text-slate-400">Manage the qualifications or preferences used to hide jobs from your search.</p>
              </div>
              <ChevronRight size={20} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
            </div>
            <div className="py-6 flex justify-between items-center group cursor-pointer">
              <div>
                <h3 className="font-black text-slate-900 text-sm uppercase italic tracking-tighter mb-1">Ready to work</h3>
                <p className="text-xs font-bold text-slate-400">Let employers know that you're available to start working as soon as possible.</p>
              </div>
              <ChevronRight size={20} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
            </div>
          </div>
        </section>
      </main>

      {/* 📜 INDEED-STYLE FOOTER */}
      <footer className="border-t border-slate-100 py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center md:text-left flex flex-wrap gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] justify-center md:justify-start">
          <Link href="#" className="hover:underline">Browse jobs</Link>
          <Link href="#" className="hover:underline">Browse companies</Link>
          <Link href="#" className="hover:underline">About</Link>
          <Link href="#" className="hover:underline">Help</Link>
          <p>© 2026 NurseFlex • Cookies, Privacy and Terms</p>
        </div>
      </footer>
    </div>
  );
}
