'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    FileText, CheckCircle2, ChevronDown,
    Settings, Upload, Loader2, X,
    AlertCircle, ChevronRight, ArrowLeft
} from 'lucide-react';
import api from '@/lib/api';

export default function ApplyPage() {
    const { id } = useParams();
    const router = useRouter();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [resumeName, setResumeName] = useState('Qamer Hassan R.pdf');
    const [showOptions, setShowOptions] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    
    // 🔥 New Report Issue States
    const [activeReportStep, setActiveReportStep] = useState<'categories' | 'form' | null>(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [feedbackText, setFeedbackText] = useState('');
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const reportModalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                // We might not have a specific fetch by ID yet, so we get all and filter
                const res = await api.get('/jobs');
                const foundJob = res.data.find((j: any) => j.id === id);
                setJob(foundJob);
            } catch (err) {
                console.error("Failed to fetch job for application");
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleSaveAndClose = () => {
        setShowOptions(false);
        setShowSaveModal(true);
    };

    const handleReportIssue = () => {
        setShowOptions(false);
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
                jobId: id,
            });
            // Success! Reset and close
            closeReportModal();
            alert('Thank you for your feedback! Our team and the employer have been notified.');
        } catch (err) {
            console.error('Failed to submit feedback', err);
            alert('Failed to submit feedback. Please try again later.');
        } finally {
            setIsSubmittingFeedback(false);
        }
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
                setShowOptions(false);
            }
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setShowSaveModal(false);
            }
            if (reportModalRef.current && !reportModalRef.current.contains(event.target as Node)) {
                closeReportModal();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeReportStep]); // Added activeReportStep to dependencies to re-attach listener when modal opens/closes

    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploading(true);
            setResumeName(file.name);
            setShowOptions(false);

            try {
                const formData = new FormData();
                formData.append('file', file);

                const res = await api.post('/applications/upload-resume', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                // Store URLs for the review step
                localStorage.setItem('uploadedResumeUrl', res.data.url);
                localStorage.setItem('uploadedResumeName', file.name);
            } catch (err) {
                console.error("Failed to upload resume");
            } finally {
                setUploading(false);
            }
        }
    };

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
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-2 italic">
                                {job.title}
                            </h2>
                            <p className="text-pink-500 font-bold text-sm">
                                {job.hospital} • {job.location}
                            </p>
                        </div>
                    )}

                    {/* Progress Bar Container */}
                    <div className="bg-white border border-pink-100 rounded-3xl p-8 mb-8 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <button 
                                onClick={() => router.push(`/jobs/${id}/apply/contact`)}
                                className="flex items-center gap-2 text-pink-600 font-bold text-sm hover:underline"
                            >
                                <ArrowLeft size={16} /> Back
                            </button>
                            <div className="flex-1 mx-4 h-2 bg-pink-50 rounded-full relative overflow-hidden">
                                <div
                                    className="absolute top-0 left-0 h-full bg-pink-600 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: '50%' }}
                                ></div>
                            </div>
                            <span className="text-[11px] font-black text-pink-400 uppercase tracking-widest mr-8">50%</span>
                            <button 
                                onClick={() => setShowSaveModal(true)}
                                className="text-pink-600 font-bold text-sm hover:underline"
                            >
                                Save and close
                            </button>
                        </div>

                        <div className="space-y-12">
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter italic">
                                Resume / CV
                            </h1>

                            {/* Resume Selection Card */}
                            <div className="border border-pink-200 rounded-3xl p-6 md:p-8 bg-pink-50/50 relative hover:border-pink-300 transition-colors">
                                <div className="flex items-center gap-6 mb-8 group">
                                    <div className="w-14 h-14 bg-pink-600 text-white rounded-2xl flex items-center justify-center shadow-md shadow-pink-200 group-hover:scale-105 transition-transform duration-300">
                                        <FileText size={28} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight italic">{resumeName}</h3>
                                        <p className="text-pink-400 font-bold text-sm">Uploaded today</p>
                                    </div>
                                    {uploading ? (
                                        <Loader2 size={28} className="animate-spin text-pink-600" />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-pink-600 uppercase tracking-widest hidden md:block">Ready to review</span>
                                            <CheckCircle2 className="text-pink-600" size={28} strokeWidth={2.5} />
                                        </div>
                                    )}
                                </div>

                                {/* Realistic Resume Preview (Indeed Style) */}
                                <div className="bg-white overflow-hidden border border-pink-100 rounded-2xl min-h-[500px] max-h-[600px] overflow-y-auto relative shadow-sm transition-all hover:shadow-md scrollbar-hide">
                                    <div className="p-10 space-y-8 pointer-events-none text-slate-800">
                                        {/* Resume Header */}
                                        <div className="text-center border-b border-slate-100 pb-8">
                                            <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Muhammad Qamer Hassan</h4>
                                            <p className="text-pink-600 font-bold text-sm mb-4">Full Stack Web Developer | AI Engineer</p>
                                            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-bold uppercase tracking-tight">
                                                <span>Lahore, Pakistan</span>
                                                <span className="text-slate-200">|</span>
                                                <span>qamerhassan645@gmail.com</span>
                                                <span className="text-slate-200">|</span>
                                                <span>0323-4519438</span>
                                            </div>
                                        </div>

                                        {/* About Me */}
                                        <div className="space-y-3">
                                            <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-pink-600 pl-3">About Me</h5>
                                            <p className="text-[11px] leading-[1.8] text-slate-600 font-medium">
                                                Experienced and results-driven AI Engineer and Full Stack Developer with a strong foundation in machine learning, deep learning, and intelligent systems. Proficient in Python, C++, neural networks, and mobile application development using Flutter.
                                            </p>
                                        </div>

                                        {/* Projects */}
                                        <div className="space-y-4">
                                            <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-blue-600 pl-3">Projects</h5>
                                            <div className="space-y-3 pl-4">
                                                <div className="space-y-1">
                                                    <p className="text-[11px] font-bold text-slate-800">• Nebula Concord — AI-powered strategy platform</p>
                                                    <p className="text-[11px] text-slate-500 pl-3">Built with .NET 10, SignalR, FastApi, LLMs.</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[11px] font-bold text-slate-800">• Auto-ia — Smart hotel management with AI pricing</p>
                                                    <p className="text-[11px] text-slate-500 pl-3">Predictive occupancy and sentiment analysis.</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Technical Skills */}
                                        <div className="space-y-4">
                                            <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-blue-600 pl-3">Technical Skills</h5>
                                            <div className="grid grid-cols-2 gap-x-8 gap-y-4 pl-4 pb-10">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Frontend</p>
                                                    <p className="text-[11px] text-slate-700 font-bold">Next.js, React, TypeScript</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Backend</p>
                                                    <p className="text-[11px] text-slate-700 font-bold">.NET, FastAPI, Node.js</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Fade effect */}
                                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
                                    
                                    {/* Premium "Apply with CV" Badge */}
                                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-white border border-blue-100 rounded-full shadow-lg flex items-center gap-3 animate-bounce duration-[2000ms]">
                                        <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                                        <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest whitespace-nowrap">Indeed-ready presentation</span>
                                    </div>
                                </div>

                                {/* CV Options Dropdown */}
                                <div className="mt-8 relative" ref={optionsRef}>
                                    <button
                                        onClick={() => setShowOptions(!showOptions)}
                                        className="w-full flex items-center justify-center gap-2 py-4 bg-white border border-blue-200 rounded-2xl font-black text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all uppercase tracking-wide text-sm"
                                    >
                                        <Settings size={18} />
                                        CV options
                                    </button>

                                    {showOptions && (
                                        <div className="absolute bottom-[calc(100%+12px)] left-0 w-full bg-white border border-blue-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-full flex items-center gap-3 px-6 py-4 text-blue-700 font-bold text-sm hover:bg-blue-50 transition-colors"
                                            >
                                                <Upload size={18} className="text-blue-400" />
                                                Upload a different file
                                            </button>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={handleFileUpload}
                                        accept=".pdf,.doc,.docx"
                                    />
                                </div>
                            </div>

                            {/* Save & Next Button */}
                            <button
                                onClick={() => router.push(`/jobs/${id}/apply/experience`)}
                                className="w-full py-5 bg-pink-600 text-white font-bold rounded-2xl text-lg hover:bg-pink-700 shadow-md shadow-pink-200 transition-all uppercase tracking-widest mt-4"
                            >
                                Save & Next
                            </button>

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
                                    className="w-full h-14 bg-pink-600 hover:bg-pink-700 text-white font-black uppercase tracking-widest rounded-2xl text-sm shadow-xl shadow-pink-100 transition-all active:scale-[0.98]"
                                >
                                    Save
                                </button>
                                <button 
                                    onClick={() => router.push('/dashboard')}
                                    className="w-full h-14 border border-slate-100 text-pink-600 font-bold rounded-2xl hover:bg-slate-50 transition-all active:scale-[0.98]"
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

            {/* 🔥 Reporting Modal (Indeed Style) */}
            {activeReportStep && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300">
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
                                                className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all text-left group"
                                            >
                                                <span className="text-slate-700 font-medium group-hover:text-blue-700 transition-colors">{cat}</span>
                                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
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

                                    <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex gap-3 mb-6">
                                        <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
                                        <p className="text-blue-900 text-[13px] leading-snug">
                                            Do not include any sensitive information such as phone numbers or email addresses.
                                        </p>
                                    </div>

                                    <textarea
                                        value={feedbackText}
                                        onChange={(e) => setFeedbackText(e.target.value)}
                                        placeholder="Type your feedback here..."
                                        className="w-full h-40 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-700 placeholder:text-slate-400 transition-all"
                                    />

                                    <div className="mt-8">
                                        <button
                                            onClick={handleSubmitFeedback}
                                            disabled={isSubmittingFeedback || !feedbackText.trim()}
                                            className="w-full h-14 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
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
                <div className="max-w-7xl mx-auto flex flex-wrap gap-x-8 gap-y-4 text-[11px] font-black text-slate-400 uppercase tracking-widest justify-center">
                    <Link href="#" className="hover:text-slate-900 transition-colors">Browse jobs</Link>
                    <Link href="#" className="hover:text-slate-900 transition-colors">Browse companies</Link>
                    <Link href="#" className="hover:text-slate-900 transition-colors">Countries</Link>
                    <Link href="#" className="hover:text-slate-900 transition-colors">About</Link>
                    <Link href="#" className="hover:text-slate-900 transition-colors">Help</Link>
                    <Link href="#" className="hover:text-slate-900 transition-colors">ESG at NurseFlex</Link>
                </div>
                <div className="text-center mt-6 text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">
                    © 2026 NurseFlex • Cookies, Privacy and Terms
                </div>
            </footer>
        </div>
    );
}
