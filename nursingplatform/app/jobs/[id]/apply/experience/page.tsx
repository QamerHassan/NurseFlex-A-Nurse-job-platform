'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, Loader2, X, AlertCircle,
    ChevronRight
} from 'lucide-react';
import api from '@/lib/api';

export default function ExperiencePage() {
    const { id } = useParams();
    const router = useRouter();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        jobTitle: '',
        company: ''
    });

    // 🔥 Reporting States
    const [activeReportStep, setActiveReportStep] = useState<'categories' | 'form' | null>(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [feedbackText, setFeedbackText] = useState('');
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

    const [showSaveModal, setShowSaveModal] = useState(false);
    
    const reportModalRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Load persisted data on mount
    useEffect(() => {
        const savedData = localStorage.getItem('experienceFormData');
        if (savedData) {
            try {
                setFormData(JSON.parse(savedData));
            } catch (err) {
                console.error("Failed to parse saved experience data", err);
            }
        }
    }, []);

    // Persist data on change
    useEffect(() => {
        localStorage.setItem('experienceFormData', JSON.stringify(formData));
    }, [formData]);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await api.get('/jobs');
                const foundJob = res.data.find((j: any) => j.id === id);
                setJob(foundJob);
            } catch (err) {
                console.error("Failed to fetch job for experience step");
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleReportIssue = () => {
        setShowSaveModal(false);
        setActiveReportStep('categories');
    };

    const closeReportModal = () => {
        setActiveReportStep(null);
        setSelectedCategory('');
        setFeedbackText('');
    };

    const handleSubmitFeedback = async () => {
        if (!feedbackText.trim()) return;
        setIsSubmittingFeedback(true);
        try {
            await api.post('/issue-reports', {
                category: selectedCategory,
                message: feedbackText,
                jobId: id && typeof id === 'string' && id.length > 5 ? id : undefined,
            });
            closeReportModal();
            alert('Thank you for your feedback! Our team and the employer have been notified.');
        } catch (err: any) {
            console.error('Failed to submit feedback', {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message
            });
            alert('Failed to submit feedback. Please try again later.');
        } finally {
            setIsSubmittingFeedback(false);
        }
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (reportModalRef.current && !reportModalRef.current.contains(event.target as Node)) {
                closeReportModal();
            }
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setShowSaveModal(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeReportStep, showSaveModal]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 className="animate-spin text-pink-600" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen bg-white font-sans flex flex-col relative">
            <main className="flex-1 flex flex-col items-center bg-pink-50/30 pb-20">
                <div className="max-w-2xl w-full px-4 pt-12">

                    {/* Job Header Card */}
                    {job && (
                        <div className="bg-white border border-pink-100 rounded-3xl p-8 mb-8 shadow-sm">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-2 italic text-center">
                                {job.title}
                            </h2>
                            <p className="text-pink-500 font-bold text-sm text-center">
                                {job.hospital} - {job.location}
                            </p>
                        </div>
                    )}

                    {/* Progress Bar Container */}
                    <div className="bg-white border border-pink-100 rounded-3xl p-8 mb-8 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-center mb-10">
                            <button
                                onClick={() => router.push(`/jobs/${id}/apply`)}
                                className="flex items-center gap-2 text-pink-600 font-bold text-sm hover:underline"
                            >
                                <ArrowLeft size={16} /> Back
                            </button>
                            <button 
                                onClick={() => setShowSaveModal(true)}
                                className="text-pink-600 font-bold text-sm hover:underline"
                            >
                                Save and close
                            </button>
                        </div>

                        <div className="flex justify-between items-center mb-6">
                            <div className="flex-1 h-2 bg-pink-50 rounded-full mr-4 relative overflow-hidden">
                                <div
                                    className="absolute top-0 left-0 h-full bg-pink-600 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: '75%' }}
                                ></div>
                            </div>
                            <span className="text-[11px] font-black text-pink-400 uppercase tracking-widest">75%</span>
                        </div>

                        <div className="space-y-12">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter italic mb-4 leading-tight">
                                    Work Experience
                                </h1>
                                <p className="text-pink-600 font-medium text-lg leading-relaxed">
                                    We share one job title with the employer to introduce you as a candidate.
                                </p>
                            </div>

                            {/* Form Content */}
                            <div className="bg-white border border-pink-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
                                <div className="space-y-4">
                                    <label className="text-xs font-bold uppercase tracking-wide text-pink-400 ml-1">Job title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Registered Nurse"
                                        className="w-full p-5 bg-pink-50/50 border border-pink-100 rounded-3xl font-semibold text-slate-900 placeholder:text-pink-300 outline-none focus:bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-50 transition-all text-lg"
                                        value={formData.jobTitle}
                                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-bold uppercase tracking-wide text-pink-400 ml-1">Company</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. City Hospital"
                                        className="w-full p-5 bg-pink-50/50 border border-pink-100 rounded-3xl font-semibold text-slate-900 placeholder:text-pink-300 outline-none focus:bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-50 transition-all text-lg"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Save & Next Button */}
                            <button
                                onClick={() => router.push(`/jobs/${id}/apply/review`)}
                                className="w-full py-5 bg-pink-600 text-white font-bold rounded-2xl text-lg hover:bg-pink-700 shadow-md shadow-pink-200 transition-all uppercase tracking-widest mt-4"
                            >
                                Save & Next
                            </button>

                            {/* 🔥 Reporting Section */}
                            <div className="text-center pt-8">
                                <p className="text-xs font-bold text-pink-400 uppercase tracking-wide leading-relaxed">
                                    Having an issue with this application? <span onClick={handleReportIssue} className="text-pink-600 underline cursor-pointer hover:text-pink-700">Tell us more</span>
                                </p>
                                <div className="mt-6 text-[10px] text-pink-300 font-bold max-w-sm mx-auto uppercase tracking-tighter leading-tight">
                                    This site is protected by reCAPTCHA and the Google <span className="underline hover:text-pink-400 cursor-pointer">Privacy Policy</span> and <span className="underline hover:text-pink-400 cursor-pointer">Terms of Service</span> apply.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* 🚀 INDEED-STYLE SAVE MODAL */}
            {showSaveModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"></div>
                    <div 
                        ref={modalRef}
                        className="relative bg-white w-full max-w-md rounded-3xl p-8 md:p-10 shadow-2xl animate-in fade-in zoom-in-95 duration-300"
                    >
                        <button 
                            onClick={() => setShowSaveModal(false)}
                            className="absolute right-6 top-6 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all"
                        >
                            <X size={24} />
                        </button>

                        <div className="text-center space-y-6">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                                Save application progress before you exit
                            </h2>
                            <p className="text-slate-500 font-medium text-base leading-relaxed">
                                Your application progress will be saved to My jobs. You can finish this application anytime within 14 days.
                            </p>

                            <div className="space-y-4 pt-6">
                                <button 
                                    onClick={() => router.push('/dashboard')}
                                    className="w-full h-14 bg-pink-600 hover:bg-pink-700 text-white font-black uppercase tracking-widest rounded-3xl text-sm shadow-xl shadow-pink-100 transition-all active:scale-[0.98]"
                                >
                                    Save
                                </button>
                                <button 
                                    onClick={() => router.push('/dashboard')}
                                    className="w-full h-14 border border-slate-100 text-pink-600 font-bold rounded-3xl hover:bg-slate-50 transition-all active:scale-[0.98]"
                                >
                                    Don't save
                                </button>
                                <button 
                                    onClick={handleReportIssue}
                                    className="text-pink-600 font-bold text-sm hover:underline pt-2"
                                >
                                    Report an issue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 🔥 Reporting Modal UI */}
            {activeReportStep && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300">
                    <div 
                        ref={reportModalRef}
                        className="bg-white w-full max-w-[480px] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-50">
                            {activeReportStep === 'form' ? (
                                <button 
                                    onClick={() => setActiveReportStep('categories')}
                                    className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-600"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                            ) : <div className="w-9" />}
                            
                            <button 
                                onClick={closeReportModal}
                                className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8 pt-4">
                            {activeReportStep === 'categories' ? (
                                <>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">What is the issue?</h2>
                                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                                        Your feedback will help us fix issues and improve your experience across NursingPlatform.
                                    </p>

                                    <div className="space-y-2">
                                        {[
                                            "Unable to continue to the next step",
                                            "Email address cannot be updated",
                                            "Unable to upload a file",
                                            "Issues with my resume or cover letter",
                                            "There's a technical problem with employer's question",
                                            "Uncomfortable answering or did not understand an employer's question",
                                            "Something else",
                                            "Share your ideas to help us improve our services"
                                        ].map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => {
                                                    setSelectedCategory(cat);
                                                    setActiveReportStep('form');
                                                }}
                                                className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-pink-200 hover:bg-pink-50/30 transition-all text-left group"
                                            >
                                                <span className="text-slate-700 font-medium group-hover:text-pink-700 transition-colors">{cat}</span>
                                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-pink-500 transition-colors" />
                                            </button>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Please tell us what happened</h2>
                                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                                        Your feedback won't be shared with the employer.
                                    </p>

                                    <div className="bg-pink-50/50 border border-pink-100 p-4 rounded-xl flex gap-3 mb-6">
                                        <AlertCircle className="w-5 h-5 text-pink-600 shrink-0" />
                                        <p className="text-pink-900 text-[13px] leading-snug">
                                            Do not include any sensitive information such as phone numbers or email addresses.
                                        </p>
                                    </div>

                                    <textarea
                                        value={feedbackText}
                                        onChange={(e) => setFeedbackText(e.target.value)}
                                        placeholder="Type your feedback here..."
                                        className="w-full h-40 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-slate-700 placeholder:text-slate-400 transition-all"
                                    />

                                    <div className="mt-8">
                                        <button
                                            onClick={handleSubmitFeedback}
                                            disabled={isSubmittingFeedback || !feedbackText.trim()}
                                            className="w-full h-14 bg-pink-600 hover:bg-pink-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                                        >
                                            {isSubmittingFeedback ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : 'Submit feedback'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* FOOTER */}
            <footer className="bg-white border-t border-slate-100 py-12 px-6">
                <p className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-[0.3em]">
                    © 2026 NurseFlex • Cookies, Privacy and Terms
                </p>
            </footer>
        </div>
    );
}
