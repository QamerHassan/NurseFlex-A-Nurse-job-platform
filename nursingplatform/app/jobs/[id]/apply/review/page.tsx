'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, FileText, CheckCircle2, ChevronDown,
    Download, Loader2, X, AlertCircle, ChevronRight, Mail, Phone, MapPin,
    ShieldCheck, Share2, Info, CheckCircle
} from 'lucide-react';
import api from '@/lib/api';

export default function ReviewPage() {
    const { id } = useParams();
    const router = useRouter();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [experience, setExperience] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);
    const [resumeName, setResumeName] = useState('Resume.pdf');
    const [emailUpdates, setEmailUpdates] = useState(true);

    // 🔥 Reporting States
    const [activeReportStep, setActiveReportStep] = useState<'categories' | 'form' | null>(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [feedbackText, setFeedbackText] = useState('');
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
    
    const reportModalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get JWT token from storage
                const token = localStorage.getItem('token') || localStorage.getItem('business_token');
                
                const [jobsRes, userJson, profileRes] = await Promise.all([
                    api.get('/jobs'),
                    Promise.resolve(localStorage.getItem('user')),
                    token ? api.get('/profile').catch(() => ({ data: null })) : Promise.resolve({ data: null })
                ]);

                const foundJob = jobsRes.data.find((j: any) => j.id === id);
                setJob(foundJob);
                
                if (userJson) setUser(JSON.parse(userJson));
                if (profileRes.data) setProfile(profileRes.data);

                // Load Contact Data from Step 1
                const contactData = localStorage.getItem('applicationContactData');
                if (contactData) setProfile((prev: any) => ({ ...prev, ...JSON.parse(contactData) }));

                // Load Experience data from Step 3
                const expData = localStorage.getItem('experienceFormData');
                if (expData) setExperience(JSON.parse(expData));


                const storedResumeName = localStorage.getItem('uploadedResumeName');
                if (storedResumeName) setResumeName(storedResumeName);
            } catch (err) {
                console.error("Failed to fetch data for review page", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleReportIssue = () => {
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
            console.error('Failed to submit feedback');
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
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeReportStep]);

    const handleSubmit = async () => {
        setSubmitting(true);
        const resumeUrl = localStorage.getItem('uploadedResumeUrl');

        try {
            await api.post('/applications/apply', {
                jobId: id,
                resumeUrl: resumeUrl || undefined,
                experience: experience // Send the experience data too
            });

            // Clear local uploads
            localStorage.removeItem('uploadedResumeUrl');
            localStorage.removeItem('uploadedResumeName');
            localStorage.removeItem('experienceFormData');
            localStorage.removeItem('applicationContactData');

            router.push(`/jobs/${id}/apply/success`);
        } catch (err: any) {
            const status = err.response?.status;
            const backendMsg = err.response?.data?.message || err.message || 'Unknown error';
            console.error('Failed to submit application - HTTP ' + status + ':', backendMsg, err.response?.data);

            if (typeof backendMsg === 'string' && backendMsg.includes('pehle hi apply')) {
                router.push(`/jobs/${id}/apply/success`);
            } else if (status === 401) {
                alert("You are not logged in. Please log in and try again.");
            } else {
                alert('Submission failed (' + status + '): ' + backendMsg);
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 className="animate-spin text-pink-600" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen bg-white font-sans flex flex-col relative">
            <main className="flex-1 flex flex-col items-center bg-pink-50/20 pb-24">
                <div className="max-w-xl w-full px-4 pt-10">

                    {/* Job Header Info (Indeed Style) */}
                    <div className="mb-8 text-center bg-white border border-pink-100 rounded-3xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">{job?.title}</h2>
                        <p className="text-sm text-pink-500 font-medium">{job?.hospital} — {job?.location}</p>
                    </div>

                    {/* Progress & Header */}
                    <div className="mb-12">
                        <div className="flex justify-between items-center mb-6">
                            <button
                                onClick={() => router.push(`/jobs/${id}/apply/experience`)}
                                className="flex items-center gap-2 text-pink-600 font-bold text-sm hover:underline"
                            >
                                <ArrowLeft size={16} /> Back
                            </button>

                            <button className="text-pink-600 font-bold text-xs hover:underline uppercase tracking-widest">Save and close</button>
                        </div>

                        <div className="flex items-center gap-4 mb-10">
                            <div className="flex-1 h-1.5 bg-pink-50 rounded-full overflow-hidden">
                                <div className="h-full bg-pink-600 rounded-full w-full"></div>
                            </div>
                            <span className="text-[10px] font-black text-pink-600 uppercase tracking-[0.2em]">100%</span>
                        </div>

                        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                            Review Application
                        </h1>
                        <p className="text-pink-600 font-medium text-base mb-10">
                            You will not be able to make changes after you submit your application.
                        </p>
                    </div>

                    {/* REVIEW SECTIONS CONTAINER */}
                    <div className="space-y-12">
                        
                        {/* 1. CONTACT INFORMATION */}
                        <section className="space-y-6">
                            <div className="flex justify-between items-end border-b border-pink-50 pb-2">
                                <h3 className="text-[11px] font-black text-pink-400 uppercase tracking-[0.2em]">Contact information</h3>
                                <button onClick={() => router.push('/profile')} className="text-pink-600 font-bold text-[13px] hover:underline">Edit</button>
                            </div>
                            
                            <div className="space-y-6 pl-1">
                                <div>
                                    <p className="text-[10px] font-bold text-pink-300 uppercase tracking-widest mb-1.5">Full name</p>
                                    <p className="text-lg font-bold text-slate-900">{user?.name || profile?.name || 'Qamer Hassan'}</p>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-pink-300 uppercase tracking-widest mb-1.5">Email</p>
                                    <p className="text-lg font-bold text-slate-900">{user?.email || 'qamerhassan6@gmail.com'}</p>
                                    <p className="text-[11px] text-pink-400 font-medium leading-[1.6]">
                                        To reduce fraud, NurseFlex may hide your email address. If your email address is hidden, an employer will not be able to see your real email. Some employers may still be able to see your real email address.
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold text-pink-300 uppercase tracking-widest mb-1.5">Phone number</p>
                                    <p className="text-lg font-bold text-slate-900">{profile?.phone || '+92 324 5963808'}</p>
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold text-pink-300 uppercase tracking-widest mb-1.5">City, Province/Territory</p>
                                    <p className="text-lg font-bold text-slate-900">{profile?.location || 'Lahore'}</p>
                                </div>
                            </div>
                        </section>

                        {/* 2. RESUME PREVIEW */}
                        <section className="space-y-6">
                            <div className="flex justify-between items-end border-b border-pink-50 pb-2">
                                <h3 className="text-[11px] font-black text-pink-400 uppercase tracking-[0.2em]">Resume</h3>
                                <div className="flex gap-5">
                                    <button className="text-pink-600 font-bold text-[13px] hover:underline">Download</button>
                                    <button onClick={() => router.back()} className="text-pink-600 font-bold text-[13px] hover:underline">Edit</button>
                                </div>
                            </div>

                            <div className="bg-white border border-pink-100 rounded-[2rem] p-6 shadow-sm group hover:border-pink-200 transition-all">
                                <div className="flex items-center gap-5 mb-8">
                                    <div className="w-14 h-14 bg-pink-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-pink-100 group-hover:scale-105 transition-transform">
                                        <FileText size={28} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-lg font-black text-slate-900 truncate pr-4">{resumeName}</p>
                                        <p className="text-[11px] text-pink-400 font-bold uppercase tracking-widest mt-0.5">Uploaded just now</p>
                                    </div>
                                </div>
                                {/* Premium Resume Sheet Preview */}
                                    <div className="bg-pink-50/20 border border-pink-100 rounded-[2rem] p-6 md:p-8 h-[600px] overflow-y-auto relative shadow-inner scrollbar-hide group">
                                        <div className="bg-white rounded-lg shadow-xl p-10 min-h-fit space-y-8 transform transition-all duration-500 border border-slate-50">
                                            {/* Resume Header */}
                                            <div className="text-center border-b border-slate-100 pb-8">
                                                <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Muhammad Qamer Hassan</h4>
                                                <p className="text-pink-600 font-bold text-sm mb-4">Full Stack Web Developer | AI Engineer</p>
                                                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-bold">
                                                    <span>Lahore, Pakistan</span>
                                                    <span className="text-slate-200">|</span>
                                                    <span>qamerhassan645@gmail.com</span>
                                                    <span className="text-slate-200">|</span>
                                                    <span>0323-4519438</span>
                                                </div>
                                                <div className="flex justify-center gap-4 mt-3 text-[10px] text-pink-500 font-black uppercase tracking-widest">
                                                    <span>LinkedIn.com/in/qamer-hassan</span>
                                                    <span>Github.com/QamerHassan</span>
                                                </div>
                                            </div>

                                            {/* About Me */}
                                            <div className="space-y-3">
                                                <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-pink-600 pl-3">About Me</h5>
                                                <p className="text-[11px] leading-[1.8] text-slate-600 font-medium">
                                                    Experienced and results-driven AI Engineer and Full Stack Developer with a strong foundation in machine learning, deep learning, and intelligent systems. Proficient in Python, C++, neural networks, and mobile application development using Flutter. Demonstrated ability to design scalable AI-powered solutions, collaborate effectively in team environments, and actively contribute to open-source projects. Passionate about solving real-world problems through data-driven and intelligent technologies.
                                                </p>
                                            </div>

                                            {/* Projects */}
                                            <div className="space-y-4">
                                                <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-pink-600 pl-3">Projects</h5>
                                            <div className="space-y-3 pl-4">
                                                <div className="space-y-1">
                                                    <p className="text-[11px] font-bold text-slate-800">• Nebula Concord — AI-powered real-time multiplayer strategy platform</p>
                                                    <p className="text-[11px] text-slate-500 pl-3 leading-relaxed">Built with .NET 10, SignalR, FastApi, LLMs for dynamic world generation.</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[11px] font-bold text-slate-800">• Auto-ia — Enterprise smart hotel management platform with AI pricing</p>
                                                    <p className="text-[11px] text-slate-500 pl-3 leading-relaxed">Nex-gen hotel management with sentiment analysis and predictive occupancy.</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[11px] font-bold text-slate-800">• Bio Management System — Business-grade system with JWT, RBAC, PDF reports</p>
                                                    <p className="text-[11px] text-slate-500 pl-3 leading-relaxed">Features D-Docs, automated invoicing and real-time inventory tracking.</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Technical Skills */}
                                        <div className="space-y-4">
                                            <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-pink-600 pl-3">Technical Skills</h5>
                                            <div className="grid grid-cols-2 gap-x-8 gap-y-4 pl-4">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Frontend</p>
                                                    <p className="text-[11px] text-slate-700 font-bold">Next.js, React, TypeScript, Tailwind CSS</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Backend</p>
                                                    <p className="text-[11px] text-slate-700 font-bold">.NET 10 Web API, FastAPI, Django REST, NestJS</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI & Data</p>
                                                    <p className="text-[11px] text-slate-700 font-bold">Machine Learning, NLP, Recommendation Systems</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">DevOps</p>
                                                    <p className="text-[11px] text-slate-700 font-bold">Docker, Kubernetes, GitHub Actions, AWS</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Education */}
                                        <div className="space-y-3 pb-4">
                                            <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-pink-600 pl-3">Education</h5>
                                            <div className="pl-4 space-y-2">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-[11px] font-bold text-slate-800">BS in Artificial Intelligence</p>
                                                        <p className="text-[10px] text-slate-500 font-bold">University of Management and Technology</p>
                                                    </div>
                                                    <p className="text-[10px] font-black text-pink-600 uppercase">2021 — 2025</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Subtle Fade for long pages */}
                                    <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-pink-50/80 to-transparent pointer-events-none rounded-b-[2rem]"></div>
                                </div>
                            </div>
                        </section>

                        {/* 3. RELEVANT EXPERIENCE */}
                        <section className="space-y-6">
                            <div className="flex justify-between items-end border-b border-pink-50 pb-2">
                                <h3 className="text-[11px] font-black text-pink-400 uppercase tracking-[0.2em]">Relevant experience</h3>
                                <button onClick={() => router.back()} className="text-pink-600 font-bold text-[13px] hover:underline">Edit</button>
                            </div>

                            <div className="bg-white border border-pink-100 rounded-[2rem] p-7 shadow-sm">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-lg font-black text-slate-900">{experience?.jobTitle || 'ICU'}</p>
                                        <p className="text-base text-pink-600 font-semibold">{experience?.company || 'City hospital'}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 4. SUPPORTING DOCUMENTS */}
                        <section className="space-y-6">
                            <div className="flex justify-between items-end border-b border-pink-50 pb-2">
                                <h3 className="text-[11px] font-black text-pink-400 uppercase tracking-[0.2em]">Supporting documents</h3>
                                <button className="text-pink-600 font-bold text-[13px] hover:underline">Add</button>
                            </div>

                            <div className="bg-pink-50/20 border border-pink-100 border-dashed rounded-[2rem] p-10 text-center">
                                <p className="text-pink-400 font-bold text-sm tracking-wide">
                                    No cover letter or additional documents included (optional)
                                </p>
                            </div>
                        </section>

                        {/* 5. EMAIL UPDATES TOGGLE (Premium UI) */}
                        <section className="pt-6 border-t border-pink-50">
                            <div className="flex items-center justify-between gap-6 px-2">
                                <div className="flex-1">
                                    <h4 className="font-black text-slate-900 text-sm tracking-tight leading-tight mb-1">
                                        Get email updates for the latest jobs
                                    </h4>
                                    <p className="text-[10px] text-pink-400 font-medium leading-[1.6]">
                                        By creating a job alert, you agree to our Terms. You can change your consent settings at any time by unsubscribing or as detailed in our terms.
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setEmailUpdates(!emailUpdates)}
                                    className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${emailUpdates ? 'bg-pink-600' : 'bg-slate-200'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-sm ${emailUpdates ? 'translate-x-7' : ''}`}></div>
                                </button>
                            </div>
                        </section>

                        {/* DISCLOSURE TEXT */}
                        <div className="space-y-8 pt-4">
                            <p className="text-[11px] text-pink-400 font-medium leading-[1.8]">
                                By pressing apply: 1) you agree to our <span className="text-pink-600 underline cursor-pointer">Terms, Cookie & Privacy Policies</span>; 2) you consent to your application being transmitted to the Employer (Indeed does not guarantee receipt), & processed & analysed in accordance with its & NurseFlex's terms & privacy policies; & 3) you acknowledge that when you apply to jobs outside your country it may involve you sending your personal data to countries with lower levels of data protection; & 4) that we may hide your contact information until this employer moves forward with your application. <span className="text-pink-600 underline cursor-pointer">What the employer sees</span>
                            </p>

                            <p className="text-[11px] text-pink-300 font-bold italic leading-tight uppercase tracking-tight">
                                You're currently subscribed to receiving calls or text messages from employers you've applied to, and Indeed. You can change this in <span className="text-pink-600 underline cursor-pointer">privacy settings</span>.
                            </p>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <div className="pt-6">
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="w-full h-16 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-300 text-white font-black text-lg rounded-[2rem] shadow-2xl shadow-pink-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3 tracking-widest uppercase"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={24} />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit your application'
                                )}
                            </button>
                        </div>

                        {/* REPORTING SECTION */}
                        <div className="text-center space-y-6">
                            <p className="text-[11px] font-black text-pink-400 uppercase tracking-[0.2em] leading-relaxed">
                                Having an issue with this application? <span onClick={handleReportIssue} className="text-pink-600 underline cursor-pointer hover:text-pink-700">Tell us more</span>
                            </p>
                            <div className="text-[9px] text-pink-300 font-black uppercase tracking-widest max-w-md mx-auto leading-relaxed">
                                This site is protected by reCAPTCHA and the Google <span className="underline hover:text-pink-400 cursor-pointer">Privacy Policy</span> and <span className="underline hover:text-pink-400 cursor-pointer">Terms of Service</span> apply.
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* 🔥 Reporting Modal UI */}
            {activeReportStep && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300">
                    <div 
                        ref={reportModalRef}
                        className="bg-white w-full max-w-[480px] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-50">
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
                                    <h2 className="text-2xl font-black text-slate-900 mb-2">What is the issue?</h2>
                                    <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium">
                                        Your feedback will help us fix issues and improve your experience.
                                    </p>

                                    <div className="space-y-2">
                                        {[
                                            "Unable to continue to the next step",
                                            "Email address cannot be updated",
                                            "Unable to upload a file",
                                            "Issues with my resume or cover letter",
                                            "There's a technical problem",
                                            "Something else"
                                        ].map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => {
                                                    setSelectedCategory(cat);
                                                    setActiveReportStep('form');
                                                }}
                                                className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-pink-200 hover:bg-pink-50/30 transition-all text-left group"
                                            >
                                                <span className="text-slate-700 font-bold group-hover:text-pink-700 transition-colors text-sm">{cat}</span>
                                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-pink-500 transition-colors" />
                                            </button>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Please tell us what happened</h2>
                                    <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium">
                                        Your feedback won't be shared with the employer.
                                    </p>

                                    <div className="bg-pink-50/50 border border-pink-100 p-4 rounded-2xl flex gap-3 mb-6">
                                        <AlertCircle className="w-5 h-5 text-pink-600 shrink-0" />
                                        <p className="text-pink-900 text-[13px] font-semibold leading-snug">
                                            Do not include any sensitive information such as phone numbers or email addresses.
                                        </p>
                                    </div>

                                    <textarea
                                        value={feedbackText}
                                        onChange={(e) => setFeedbackText(e.target.value)}
                                        placeholder="Type your feedback here..."
                                        className="w-full h-40 p-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-pink-100 resize-none text-slate-700 font-bold placeholder:text-slate-400 transition-all text-sm"
                                    />

                                    <div className="mt-8">
                                        <button
                                            onClick={handleSubmitFeedback}
                                            disabled={isSubmittingFeedback || !feedbackText.trim()}
                                            className="w-full h-14 bg-pink-600 hover:bg-pink-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] uppercase tracking-widest text-sm shadow-xl shadow-pink-50"
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
                <p className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-[0.4em]">
                    © 2026 NurseFlex • Excellence in Healthcare Recruitment
                </p>
            </footer>
        </div>
    );
}
