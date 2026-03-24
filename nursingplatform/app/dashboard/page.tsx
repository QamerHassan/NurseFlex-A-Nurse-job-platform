'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import {
    MapPin, Loader2, CheckCircle2,
    Search, Bookmark,
    History, X, AlertCircle,
    Send, User,
    FileText, Clock,
    CheckSquare, XCircle,
    RefreshCw, Building2, Briefcase, Calendar,
    LayoutGrid, List, Zap
} from 'lucide-react';
import Link from 'next/link';

import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Skeleton } from "@/app/components/ui/skeleton";

import {
    DropdownMenu, DropdownMenuContent,
    DropdownMenuTrigger, DropdownMenuLabel,
    DropdownMenuRadioGroup, DropdownMenuRadioItem,
} from "@/app/components/ui/dropdown-menu";
import { HospitalsSection } from '@/app/components/HospitalsSection';
import { HospitalLogo } from '@/app/components/HospitalLogo';
import { DASHBOARD_MOCK_JOBS } from '@/app/lib/mock-jobs';

// ─── Constants ────────────────────────────────────────────────────────────────
const RECENT_TITLE_KEY = 'nurseflex_recent_titles';
const RECENT_LOCATION_KEY = 'nurseflex_recent_locations';

const SUGGESTED_TITLES = [
    'Registered Nurse', 'ICU Nurse', 'ER Nurse', 'Pediatric Nurse',
    'Surgical Nurse', 'Cardiology Nurse', 'Oncology Nurse', 'Travel Nurse',
];

const SUGGESTED_LOCATIONS = [
    'New York, NY', 'Los Angeles, CA', 'Houston, TX', 'Chicago, IL',
    'Phoenix, AZ', 'Philadelphia, PA', 'Dallas, TX', 'Seattle, WA',
];


// Mock jobs are now imported from the shared file (app/lib/mock-jobs.ts)
// so that jobs/[id]/page.tsx can resolve the same IDs.
const ALL_MOCK_JOBS = DASHBOARD_MOCK_JOBS;

