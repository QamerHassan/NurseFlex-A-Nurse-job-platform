'use client';
import { useEffect, useState, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import {
  MapPin, Loader2, Bell, CheckCircle2,
  Search, Flag, Share2, ChevronRight, ArrowRight,
  DollarSign, Briefcase, Zap, PoundSterling,
  Bookmark, MessageSquare, History, X, AlertCircle, Filter,
  ExternalLink, MoreHorizontal, ThumbsDown, Send
} from 'lucide-react';
import Link from 'next/link';

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Separator } from "@/app/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/app/components/ui/dropdown-menu";

const RECENT_TITLE_KEY = 'nurseflex_recent_titles';
const RECENT_LOCATION_KEY = 'nurseflex_recent_locations';

const SUGGESTED_TITLES = [
  'Registered Nurse', 'ICU Nurse', 'ER Nurse', 'Pediatric Nurse',
  'Surgical Nurse', 'Cardiology Nurse', 'Oncology Nurse'
];

const SUGGESTED_LOCATIONS = [
  'London, UK', 'New York, USA', 'Toronto, CA', 'Sydney, AU',
  'Dubai, UAE', 'Berlin, DE'
];

export default function DashboardPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ show: boolean; message: string } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Autocomplete state
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showTitleDrop, setShowTitleDrop] = useState(false);
  const [showLocationDrop, setShowLocationDrop] = useState(false);
  const [recentTitles, setRecentTitles] = useState<string[]>([]);
  const [recentLocations, setRecentLocations] = useState<string[]>([]);

  // Filter state
  const [minSalary, setMinSalary] = useState<string>('');
  const [selectedJobType, setSelectedJobType] = useState<string>('All');
  const [datePosted, setDatePosted] = useState<string>('Anytime');

  const titleRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (sessionStatus === 'loading') return;
    if ((session as any)?.error === 'UserNotFound') {
        signOut({ callbackUrl: '/auth/login' });
        return;
    }
    const hasLocalToken = !!localStorage.getItem('token');
    const hasSession = !!session;
    if (!hasLocalToken && !hasSession) {
      router.replace('/auth/login');
      return;
    }
    const localUser = JSON.parse(localStorage.getItem('user') || 'null');
    const userRole = (session?.user as any)?.role || localUser?.role;
    const isPending = (session?.user as any)?.status === 'PENDING' || localUser?.status === 'PENDING';
    if (isPending) {
      router.replace('/auth/pending');
      return;
    }
    setAuthChecked(true);
  }, [session, sessionStatus, router]);

  useEffect(() => {
    const rt = JSON.parse(localStorage.getItem(RECENT_TITLE_KEY) || '[]');
    const rl = JSON.parse(localStorage.getItem(RECENT_LOCATION_KEY) || '[]');
    setRecentTitles(rt);
    setRecentLocations(rl);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (titleRef.current && !titleRef.current.contains(e.target as Node)) setShowTitleDrop(false);
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) setShowLocationDrop(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (!authChecked) return;
    const fetchInitialData = async () => {
      try {
        const [jobsRes] = await Promise.all([api.get('/jobs')]);
        setFilteredJobs(jobsRes.data);
        if (jobsRes.data.length > 0) setSelectedJob(jobsRes.data[0]);
        try {
          const profileRes = await api.get('/profile');
          setUserProfile(profileRes.data);
        } catch { }
        try {
          const savedRes = await api.get('/saved-jobs');
          setSavedJobIds(new Set(savedRes.data.map((sj: any) => sj.jobId)));
        } catch { }
      } catch (err) {
        console.error('Dashboard fetch error');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [authChecked]);

  const handleSearch = async (overrideTitle?: string, overrideLocation?: string, overrideSalary?: string, overrideType?: string, overrideDate?: string) => {
    const t = overrideTitle ?? searchTitle;
    const l = overrideLocation ?? searchLocation;
    const s = overrideSalary ?? minSalary;
    const ty = overrideType ?? selectedJobType;
    const d = overrideDate ?? datePosted;

    if (t) saveRecent(RECENT_TITLE_KEY, t, setRecentTitles);
    if (l) saveRecent(RECENT_LOCATION_KEY, l, setRecentLocations);
    setShowTitleDrop(false);
    setShowLocationDrop(false);
    setLoading(true);
    try {
      const res = await api.get('/jobs', { 
        params: { 
          title: t, 
          location: l,
          minSalary: s,
          type: ty,
          datePosted: d === 'Anytime' ? '' : d
        } 
      });
      setFilteredJobs(res.data);
      if (res.data.length > 0) setSelectedJob(res.data[0]);
    } catch { } finally { setLoading(false); }
  };

  const saveRecent = (key: string, value: string, setter: (v: string[]) => void) => {
    const prev: string[] = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = [value, ...prev.filter((v) => v !== value)].slice(0, 5);
    localStorage.setItem(key, JSON.stringify(updated));
    setter(updated);
  };

  const removeRecent = (key: string, value: string, setter: (v: string[]) => void) => {
    const prev: string[] = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = prev.filter((v) => v !== value);
    localStorage.setItem(key, JSON.stringify(updated));
    setter(updated);
  };

  const handleToggleSave = async (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    try {
      let message = '';
      if (savedJobIds.has(jobId)) {
        await api.delete(`/saved-jobs/${jobId}`);
        const newIds = new Set(savedJobIds);
        newIds.delete(jobId);
        setSavedJobIds(newIds);
        message = 'Removed from saved jobs';
      } else {
        await api.post(`/saved-jobs/${jobId}`);
        const newIds = new Set(savedJobIds);
        newIds.add(jobId);
        setSavedJobIds(newIds);
        message = 'Job saved successfully';
      }
      setToast({ show: true, message });
      setTimeout(() => setToast(null), 3000);
    } catch { }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
        
        {/* SEARCH SECTION - PINK INDEED MIRROR */}
        <div className="max-w-4xl mx-auto mb-16">
            <div className="flex items-center bg-white rounded-full border border-slate-300 shadow-md hover:shadow-lg transition-shadow p-1.5 relative group">
                {/* WHAT */}
                <div className="flex-[5] flex items-center relative" ref={titleRef}>
                    <div className="pl-4 pr-3 text-slate-900 font-bold block">
                        <Search size={22} className="text-slate-900" />
                    </div>
                    <Input 
                        placeholder="Job title, keywords, or company" 
                        className="h-12 border-none bg-transparent font-bold text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-[16px]"
                        value={searchTitle}
                        onChange={(e) => setSearchTitle(e.target.value)}
                        onFocus={() => setShowTitleDrop(true)}
                    />
                    {showTitleDrop && (
                        <Card className="absolute top-[calc(100%+12px)] left-0 w-full sm:w-[480px] border-slate-200 shadow-2xl z-[150] p-0 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="py-4">
                                <p className="px-5 pb-3 text-[13px] font-bold text-slate-500">Recent searches</p>
                                {recentTitles.length > 0 ? (
                                    recentTitles.map(t => (
                                        <button key={t} className="w-full flex items-center px-5 py-3 hover:bg-slate-50 text-left transition-colors group/item" onClick={() => { setSearchTitle(t); handleSearch(t); }}>
                                            <History size={18} className="text-slate-400 mr-4" />
                                            <div className="flex-1">
                                                <span className="block text-[15px] font-bold text-slate-700 leading-tight">{t}</span>
                                                <span className="block text-[12px] text-pink-600 font-bold">1 new</span>
                                            </div>
                                            <X size={16} className="text-slate-300 opacity-0 group-hover/item:opacity-100 hover:text-red-500 transition-all p-1" onClick={(e) => { e.stopPropagation(); removeRecent(RECENT_TITLE_KEY, t, setRecentTitles); }} />
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-5 py-2 text-sm text-slate-400 font-medium italic">No recent searches</div>
                                )}
                            </div>
                            <div className="py-4 border-t border-slate-100">
                                <p className="px-5 pb-3 text-[13px] font-bold text-slate-500">Search suggestions</p>
                                <div className="grid grid-cols-1">
                                    {SUGGESTED_TITLES.map(s => (
                                        <button key={s} className="w-full flex items-center px-5 py-3 hover:bg-pink-50 text-left transition-colors group/item" onClick={() => { setSearchTitle(s); handleSearch(s); }}>
                                            <Search size={16} className="text-slate-400 group-hover/item:text-[#ec4899] mr-4" />
                                            <span className="text-[15px] font-bold text-slate-700 group-hover/item:text-[#ec4899] transition-colors">{s}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    )}
                </div>

                <div className="w-px h-8 bg-slate-200 mx-2 hidden md:block"></div>

                {/* WHERE */}
                <div className="flex-[4] flex items-center relative" ref={locationRef}>
                    <div className="pl-2 pr-3 text-slate-900 font-bold hidden md:block">
                        <MapPin size={22} className="text-slate-900" />
                    </div>
                    <Input 
                        placeholder="City, state, or zip" 
                        className="h-12 border-none bg-transparent font-bold text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-[16px]"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        onFocus={() => setShowLocationDrop(true)}
                    />
                    {showLocationDrop && (
                         <Card className="absolute top-[calc(100%+12px)] left-0 w-full sm:w-[380px] border-slate-200 shadow-2xl z-[150] p-0 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                             <div className="py-4">
                                 <p className="px-5 pb-3 text-[13px] font-bold text-slate-500">Suggested Zones</p>
                                 <div className="grid grid-cols-1">
                                    {SUGGESTED_LOCATIONS.map(loc => (
                                        <button key={loc} className="w-full flex items-center px-5 py-3.5 hover:bg-slate-50 text-left transition-colors" onClick={() => { setSearchLocation(loc); handleSearch(undefined, loc); }}>
                                            <MapPin size={18} className="text-slate-400 mr-4" />
                                            <span className="text-[15px] font-bold text-slate-700">{loc}</span>
                                        </button>
                                    ))}
                                 </div>
                             </div>
                         </Card>
                    )}
                </div>

                <Button onClick={() => handleSearch()} className="h-12 px-8 rounded-full bg-[#ec4899] hover:bg-[#db2777] font-black text-[16px] transition-all shrink-0 ml-2 text-white shadow-lg shadow-pink-100">
                    Find jobs
                </Button>
            </div>
            
            {/* FILTER CHIPS - PINK THEMED */}
            <div className="mt-8 flex flex-wrap gap-3 overflow-x-auto pb-2 scrollbar-hide">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className={`rounded-full h-10 px-6 font-bold transition-all ${minSalary ? 'text-pink-600 border-pink-600 bg-pink-50' : 'text-slate-700 border-slate-200 hover:border-pink-300 hover:text-pink-600 hover:bg-pink-50'}`}>
                            Pay {minSalary && `($${minSalary}+)`}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 rounded-2xl p-2 shadow-2xl border-slate-100">
                        <DropdownMenuLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest p-4">Minimum Salary</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={minSalary} onValueChange={(val) => { setMinSalary(val); handleSearch(undefined, undefined, val); }}>
                            <DropdownMenuRadioItem value="" className="font-bold py-3 rounded-xl">Any</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="30" className="font-bold py-3 rounded-xl">$30+ per hour</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="50" className="font-bold py-3 rounded-xl">$50+ per hour</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="70" className="font-bold py-3 rounded-xl">$70+ per hour</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="90" className="font-bold py-3 rounded-xl">$90+ per hour</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="outline" className="rounded-full h-10 px-6 font-bold text-pink-600 border-pink-600 bg-pink-50 flex items-center gap-2 shadow-sm">
                    Distance <span className="w-5 h-5 bg-pink-600 text-white rounded-full flex items-center justify-center text-[10px]">1</span>
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className={`rounded-full h-10 px-6 font-bold transition-all ${selectedJobType !== 'All' ? 'text-pink-600 border-pink-600 bg-pink-50' : 'text-slate-700 border-slate-200 hover:border-pink-300 hover:text-pink-600 hover:bg-pink-50'}`}>
                            Job Type {selectedJobType !== 'All' && `(${selectedJobType})`}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 rounded-2xl p-2 shadow-2xl border-slate-100">
                        <DropdownMenuLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest p-4">Employment Type</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={selectedJobType} onValueChange={(val) => { setSelectedJobType(val); handleSearch(undefined, undefined, undefined, val); }}>
                            <DropdownMenuRadioItem value="All" className="font-bold py-3 rounded-xl">All Types</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Full-time" className="font-bold py-3 rounded-xl">Full-time</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Part-time" className="font-bold py-3 rounded-xl">Part-time</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Night Shift" className="font-bold py-3 rounded-xl">Night Shift</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Contract" className="font-bold py-3 rounded-xl">Contract</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="outline" className="rounded-full h-10 px-6 font-bold text-slate-700 border-slate-200 hover:border-pink-300 hover:text-pink-600 hover:bg-pink-50 transition-all">Job Language</Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className={`rounded-full h-10 px-6 font-bold transition-all ${datePosted !== 'Anytime' ? 'text-pink-600 border-pink-600 bg-pink-50' : 'text-slate-700 border-slate-200 hover:border-pink-300 hover:text-pink-600 hover:bg-pink-50'}`}>
                            Date posted {datePosted !== 'Anytime' && `(Last ${datePosted}d)`}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 rounded-2xl p-2 shadow-2xl border-slate-100">
                        <DropdownMenuLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest p-4">Time Period</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={datePosted} onValueChange={(val) => { setDatePosted(val); handleSearch(undefined, undefined, undefined, undefined, val); }}>
                            <DropdownMenuRadioItem value="Anytime" className="font-bold py-3 rounded-xl">Anytime</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="1" className="font-bold py-3 rounded-xl">Last 24 hours</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="3" className="font-bold py-3 rounded-xl">Last 3 days</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="7" className="font-bold py-3 rounded-xl">Last 7 days</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="14" className="font-bold py-3 rounded-xl">Last 14 days</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>

        {/* CONTENT HIERARCHY */}
        <div className="max-w-6xl mx-auto">
            <div className="mb-8 border-b border-slate-200 flex items-center justify-between">
                <nav className="flex gap-8">
                    <button className="px-2 py-4 text-sm font-bold border-b-4 border-[#ec4899] text-[#ec4899]">Recommended Jobs</button>
                    <button className="px-2 py-4 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Past Searches</button>
                </nav>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Jobs based on your activity on NurseFlex
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative">
                
                {/* LEFT: JOB LIST */}
                <div className="md:col-span-12 lg:col-span-5 space-y-4">
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <Card key={i} className="border-slate-200 p-6 rounded-xl shadow-none">
                                    <Skeleton className="h-6 w-3/4 mb-4" />
                                    <Skeleton className="h-4 w-1/2 mb-2" />
                                    <Skeleton className="h-4 w-1/4" />
                                </Card>
                            ))}
                        </div>
                    ) : filteredJobs.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                            <AlertCircle size={40} className="mx-auto text-slate-300 mb-4" />
                            <p className="text-lg font-bold text-slate-500">No matching jobs found</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredJobs.map(job => (
                                <Card 
                                    key={job.id}
                                    onClick={() => setSelectedJob(job)}
                                    className={`group cursor-pointer transition-all border shadow-none rounded-xl overflow-hidden hover:border-[#ec4899] ${selectedJob?.id === job.id ? 'border-[#ec4899] ring-1 ring-[#ec4899]' : 'border-slate-200'}`}
                                >
                                    <CardContent className="p-6 relative">
                                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:bg-slate-100" onClick={(e) => handleToggleSave(e, job.id)}>
                                                {savedJobIds.has(job.id) ? <Bookmark size={18} fill="#ec4899" className="text-[#ec4899]" /> : <Bookmark size={18} />}
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:bg-slate-100">
                                                <ThumbsDown size={18} />
                                            </Button>
                                        </div>

                                        <div className="mb-2">
                                            <span className="text-[10px] font-black bg-pink-100 text-[#ec4899] px-2 py-0.5 rounded-sm uppercase tracking-widest">New</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-[#ec4899] group-hover:underline transition-all leading-snug mb-1 pr-12">{job.title}</h3>
                                        <div className="text-slate-900 text-sm font-bold mb-1">{job.hospital}</div>
                                        <div className="text-slate-600 text-sm mb-4">{job.location}</div>
                                        
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <div className="flex items-center bg-slate-100 text-slate-600 text-xs font-bold px-2 rounded-sm border border-slate-200/50">
                                                ${job.salary} an hour
                                            </div>
                                            <div className="flex items-center bg-slate-100 text-slate-600 text-xs font-bold px-2 rounded-sm border border-slate-200/50">
                                                {job.type}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-slate-500 text-[12px] font-bold">
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md text-[#ec4899]">
                                                <Send size={14} className="fill-[#ec4899]" />
                                                Easily apply
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-slate-50 text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                                            Posted 1 day ago
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* RIGHT: JOB DETAIL PANE */}
                <div className="hidden lg:block lg:col-span-7">
                    <Card className="sticky top-[100px] border border-slate-200 shadow-xl rounded-xl overflow-hidden bg-white h-[calc(100vh-140px)] flex flex-col">
                        {selectedJob ? (
                            <ScrollArea className="flex-1">
                                <div className="p-8">
                                    <div className="mb-8">
                                        <h1 className="text-3xl font-black text-slate-900 mb-2 leading-tight tracking-tight">{selectedJob.title}</h1>
                                        <div className="space-y-1 mb-6">
                                            <div className="flex items-center gap-2">
                                                <Link href="#" className="text-base font-bold text-[#ec4899] hover:underline">
                                                    {selectedJob.hospital}
                                                </Link>
                                                <span className="text-slate-400 text-sm">|</span>
                                                <span className="text-sm text-slate-600 font-medium">{selectedJob.location}</span>
                                            </div>
                                            <div className="text-sm text-slate-900 font-bold">
                                                ${selectedJob.salary} an hour
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Button asChild className="bg-[#ec4899] hover:bg-[#db2777] h-11 px-8 rounded-xl text-base font-bold text-white shadow-md shadow-pink-100 transition-all active:scale-[0.98]">
                                                <Link href={`/jobs/${selectedJob.id}/apply/contact`}>Apply now</Link>
                                            </Button>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="icon" className="h-11 w-11 border-slate-200 hover:bg-slate-50 rounded-xl transition-all" onClick={(e) => handleToggleSave(e, selectedJob.id)}>
                                                    <Bookmark size={20} className={savedJobIds.has(selectedJob.id) ? 'fill-[#ec4899] text-[#ec4899]' : 'text-slate-600'} />
                                                </Button>
                                                <Button variant="outline" size="icon" className="h-11 w-11 border-slate-200 hover:bg-slate-50 rounded-xl transition-all">
                                                    <ThumbsDown size={20} className="text-slate-600" />
                                                </Button>
                                                <Button variant="outline" size="icon" className="h-11 w-11 border-slate-200 hover:bg-slate-50 rounded-xl transition-all">
                                                    <Share2 size={20} className="text-slate-600" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator className="bg-slate-100 mb-8" />

                                    <div className="space-y-8 max-w-2xl">
                                        {/* Profile Insights Section */}
                                        <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 mb-8">
                                            <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                                                <Zap size={18} className="text-[#ec4899]" /> Profile insights
                                            </h2>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-6 px-1">Job details</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-9 h-9 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-slate-600 shadow-sm">
                                                        <DollarSign size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900 mb-1">Pay</p>
                                                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 font-bold text-xs px-2.5 py-1 rounded-md">
                                                            Up to ${selectedJob.salary} an hour
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="w-9 h-9 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-slate-600 shadow-sm">
                                                        <Briefcase size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900 mb-1">Job type</p>
                                                        <Badge variant="outline" className="bg-slate-100 border-none text-slate-600 font-bold text-xs px-2.5 py-1 rounded-md">
                                                            {selectedJob.type}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator className="bg-slate-100" />

                                        {/* Dynamic Description & Requirements */}
                                        <div className="max-w-none">
                                            <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-tight border-b border-slate-100 pb-2">Full job description</h2>
                                            
                                            <div className="space-y-4 text-slate-600 font-medium leading-relaxed">
                                                {selectedJob.description && selectedJob.description.trim() !== "" ? (
                                                    <div className="whitespace-pre-wrap">
                                                        {selectedJob.description}
                                                    </div>
                                                ) : (
                                                    <div className="bg-slate-50 border border-dashed border-slate-200 p-8 rounded-xl text-center">
                                                        <p className="text-slate-400 italic">No detailed description provided for this position.</p>
                                                        <p className="text-[10px] text-slate-300 mt-2 font-mono">Job ID: {selectedJob.id}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ScrollArea>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-12 text-center opacity-40">
                                <Search size={64} className="text-slate-300 mb-6" />
                                <h2 className="text-2xl font-bold text-slate-400">Select a job for full details</h2>
                            </div>
                        )}
                        <CardFooter className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                            <Button variant="link" className="text-xs font-bold text-[#ec4899] p-0 h-auto">Report job</Button>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Job ID: {selectedJob?.id || 'N/A'}</span>
                        </CardFooter>
                    </Card>
                </div>

            </div>
        </div>
      </div>

      {/* TOAST SYSTEM */}
      {toast?.show && (
        <div className="fixed bottom-8 right-8 z-[200] animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Card className="border-none shadow-2xl bg-[#ec4899] text-white px-6 py-4 flex items-center gap-4 rounded-lg">
                <CheckCircle2 size={20} className="shrink-0" />
                <span className="font-bold text-sm tracking-tight">{toast.message}</span>
                <button onClick={() => setToast(null)} className="ml-4 hover:opacity-50 transition-opacity">
                    <X size={18} />
                </button>
            </Card>
        </div>
      )}
    </div>
  );
}
