"use client";
import React from 'react';
import Link from 'next/link';
import {
    DollarSign, Briefcase, Clock, MapPin, Building2,
    Send, Bookmark, Share2, CheckCircle2, Loader2,
    AlertCircle, ExternalLink, Flag, ChevronRight,
    Users, Calendar, Zap, BadgeCheck
} from 'lucide-react';
import { Separator } from "@/app/components/ui/separator";
import { HospitalLogo } from '@/app/components/HospitalLogo';

interface JobDetailPaneProps {
    job: any;
    isSaved: boolean;
    isApplied: boolean;
    isApplying: boolean;
    onSave: (e: React.MouseEvent) => void;
    onApply: (e: React.MouseEvent) => void;
}

// ─── Parse description into structured sections ───────────────────────────────
function parseJobDescription(raw: string): { heading: string | null; lines: string[] }[] {
    if (!raw) return [];

    const HEADINGS = [
        'Description:', 'Job Description', 'Overview:', 'About the Role',
        'Responsibilities:', 'Key Responsibilities:', 'What You\'ll Do:',
        'Requirements:', 'Required Qualifications:', 'Qualifications:',
        'What We\'re Looking For:', 'Must Have:',
        'Preferred Qualifications:', 'Nice to Have:', 'Preferred:',
        'Work Environment:', 'Schedule:', 'Shift Information:',
        'What We Offer:', 'Benefits:', 'Compensation:',
        'How to Apply:', 'Note:', 'Additional Information:',
        'About Us:', 'About the Company:',
    ];

    const sections: { heading: string | null; lines: string[] }[] = [];
    let current: { heading: string | null; lines: string[] } = { heading: null, lines: [] };

    raw.split('\n').forEach(rawLine => {
        const line = rawLine.trim();
        if (!line) return;

        const isHeading = HEADINGS.some(h =>
            line.toLowerCase().startsWith(h.toLowerCase()) ||
            (line.endsWith(':') && line.length < 60 && !line.startsWith('•') && !line.startsWith('-'))
        );
        const isMeta = /^(Job Title|Company|Location|Position Type|Salary|Pay|Job Type|Work Location):/i.test(line);

        if (isHeading && !isMeta) {
            if (current.lines.length > 0 || current.heading) sections.push(current);
            current = { heading: line.replace(/:$/, ''), lines: [] };
        } else {
            current.lines.push(line);
        }
    });

    if (current.lines.length > 0 || current.heading) sections.push(current);
    return sections.filter(s => s.lines.length > 0 || s.heading);
}