type ActiveTab = 'jobs' | 'applications' | 'saved';

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }: {
    message: string; type: 'success' | 'info' | 'error'; onClose: () => void;
}) {
    return (
        <div className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-xl text-white font-semibold text-sm shadow-2xl animate-in slide-in-from-bottom-4 duration-300 ${type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-500' : 'bg-blue-600'
            }`}>
            <CheckCircle2 size={16} />
            {message}
            <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100"><X size={14} /></button>
        </div>
    );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, bg, border, onClick, loading }: {
    label: string; value: number; icon: any;
    color: string; bg: string; border: string;
    onClick?: () => void; loading?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            className={`bg-white border ${border} rounded-2xl p-4 flex items-center gap-3 shadow-sm w-full text-left transition-all ${onClick ? 'hover:shadow-md hover:scale-[1.02] cursor-pointer' : 'cursor-default'}`}
        >
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon size={18} className={color} />
            </div>
            <div>
                {loading
                    ? <div className="h-7 w-8 bg-slate-100 animate-pulse rounded mb-1" />
                    : <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
                }
                <p className="text-xs text-slate-400 font-medium mt-0.5">{label}</p>
            </div>
        </button>
    );
}

// ─── Hospital Banner ──────────────────────────────────────────────────────────
function HospitalBanner({ name, imageUrl, imageLoading, jobCount, loading, onClear }: {
    name: string;
    imageUrl: string | null;
    imageLoading: boolean;
    jobCount: number;
    loading: boolean;
    onClear: () => void;
}) {
    return (
        <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-md mb-5 animate-in fade-in slide-in-from-top-2 duration-400">
            {/* Hero image area */}
            <div className="relative h-44 bg-gradient-to-br from-blue-700 via-blue-600 to-green-600 overflow-hidden">
                {/* Dot pattern */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                    backgroundSize: '32px 32px'
                }} />

                {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 size={28} className="animate-spin text-white/70" />
                            <p className="text-white/60 text-xs">Loading hospital image…</p>
                        </div>
                    </div>
                )}

                {imageUrl && !imageLoading && (
                    <img
                        src={imageUrl}
                        alt={name}
                        className="w-full h-full object-cover"
                        style={{ objectPosition: 'center 30%' }}
                    />
                )}

                {!imageUrl && !imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Building2 size={64} className="text-white/20" />
                    </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

                {/* Text overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between gap-3">
                    <div>
                        <p className="text-white/60 text-[10px] font-semibold uppercase tracking-widest mb-0.5">Showing jobs at</p>
                        <h2 className="text-white text-xl font-bold leading-tight drop-shadow">{name}</h2>
                        <p className="text-white/70 text-xs mt-1 flex items-center gap-1.5">
                            <Briefcase size={11} />
                            {loading ? 'Searching…' : `${jobCount} open position${jobCount !== 1 ? 's' : ''} found`}
                        </p>
                    </div>
                    <button
                        onClick={onClear}
                        className="h-9 px-4 bg-white/15 hover:bg-white/30 border border-white/25 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5 transition-all backdrop-blur-sm shrink-0"
                    >
                        <X size={13} /> Clear
                    </button>
                </div>
            </div>

            {/* Bottom strip */}
            <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-green-50 border-t border-blue-100 flex items-center gap-3">
                <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full flex items-center gap-1.5">
                    🏥 Hospital Search Active
                </span>
                {!loading && jobCount > 0 && (
                    <span className="text-[11px] text-slate-500">Scroll down to browse all open positions</span>
                )}
                {!loading && jobCount === 0 && (
                    <span className="text-[11px] text-red-500 font-medium">No jobs found — try a different hospital</span>
                )}
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function NurseDashboard() {
    const { data: session, status: sessionStatus } = useSession();
    const router = useRouter();

    // ── State ─────────────────────────────────────────────────────────────────
    const [authChecked, setAuthChecked] = useState(false);
    const [activeTab, setActiveTab] = useState<ActiveTab>('jobs');
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);
    const [applyingId, setApplyingId] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

    // Jobs
    const [allJobs, setAllJobs] = useState<any[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
    const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
    const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());

    // Applications
    const [applications, setApplications] = useState<any[]>([]);

    // Profile
    const [userProfile, setUserProfile] = useState<any>(null);

    // Search
    const [searchTitle, setSearchTitle] = useState('');
    const [searchLocation, setSearchLocation] = useState('');
    const [minSalary, setMinSalary] = useState('');
    const [selectedJobType, setSelectedJobType] = useState('All');
    const [datePosted, setDatePosted] = useState('Anytime');

    // Hospital search context ── NEW
    const [hospitalSearchName, setHospitalSearchName] = useState<string | null>(null);
    const [hospitalImageUrl, setHospitalImageUrl] = useState<string | null>(null);
    const [hospitalImageLoading, setHospitalImageLoading] = useState(false);

    // Autocomplete
    const [showTitleDrop, setShowTitleDrop] = useState(false);
    const [showLocationDrop, setShowLocationDrop] = useState(false);
    const [recentTitles, setRecentTitles] = useState<string[]>([]);
    const [recentLocations, setRecentLocations] = useState<string[]>([]);

    // Toast
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

    const titleRef = useRef<HTMLDivElement>(null);
    const locationRef = useRef<HTMLDivElement>(null);

    // ── Auth check ────────────────────────────────────────────────────────────
    useEffect(() => {
        if (sessionStatus === 'loading') return;
        if ((session as any)?.error === 'UserNotFound') { signOut({ callbackUrl: '/auth/login' }); return; }
        const hasLocalToken = !!localStorage.getItem('token');
        const hasSession = !!session;
        if (!hasLocalToken && !hasSession) { router.replace('/auth/login'); return; }
        const localUser = JSON.parse(localStorage.getItem('user') || 'null');
        const userRole = (session?.user as any)?.role || localUser?.role;
        const isPending = (session?.user as any)?.status === 'PENDING' || localUser?.status === 'PENDING';
        if (isPending && userRole === 'BUSINESS') { router.replace('/auth/pending'); return; }
        setAuthChecked(true);
    }, [session, sessionStatus, router]);

    // ── Outside click ─────────────────────────────────────────────────────────
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (titleRef.current && !titleRef.current.contains(e.target as Node)) setShowTitleDrop(false);
            if (locationRef.current && !locationRef.current.contains(e.target as Node)) setShowLocationDrop(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // ── Recent from localStorage ──────────────────────────────────────────────
    useEffect(() => {
        setRecentTitles(JSON.parse(localStorage.getItem(RECENT_TITLE_KEY) || '[]'));
        setRecentLocations(JSON.parse(localStorage.getItem(RECENT_LOCATION_KEY) || '[]'));
    }, []);

    // ── Fetch user stats (applications + saved) ───────────────────────────────
    const fetchUserData = useCallback(async () => {
        setStatsLoading(true);
        try {
            const [savedRes, appsRes1, appsRes2] = await Promise.allSettled([
                api.get('/saved-jobs'),
                api.get('/applications/my'),
                api.get('/applications/my-apps'),
            ]);

            if (savedRes.status === 'fulfilled') {
                const savedData = Array.isArray(savedRes.value.data) ? savedRes.value.data : [];
                setSavedJobIds(new Set(savedData.map((s: any) => s.jobId ?? s.id)));
            }

            const apps1 = appsRes1.status === 'fulfilled' && Array.isArray(appsRes1.value.data) ? appsRes1.value.data : [];
            const apps2 = appsRes2.status === 'fulfilled' && Array.isArray(appsRes2.value.data) ? appsRes2.value.data : [];
            const merged = [...apps1, ...apps2].filter((a, i, arr) => arr.findIndex(x => x.id === a.id) === i);
            if (merged.length > 0) {
                setApplications(merged);
                setAppliedJobIds(new Set(merged.map((a: any) => a.jobId ?? a.job?.id)));
            }
        } catch (err) {
            console.error('User data fetch error:', err);
        } finally {
            setStatsLoading(false);
        }
    }, []);

    // ── Initial data fetch ────────────────────────────────────────────────────
    useEffect(() => {
        if (!authChecked) return;
        const init = async () => {
            setLoading(true);
            try {
                const [jobsRes, profileRes] = await Promise.allSettled([
                    api.get('/jobs'),
                    api.get('/profile'),
                ]);
                if (jobsRes.status === 'fulfilled') {
                    const apiJobs = Array.isArray(jobsRes.value.data) ? jobsRes.value.data : [];
                    const combined = [...apiJobs, ...ALL_MOCK_JOBS];
                    setAllJobs(combined);
                    setFilteredJobs(combined);
                } else {
                    // API failed → use mock data only
                    setAllJobs(ALL_MOCK_JOBS);
                    setFilteredJobs(ALL_MOCK_JOBS);
                }
                if (profileRes.status === 'fulfilled') setUserProfile(profileRes.value.data);
            } catch (err) {
                console.error('Dashboard init error:', err);
                setAllJobs(ALL_MOCK_JOBS);
                setFilteredJobs(ALL_MOCK_JOBS);
            } finally {
                setLoading(false);
            }
            await fetchUserData();
        };
        init();
    }, [authChecked, fetchUserData]);

    // ── Manual refresh ────────────────────────────────────────────────────────
    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchUserData();
        setRefreshing(false);
        showToast('Dashboard refreshed!', 'success');
    };

    // ── Helpers ───────────────────────────────────────────────────────────────
    const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const saveRecent = (key: string, value: string, setter: (v: string[]) => void) => {
        const prev: string[] = JSON.parse(localStorage.getItem(key) || '[]');
        const updated = [value, ...prev.filter(v => v !== value)].slice(0, 5);
        localStorage.setItem(key, JSON.stringify(updated));
        setter(updated);
    };

    const removeRecent = (key: string, value: string, setter: (v: string[]) => void) => {
        const prev: string[] = JSON.parse(localStorage.getItem(key) || '[]');
        const updated = prev.filter(v => v !== value);
        localStorage.setItem(key, JSON.stringify(updated));
        setter(updated);
    };

    // ── Local filter helper (used for mock data) ──────────────────────────────
    const filterMockJobs = (jobs: any[], t: string, l: string, s: string, ty: string, hospitalName?: string) => {
        return jobs.filter(j => {
            if (hospitalName) {
                return j.hospital?.toLowerCase().includes(hospitalName.toLowerCase());
            }
            const matchTitle = !t || j.title.toLowerCase().includes(t.toLowerCase()) || j.hospital?.toLowerCase().includes(t.toLowerCase());
            const matchLoc = !l || j.location.toLowerCase().includes(l.toLowerCase());
            const matchSalary = !s || parseInt(j.salary || '0') >= parseInt(s);
            const matchType = ty === 'All' || j.type === ty;
            return matchTitle && matchLoc && matchSalary && matchType;
        });
    };

    // ── Fetch hospital image from Wikipedia ───────────────────────────────────
    const fetchHospitalImage = async (hospitalName: string) => {
        setHospitalImageLoading(true);
        setHospitalImageUrl(null);
        try {
            // Try direct page summary first
            const res = await fetch(
                `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(hospitalName)}`
            );
            if (res.ok) {
                const data = await res.json();
                if (data?.thumbnail?.source) {
                    setHospitalImageUrl(data.thumbnail.source);
                    return;
                }
            }
            // Fallback: search Wikipedia for the hospital
            const searchRes = await fetch(
                `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(hospitalName + ' hospital')}&format=json&origin=*&srlimit=1`
            );
            if (searchRes.ok) {
                const searchData = await searchRes.json();
                const pageTitle = searchData?.query?.search?.[0]?.title;
                if (pageTitle) {
                    const pageRes = await fetch(
                        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`
                    );
                    if (pageRes.ok) {
                        const pageData = await pageRes.json();
                        if (pageData?.thumbnail?.source) {
                            setHospitalImageUrl(pageData.thumbnail.source);
                        }
                    }
                }
            }
        } catch (err) {
            console.warn('Hospital image fetch failed:', err);
        } finally {
            setHospitalImageLoading(false);
        }
    };

    // ── Search (handles both normal and hospital search) ──────────────────────
    const handleSearch = async (
        t = searchTitle,
        l = searchLocation,
        s = minSalary,
        ty = selectedJobType,
        d = datePosted,
        hospitalName?: string   // ← NEW
    ) => {
        if (t && !hospitalName) saveRecent(RECENT_TITLE_KEY, t, setRecentTitles);
        if (l) saveRecent(RECENT_LOCATION_KEY, l, setRecentLocations);
        setShowTitleDrop(false);
        setShowLocationDrop(false);
        setLoading(true);

        try {
            // Build API params
            const params: Record<string, string> = {
                location: l || '',
                minSalary: s || '',
                type: ty || '',
                datePosted: d === 'Anytime' ? '' : d || '',
            };
            if (hospitalName) {
                params.hospital = hospitalName;
                params.title = hospitalName;
            } else {
                params.title = t || '';
            }

            const res = await api.get('/jobs', { params });
            const apiJobs = Array.isArray(res.data) ? res.data : [];

            // Also filter mock jobs locally
            const mockResults = filterMockJobs(ALL_MOCK_JOBS, t, l, s, ty, hospitalName);

            // Merge, deduplicate by id
            const combined = [...apiJobs, ...mockResults].filter(
                (job, idx, arr) => arr.findIndex(j => j.id === job.id) === idx
            );

            setFilteredJobs(combined);
        } catch {
            // API error → fall back to local mock filtering only
            const mockResults = filterMockJobs(ALL_MOCK_JOBS, t, l, s, ty, hospitalName);
            setFilteredJobs(mockResults);
        } finally {
            setLoading(false);
        }
    };

    // ── Hospital search trigger (from HospitalsSection card click) ────────────
    const handleHospitalSearch = (hospitalName: string) => {
        setSearchTitle('');
        setSearchLocation('');
        setHospitalSearchName(hospitalName);
        fetchHospitalImage(hospitalName);        // async, non-blocking
        setActiveTab('jobs');
        handleSearch('', '', minSalary, selectedJobType, datePosted, hospitalName);
    };

    // ── Clear hospital search ─────────────────────────────────────────────────
    const clearHospitalSearch = () => {
        setHospitalSearchName(null);
        setHospitalImageUrl(null);
        setSearchTitle('');
        setSearchLocation('');
        // Restore all jobs
        setFilteredJobs(allJobs);
    };

    // ── Save / unsave ─────────────────────────────────────────────────────────
    const handleToggleSave = async (e: React.MouseEvent, jobId: string) => {
        e.stopPropagation();
        try {
            if (savedJobIds.has(jobId)) {
                await api.delete(`/saved-jobs/${jobId}`);
                setSavedJobIds(p => { const n = new Set(p); n.delete(jobId); return n; });
                showToast('Removed from saved jobs', 'info');
            } else {
                await api.post(`/saved-jobs/${jobId}`);
                setSavedJobIds(p => new Set([...p, jobId]));
                showToast('Job saved!', 'success');
            }
        } catch {
            showToast('Failed to update saved jobs', 'error');
        }
    };

    // ── Apply ─────────────────────────────────────────────────────────────────
    const handleApply = (e: React.MouseEvent, jobId: string) => {
        e.stopPropagation();
        window.open(`/jobs/${jobId}`, '_blank');
    };

    // ── Derived stats ─────────────────────────────────────────────────────────
    const stats = {
        applied: applications.length,
        pending: applications.filter(a => a.status === 'Pending' || a.status === 'PENDING').length,
        approved: applications.filter(a => a.status === 'Approved' || a.status === 'APPROVED').length,
        saved: savedJobIds.size,
    };

    const nurseFirstName =
        userProfile?.name?.split(' ')[0] ||
        (session?.user as any)?.name?.split(' ')[0] ||
        'Nurse';

    // ── Loading guard ─────────────────────────────────────────────────────────
    if (!authChecked && sessionStatus === 'loading') return (
        <div className="flex h-[60vh] items-center justify-center">
            <Loader2 size={32} className="animate-spin text-blue-600" />
        </div>
    );

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">

                {/* ── Welcome banner ── */}
                <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-green-600 p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -ml-10 -mb-10 blur-2xl" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <p className="text-white/70 text-sm font-medium">Welcome back 👋</p>
                            <h1 className="text-2xl font-bold mt-0.5">Hello, {nurseFirstName}!</h1>
                            <p className="text-white/70 text-sm mt-1">
                                {filteredJobs.length} jobs available ·{' '}
                                {statsLoading ? '…' : stats.applied} application{stats.applied !== 1 ? 's' : ''} sent
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleRefresh}
                                disabled={refreshing}
                                title="Refresh dashboard"
                                className="h-10 w-10 bg-white/20 hover:bg-white/30 border border-white/20 rounded-xl text-white flex items-center justify-center transition-all"
                            >
                                <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
                            </button>
                            <Link href="/profile"
                                className="h-10 px-5 bg-white/20 hover:bg-white/30 border border-white/20 rounded-xl text-white font-semibold text-sm flex items-center gap-2 transition-all">
                                <User size={15} /> My Profile
                            </Link>
                            <Link href="/profile/cv"
                                className="h-10 px-5 bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-md">
                                <FileText size={15} /> Update CV
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ── Stat cards ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Jobs Applied" value={stats.applied} icon={Send} color="text-blue-600" bg="bg-blue-50" border="border-blue-100" loading={statsLoading} onClick={() => setActiveTab('applications')} />
                    <StatCard label="Pending Review" value={stats.pending} icon={Clock} color="text-amber-600" bg="bg-amber-50" border="border-amber-100" loading={statsLoading} onClick={() => setActiveTab('applications')} />
                    <StatCard label="Approved" value={stats.approved} icon={CheckSquare} color="text-green-600" bg="bg-green-50" border="border-green-100" loading={statsLoading} onClick={() => setActiveTab('applications')} />
                    <StatCard label="Saved Jobs" value={stats.saved} icon={Bookmark} color="text-blue-600" bg="bg-blue-50" border="border-blue-100" loading={statsLoading} onClick={() => setActiveTab('saved')} />
                </div>

                {/* ── Search bar ── */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
                    <div className="flex flex-col md:flex-row gap-3">

                        {/* Title input */}
                        <div className="relative flex-1" ref={titleRef}>
                            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                            <Input
                                placeholder="Job title, keywords, or hospital name..."
                                className="h-11 pl-10 rounded-xl bg-slate-50 border-slate-200 focus:border-blue-500 focus:bg-white text-sm transition-all"
                                value={searchTitle}
                                onChange={e => {
                                    setSearchTitle(e.target.value);
                                    if (hospitalSearchName) { setHospitalSearchName(null); setHospitalImageUrl(null); }
                                }}
                                onFocus={() => setShowTitleDrop(true)}
                                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                            />
                            {showTitleDrop && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden">
                                    {recentTitles.length > 0 && (
                                        <div className="py-2 border-b border-slate-50">
                                            <p className="px-4 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Recent</p>
                                            {recentTitles.map(t => (
                                                <button key={t} onClick={() => { setSearchTitle(t); handleSearch(t); }}
                                                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 text-sm text-slate-700 font-medium transition-colors group">
                                                    <span className="flex items-center gap-2.5"><History size={13} className="text-slate-400" />{t}</span>
                                                    <X size={12} className="text-slate-300 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                                                        onClick={ev => { ev.stopPropagation(); removeRecent(RECENT_TITLE_KEY, t, setRecentTitles); }} />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    <div className="py-2">
                                        <p className="px-4 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Suggestions</p>
                                        {SUGGESTED_TITLES.map(s => (
                                            <button key={s} onClick={() => { setSearchTitle(s); handleSearch(s); }}
                                                className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-blue-50 text-sm text-slate-700 hover:text-blue-700 font-medium transition-colors">
                                                <Search size={13} className="text-slate-400" />{s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Location input */}
                        <div className="relative flex-1" ref={locationRef}>
                            <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                            <Input
                                placeholder="City, state..."
                                className="h-11 pl-10 rounded-xl bg-slate-50 border-slate-200 focus:border-green-500 focus:bg-white text-sm transition-all"
                                value={searchLocation}
                                onChange={e => setSearchLocation(e.target.value)}
                                onFocus={() => setShowLocationDrop(true)}
                                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                            />
                            {showLocationDrop && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden">
                                    <div className="py-2">
                                        <p className="px-4 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Suggested</p>
                                        {SUGGESTED_LOCATIONS.map(loc => (
                                            <button key={loc} onClick={() => { setSearchLocation(loc); handleSearch(undefined, loc); }}
                                                className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-green-50 text-sm text-slate-700 hover:text-green-700 font-medium transition-colors">
                                                <MapPin size={13} className="text-slate-400" />{loc}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Search button */}
                        <button onClick={() => handleSearch()}
                            className="h-11 px-7 rounded-xl bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold text-sm flex items-center gap-2 shrink-0 shadow-md transition-all">
                            <Search size={15} /> Search
                        </button>
                    </div>

                    {/* Filter chips */}
                    <div className="flex flex-wrap gap-2">
                        {/* Pay filter */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className={`h-8 px-4 rounded-full border text-xs font-semibold transition-all ${minSalary ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'}`}>
                                    Pay {minSalary && `($${minSalary}+/hr)`}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="rounded-xl shadow-xl border-slate-100 p-1 w-44">
                                <DropdownMenuLabel className="text-[10px] text-slate-400 uppercase tracking-widest px-3 py-2">Min Salary / hr</DropdownMenuLabel>
                                <DropdownMenuRadioGroup value={minSalary} onValueChange={v => { setMinSalary(v); handleSearch(undefined, undefined, v); }}>
                                    {[['', 'Any'], ['30', '$30+'], ['50', '$50+'], ['70', '$70+'], ['90', '$90+']].map(([v, l]) => (
                                        <DropdownMenuRadioItem key={v} value={v} className="text-sm rounded-lg py-2">{l}</DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Job type filter */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className={`h-8 px-4 rounded-full border text-xs font-semibold transition-all ${selectedJobType !== 'All' ? 'bg-green-50 border-green-300 text-green-700' : 'bg-white border-slate-200 text-slate-600 hover:border-green-300 hover:text-green-600'}`}>
                                    {selectedJobType === 'All' ? 'Job Type' : selectedJobType}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="rounded-xl shadow-xl border-slate-100 p-1 w-44">
                                <DropdownMenuLabel className="text-[10px] text-slate-400 uppercase tracking-widest px-3 py-2">Employment Type</DropdownMenuLabel>
                                <DropdownMenuRadioGroup value={selectedJobType} onValueChange={v => { setSelectedJobType(v); handleSearch(undefined, undefined, undefined, v); }}>
                                    {['All', 'Full-time', 'Part-time', 'Night Shift', 'Contract', 'Per Diem'].map(t => (
                                        <DropdownMenuRadioItem key={t} value={t} className="text-sm rounded-lg py-2">{t}</DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Date posted filter */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className={`h-8 px-4 rounded-full border text-xs font-semibold transition-all ${datePosted !== 'Anytime' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'}`}>
                                    {datePosted === 'Anytime' ? 'Date Posted' : `Last ${datePosted}d`}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="rounded-xl shadow-xl border-slate-100 p-1 w-44">
                                <DropdownMenuLabel className="text-[10px] text-slate-400 uppercase tracking-widest px-3 py-2">Posted Within</DropdownMenuLabel>
                                <DropdownMenuRadioGroup value={datePosted} onValueChange={v => { setDatePosted(v); handleSearch(undefined, undefined, undefined, undefined, v); }}>
                                    {[['Anytime', 'Anytime'], ['1', 'Last 24 hrs'], ['3', 'Last 3 days'], ['7', 'Last 7 days'], ['14', 'Last 14 days']].map(([v, l]) => (
                                        <DropdownMenuRadioItem key={v} value={v} className="text-sm rounded-lg py-2">{l}</DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Clear filters */}
                        {(minSalary || selectedJobType !== 'All' || datePosted !== 'Anytime') && (
                            <button
                                onClick={() => { setMinSalary(''); setSelectedJobType('All'); setDatePosted('Anytime'); handleSearch(undefined, undefined, '', 'All', 'Anytime'); }}
                                className="h-8 px-4 rounded-full border border-red-200 bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-all flex items-center gap-1">
                                <X size={11} /> Clear filters
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Tabs & View Toggle ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit shadow-sm">
                        {([
                            { id: 'jobs', label: 'Browse Jobs', count: filteredJobs.length },
                            { id: 'applications', label: 'My Applications', count: stats.applied },
                            { id: 'saved', label: 'Saved Jobs', count: stats.saved },
                        ] as { id: ActiveTab; label: string; count: number }[]).map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${activeTab === tab.id ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
                                {tab.label}
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                    {statsLoading && tab.id !== 'jobs' ? '…' : tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {activeTab === 'jobs' && (
                        <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm w-fit self-end sm:self-auto">
                            <button onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-400 hover:bg-slate-50'}`}>
                                <List size={18} />
                            </button>
                            <button onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-400 hover:bg-slate-50'}`}>
                                <LayoutGrid size={18} />
                            </button>
                        </div>
                    )}
                </div>

                {/* ════════════════ JOBS TAB ════════════════ */}
                {activeTab === 'jobs' && (
                    <div className="space-y-4">
                        {/* Hospital banner — only shown during hospital search */}
                        {hospitalSearchName && (
                            <HospitalBanner
                                name={hospitalSearchName}
                                imageUrl={hospitalImageUrl}
                                imageLoading={hospitalImageLoading}
                                jobCount={filteredJobs.length}
                                loading={loading}
                                onClear={clearHospitalSearch}
                            />
                        )}

                        <div className="w-full">
                            {/* Job list */}
                            <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
                                {loading ? (
                                    Array(viewMode === 'grid' ? 6 : 4).fill(0).map((_, i) => (
                                        <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                                            <Skeleton className="h-5 w-3/4 mb-3" />
                                            <Skeleton className="h-4 w-1/2 mb-2" />
                                            <Skeleton className="h-4 w-1/3" />
                                        </div>
                                    ))
                                ) : filteredJobs.length === 0 ? (
                                    <div className="py-20 text-center bg-white border border-dashed border-slate-200 rounded-2xl col-span-full">
                                        <AlertCircle size={36} className="mx-auto text-slate-300 mb-3" />
                                        <p className="font-semibold text-slate-500">
                                            {hospitalSearchName ? `No jobs found at ${hospitalSearchName}` : 'No jobs found'}
                                        </p>
                                        <p className="text-sm text-slate-400 mt-1">
                                            {hospitalSearchName ? 'This hospital may not have listed positions yet.' : 'Try different search terms or clear filters.'}
                                        </p>
                                        {hospitalSearchName && (
                                            <button onClick={clearHospitalSearch}
                                                className="mt-4 h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all">
                                                Browse All Jobs
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    filteredJobs.map(job => {
                                        const isSaved = savedJobIds.has(job.id);
                                        const isApplied = appliedJobIds.has(job.id);

                                        if (viewMode === 'grid') {
                                            return (
                                                <div key={job.id} onClick={() => window.open(`/jobs/${job.id}`, '_blank')}
                                                    className="bg-white border border-slate-100 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-md group flex flex-col h-full hover:border-blue-200">
                                                    <div className="flex items-start justify-between gap-2 mb-3">
                                                        <HospitalLogo hospitalName={job.hospital || job.businessName || ''} size="sm" />
                                                        <button onClick={e => handleToggleSave(e, job.id)}
                                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-blue-600 hover:bg-blue-50 transition-all">
                                                            <Bookmark size={15} className={isSaved ? 'fill-blue-600 text-blue-600' : ''} />
                                                        </button>
                                                    </div>
                                                    <div className="mb-1 flex items-center gap-1.5">
                                                        <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">New Posting</span>
                                                        {isApplied && <span className="text-[10px] font-semibold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">Applied</span>}
                                                    </div>
                                                    <h3 className="font-bold text-slate-900 text-sm leading-snug mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                        {job.title}
                                                    </h3>
                                                    <p className="text-xs font-medium text-slate-500 truncate mb-2">{job.hospital || job.businessName}</p>
                                                    
                                                    <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-slate-50">
                                                        {job.salary && <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded-full font-bold">${job.salary}/hr</span>}
                                                        <span className="text-[10px] text-blue-600 flex items-center gap-1 font-bold ml-auto">
                                                            <Zap size={10} className="fill-blue-600" /> Easy Apply
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div key={job.id} onClick={() => window.open(`/jobs/${job.id}`, '_blank')}
                                                className="bg-white border border-slate-100 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-md group border-l-4 border-l-transparent hover:border-l-blue-500">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex items-start gap-4 flex-1 min-w-0">
                                                        <HospitalLogo hospitalName={job.hospital || job.businessName || ''} size="md" />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                                {isApplied && (
                                                                    <Badge className="bg-green-50 text-green-700 border-green-100 text-[10px] font-semibold px-2 py-0 border">✓ Applied</Badge>
                                                                )}
                                                                <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                                                    {hospitalSearchName ? `🏥 ${job.hospital}` : 'New Posting'}
                                                                </span>
                                                            </div>
                                                            <h3 className="font-bold text-slate-900 text-base leading-tight group-hover:text-blue-600 transition-colors truncate">
                                                                {job.title}
                                                            </h3>
                                                            <p className="text-sm text-slate-500 mt-0.5 font-medium truncate">{job.hospital || job.businessName}</p>
                                                            <div className="flex items-center gap-3 mt-2">
                                                                <p className="text-xs text-slate-400 flex items-center gap-1"><MapPin size={12} />{job.location}</p>
                                                                {job.salary && <p className="text-xs font-semibold text-green-600 flex items-center gap-1">💰 ${job.salary}/hr</p>}
                                                                {job.type && <p className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">{job.type}</p>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                window.open(`/jobs/${job.id}`, '_blank');
                                                            }}
                                                            className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
                                                        >
                                                            Apply <Send size={14} className="fill-white" />
                                                        </button>
                                                        <button 
                                                            onClick={e => handleToggleSave(e, job.id)}
                                                            className="w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                                        >
                                                            <Bookmark size={18} className={isSaved ? 'fill-blue-600 text-blue-600' : ''} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ════════════════ APPLICATIONS TAB ════════════════ */}
                {activeTab === 'applications' && (
                    <div className="space-y-3">
                        {statsLoading ? (
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5">
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="w-11 h-11 rounded-xl" />
                                        <div className="flex-1"><Skeleton className="h-4 w-1/2 mb-2" /><Skeleton className="h-3 w-1/3" /></div>
                                        <Skeleton className="h-7 w-20 rounded-full" />
                                    </div>
                                </div>
                            ))
                        ) : applications.length === 0 ? (
                            <div className="py-20 text-center bg-white border border-dashed border-slate-200 rounded-2xl">
                                <Send size={36} className="mx-auto text-slate-300 mb-3" />
                                <p className="font-semibold text-slate-500">No applications yet</p>
                                <p className="text-sm text-slate-400 mt-1">Apply to jobs to see them here.</p>
                                <button onClick={() => setActiveTab('jobs')}
                                    className="mt-4 h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all">
                                    Browse Jobs
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 pb-1">
                                    <p className="text-sm font-semibold text-slate-600">{applications.length} application{applications.length !== 1 ? 's' : ''}</p>
                                    <span className="text-slate-300">·</span>
                                    <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">{stats.pending} pending</span>
                                    {stats.approved > 0 && <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">{stats.approved} approved</span>}
                                </div>

                                {applications.map(app => (
                                    <div key={app.id} className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-sm transition-all">
                                        <div className="flex items-center gap-4">
                                            <HospitalLogo hospitalName={app.job?.hospital || app.job?.businessName || ''} size="md" />
                                            <div>
                                                <p className="font-semibold text-slate-900 text-sm">{app.job?.title || 'Job Position'}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">{app.job?.hospital || app.job?.businessName || 'Healthcare Facility'}</p>
                                                <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                                                    <Calendar size={10} />
                                                    Applied {new Date(app.appliedAt || app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            {app.resumeUrl && (
                                                <a href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${app.resumeUrl}`}
                                                    target="_blank" rel="noopener noreferrer"
                                                    className="h-8 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 flex items-center gap-1.5 transition-all">
                                                    <FileText size={12} /> CV
                                                </a>
                                            )}
                                            <Badge className={`text-[11px] font-semibold border px-2.5 py-1 ${(app.status === 'Approved' || app.status === 'APPROVED') ? 'bg-green-50 text-green-700 border-green-100' :
                                                    (app.status === 'Rejected' || app.status === 'REJECTED') ? 'bg-red-50 text-red-600 border-red-100' :
                                                        'bg-amber-50 text-amber-700 border-amber-100'
                                                }`}>
                                                {(app.status === 'Approved' || app.status === 'APPROVED') ? <><CheckCircle2 size={11} className="inline mr-1" />Approved</> :
                                                    (app.status === 'Rejected' || app.status === 'REJECTED') ? <><XCircle size={11} className="inline mr-1" />Rejected</> :
                                                        <><Clock size={11} className="inline mr-1" />Pending</>}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                )}

                {/* ════════════════ SAVED JOBS TAB ════════════════ */}
                {activeTab === 'saved' && (
                    <div className="space-y-3">
                        {statsLoading ? (
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5">
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="w-11 h-11 rounded-xl" />
                                        <div className="flex-1"><Skeleton className="h-4 w-1/2 mb-2" /><Skeleton className="h-3 w-1/3" /></div>
                                        <Skeleton className="h-9 w-24 rounded-xl" />
                                    </div>
                                </div>
                            ))
                        ) : savedJobIds.size === 0 ? (
                            <div className="py-20 text-center bg-white border border-dashed border-slate-200 rounded-2xl">
                                <Bookmark size={36} className="mx-auto text-slate-300 mb-3" />
                                <p className="font-semibold text-slate-500">No saved jobs</p>
                                <p className="text-sm text-slate-400 mt-1">Bookmark jobs to revisit them later.</p>
                                <button onClick={() => setActiveTab('jobs')}
                                    className="mt-4 h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all">
                                    Browse Jobs
                                </button>
                            </div>
                        ) : (
                            allJobs.filter(j => savedJobIds.has(j.id)).map(job => (
                                <div key={job.id} className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-sm transition-all group">
                                    <div className="flex items-center gap-4">
                                        <HospitalLogo hospitalName={job.hospital || job.businessName || ''} size="md" />
                                        <div>
                                            <p className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{job.title}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{job.hospital || job.businessName}</p>
                                            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                                                <MapPin size={10} />{job.location}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {job.salary && <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">${job.salary}/hr</span>}
                                        <button onClick={() => window.open(`/jobs/${job.id}`, '_blank')}
                                            className="h-9 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white text-xs font-semibold transition-all shadow-sm">
                                            View Job
                                        </button>
                                        <button onClick={e => handleToggleSave(e, job.id)}
                                            className="h-9 w-9 rounded-xl border border-slate-200 flex items-center justify-center text-blue-600 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all">
                                            <Bookmark size={15} className="fill-blue-600" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* ════════════════ HOSPITALS SECTION ════════════════ */}
                <div className="pt-2">
                    <HospitalsSection
                        onHospitalSearch={handleHospitalSearch}
                    />
                </div>

                <p className="text-center text-[10px] text-slate-300 uppercase tracking-widest pt-2">
                    NurseFlex · Find your next role
                </p>
            </div>
        </div>
    );
}