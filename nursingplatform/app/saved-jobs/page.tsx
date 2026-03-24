'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Bookmark, Zap, Loader2, MapPin,
  Clock, CheckCircle2, X, XCircle,
  Send, Calendar, RefreshCw, AlertCircle
} from 'lucide-react';
import api from '@/lib/api';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";

// ─── Types ────────────────────────────────────────────────────────────────────
type TabId = 'Saved' | 'Applied' | 'Interviews' | 'Archived';

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-gradient-to-r from-teal-50 to-emerald-50 ${className}`} />;
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ tab }: { tab: TabId }) {
  const config: Record<TabId, { icon: React.ReactNode; label: string; sub: string }> = {
    Saved:      { icon: <Bookmark size={32} />,       label: 'No saved jobs yet',       sub: 'Jobs you bookmark will appear here.' },
    Applied:    { icon: <Send size={32} />,            label: 'No applications yet',     sub: 'Jobs you apply to will appear here.' },
    Interviews: { icon: <Calendar size={32} />,        label: 'No interviews scheduled', sub: 'Interview invitations will appear here.' },
    Archived:   { icon: <AlertCircle size={32} />,     label: 'Nothing archived',        sub: 'Archived jobs will appear here.' },
  };
  const c = config[tab];
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border-2 border-dashed"
      style={{ borderColor: 'rgba(20,184,166,0.2)', background: 'linear-gradient(135deg, rgba(20,184,166,0.03), rgba(16,185,129,0.03))' }}>
      <div style={{
        width: 72, height: 72, borderRadius: 20, marginBottom: 20,
        background: 'linear-gradient(135deg, rgba(20,184,166,0.1), rgba(16,185,129,0.1))',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#14b8a6'
      }}>{c.icon}</div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>{c.label}</h2>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24, maxWidth: 280 }}>{c.sub}</p>
      <Link href="/dashboard" style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '12px 28px', borderRadius: 12, fontWeight: 700, fontSize: 13,
        background: 'linear-gradient(135deg, #14b8a6, #10b981)',
        color: 'white', textDecoration: 'none',
        boxShadow: '0 4px 16px rgba(20,184,166,0.35)'
      }}>
        Find Jobs
      </Link>
    </div>
  );
}

// ─── Status Badge — blue/green only ──────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const s = (status || '').toLowerCase();
  const styles: Record<string, { bg: string; color: string; border: string; icon: React.ReactNode }> = {
    approved:  { bg: 'rgba(16,185,129,0.1)',  color: '#059669', border: 'rgba(16,185,129,0.3)',  icon: <CheckCircle2 size={11} /> },
    interview: { bg: 'rgba(37,99,235,0.08)',  color: '#1d4ed8', border: 'rgba(37,99,235,0.2)',   icon: <Calendar size={11} /> },
    rejected:  { bg: 'rgba(14,165,233,0.08)', color: '#0369a1', border: 'rgba(14,165,233,0.2)',  icon: <XCircle size={11} /> },
    pending:   { bg: 'rgba(20,184,166,0.08)', color: '#0d9488', border: 'rgba(20,184,166,0.25)', icon: <Clock size={11} /> },
  };
  const st = styles[s] || styles.pending;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700,
      background: st.bg, color: st.color, border: `1px solid ${st.border}`,
      textTransform: 'capitalize'
    }}>
      {st.icon}{status || 'Pending'}
    </span>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs]     = useState<any[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [refreshing, setRefreshing]   = useState(false);
  const [activeTab, setActiveTab]     = useState<TabId>('Saved');

  const { data: session, status } = useSession();
  const router = useRouter();

  // ── Fetch — tries BOTH endpoint variants so it works regardless of backend ──
  const fetchData = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    else setRefreshing(true);
    try {
      const [savedRes, appsRes1, appsRes2] = await Promise.allSettled([
        api.get('/saved-jobs'),
        api.get('/applications/my'),        // endpoint used by dashboard
        api.get('/applications/my-apps'),   // endpoint used originally here
      ]);

      if (savedRes.status === 'fulfilled') {
        setSavedJobs(Array.isArray(savedRes.value.data) ? savedRes.value.data : []);
      }

      // Use whichever applications endpoint returned data
      const apps1 = appsRes1.status === 'fulfilled' && Array.isArray(appsRes1.value.data) ? appsRes1.value.data : [];
      const apps2 = appsRes2.status === 'fulfilled' && Array.isArray(appsRes2.value.data) ? appsRes2.value.data : [];
      // Prefer the one with more data; deduplicate by id
      const merged = [...apps1, ...apps2].filter((a, i, arr) => arr.findIndex(x => x.id === a.id) === i);
      setAppliedJobs(merged);

    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'loading') return;
    if ((session as any)?.error === 'UserNotFound') { signOut({ callbackUrl: '/auth/login' }); return; }
    const hasLocalToken = !!localStorage.getItem('token');
    if (!hasLocalToken && !session) { router.replace('/auth/login'); return; }
    fetchData();
  }, [status, session, router, fetchData]);

  const handleUnsave = async (jobId: string) => {
    try {
      await api.delete(`/saved-jobs/${jobId}`);
      setSavedJobs(prev => prev.filter(sj => (sj.jobId ?? sj.id) !== jobId));
    } catch (err) {
      console.error('Unsave failed:', err);
    }
  };

  const counts: Record<TabId, number> = {
    Saved:      savedJobs.length,
    Applied:    appliedJobs.length,
    Interviews: appliedJobs.filter(a => (a.status || '').toLowerCase() === 'interview').length,
    Archived:   0,
  };

  const tabs: TabId[] = ['Saved', 'Applied', 'Interviews', 'Archived'];

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* ── Background gradient blobs ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '40%', height: '40%', background: 'radial-gradient(ellipse, rgba(20,184,166,0.07) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: '35%', height: '35%', background: 'radial-gradient(ellipse, rgba(16,185,129,0.05) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      </div>

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px 80px', position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'linear-gradient(135deg, #14b8a6, #10b981)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(20,184,166,0.35)', flexShrink: 0
              }}>
                <Bookmark size={18} style={{ color: 'white' }} />
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>My Jobs</h1>
            </div>
            <p style={{ fontSize: 13, color: '#64748b', fontWeight: 500, paddingLeft: 52 }}>
              Manage your saved jobs and track your applications
            </p>
          </div>

          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            title="Refresh"
            style={{
              width: 40, height: 40, borderRadius: 12, border: '1px solid rgba(20,184,166,0.2)',
              background: 'rgba(20,184,166,0.06)', color: '#14b8a6',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <RefreshCw size={16} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          </button>
        </div>

        {/* ── Stat pills ── */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
          {([
            { label: 'Saved',     val: counts.Saved,      color: '#14b8a6', bg: 'rgba(20,184,166,0.08)',  border: 'rgba(20,184,166,0.2)'  },
            { label: 'Applied',   val: counts.Applied,    color: '#10b981', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.2)'  },
            { label: 'Interviews',val: counts.Interviews,  color: '#2563eb', bg: 'rgba(37,99,235,0.08)',   border: 'rgba(37,99,235,0.2)'   },
          ]).map(s => (
            <div key={s.label} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 18px', borderRadius: 12,
              background: s.bg, border: `1px solid ${s.border}`
            }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: s.color, lineHeight: 1 }}>{loading ? '…' : s.val}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: 'white', padding: 4, borderRadius: 14, border: '1px solid rgba(0,0,0,0.06)', width: 'fit-content', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          {tabs.map(tab => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '9px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  fontWeight: 700, fontSize: 13, transition: 'all 0.18s',
                  background: active ? 'linear-gradient(135deg, #14b8a6, #10b981)' : 'transparent',
                  color: active ? 'white' : '#64748b',
                  boxShadow: active ? '0 4px 12px rgba(20,184,166,0.3)' : 'none',
                }}
              >
                {tab}
                {counts[tab] > 0 && (
                  <span style={{
                    marginLeft: 6, fontSize: 10, fontWeight: 800,
                    background: active ? 'rgba(255,255,255,0.25)' : 'rgba(20,184,166,0.12)',
                    color: active ? 'white' : '#14b8a6',
                    padding: '2px 7px', borderRadius: 20
                  }}>{counts[tab]}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: 'white', borderRadius: 20, padding: 28, border: '1px solid rgba(0,0,0,0.05)' }}>
                <Skeleton className="h-6 w-1/3 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* ─── SAVED TAB ─── */}
            {activeTab === 'Saved' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {savedJobs.length === 0 ? <EmptyState tab="Saved" /> : savedJobs.map(sj => {
                  const jobId = sj.jobId ?? sj.id;
                  const job = sj.job || sj;
                  return (
                    <div key={sj.id} style={{
                      background: 'white', borderRadius: 20, padding: 28,
                      border: '1px solid rgba(0,0,0,0.05)',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                      transition: 'box-shadow 0.2s, border-color 0.2s',
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(20,184,166,0.4)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 24px rgba(20,184,166,0.12)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,0,0,0.05)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                        <div style={{ flex: 1, paddingRight: 16 }}>
                          {/* Accent line */}
                          <div style={{ width: 32, height: 3, borderRadius: 2, background: 'linear-gradient(90deg, #14b8a6, #10b981)', marginBottom: 10 }} />
                          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>{job.title}</h3>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>{job.hospitalName || job.hospital || job.businessName}</p>
                          {job.location && (
                            <p style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <MapPin size={11} />{job.location}
                            </p>
                          )}
                        </div>
                        <button onClick={() => handleUnsave(jobId)} style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid rgba(20,184,166,0.2)', background: 'rgba(20,184,166,0.06)', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'background 0.15s' }}>
                          <X size={16} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, color: '#14b8a6', fontSize: 11, fontWeight: 700 }}>
                        <Zap size={12} style={{ fill: '#14b8a6' }} /> Easy Apply
                      </div>

                      <div style={{ display: 'flex', gap: 10 }}>
                        <Link href={`/jobs/${jobId}/apply/contact`} style={{
                          padding: '10px 22px', borderRadius: 10, fontSize: 13, fontWeight: 700,
                          background: 'linear-gradient(135deg, #14b8a6, #10b981)',
                          color: 'white', textDecoration: 'none',
                          boxShadow: '0 4px 12px rgba(20,184,166,0.3)',
                          transition: 'opacity 0.2s'
                        }}>Apply Now</Link>
                        <Link href={`/dashboard?jobId=${jobId}`} style={{
                          padding: '10px 22px', borderRadius: 10, fontSize: 13, fontWeight: 700,
                          background: 'rgba(20,184,166,0.06)', color: '#0d9488',
                          border: '1px solid rgba(20,184,166,0.2)', textDecoration: 'none',
                          transition: 'background 0.15s'
                        }}>View Details</Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ─── APPLIED TAB ─── */}
            {activeTab === 'Applied' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {appliedJobs.length === 0 ? <EmptyState tab="Applied" /> : appliedJobs.map(app => {
                  const job = app.job || app;
                  const appliedDate = app.appliedAt || app.createdAt;
                  return (
                    <div key={app.id} style={{
                      background: 'white', borderRadius: 20, padding: 28,
                      border: '1px solid rgba(0,0,0,0.05)',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                        <div style={{ flex: 1 }}>
                          {/* Avatar + title */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
                            <div style={{
                              width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                              background: 'linear-gradient(135deg, #14b8a6, #10b981)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: 'white', fontWeight: 800, fontSize: 16
                            }}>{(job.title || 'J')[0].toUpperCase()}</div>
                            <div>
                              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 2 }}>{job.title || 'Job Position'}</h3>
                              <p style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{job.hospitalName || job.hospital || job.businessName || 'Healthcare Facility'}</p>
                            </div>
                          </div>

                          {job.location && (
                            <p style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                              <MapPin size={11} />{job.location}
                            </p>
                          )}

                          {appliedDate && (
                            <p style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 600 }}>
                              <Clock size={11} />
                              Applied {new Date(appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          )}
                        </div>
                        <StatusBadge status={app.status || 'Pending'} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ─── INTERVIEWS TAB ─── */}
            {activeTab === 'Interviews' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {counts.Interviews === 0 ? <EmptyState tab="Interviews" /> :
                  appliedJobs
                    .filter(a => (a.status || '').toLowerCase() === 'interview')
                    .map(app => {
                      const job = app.job || app;
                      return (
                        <div key={app.id} style={{ background: 'white', borderRadius: 20, padding: 28, border: '1px solid rgba(20,184,166,0.2)', boxShadow: '0 2px 12px rgba(20,184,166,0.06)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                              <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #14b8a6, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 16 }}>
                                {(job.title || 'J')[0].toUpperCase()}
                              </div>
                              <div>
                                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 2 }}>{job.title}</h3>
                                <p style={{ fontSize: 12, color: '#64748b' }}>{job.hospitalName || job.businessName}</p>
                              </div>
                            </div>
                            <StatusBadge status="Interview" />
                          </div>
                        </div>
                      );
                    })
                }
              </div>
            )}

            {/* ─── ARCHIVED TAB ─── */}
            {activeTab === 'Archived' && <EmptyState tab="Archived" />}
          </>
        )}
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}