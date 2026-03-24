'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, X, ChevronRight, AlertCircle, Briefcase, Building2 } from 'lucide-react';
import api from '@/lib/api';

export default function ExperiencePage() {
    const { id }  = useParams();
    const router  = useRouter();
    const [job, setJob]         = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [form, setForm]       = useState({ jobTitle: '', company: '' });
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
                const saved = localStorage.getItem('experienceFormData');
                if (saved) {
                    setForm(JSON.parse(saved));
                } else if (profileRes.status === 'fulfilled') {
                    const p = profileRes.value.data;
                    setForm({ jobTitle: p.jobTitles?.[0] || '', company: '' });
                }
            } catch (err) {
                console.error('ExperiencePage init:', err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [id]);

    useEffect(() => {
        localStorage.setItem('experienceFormData', JSON.stringify(form));
    }, [form]);

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

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                <button onClick={() => router.push(`/jobs/${id}/apply`)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-medium">
                    <ArrowLeft size={16} /> Back
                </button>
                <p className="text-sm font-semibold text-slate-500">Step 3 of 4</p>
                <button onClick={() => setShowSaveModal(true)} className="text-sm font-semibold text-blue-600 hover:underline">Save & close</button>
            </div>

            <div className="max-w-xl mx-auto px-4 py-8 space-y-5">
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
                        <span>Progress</span><span>75%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-gradient-to-r from-blue-600 to-green-500 rounded-full transition-all duration-700" />
                    </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Work Experience</h1>
                        <p className="text-sm text-slate-400 mt-0.5">We share your most recent job title with the employer.</p>
                    </div>

                    {[
                        { label: 'Most Recent Job Title', key: 'jobTitle', icon: Briefcase,  placeholder: 'e.g. Registered Nurse' },
                        { label: 'Company / Facility',    key: 'company',  icon: Building2,  placeholder: 'e.g. City Medical Center' },
                    ].map(f => (
                        <div key={f.key} className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{f.label}</label>
                            <div className="relative">
                                <f.icon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <input
                                    value={(form as any)[f.key]}
                                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                    placeholder={f.placeholder}
                                    className="w-full h-10 pl-8 pr-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white outline-none text-sm font-medium text-slate-900 transition-all"
                                />
                            </div>
                        </div>
                    ))}

                    <button onClick={() => router.push(`/jobs/${id}/apply/review`)}
                        className="w-full h-11 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all mt-2">
                        Save & Continue →
                    </button>

                    <p className="text-center text-xs text-slate-400">
                        Having an issue?{' '}
                        <button onClick={() => setReportStep('categories')} className="text-blue-600 hover:underline font-medium">Tell us more</button>
                    </p>
                </div>
            </div>

            {showSaveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-7 max-w-sm w-full shadow-2xl space-y-5 relative">
                        <button onClick={() => setShowSaveModal(false)} className="absolute top-4 right-4 text-slate-400"><X size={20} /></button>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Save progress before leaving?</h3>
                            <p className="text-sm text-slate-400 mt-1">You can finish within 14 days.</p>
                        </div>
                        <div className="space-y-3">
                            <button onClick={() => router.push('/dashboard')} className="w-full h-11 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold text-sm">Save & Exit</button>
                            <button onClick={() => router.push('/dashboard')} className="w-full h-11 border border-slate-200 text-slate-600 rounded-xl font-semibold text-sm hover:bg-slate-50">Don't Save</button>
                        </div>
                    </div>
                </div>
            )}

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
                                        {["Can't continue to next step", 'Form not saving', 'Something else'].map(cat => (
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
