"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useSession, signIn } from 'next-auth/react';
import api from '@/lib/api';
import { US_HOSPITALS, US_STATES } from '@/app/lib/constants';
import { ALL_MOCK_JOBS } from '@/app/lib/us-hospitals';
import {
  Search, MapPin, Zap, Loader2, Filter,
  DollarSign, Building2, ArrowRight, LayoutGrid,
  List, Bookmark, Share2, Send, Clock, Briefcase,
  CheckCircle2, AlertCircle, X, ChevronRight,
  ExternalLink, History, Star, BadgeCheck
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Badge } from "@/app/components/ui/badge";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Separator } from "@/app/components/ui/separator";
import { Skeleton } from "@/app/components/ui/skeleton";
import JobDetailPane from '@/app/components/JobDetailPane';
import { HospitalLogo } from '@/app/components/HospitalLogo';

// ─── Mock fallback data ────────────────────────────────────────────────────────
const MOCK_JOBS = [
  { id: 'm1', title: 'ICU Specialist (Critical Care)', hospital: 'Mayo Clinic', location: 'Rochester, MN', salary: '115', type: 'Full-Time', department: 'ICU', description: 'Lead critical care for high-acuity patients in a fast-paced ICU. Collaborate with multidisciplinary teams and mentor junior nurses.\n\nResponsibilities:\n• Monitor patient vitals 24/7\n• Administer medications and IVs\n• Coordinate care plans with physicians\n• Maintain accurate patient records\n\nRequirements:\n• BSN required, MSN preferred\n• 2+ years ICU experience\n• CCRN certification preferred\n• BLS & ACLS current' },
  { id: 'm2', title: 'Pediatric RN', hospital: "Children's Hospital of Philadelphia", location: 'Philadelphia, PA', salary: '95', type: 'Full-Time', department: 'Pediatrics', description: 'Provide compassionate care to pediatric patients ages 0-18. Work closely with families and a dedicated pediatric team.\n\nResponsibilities:\n• Assess and monitor pediatric patients\n• Administer treatments per care plan\n• Educate families on care and medications\n\nRequirements:\n• BSN required\n• 1+ year pediatric experience preferred\n• BLS certified' },
  { id: 'm3', title: 'Emergency Room Nurse', hospital: 'Massachusetts General Hospital', location: 'Boston, MA', salary: '105', type: 'Full-Time', department: 'ER', description: 'Join our Level 1 trauma center ER team. Handle diverse emergencies with precision and speed.\n\nRequirements:\n• 2+ years ER experience\n• TNCC, ENPC preferred\n• Ability to work in high-pressure environment' },
  { id: 'm4', title: 'Labor & Delivery Nurse', hospital: 'Cedars-Sinai Medical Center', location: 'Los Angeles, CA', salary: '110', type: 'Full-Time', department: 'General', description: 'Support mothers through labor, delivery, and postpartum care.\n\nRequirements:\n• OB nursing experience preferred\n• NRP certification\n• BSN required' },
  { id: 'm5', title: 'Cardiac ICU Nurse', hospital: 'Johns Hopkins Hospital', location: 'Baltimore, MD', salary: '120', type: 'Part-Time', department: 'ICU', description: 'Care for post-cardiac surgery and complex cardiac patients.\n\nRequirements:\n• CCRN or PCCN preferred\n• 2+ years cardiac experience' },
  { id: 'm6', title: 'Geriatric Care Manager', hospital: 'Cleveland Clinic', location: 'Cleveland, OH', salary: '100', type: 'Full-Time', department: 'Geriatric', description: 'Manage care plans for elderly patients with complex needs.\n\nRequirements:\n• Geriatric nursing experience\n• Strong care coordination skills' },
  { id: 'm7', title: 'Oncology Nurse Specialist', hospital: 'MD Anderson Cancer Center', location: 'Houston, TX', salary: '118', type: 'Full-Time', department: 'Oncology', description: 'Administer chemotherapy and provide patient education for cancer patients.\n\nRequirements:\n• OCN certification preferred\n• 2+ years oncology experience' },
  { id: 'm8', title: 'ER Trauma Specialist', hospital: 'UCSF Medical Center', location: 'San Francisco, CA', salary: '130', type: 'Full-Time', department: 'ER', description: 'Fast-paced trauma bay nursing in a top-ranked Level 1 facility.\n\nRequirements:\n• TNCC required\n• 3+ years trauma ER experience' },
  { id: 'm9', title: 'Surgical ICU Nurse', hospital: 'NewYork-Presbyterian Hospital', location: 'New York, NY', salary: '125', type: 'Full-Time', department: 'ICU', description: 'Support post-surgical patients in an intensive care setting.\n\nRequirements:\n• CCRN preferred\n• Surgical nursing background' },
  { id: 'm10', title: 'Travel Nurse – Float Pool', hospital: 'Kaiser Permanente', location: 'San Diego, CA', salary: '88', type: 'Contract', department: 'General', description: 'Float between departments at multiple Kaiser facilities.\n\nRequirements:\n• 2+ years general nursing\n• Flexible schedule required' },
  { id: 'm11', title: 'Night Shift ICU RN', hospital: 'Stanford Health Care', location: 'Palo Alto, CA', salary: '122', type: 'Full-Time', department: 'ICU', description: 'Overnight critical care for complex ICU patients.\n\nRequirements:\n• Night shift availability required\n• CCRN preferred' },
  { id: 'm12', title: 'Pediatric Oncology Nurse', hospital: "St. Jude Children's Research Hospital", location: 'Memphis, TN', salary: '98', type: 'Full-Time', department: 'Pediatrics', description: 'Provide specialized oncology care for pediatric patients.\n\nRequirements:\n• Pediatric or oncology nursing experience\n• Strong family communication skills' },
];

