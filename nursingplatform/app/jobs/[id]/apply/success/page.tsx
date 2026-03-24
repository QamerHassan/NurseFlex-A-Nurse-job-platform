"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Briefcase, Search } from 'lucide-react';

export default function ApplicationSuccess() {
    useEffect(() => {
        ['uploadedResumeUrl', 'uploadedResumeName', 'uploadedResumeType',
         'experienceFormData', 'applicationContactData'].forEach(k => localStorage.removeItem(k));
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
            <div className="max-w-md w-full space-y-6 text-center">

                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-green-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-blue-100">
                    <CheckCircle2 size={40} className="text-white" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-slate-900">Application Submitted!</h1>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Your profile has been shared with the employer. You'll receive an email if they want to move forward.
                    </p>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-5 text-left shadow-sm space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">What happens next</p>
                    {[
                        'The employer reviews your profile and resume.',
                        "If interested, they'll contact you via NurseFlex or email.",
                        'You can track your application status in your dashboard.',
                    ].map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-green-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">
                                {i + 1}
                            </div>
                            <p className="text-sm text-slate-600">{step}</p>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-3">
                    <Link href="/dashboard"
                        className="w-full h-11 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all">
                        <Briefcase size={16} /> View My Applications
                    </Link>
                    <Link href="/jobs"
                        className="w-full h-11 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all">
                        <Search size={16} /> Browse More Jobs
                    </Link>
                </div>

                <p className="text-[10px] text-slate-300 uppercase tracking-widest">NurseFlex · Healthcare Recruitment</p>
            </div>
        </div>
    );
}
