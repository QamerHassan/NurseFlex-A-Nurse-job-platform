'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    CheckCircle2, ArrowRight, Home, Briefcase,
    ExternalLink, Loader2
} from 'lucide-react';
import Image from 'next/image';
import api from '@/lib/api';

export default function ApplySuccessPage() {
    const { id } = useParams();
    const router = useRouter();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jobsRes, userJson] = await Promise.all([
                    api.get('/jobs'),
                    Promise.resolve(localStorage.getItem('user'))
                ]);
                const foundJob = jobsRes.data.find((j: any) => j.id === id);
                setJob(foundJob);
                if (userJson) setUser(JSON.parse(userJson));
            } catch (err) {
                console.error("Failed to fetch data for success page");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 className="animate-spin text-pink-600" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen bg-white font-sans flex flex-col pt-12">
            <main className="flex-1 flex flex-col items-center bg-white pb-20 pt-12">
                <div className="max-w-xl w-full px-6 flex flex-col items-center">

                    {/* Illustration */}
                    <div className="w-full aspect-[4/3] relative mb-12">
                        <Image
                            src="/images/success-illustration.png"
                            alt="Application Submitted"
                            fill
                            className="object-contain"
                        />
                    </div>

                    <h1 className="text-4xl font-black text-slate-900 text-center tracking-tighter italic mb-10 leading-tight">
                        Your application has been submitted!
                    </h1>

                    {/* Email Confirmation Card */}
                    <div className="w-full bg-white border border-slate-100 rounded-3xl p-8 mb-12 shadow-sm flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                            <CheckCircle2 size={20} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-slate-600 font-bold leading-relaxed">
                                You will get an email confirmation at <span className="text-slate-900 italic">{user?.email || 'qamerhassan6@gmail.com'}</span>
                            </p>
                        </div>
                    </div>

                    {/* Keep track section */}
                    <div className="w-full space-y-4 mb-12">
                        <h3 className="text-xl font-black text-slate-900 tracking-tighter italic">Keep track of your applications</h3>
                        <p className="text-slate-500 font-bold italic">
                            To keep track of your applications, go to <Link href="/saved-jobs" className="text-pink-600 hover:underline inline-flex items-center gap-1">MyJobs <ExternalLink size={14} /></Link>
                        </p>
                    </div>

                    {/* Action Button */}
                    <Link href="/dashboard" className="w-full">
                        <button className="w-full py-6 bg-white border-2 border-slate-100 text-pink-600 font-black rounded-3xl text-xl hover:bg-slate-50 transition-all active:scale-95 uppercase tracking-tighter italic shadow-sm hover:shadow-md">
                            Return to job search
                        </button>
                    </Link>

                    <div className="text-center pt-20">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                            Having an issue with this application? <span className="text-pink-600 underline cursor-pointer">Tell us more</span>
                        </p>
                    </div>
                </div>
            </main>

            {/* FOOTER */}
            <footer className="bg-white border-t border-slate-100 py-12 px-6">
                <p className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-[0.3em]">
                    © 2026 NurseFlex • Cookies, Privacy and Terms
                </p>
            </footer>
        </div>
    );
}
