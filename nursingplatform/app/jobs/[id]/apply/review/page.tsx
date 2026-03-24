'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft, FileText, CheckCircle2, Loader2, X,
    AlertCircle, ChevronRight, Mail, Phone, MapPin, User
} from 'lucide-react';
import api from '@/lib/api';

export default function ReviewPage() {
    const { id }     = useParams();
    const router     = useRouter();
    const [job, setJob]           = useState<any>(null);
    const [loading, setLoading]   = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [user, setUser]         = useState<any>(null);
    const [profile, setProfile]   = useState<any>(null);
    const [contact, setContact]   = useState<any>({});
    const [experience, setExperience] = useState<any>({});
    const [resumeName, setResumeName] = useState('');
    const [resumeUrl, setResumeUrl]   = useState<string | null>(null);
    const [resumeType, setResumeType] = useState<string | null>(null);
    const [emailUpdates, setEmailUpdates] = useState(true);
    const [reportStep, setReportStep]   = useState<'categories' | 'form' | null>(null);
    const [reportCat, setReportCat]     = useState('');
    const [reportText, setReportText]   = useState('');
    const [submittingReport, setSubmittingReport] = useState(false);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        const init = async () => {
            try {
                const [jobsRes, profileRes] = await Promise.allSettled([
                    api.get('/jobs'),
                    api.get('/profile'),
                ]);
                if (jobsRes.status === 'fulfilled') {
                    setJob(jobsRes.value.data.find((j: any) => j.id === id) || null);
                }
                if (profileRes.status === 'fulfilled') setProfile(profileRes.value.data);

                const localUser = JSON.parse(localStorage.getItem('user') || '{}');
                setUser(localUser);
                setContact(JSON.parse(localStorage.getItem('applicationContactData') || '{}'));
                setExperience(JSON.parse(localStorage.getItem('experienceFormData') || '{}'));

                const rUrl  = localStorage.getItem('uploadedResumeUrl');
                const rName = localStorage.getItem('uploadedResumeName');
                const rType = localStorage.getItem('uploadedResumeType');
                if (rUrl && rName) {
                    setResumeUrl(rUrl.startsWith('http') ? rUrl : `${API_BASE}${rUrl}`);
                    setResumeName(rName);
                    setResumeType(rType);
                }
            } catch (err) {
                console.error('ReviewPage init:', err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [id]);

    const handleSubmit = async () => {
        setSubmitting(true);
        
        // --- 1. MOCK JOB INTERCEPT ---
        // If it's a mock job, the backend will throw a 500 because the ID isn't a valid MongoDB ObjectId.
        // We simulate a successful submission instead.
        if (typeof id === 'string' && id.startsWith('m')) {
            setTimeout(() => {
                ['uploadedResumeUrl', 'uploadedResumeName', 'uploadedResumeType',
                 'experienceFormData', 'applicationContactData'].forEach(k => localStorage.removeItem(k));
                router.push(`/jobs/${id}/apply/success`);
                setSubmitting(false);
            }, 1000); // 1-second simulated delay
            return;
        }

        // --- 2. REAL JOB SUBMISSION ---
        const rUrl = localStorage.getItem('uploadedResumeUrl');
        try {
            await api.post('/applications/apply', {
                jobId:      id,
                resumeUrl:  rUrl || undefined,
                experience: experience,
            });
            ['uploadedResumeUrl', 'uploadedResumeName', 'uploadedResumeType',
             'experienceFormData', 'applicationContactData'].forEach(k => localStorage.removeItem(k));
            router.push(`/jobs/${id}/apply/success`);
        } catch (err: any) {
            const status = err.response?.status;
            const msg    = err.response?.data?.message || err.message;
            console.error(`Submit failed (${status}):`, msg);
            if (typeof msg === 'string' && (msg.includes('pehle hi apply') || msg.includes('already applied'))) {
                router.push(`/jobs/${id}/apply/success`);
                return;
            }
            if (status === 401) {
                alert('You are not logged in. Please sign in and try again.');
            } else {
                alert(`Submission failed: ${msg}`);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmitReport = async () => {
        if (!reportText.trim()) return;
        setSubmittingReport(true);
        try {
            await api.post('/issue-reports', { category: reportCat, message: reportText, jobId: id });
            setReportStep(null); setReportCat(''); setReportText('');
            alert('Feedback submitted!');
        } catch { alert('Failed to submit.'); }
        finally { setSubmittingReport(false); }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={36} />
        </div>
    );

    const fullName = contact.firstName && contact.lastName
        ? `${contact.firstName} ${contact.lastName}`
        : profile?.name || user?.name || 'Your Name';

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-10">
            <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                <button onClick={() => router.push(`/jobs/${id}/apply/experience`)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-medium">
                    <ArrowLeft size={16} /> Back
                </button>
                <p className="text-sm font-semibold text-slate-500">Step 4 of 4</p>
                <span className="text-sm font-semibold text-green-600">100% Done</span>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
                {job && (
                    <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {job.title[0]?.toUpperCase()}
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900 text-sm">{job.title}</p>
                            <p className="text-xs text-slate-400">{job.hospital} · {job.location}</p>
                        </div>
                    </div>
                )}

                <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                        <span>Progress</span><span>100%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full w-full bg-gradient-to-r from-blue-600 to-green-500 rounded-full" />
                    </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-1">
                    <h1 className="text-xl font-bold text-slate-900">Review Application</h1>
                    <p className="text-sm text-slate-400">You cannot make changes after submitting.</p>
                </div>

                {/* Contact */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Information</p>
                        <button onClick={() => router.push(`/jobs/${id}/apply/contact`)} className="text-xs font-semibold text-blue-600 hover:underline">Edit</button>
                    </div>
                    <div className="space-y-3">
                        {[
                            { icon: User,   label: 'Full Name',    value: fullName },
                            { icon: Mail,   label: 'Email',        value: contact.email  || user?.email  || '—' },
                            { icon: Phone,  label: 'Phone',        value: contact.phone  || '—' },
                            { icon: MapPin, label: 'City / State', value: contact.city && contact.province ? `${contact.city}, ${contact.province}` : (contact.city || '—') },
                        ].map(r => (
                            <div key={r.label} className="flex items-center gap-3">
                                <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                                    <r.icon size={13} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400">{r.label}</p>
                                    <p className="text-sm font-semibold text-slate-900">{r.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                        NurseFlex may hide your email to reduce fraud. The employer sees it only after proceeding with your application.
                    </p>
                </div>

                {/* Resume */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resume</p>
                        <button onClick={() => router.push(`/jobs/${id}/apply`)} className="text-xs font-semibold text-blue-600 hover:underline">Edit</button>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-500 rounded-xl flex items-center justify-center text-white shrink-0">
                            <FileText size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 text-sm truncate">{resumeName || 'No resume uploaded'}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{resumeName ? 'Uploaded' : 'No file attached'}</p>
                        </div>
                        {resumeName && <CheckCircle2 size={18} className="text-green-500 shrink-0" />}
                    </div>
                    {resumeUrl && (
                        <div className="rounded-xl border border-slate-100 overflow-hidden bg-slate-50" style={{ height: '300px' }}>
                            {resumeType?.startsWith('image/') ? (
                                <img src={resumeUrl} alt="Resume" className="w-full h-full object-contain" />
                            ) : (
                                <iframe src={`${resumeUrl}#toolbar=0&navpanes=0&view=FitH`} className="w-full h-full border-none" title="Resume" />
                            )}
                        </div>
                    )}
                </div>

                {/* Experience */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Relevant Experience</p>
                        <button onClick={() => router.push(`/jobs/${id}/apply/experience`)} className="text-xs font-semibold text-blue-600 hover:underline">Edit</button>
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900 text-sm">{experience.jobTitle || '—'}</p>
                        {experience.company && <p className="text-sm text-slate-500 mt-0.5">{experience.company}</p>}
                    </div>
                </div>

                {/* Email toggle */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between gap-5">
                    <div>
                        <p className="text-sm font-semibold text-slate-900">Get email updates for similar jobs</p>
                        <p className="text-xs text-slate-400 mt-0.5">You can unsubscribe at any time.</p>
                    </div>
                    <button onClick={() => setEmailUpdates(v => !v)}
                        className={`w-12 h-6 rounded-full relative transition-colors duration-300 shrink-0 ${emailUpdates ? 'bg-green-500' : 'bg-slate-200'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${emailUpdates ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed px-1">
                    By pressing Submit: you agree to our{' '}
                    <span className="text-blue-600 cursor-pointer hover:underline">Terms & Privacy Policies</span>.
                    Your application will be transmitted to the employer as entered.
                </p>

                <button onClick={handleSubmit} disabled={submitting}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-bold text-base rounded-2xl shadow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-3">
                    {submitting
                        ? <><Loader2 size={20} className="animate-spin" />Submitting...</>
                        : 'Submit Application'
                    }
                </button>

                <p className="text-center text-xs text-slate-400">
                    Having an issue?{' '}
                    <button onClick={() => setReportStep('categories')} className="text-blue-600 hover:underline font-medium">Tell us more</button>
                </p>
            </div>

            {reportStep && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-slate-50">
                            {reportStep === 'form' ? <button onClick={() => setReportStep('categories')} className="p-1.5 hover:bg-slate-50 rounded-full"><ArrowLeft size={16} /></button> : <div className="w-8" />}
                            <button onClick={() => setReportStep(null)} className="p-1.5 hover:bg-slate-50 rounded-full text-slate-400"><X size={18} /></button>
                        </div>
                        <div className="p-6">
                            {reportStep === 'categories' ? (
                                <>
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">What is the issue?</h3>
                                    <div className="space-y-2">
                                        {['Cannot submit application', 'Issues with resume', 'Information not saving', 'Something else'].map(cat => (
                                            <button key={cat} onClick={() => { setReportCat(cat); setReportStep('form'); }}
                                                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 text-sm text-slate-700 text-left transition-all">
                                                {cat} <ChevronRight size={14} className="text-slate-300" />
                                            </button>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">Tell us what happened</h3>
                                    <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl mb-4 text-xs text-blue-700">
                                        <AlertCircle size={13} className="shrink-0 mt-0.5" /> Don't include personal contact details.
                                    </div>
                                    <textarea value={reportText} onChange={e => setReportText(e.target.value)} rows={4}
                                        placeholder="Describe the issue..."
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none outline-none focus:border-blue-400 transition-all" />
                                    <button onClick={handleSubmitReport} disabled={submittingReport || !reportText.trim()}
                                        className="w-full h-11 mt-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                                        {submittingReport ? <><Loader2 size={14} className="animate-spin" />Submitting...</> : 'Submit Feedback'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
