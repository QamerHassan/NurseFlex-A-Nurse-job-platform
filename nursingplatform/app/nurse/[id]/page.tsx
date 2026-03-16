"use client";
import React, { useEffect, useState } from 'react';
import { Loader2, Star, MapPin, Briefcase, Calendar, User, FileText, ArrowLeft, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PublicNurseProfile() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/profile/${params.id}`);
        setData(response.data);
      } catch (err) {
        console.error("Fetch Public Profile Error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchProfile();
  }, [params.id]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  if (!data) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 flex-col gap-4">
      <h2 className="text-2xl font-black text-slate-900">Profile Not Found</h2>
      <button onClick={() => router.back()} className="text-indigo-600 font-bold hover:underline">Go Back</button>
    </div>
  );

  const { user, profile } = data;
  const displayName = profile?.name || user?.name || 'Nurse';
  const initials = displayName !== 'Nurse' ? displayName.split(' ').map((n: string) => n ? n[0] : '').join('').toUpperCase() : 'N';

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-4xl mx-auto pt-12 px-6">
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 mb-8 transition-colors">
          <ArrowLeft size={16} /> Back
        </button>

        {/* Profile Header Card */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 p-10 md:p-14 mb-8 relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-bl-full -z-0 opacity-50 blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8 justify-between">
            <div className="flex items-center gap-8">
              <div className="w-28 h-28 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center font-black text-4xl shadow-xl shadow-indigo-200">
                {initials}
              </div>
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">{displayName}</h1>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                    <MapPin size={14} className="text-indigo-500" />
                    {profile?.location || profile?.country || 'Location not specified'}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                    <Briefcase size={14} className="text-indigo-500" />
                    {profile?.experience || 0} Years Exp.
                  </div>
                </div>
              </div>
            </div>
            

          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column (About & Skills) */}
          <div className="md:col-span-1 space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
                <User size={16} className="text-indigo-500" /> About
              </h3>
              <p className="text-slate-600 font-medium text-sm leading-relaxed">
                {profile?.bio || 'This nurse hasn\'t added a bio yet.'}
              </p>
            </div>

            {profile?.skills && profile.skills.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
                  <Star size={16} className="text-indigo-500" /> Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill: string, idx: number) => (
                    <span key={idx} className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-indigo-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {profile?.resumeUrl && (
              <a href={`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001'}${profile.resumeUrl}`} target="_blank" rel="noopener noreferrer" className="block w-full">
                <div className="bg-slate-900 hover:bg-indigo-600 transition-colors rounded-3xl p-6 text-white text-center group">
                  <FileText size={32} className="mx-auto mb-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span className="font-black uppercase tracking-widest text-sm">View Full Resume</span>
                </div>
              </a>
            )}
          </div>

          {/* Right Column (Empty Placeholder for now) */}
          <div className="md:col-span-2">
            <div className="bg-white/50 backdrop-blur rounded-[2.5rem] border border-slate-100 p-12 text-center h-full flex flex-col items-center justify-center">
                <ShieldCheck size={48} className="text-blue-600 mb-6" />
                <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight italic">Verified Professional</h2>
                <p className="text-slate-400 font-bold text-sm max-w-sm mx-auto">This profile has been verified by NurseFlex. Professional credentials and experience are authenticated.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
