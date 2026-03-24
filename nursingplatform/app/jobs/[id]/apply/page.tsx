'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FileText, CheckCircle2, Upload, Loader2, X, ArrowLeft, AlertCircle, ChevronRight } from 'lucide-react';
import api from '@/lib/api';

export default function ApplyPage() {
    const { id }   = useParams();
    const router   = useRouter();
    const fileRef  = useRef<HTMLInputElement>(null);

    const [job, setJob]                 = useState<any>(null);
    const [loading, setLoading]         = useState(true);
    const [uploading, setUploading]     = useState(false);
    const [profile, setProfile]         = useState<any>(null);
    const [resumeName, setResumeName]   = useState('');
    const [localPreview, setLocalPreview] = useState<{ url: string; type: string } | null>(null);
    const [showSaveModal, setShowSaveModal] = useState(false);

    // Report issue
    const [reportStep, setReportStep]   = useState<'categories' | 'form' | null>(null);
    const [reportCat, setReportCat]     = useState('');
    const [reportText, setReportText]   = useState('');
    const [submittingReport, setSubmittingReport] = useState(false);

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

                // Restore saved resume
                const savedUrl  = localStorage.getItem('uploadedResumeUrl');
                const savedName = localStorage.getItem('uploadedResumeName');
                const savedType = localStorage.getItem('uploadedResumeType');
                if (savedUrl && savedName) {
                    setResumeName(savedName);
                    if (savedUrl.startsWith('/uploads')) {
                        const full = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${savedUrl}`;
                        setLocalPreview({ url: full, type: savedType || 'application/pdf' });
                    }
                }
            } catch (err) {
                console.error('ApplyPage init error:', err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [id]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setResumeName(file.name);
        const blob = URL.createObjectURL(file);
        setLocalPreview({ url: blob, type: file.type });
        try {
            const fd = new FormData();
            fd.append('file', file);
            const res = await api.post('/applications/upload-resume', fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            localStorage.setItem('uploadedResumeUrl',  res.data.url);
            localStorage.setItem('uploadedResumeName', file.name);
            localStorage.setItem('uploadedResumeType', file.type);
        } catch (err) {
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmitReport = async () => {
        if (!reportText.trim()) return;
        setSubmittingReport(true);
        try {
            await api.post('/issue-reports', { category: reportCat, message: reportText, jobId: id });
            setReportStep(null); setReportCat(''); setReportText('');
            alert('Feedback submitted. Thank you!');
        } catch { alert('Failed to submit. Try again.'); }
        finally { setSubmittingReport(false); }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={36} />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Top bar */}
            <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                <button onClick={() => router.push(`/jobs/${id}/apply/contact`)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-medium">
                    <ArrowLeft size={16} /> Back
                </button>
                <p className="text-sm font-semibold text-slate-500">Step 2 of 4</p>
                <button onClick={() => setShowSaveModal(true)} className="text-sm font-semibold text-blue-600 hover:underline">Save & close</button>
            </div>

            <div className="max-w-xl mx-auto px-4 py-8 space-y-5">
                {/* Job card */}
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

                {/* Progress */}
                <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                        <span>Progress</span><span>50%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full w-1/2 bg-gradient-to-r from-blue-600 to-green-500 rounded-full transition-all duration-700" />
                    </div>
                </div>

                {/* Resume card */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Resume / CV</h1>
                        <p className="text-sm text-slate-400 mt-0.5">Upload your latest resume to share with employers.</p>
                    </div>

                    {/* File info */}
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-green-500 rounded-xl flex items-center justify-center text-white shrink-0">
                            <FileText size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 text-sm truncate">
                                {resumeName || 'No resume uploaded'}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                                {uploading ? 'Uploading...' : resumeName ? 'Ready to submit' : 'Upload a PDF, DOC, or image'}
                            </p>
                        </div>
                        {uploading
                            ? <Loader2 size={20} className="animate-spin text-blue-600 shrink-0" />
                            : resumeName
                                ? <CheckCircle2 size={20} className="text-green-500 shrink-0" />
                                : null
                        }
                    </div>

                    {/* PDF Preview */}
                    {localPreview && (
                        <div className="rounded-2xl border border-slate-100 overflow-hidden bg-slate-50" style={{ height: '400px' }}>
                            {localPreview.type.startsWith('image/') ? (
                                <img src={localPreview.url} alt="Resume" className="w-full h-full object-contain" />
                            ) : localPreview.type === 'application/pdf' ? (
                                <iframe src={`${localPreview.url}#toolbar=0&navpanes=0&view=FitH`} className="w-full h-full border-none" title="Resume Preview" />
                            ) : null}
                        </div>
                    )}

                    {/* Upload / Change button */}
                    <button onClick={() => fileRef.current?.click()}
                        className="w-full h-10 border border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 rounded-xl text-sm font-semibold text-slate-500 hover:text-blue-600 flex items-center justify-center gap-2 transition-all">
                        <Upload size={15} /> {resumeName ? 'Upload a different file' : 'Upload Resume'}
                    </button>
                    <input type="file" ref={fileRef} className="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={handleFileUpload} />

                    <button
                        onClick={() => router.push(`/jobs/${id}/apply/experience`)}
                        disabled={uploading}
                        className="w-full h-11 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-70">
                        Save & Continue →
                    </button>

                    <p className="text-center text-xs text-slate-400">
                        Having an issue?{' '}
                        <button onClick={() => setReportStep('categories')} className="text-blue-600 hover:underline font-medium">Tell us more</button>
                    </p>
                </div>
            </div>

            {/* Save modal */}
            {showSaveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-7 max-w-sm w-full shadow-2xl space-y-5 relative">
                        <button onClick={() => setShowSaveModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X size={20} /></button>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Save progress before leaving?</h3>
                            <p className="text-sm text-slate-400 mt-1">You can finish this application within 14 days.</p>
                        </div>
                        <div className="space-y-3">
                            <button onClick={() => router.push('/dashboard')} className="w-full h-11 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold text-sm">Save & Exit</button>
                            <button onClick={() => router.push('/dashboard')} className="w-full h-11 border border-slate-200 text-slate-600 rounded-xl font-semibold text-sm hover:bg-slate-50">Don't Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Report modal */}
            {reportStep && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-slate-50">
                            {reportStep === 'form'
                                ? <button onClick={() => setReportStep('categories')} className="p-1.5 hover:bg-slate-50 rounded-full"><ArrowLeft size={16} /></button>
                                : <div className="w-8" />
                            }
                            <button onClick={() => setReportStep(null)} className="p-1.5 hover:bg-slate-50 rounded-full text-slate-400"><X size={18} /></button>
                        </div>
                        <div className="p-6">
                            {reportStep === 'categories' ? (
                                <>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">What is the issue?</h3>
                                    <p className="text-sm text-slate-400 mb-5">Your feedback helps us improve.</p>
                                    <div className="space-y-2">
                                        {["Unable to upload a file", "Can't continue to next step", 'Issues with resume', 'Something else'].map(cat => (
                                            <button key={cat} onClick={() => { setReportCat(cat); setReportStep('form'); }}
                                                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 text-sm text-slate-700 font-medium transition-all text-left">
                                                {cat} <ChevronRight size={14} className="text-slate-300" />
                                            </button>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">Tell us what happened</h3>
                                    <p className="text-sm text-slate-400 mb-4">This won't be shared with the employer.</p>
                                    <div className="flex items-start gap-2.5 p-3 bg-blue-50 border border-blue-100 rounded-xl mb-4 text-xs text-blue-700">
                                        <AlertCircle size={14} className="shrink-0 mt-0.5" /> Don't include phone numbers or emails.
                                    </div>
                                    <textarea value={reportText} onChange={e => setReportText(e.target.value)} rows={4}
                                        placeholder="Describe the issue..."
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none outline-none focus:border-blue-400 focus:bg-white transition-all" />
                                    <button onClick={handleSubmitReport} disabled={submittingReport || !reportText.trim()}
                                        className="w-full h-11 mt-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold text-sm disabled:opacity-50 transition-all flex items-center justify-center gap-2">
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