// ─── Render one line ──────────────────────────────────────────────────────────
function DescLine({ text }: { text: string }) {
    const isBullet = text.startsWith('•') || text.startsWith('-') || text.startsWith('*');
    const content = isBullet ? text.replace(/^[•\-\*]\s*/, '') : text;

    if (isBullet) {
        return (
            <li className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0 mt-2" />
                {content}
            </li>
        );
    }
    return <p className="text-sm text-slate-600 leading-relaxed">{content}</p>;
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function JobDetailPane({
    job, isSaved, isApplied, isApplying, onSave, onApply
}: JobDetailPaneProps) {
    if (!job) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-10">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                    <Briefcase size={28} className="text-slate-300" />
                </div>
                <p className="font-semibold text-slate-400">Select a job to view details</p>
                <p className="text-sm text-slate-300 mt-1">Click any listing on the left</p>
            </div>
        );
    }

    const sections = parseJobDescription(job.description || '');

    return (
        <div className="flex flex-col h-full">
            <div className="p-6 space-y-6">

                    {/* ── Job header ── */}
                    <div className="flex gap-4 items-start">
                        {/* Real hospital logo — supports both backend logo URL & Clearbit lookup */}
                        <HospitalLogo
                            name={job.hospital || job.businessName}
                            logo={job.logo || (job.business && job.business.logo)}
                            size={64}
                        />
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold text-slate-900 leading-tight">{job.title}</h2>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                                <Link href="#" className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1">
                                    {job.hospital || job.businessName}
                                    <ExternalLink size={12} />
                                </Link>
                                <span className="text-slate-300">·</span>
                                <span className="text-sm text-slate-500 flex items-center gap-1">
                                    <MapPin size={12} />{job.location}
                                </span>
                                {job.salary && (
                                    <>
                                        <span className="text-slate-300">·</span>
                                        <span className="text-sm font-semibold text-green-700">${job.salary}/hr</span>
                                    </>
                                )}
                            </div>
                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                <Zap size={11} className="text-blue-500 fill-blue-500" />
                                Responded to 80–90% of applications in the past 30 days
                            </p>
                        </div>
                    </div>

                    {/* ── Apply / Save / Share ── */}
                    <div className="flex items-center gap-3 flex-wrap">
                        {isApplied ? (
                            <div className="flex items-center gap-2 h-11 px-5 rounded-xl bg-green-50 border border-green-100 text-green-700 font-semibold text-sm">
                                <CheckCircle2 size={16} /> Applied Successfully
                            </div>
                        ) : (
                            <button onClick={onApply} disabled={isApplying}
                                className="h-11 px-7 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center gap-2 shadow-md transition-all disabled:opacity-70">
                                {isApplying
                                    ? <><Loader2 size={15} className="animate-spin" />Applying...</>
                                    : <><Send size={15} className="fill-white" />Apply now</>
                                }
                            </button>
                        )}
                        <button onClick={onSave}
                            className="h-11 w-11 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all">
                            <Bookmark size={18} className={isSaved ? 'fill-blue-600 text-blue-600' : ''} />
                        </button>
                        <button className="h-11 w-11 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all">
                            <Share2 size={18} />
                        </button>
                        {!isApplied && (
                            <button onClick={onApply}
                                className="h-11 px-5 rounded-xl border border-slate-200 text-slate-600 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50 font-semibold text-sm flex items-center gap-2 transition-all">
                                Full Application <ChevronRight size={14} />
                            </button>
                        )}
                    </div>

                    <Separator className="bg-slate-100" />

                    {/* ── Job details box ── */}
                    <div className="border border-slate-200 rounded-2xl overflow-hidden">
                        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
                            <p className="font-semibold text-slate-900 text-sm">Job details</p>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Here's how the job details align with your{' '}
                                <Link href="/profile" className="text-blue-600 hover:underline">profile</Link>.
                            </p>
                        </div>

                        <div className="p-5 space-y-5">
                            {/* Pay */}
                            {job.salary && (
                                <div className="flex items-start gap-3">
                                    <DollarSign size={18} className="text-slate-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Pay</p>
                                        <div className="flex flex-wrap gap-2 mt-1.5">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
                                                ${job.salary}/hr
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <Separator className="bg-slate-100" />

                            {/* Job type */}
                            <div className="flex items-start gap-3">
                                <Briefcase size={18} className="text-slate-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">Job type</p>
                                    <div className="flex flex-wrap gap-2 mt-1.5">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
                                            <CheckCircle2 size={11} className="text-green-500" />
                                            {job.type || 'Full-time'}
                                        </span>
                                        {job.shiftType && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
                                                <CheckCircle2 size={11} className="text-green-500" />
                                                {job.shiftType}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Location ── */}
                    <div className="border border-slate-200 rounded-2xl p-5">
                        <p className="font-semibold text-slate-900 text-sm mb-3">Location</p>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <MapPin size={15} className="text-slate-400 shrink-0" />
                            {job.location}
                        </div>
                        {job.department && (
                            <div className="flex items-center gap-2 text-sm text-slate-600 mt-2">
                                <Building2 size={15} className="text-slate-400 shrink-0" />
                                {job.department}
                            </div>
                        )}
                    </div>

                    {/* ── Full description ── */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                            Full job description
                        </h3>

                        {sections.length > 0 ? (
                            <div className="space-y-5">
                                {sections.map((section, i) => (
                                    <div key={i} className="space-y-2">
                                        {section.heading && (
                                            <h4 className="font-semibold text-slate-900 text-sm">{section.heading}</h4>
                                        )}
                                        {section.lines.some(l => l.startsWith('•') || l.startsWith('-') || l.startsWith('*')) ? (
                                            <ul className="space-y-1.5 pl-1">
                                                {section.lines.map((line, j) => <DescLine key={j} text={line} />)}
                                            </ul>
                                        ) : (
                                            <div className="space-y-1.5">
                                                {section.lines.map((line, j) => <DescLine key={j} text={line} />)}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : job.description ? (
                            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
                        ) : (
                            <div className="py-8 text-center border border-dashed border-slate-200 rounded-xl">
                                <p className="text-sm text-slate-400 italic">No description provided for this position.</p>
                            </div>
                        )}
                    </div>

                    {/* ── Extra metadata ── */}
                    {(job.experience || job.date) && (
                        <div className="border border-slate-100 rounded-2xl p-5 space-y-3 bg-slate-50/50">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Additional Info</p>
                            {job.experience && (
                                <div className="flex items-center gap-3">
                                    <Users size={14} className="text-slate-400 shrink-0" />
                                    <span className="text-sm text-slate-600">Experience: <strong>{job.experience}</strong></span>
                                </div>
                            )}
                            {job.date && (
                                <div className="flex items-center gap-3">
                                    <Calendar size={14} className="text-slate-400 shrink-0" />
                                    <span className="text-sm text-slate-600">Start date: <strong>{job.date}</strong></span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

            {/* ── Footer ── */}
            <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
                <button className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1.5 transition-colors">
                    <Flag size={12} /> Report job
                </button>
                <span className="text-[10px] text-slate-300">Job ID: {job.id}</span>
            </div>
        </div>
    );
}