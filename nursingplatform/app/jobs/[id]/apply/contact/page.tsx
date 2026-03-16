'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Loader2, X, AlertCircle, ChevronRight, ArrowLeft,
    User, Mail, Phone, MapPin, Globe, CheckCircle2
} from 'lucide-react';
import api from '@/lib/api';

export default function ContactInfoPage() {
    const { id } = useParams();
    const router = useRouter();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [showSaveModal, setShowSaveModal] = useState(false);
    
    // Form States
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        city: '',
        province: ''
    });

    const [isSaving, setIsSaving] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Job
                const jobsRes = await api.get('/jobs');
                const foundJob = jobsRes.data.find((j: any) => j.id === id);
                setJob(foundJob);

                // Fetch Profile
                const profileRes = await api.get('/profile');
                const p = profileRes.data;
                setProfile(p);
                
                // Initialize form with profile data or existing localStorage data
                const savedContact = JSON.parse(localStorage.getItem('applicationContactData') || '{}');
                
                setFormData({
                    firstName: savedContact.firstName || p.firstName || '',
                    lastName: savedContact.lastName || p.lastName || '',
                    email: savedContact.email || p.email || '',
                    phone: savedContact.phone || p.phone || '',
                    city: savedContact.city || p.city || '',
                    province: savedContact.province || p.province || ''
                });

            } catch (err) {
                console.error("Failed to fetch data for contact page", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleContinue = () => {
        setIsSaving(true);
        // Persist to localStorage for later steps
        localStorage.setItem('applicationContactData', JSON.stringify(formData));
        setTimeout(() => {
            router.push(`/jobs/${id}/apply`); // Next step: Resume Upload
        }, 600);
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
                            <div className="flex-1 h-2 bg-pink-50 rounded-full mr-4 relative overflow-hidden">
                                <div
                                    className="absolute top-0 left-0 h-full bg-pink-600 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: '25%' }}
                                ></div>
                            </div>
                            <span className="text-[11px] font-black text-pink-400 uppercase tracking-widest mr-8">25%</span>
                            <button 
                                onClick={() => setShowSaveModal(true)}
                                className="text-pink-600 font-bold text-sm hover:underline"
                            >
                                Save and close
                            </button>
                        </div>

                        <div className="space-y-10">
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter italic">
                                Contact Information
                            </h1>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">First name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 group-focus-within:text-pink-600 transition-colors" size={18} />
                                            <input 
                                                type="text"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                                className="w-full h-14 pl-12 pr-4 bg-pink-50/50 border border-pink-100 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">Last name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 group-focus-within:text-pink-600 transition-colors" size={18} />
                                            <input 
                                                type="text"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                                className="w-full h-14 pl-12 pr-4 bg-pink-50/50 border border-pink-100 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 group-focus-within:text-pink-600 transition-colors" size={18} />
                                        <input 
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full h-14 pl-12 pr-4 bg-pink-50/50 border border-pink-100 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                                        />
                                    </div>
                                    <p className="text-[10px] font-bold text-pink-400 mt-1 ml-1 uppercase tracking-tighter">Your email is only shown to the employer after you apply.</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">Phone number (Optional)</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 group-focus-within:text-pink-600 transition-colors" size={18} />
                                        <input 
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            className="w-full h-14 pl-12 pr-4 bg-pink-50/50 border border-pink-100 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">City</label>
                                        <div className="relative group">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 group-focus-within:text-pink-600 transition-colors" size={18} />
                                            <input 
                                                type="text"
                                                value={formData.city}
                                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                                                className="w-full h-14 pl-12 pr-4 bg-pink-50/50 border border-pink-100 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">Province / State</label>
                                        <div className="relative group">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 group-focus-within:text-pink-600 transition-colors" size={18} />
                                            <input 
                                                type="text"
                                                value={formData.province}
                                                onChange={(e) => setFormData({...formData, province: e.target.value})}
                                                className="w-full h-14 pl-12 pr-4 bg-pink-50/50 border border-pink-100 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Save & Next Button */}
                            <button
                                onClick={handleContinue}
                                disabled={isSaving}
                                className="w-full py-5 bg-pink-600 text-white font-bold rounded-2xl text-lg hover:bg-pink-700 shadow-md shadow-pink-200 transition-all uppercase tracking-widest mt-4 flex items-center justify-center gap-3"
                            >
                                {isSaving ? <Loader2 className="animate-spin" /> : 'Save & Next'}
                            </button>

                            <div className="text-center pt-8">
                                <p className="text-[10px] text-pink-300 font-bold max-w-sm mx-auto uppercase tracking-tighter leading-tight">
                                    By clicking Save & Next, you agree to NurseFlex's <span className="underline hover:text-pink-400 cursor-pointer">Terms of Service</span>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* SAVE MODAL (REUSED) */}
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
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

