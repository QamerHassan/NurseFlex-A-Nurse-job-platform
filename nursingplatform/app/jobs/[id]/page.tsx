"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import api from '@/lib/api';
import { ALL_MOCK_JOBS } from '@/app/lib/us-hospitals';
import { DASHBOARD_MOCK_JOBS } from '@/app/lib/mock-jobs';
import JobDetailPane from '@/app/components/JobDetailPane';
import { ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function JobDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { status } = useSession();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    
    // Save / Apply status state
    const [isSaved, setIsSaved] = useState(false);
    const [isApplied, setIsApplied] = useState(false);
    const [isApplying, setIsApplying] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                setLoading(true);
                
                // 1. Check if it's a mock job ID (dashboard mock-N or us-hospitals m-hN-N)
                if (typeof id === 'string' && id.startsWith('m')) {
                    const mockJob =
                        DASHBOARD_MOCK_JOBS.find(j => j.id === id) ||
                        ALL_MOCK_JOBS.find(j => j.id === id);
                    if (mockJob) {
                        setJob(mockJob);
                        setLoading(false);
                        return;
                    }
                }

                // 2. Try fetching from API for real jobs
                const res = await api.get(`/jobs/${id}`);
                setJob(res.data);
                
                // 3. Fetch user's status for this job
                const [savedRes, appsRes] = await Promise.allSettled([
                    api.get('/saved-jobs'),
                    api.get('/applications/my-apps'),
                ]);
                
                if (savedRes.status === 'fulfilled') {
                    setIsSaved(savedRes.value.data.some((s: any) => s.jobId === id));
                }
                if (appsRes.status === 'fulfilled') {
                    setIsApplied(appsRes.value.data.some((a: any) => a.jobId === id));
                }
                
            } catch (err) {
                console.error("Failed to fetch job from API, checking mock data", err);
                // 3. Fallback to Mock Data (check both datasets)
                const mockJob =
                    DASHBOARD_MOCK_JOBS.find(j => j.id === id) ||
                    ALL_MOCK_JOBS.find(j => j.id === id);
                if (mockJob) {
                    setJob(mockJob);
                } else {
                    setError(true);
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchJob();
    }, [id]);

    const handleSave = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (status !== 'authenticated') {
            signIn('google');
            return;
        }
        try {
            if (isSaved) {
                await api.delete(`/saved-jobs/${id}`);
                setIsSaved(false);
            } else {
                await api.post(`/saved-jobs/${id}`);
                setIsSaved(true);
            }
        } catch (err) {
            console.error("Save error:", err);
        }
    };

    const handleApply = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (status !== 'authenticated') {
            signIn('google', { callbackUrl: window.location.href });
            return;
        }
        if (isApplied) return;
        
        // Navigate to the actual application form page
        router.push(`/jobs/${id}/apply/contact`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Loading job details...</p>
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
                <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-sm border border-slate-100 text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Job Not Found</h2>
                    <p className="text-slate-500 mb-8">We couldn't find the position you're looking for. It might have been closed or removed.</p>
                    <Link href="/jobs" className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all">
                        Back to Job Search
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Back Link */}
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold mb-6 transition-colors"
                >
                    <ChevronLeft size={20} />
                    Back to Jobs
                </button>

                {/* Job Content Container */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <JobDetailPane 
                        job={job}
                        isSaved={isSaved}
                        isApplied={isApplied}
                        isApplying={isApplying}
                        onSave={handleSave}
                        onApply={handleApply}
                    />
                </div>
                
                {/* Mobile Apply Sticky Bar (Optional enhancement) */}
                <div className="md:hidden fixed bottom- my-4 left-4 right-4 z-50">
                     {/* JobDetailPane already has a button, but a sticky one for mobile is good */}
                </div>
            </div>
        </div>
    );
}