const CATEGORIES = ['All', 'ICU', 'ER', 'Pediatrics', 'Oncology', 'Geriatric', 'Full-Time', 'Part-Time', 'Contract'];

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[300] flex items-center gap-3 px-5 py-3.5 rounded-xl bg-green-600 text-white text-sm font-semibold shadow-2xl animate-in slide-in-from-bottom-4">
      <CheckCircle2 size={16} /> {msg}
      <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100"><X size={14} /></button>
    </div>
  );
}

export default function JobsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');

  // Save / Apply
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      try {
        const [jobsRes, savedRes, appsRes] = await Promise.allSettled([
          api.get('/jobs'),
          api.get('/saved-jobs'),
          api.get('/applications/my-apps'),
        ]);
        const jobs = jobsRes.status === 'fulfilled' && Array.isArray(jobsRes.value.data)
          ? [...jobsRes.value.data, ...ALL_MOCK_JOBS] : ALL_MOCK_JOBS;
        setAllJobs(jobs);
        setFilteredJobs(jobs);
        if (savedRes.status === 'fulfilled') setSavedIds(new Set(savedRes.value.data.map((s: any) => s.jobId)));
        if (appsRes.status === 'fulfilled') setAppliedIds(new Set(appsRes.value.data.map((a: any) => a.jobId)));
      } catch {
        setAllJobs(ALL_MOCK_JOBS); setFilteredJobs(ALL_MOCK_JOBS);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // ── Filter ────────────────────────────────────────────────────────────────
  useEffect(() => {
    let result = [...allJobs];
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(j =>
        j.title.toLowerCase().includes(q) ||
        (j.hospital || '').toLowerCase().includes(q) ||
        (j.location || '').toLowerCase().includes(q)
      );
    }
    if (selectedState !== 'All') result = result.filter(j => (j.location || '').includes(selectedState));
    if (activeCategory !== 'All') {
      const cat = activeCategory.toLowerCase();
      result = result.filter(j => {
        const t = j.title.toLowerCase();
        const ty = (j.type || '').toLowerCase();
        const d = (j.department || '').toLowerCase();
        if (cat === 'er') return t.includes('er') || t.includes('emergency') || d.includes('er');
        if (cat === 'icu') return t.includes('icu') || t.includes('intensive') || d.includes('icu');
        if (cat === 'pediatrics') return t.includes('pediatric') || d.includes('pediatric');
        if (cat === 'oncology') return t.includes('oncol') || d.includes('oncol');
        if (cat === 'geriatric') return t.includes('geriatric') || d.includes('geriatric');
        return ty.includes(cat) || t.includes(cat) || d.includes(cat);
      });
    }
    setFilteredJobs(result);
  }, [searchTerm, selectedState, activeCategory, allJobs]);

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      if (savedIds.has(id)) {
        await api.delete(`/saved-jobs/${id}`).catch(() => { });
        setSavedIds(p => { const n = new Set(p); n.delete(id); return n; });
        showToast('Removed from saved jobs');
      } else {
        await api.post(`/saved-jobs/${id}`).catch(() => { });
        setSavedIds(p => new Set([...p, id]));
        showToast('Job saved!');
      }
    } catch { }
  };

  const handleApply = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    window.open(`/jobs/${id}`, '_blank');
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // ── Job card ──────────────────────────────────────────────────────────────
  const JobCard = ({ job, compact = false }: { job: any; compact?: boolean }) => {
    const isSaved = savedIds.has(job.id);
    const isApplied = appliedIds.has(job.id);
    const isApplying = applyingId === job.id;

    if (compact) {
      // ── LIST ROW ──
      return (
        <div onClick={() => window.open(`/jobs/${job.id}`, '_blank')}
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-slate-100 cursor-pointer transition-all hover:bg-slate-50 group border-l-4 border-l-transparent hover:border-l-blue-500`}>
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Avatar */}
            <HospitalLogo 
              hospitalName={job.hospital || job.businessName} 
              logo={job.logo || (job.business && job.business.logo)}
              size="sm" 
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className={`font-semibold text-sm truncate group-hover:text-blue-600 transition-colors text-slate-900`}>
                  {job.title}
                </span>
                {isApplied && <Badge className="bg-green-50 text-green-700 border-green-100 border text-[10px] font-semibold px-1.5 py-0 shrink-0">Applied</Badge>}
              </div>
              <p className="text-xs text-slate-500 truncate">{job.hospital} · {job.location}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {job.salary && <span className="text-[11px] text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full font-semibold">${job.salary}/hr</span>}
                {job.type && <span className="text-[11px] text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full font-semibold">{job.type}</span>}
                <span className="text-[11px] text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1"><Zap size={9} className="fill-blue-600" />Easy Apply</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={e => handleSave(e, job.id)}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
              <Bookmark size={14} className={isSaved ? 'fill-blue-600 text-blue-600' : ''} />
            </button>
            <button onClick={e => handleApply(e, job.id)} disabled={isApplied || isApplying}
              className={`h-8 px-4 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${isApplied ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-sm'} disabled:opacity-70`}>
              {isApplying ? <Loader2 size={12} className="animate-spin" /> : isApplied ? <><CheckCircle2 size={12} />Applied</> : <><Send size={12} />Apply</>}
            </button>
          </div>
        </div>
      );
    }

    // ── CARD ──
    return (
      <div onClick={() => window.open(`/jobs/${job.id}`, '_blank')}
        className={`bg-white border rounded-2xl p-5 cursor-pointer transition-all hover:shadow-md group flex flex-col h-full border-slate-100 hover:border-blue-200`}>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <HospitalLogo 
            hospitalName={job.hospital || job.businessName} 
            logo={job.logo || (job.business && job.business.logo)}
            size="sm" 
          />
          <button onClick={e => handleSave(e, job.id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-blue-600 hover:bg-blue-50 transition-all">
            <Bookmark size={15} className={isSaved ? 'fill-blue-600 text-blue-600' : ''} />
          </button>
        </div>

        {/* Content */}
        <div className="mb-1 flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">New</span>
          {isApplied && <span className="text-[10px] font-semibold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">Applied</span>}
        </div>
        <h3 className={`font-semibold text-sm leading-snug mb-1 group-hover:text-blue-600 transition-colors text-slate-900`}>
          {job.title}
        </h3>
        <p className="text-xs font-medium text-slate-600 truncate">{job.hospital}</p>
        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 truncate"><MapPin size={10} />{job.location}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {job.salary && <span className="text-[11px] text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full font-semibold">${job.salary}/hr</span>}
          {job.type && <span className="text-[11px] text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full font-semibold">{job.type}</span>}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-blue-600 flex items-center gap-1 font-semibold">
            <Zap size={11} className="fill-blue-600" /> Easy Apply
          </span>
          <button onClick={e => handleApply(e, job.id)} disabled={isApplied || isApplying}
            className={`h-7 px-3 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${isApplied ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-sm'} disabled:opacity-70`}>
            {isApplying ? <Loader2 size={11} className="animate-spin" /> : isApplied ? <><CheckCircle2 size={11} />Applied</> : <><Send size={11} />Apply</>}
          </button>
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-5">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Find Nursing Jobs in the USA</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              <span className="text-blue-600 font-semibold">{filteredJobs.length}</span> open positions
            </p>
          </div>
          {/* View toggle */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm self-start">
            <button onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}>
              <List size={17} />
            </button>
            <button onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}>
              <LayoutGrid size={17} />
            </button>
          </div>
        </div>

        {/* ── Search bar ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Keyword */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Job title, keywords, or hospital..."
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white outline-none text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            {/* State */}
            <div className="relative md:w-56">
              <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
              <select
                value={selectedState}
                onChange={e => setSelectedState(e.target.value)}
                className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-green-500 focus:bg-white outline-none text-sm font-medium text-slate-700 appearance-none cursor-pointer transition-all"
              >
                <option value="All">All US States</option>
                {US_STATES.map((s: any) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            {/* Button */}
            <button
              onClick={() => { }} // search happens reactively
              className="h-11 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold text-sm flex items-center gap-2 shadow-md transition-all shrink-0">
              <Search size={15} /> Search Jobs
            </button>
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`h-8 px-4 rounded-full border text-xs font-semibold transition-all ${activeCategory === cat
                  ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white border-transparent shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'}`}>
                {cat}
              </button>
            ))}
            {/* Clear */}
            {(searchTerm || selectedState !== 'All' || activeCategory !== 'All') && (
              <button onClick={() => { setSearchTerm(''); setSelectedState('All'); setActiveCategory('All'); }}
                className="h-8 px-4 rounded-full border border-red-200 bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-all flex items-center gap-1">
                <X size={11} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* ── Top facilities ── */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest shrink-0">Top Facilities:</span>
          {US_HOSPITALS.slice(0, 6).map((h: any) => (
            <button key={h.value} onClick={() => setSearchTerm(searchTerm === h.label ? '' : h.label)}
              className={`text-[11px] px-3 py-1 rounded-full border font-semibold transition-all ${searchTerm === h.label ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600'}`}>
              {h.label}
            </button>
          ))}
        </div>

        {/* ── Loading ── */}
        {loading ? (
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="py-20 text-center bg-white border border-dashed border-slate-200 rounded-2xl">
            <Filter size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="font-semibold text-slate-600">No matching jobs found</p>
            <p className="text-sm text-slate-400 mt-1">Try different keywords or clear filters.</p>
          </div>
        ) : viewMode === 'list' ? (
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-50 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">{filteredJobs.length} Jobs found</p>
              <p className="text-xs text-slate-400">Click a job to view details in a new window</p>
            </div>
            <div className="divide-y divide-slate-50">
              {filteredJobs.map(job => <JobCard key={job.id} job={job} compact />)}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
             {filteredJobs.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        )}

        <p className="text-center text-[10px] text-slate-300 uppercase tracking-widest pt-2">
          NurseFlex · USA Nursing Jobs
        </p>
      </div>
    </div>
  );
}