"use client";
import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { US_HOSPITALS, US_STATES } from '@/app/lib/constants';
import { Search, MapPin, Hospital, Zap, Loader2, Filter, DollarSign, Building2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/app/components/ui/button";

export default function JobsPage() {
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "ICU", "ER", "Pediatrics", "Geriatric", "Full-Time", "Part-Time"];
  const topFacilities = US_HOSPITALS.slice(0, 5).map(h => h.label); // Show top 5 recognizable hospitals

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs');
        setAllJobs(res.data);
        setFilteredJobs(res.data);
      } catch (err) {
        console.error("Jobs fetch error, using mock data for development");
        const mockJobs = [
          { id: 1, title: "ICU Specialist (Critical Care)", hospital: "Mayo Clinic", location: "Rochester, MN", salary: "$115k - $140k", type: "Full-Time" },
          { id: 2, title: "Pediatrics RN", hospital: "Children's Hospital of Philadelphia", location: "Philadelphia, PA", salary: "$95k - $110k", type: "Full-Time" },
          { id: 3, title: "Emergency Room (ER) Nurse", hospital: "Massachusetts General Hospital", location: "Boston, MA", salary: "$105k - $130k", type: "Full-Time" },
          { id: 4, title: "Labor & Delivery Nurse", hospital: "Cedars-Sinai Medical Center", location: "Los Angeles, CA", salary: "$110k - $135k", type: "Full-Time" },
          { id: 5, title: "Cardiac ICU Nurse", hospital: "Johns Hopkins Hospital", location: "Baltimore, MD", salary: "$120k - $150k", type: "Part-Time" },
          { id: 6, title: "Geriatric Care Manager", hospital: "Cleveland Clinic", location: "Cleveland, OH", salary: "$100k - $125k", type: "Full-Time" },
          { id: 7, title: "Pediatric Care Specialist", hospital: "Stanford Health Care", location: "Palo Alto, CA", salary: "$100k - $120k", type: "Part-Time" },
          { id: 8, title: "ER Trauma Specialist", hospital: "Dallas Medical Center", location: "Dallas, TX", salary: "$95k - $115k", type: "Full-Time" },
          { id: 9, title: "Geriatric Nurse Practitioner", hospital: "Mount Sinai Hospital", location: "New York, NY", salary: "$130k - $160k", type: "Full-Time" },
          { id: 10, title: "Intensive Care Unit (ICU) Nurse", hospital: "UCLA Health", location: "Los Angeles, CA", salary: "$115k - $145k", type: "Full-Time" },
          { id: 11, title: "Part-Time Geriatric Nurse", hospital: "Sunrise Senior Living", location: "Chicago, IL", salary: "$45 - $60/hr", type: "Part-Time" },
          { id: 12, title: "Urgent Care Nurse", hospital: "Kaiser Permanente", location: "San Francisco, CA", salary: "$110k - $130k", type: "Part-Time" }
        ];
        setAllJobs(mockJobs);
        setFilteredJobs(mockJobs);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Search aur Filter Logic
  useEffect(() => {
    let result = allJobs;

    if (searchTerm) {
      result = result.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.hospital.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedState !== "All") {
      result = result.filter(job => 
        job.location.includes(selectedState)
      );
    }

    if (activeCategory !== "All") {
      result = result.filter(job => {
        const title = job.title.toLowerCase();
        const typeArr = [job.type.toLowerCase()];
        const hospital = job.hospital.toLowerCase();
        const category = activeCategory.toLowerCase();

        // Specific category mappings
        if (category === 'er') return title.includes('er') || title.includes('emergency');
        if (category === 'icu') return title.includes('icu') || title.includes('intensive care');
        if (category === 'pediatrics') return title.includes('pediatric');
        if (category === 'geriatric') return title.includes('geriatric');
        
        return title.includes(category) || typeArr.includes(category) || hospital.includes(category);
      });
    }

    // --- Advanced Deduplication Logic ---
    // Strip IDs and unique markers from titles to find "real" duplicates
    const seen = new Set();
    result = result.filter(job => {
      // Clean title: remove "(ID: ...)" patterns
      const cleanTitle = job.title.replace(/\(ID:.*?\)/i, '').trim().toLowerCase();
      const key = `${cleanTitle}-${job.hospital}-${job.location}`.toLowerCase();
      
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    setFilteredJobs(result);
  }, [searchTerm, activeCategory, selectedState, allJobs]);

  if (loading) return (
    <div className="h-[70vh] flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-[#ec4899] mb-4" size={32} />
      <p className="text-xs font-semibold text-slate-400">Searching for jobs...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tighter">Find Nursing Jobs in the USA</h1>
          <p className="text-pink-600 font-bold mt-2 text-sm bg-pink-50 px-3 py-1 rounded-full inline-block">
            {filteredJobs.length} open positions
          </p>
        </header>

        {/* Search & Category Section */}
        <div className="max-w-4xl mb-12 space-y-6">
          <div className="flex flex-col md:flex-row gap-0 border-2 border-slate-300 rounded-lg overflow-hidden shadow-sm">
            <div className="flex-1 relative group bg-white border-b md:border-b-0 md:border-r border-slate-300">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Job title, keywords, or hospital"
                className="w-full bg-transparent p-4 pl-14 outline-none font-medium text-slate-900 placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="md:w-64 relative bg-white group flex items-center pr-4">
                <MapPin className="ml-5 text-slate-400" size={20} />
                <select 
                    value={selectedState} 
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full p-4 bg-transparent outline-none font-bold text-slate-700 appearance-none cursor-pointer"
                >
                    <option value="All">All US States</option>
                    {US_STATES.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>
            </div>
            <button className="bg-[#ec4899] hover:bg-[#db2777] text-white font-bold px-8 py-4 transition-all whitespace-nowrap">
                Search jobs
            </button>
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap border ${activeCategory === cat
                  ? "bg-[#ec4899] text-white border-[#ec4899]"
                  : "bg-white text-slate-600 border-slate-300 hover:border-[#ec4899] hover:text-[#ec4899]"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Top Hospitals Filter */}
        <div className="mb-12 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Top Facilities:</span>
            {topFacilities.map((facility) => (
              <button
                key={facility}
                onClick={() => {
                  if (activeCategory === facility) setActiveCategory("All");
                  else setActiveCategory(facility);
                }}
                className={`text-xs px-3 py-1 rounded-md border font-semibold transition-all ${activeCategory === facility
                  ? 'bg-pink-50 border-[#ec4899] text-[#ec4899]'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-[#ec4899] hover:text-[#ec4899]'
                  }`}
              >
                {facility}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-none hover:border-[#ec4899] transition-all flex flex-col h-full group">
                <div className="mb-1">
                  <span className="text-[10px] font-bold bg-[#fdf2f8] text-[#ec4899] px-1.5 py-0.5 rounded-sm uppercase tracking-wide">New</span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 group-hover:underline leading-tight mb-2">
                  {job.title}
                </h3>

                <div className="space-y-1 mb-4">
                  <p className="text-slate-700 font-semibold text-sm">{job.hospital}</p>
                  <p className="text-slate-600 text-sm">{job.location}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <div className="flex items-center bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-sm">
                    {job.salary}
                  </div>
                  <div className="flex items-center bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-sm">
                    {job.type}
                  </div>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-[#ec4899] text-xs font-bold">
                    <Zap size={14} className="fill-[#ec4899]" /> Easy Apply
                  </div>
                  <Link href={`/jobs/${job.id}/apply/contact`}>
                    <Button variant="ghost" size="sm" className="font-bold text-[#ec4899] hover:bg-pink-50">
                      Details <ArrowRight size={14} className="ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center bg-white rounded-xl border-2 border-dashed border-slate-200">
              <Filter className="mx-auto text-slate-300 mb-4" size={48} />
              <h3 className="text-xl font-bold text-slate-900">No matching roles found</h3>
              <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or search keywords</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}