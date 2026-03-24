"use client";
import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
// Building2 aur MapPin ko yahan add kar diya hai
import { Loader2, Hospital, Calendar, CheckCircle2, MapPin, Building2, ChevronRight } from 'lucide-react';

export default function MyApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getStatusStyles = (status: string) => {
    const s = status?.toLowerCase() || 'pending';
    switch (s) {
      case 'accepted': 
        return { color: "text-emerald-600", bg: "bg-emerald-50", bar: "bg-emerald-500", step: 4, note: "Congratulations! You're Hired." };
      case 'interview': 
        return { color: "text-purple-600", bg: "bg-purple-50", bar: "bg-purple-500", step: 3, note: "Employer scheduled an interview." };
      case 'reviewed': 
        return { color: "text-blue-600", bg: "bg-blue-50", bar: "bg-blue-500", step: 2, note: "Employer is reviewing your profile." };
      case 'rejected':
        return { color: "text-rose-600", bg: "bg-rose-50", bar: "bg-rose-500", step: 0, note: "Application not selected this time." };
      default: 
        return { color: "text-slate-600", bg: "bg-slate-50", bar: "bg-blue-500", step: 1, note: "Waiting for initial review" };
    }
  };

  useEffect(() => {
    const fetchMyApps = async () => {
      try {
        const response = await api.get('/applications/my-apps');
        setApplications(response.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyApps();
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Loading your applications...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">My Applications</h2>
          <div className="flex items-center gap-2 mt-2">
             <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
             <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] italic">
              Live tracking your applications
            </p>
          </div>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase">Total Submissions</p>
          <p className="text-3xl font-black text-slate-900">{applications.length}</p>
        </div>
      </header>

      <div className="space-y-8">
        {applications.length > 0 ? (
          applications.map((app) => {
            const styles = getStatusStyles(app.status);
            return (
              <div key={app.id} className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group">
                <div className="p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                  
                  <div className="flex items-center gap-6">
                    <div className={`w-20 h-20 ${styles.bg} rounded-[2rem] flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform`}>
                      <Hospital className={styles.color} size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 leading-tight mb-1 group-hover:text-blue-600 transition-colors">
                        {app.job?.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 items-center">
                        <span className="flex items-center gap-1.5 text-slate-500 font-bold text-xs uppercase italic">
                          <Building2 size={14} className="text-slate-300" /> {app.job?.hospital}
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                          <Calendar size={12} /> {new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <div className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-tighter ${styles.bg} ${styles.color} border border-current/10 shadow-sm`}>
                      <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                      {app.status}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 mt-3 uppercase tracking-wider">{styles.note}</p>
                  </div>
                </div>

                <div className="bg-slate-50/50 px-10 py-6 flex items-center gap-6 border-t border-slate-50">
                  <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                    {[1, 2, 3, 4].map((stepNumber) => (
                      <div 
                        key={stepNumber}
                        className={`h-full border-r-2 border-white last:border-0 transition-all duration-1000 delay-${stepNumber * 100} ${
                          styles.step >= stepNumber ? styles.bar : 'bg-slate-200'
                        }`} 
                        style={{ width: '25%' }}
                      ></div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black uppercase text-slate-900 tracking-widest leading-none">Stage {styles.step}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">of 4 Steps</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 shadow-inner">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="text-slate-200" size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 uppercase">No Applications Yet</h3>
            <p className="text-slate-400 font-bold text-sm mt-2">You haven't applied to any shifts yet. Let's get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}