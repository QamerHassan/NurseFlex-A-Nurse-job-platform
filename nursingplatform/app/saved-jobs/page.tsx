'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Bookmark, Briefcase,
  Calendar, Archive,
  ChevronRight, Search, Zap, Loader2,
  Building2, MapPin, ArrowRight, MessageSquare, AlertCircle,
  Clock, CheckCircle2, X
} from 'lucide-react';
import api from '@/lib/api';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";
import { Separator } from "@/app/components/ui/separator";

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    Saved: 0,
    Applied: 0,
    Interviews: 0,
    Archived: 0
  });

  const { data: session, status } = useSession();
  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [savedRes, appliedRes] = await Promise.all([
        api.get('/saved-jobs').catch(() => ({ data: [] })),
        api.get('/applications/my-apps').catch(() => ({ data: [] }))
      ]);
      setSavedJobs(savedRes.data || []);
      setAppliedJobs(appliedRes.data || []);
      setCounts({
        Saved: savedRes.data?.length || 0,
        Applied: appliedRes.data?.length || 0,
        Interviews: 0,
        Archived: 0
      });
    } catch (err) {
      console.error("Failed to fetch activity data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'loading') return;
    if ((session as any)?.error === 'UserNotFound') {
      signOut({ callbackUrl: '/auth/login' });
      return;
    }
    const hasLocalToken = !!localStorage.getItem('token');
    if (!hasLocalToken && !session) {
      router.replace('/auth/login');
      return;
    }
    fetchData();
  }, [status, session, router]);

  const handleUnsave = async (jobId: string) => {
    try {
      await api.delete(`/saved-jobs/${jobId}`);
      setSavedJobs(prev => prev.filter(sj => sj.jobId !== jobId));
      setCounts(prev => ({ ...prev, Saved: Math.max(0, prev.Saved - 1) }));
    } catch (err) {
      console.error("Failed to unsave job");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-12">
        <header className="mb-12">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">My jobs</h1>
            <p className="text-slate-600 text-sm">Manage your job search and applications</p>
        </header>

        <Tabs defaultValue="Saved" className="w-full">
          <TabsList className="h-auto p-0 bg-transparent border-b border-slate-200 rounded-none w-full justify-start gap-8 mb-8">
            {[
              { id: 'Saved', label: 'Saved', count: counts.Saved },
              { id: 'Applied', label: 'Applied', count: counts.Applied },
              { id: 'Interviews', label: 'Interviews', count: counts.Interviews },
              { id: 'Archived', label: 'Archived', count: counts.Archived }
            ].map(tab => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id} 
                className="px-1 py-4 rounded-none border-b-4 border-transparent font-bold text-sm text-slate-500 data-[state=active]:border-[#ec4899] data-[state=active]:text-[#ec4899] data-[state=active]:bg-transparent transition-all"
              >
                {tab.label} {tab.count > 0 && `(${tab.count})`}
              </TabsTrigger>
            ))}
          </TabsList>

          {loading ? (
            <div className="space-y-4">
               {[1,2,3].map(i => (
                 <Card key={i} className="border-slate-200 p-6 rounded-xl shadow-none">
                     <Skeleton className="h-6 w-1/3 mb-4 bg-pink-50" />
                     <Skeleton className="h-4 w-1/2 bg-pink-50" />
                 </Card>
               ))}
            </div>
          ) : (
            <>
              <TabsContent value="Saved" className="animate-in fade-in duration-300">
                {savedJobs.length > 0 ? (
                  <div className="space-y-4">
                    {savedJobs.map((sj) => (
                      <Card key={sj.id} className="group border-slate-200 shadow-none hover:border-[#ec4899] rounded-xl transition-all overflow-hidden bg-white">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 group-hover:underline transition-all mb-1 pr-12">{sj.job.title}</h3>
                                    <div className="text-slate-700 font-medium text-sm mb-1">{sj.job.hospitalName}</div>
                                    <div className="text-slate-600 text-sm">{sj.job.location}</div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => handleUnsave(sj.jobId)} className="h-10 w-10 text-slate-400 hover:text-red-600">
                                        <X size={20} />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-6 text-[#ec4899] text-xs font-bold">
                                <Zap size={14} className="fill-[#ec4899]" />
                                Easily apply
                            </div>

                            <div className="flex gap-3">
                                <Button asChild className="bg-[#ec4899] hover:bg-[#db2777] h-10 px-6 rounded-lg font-bold text-white shadow-none">
                                    <Link href={`/jobs/${sj.jobId}/apply/contact`}>Apply Now</Link>
                                </Button>
                                <Button asChild variant="outline" className="h-10 px-6 rounded-lg border-slate-300 font-bold text-slate-700 hover:bg-slate-50">
                                    <Link href={`/dashboard?jobId=${sj.jobId}`}>View Details</Link>
                                </Button>
                            </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <EmptyState tab="Saved" />
                )}
              </TabsContent>

              <TabsContent value="Applied" className="animate-in fade-in duration-300">
                {appliedJobs.length > 0 ? (
                  <div className="space-y-4">
                     {appliedJobs.map((app) => (
                      <Card key={app.id} className="border-slate-200 shadow-none rounded-xl overflow-hidden bg-white">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-1">{app.job.title}</h3>
                                    <div className="text-slate-700 font-medium text-sm mb-1">{app.job.hospitalName}</div>
                                    <div className="text-slate-600 text-sm mb-4">{app.job.location}</div>
                                    
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                        <Clock size={14} /> Applied {new Date(app.appliedAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <Badge className={`h-8 px-4 font-bold text-xs rounded-lg shadow-none ${
                                    app.status === 'Applied' ? 'bg-pink-50 text-[#ec4899] border-[#ec4899]/20' :
                                    app.status === 'Interview' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                    'bg-slate-50 text-slate-600 border-slate-200'
                                }`}>
                                    {app.status}
                                </Badge>
                            </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <EmptyState tab="Applied" />
                )}
              </TabsContent>

              <TabsContent value="Interviews">
                  <EmptyState tab="Interviews" />
              </TabsContent>

              <TabsContent value="Archived">
                  <EmptyState tab="Archived" />
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
    </div>
  );
}

function Skeleton({ className }: { className?: string }) {
    return <div className={`animate-pulse bg-pink-50 rounded ${className}`} />;
}

function EmptyState({ tab }: { tab: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border-2 border-dashed border-slate-200">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6 border border-slate-100 shadow-inner">
        <Bookmark size={32} className="opacity-50" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">No {tab.toLowerCase()} jobs</h2>
      <p className="text-slate-500 text-sm mb-8 max-w-xs mx-auto">
        Jobs you {tab.toLowerCase() === 'saved' ? 'save' : 'apply to'} will appear here.
      </p>

      <Button asChild className="bg-[#ec4899] hover:bg-[#db2777] h-12 px-8 rounded-lg font-bold text-white shadow-none">
        <Link href="/dashboard">
          Find jobs
        </Link>
      </Button>
    </div>
  );
}
