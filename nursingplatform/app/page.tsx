"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, ArrowRight, Star, Zap, CheckCircle, Users, ClipboardCheck, Heart, ShieldCheck } from 'lucide-react';
import EmployerProfileDropdown from '@/app/components/EmployerProfileDropdown';

export default function LandingPage() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');

  // 📈 Registered Nurses Counter (Mock dynamic)
  const [nurseCount, setNurseCount] = useState(12480);
  useEffect(() => {
    const interval = setInterval(() => {
      setNurseCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col text-slate-900">



      {/* 🔍 HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-24 px-6">
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6 relative z-10">
            <h1 className="text-4xl md:text-[3.25rem] font-bold text-slate-900 leading-[1.1] tracking-tighter">
              The top site for <span className="text-[#ec4899]">verified nurses</span> in the USA.
            </h1>

            <p className="text-lg text-slate-600 font-medium max-w-xl leading-relaxed">
              Search thousands of nursing jobs. Connect with top facilities. Manage your career with a premium digital community built for healthcare professionals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/auth/register" className="bg-[#ec4899] hover:bg-[#db2777] text-white font-bold px-8 py-4 rounded-xl transition-all shadow-none flex items-center justify-center gap-2 group">
                Get started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex items-center gap-4 px-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`w-10 h-10 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center overflow-hidden`}>
                      <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">{nurseCount.toLocaleString()}+</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registered Nurses</p>
                </div>
              </div>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 pt-6">
              {[
                "100% Verified Profiles",
                "Largest US Nursing Network",
                "Direct Facility Connections",
                "Transparent Career Path"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-2.5 text-slate-600 font-semibold text-sm">
                  <CheckCircle size={18} className="text-emerald-500 fill-emerald-50" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-1 relative lg:block hidden">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl transition-all duration-700 hover:scale-[1.01] bg-white group">
              <img
                src="/nurse_hero_professional_1773058826182.png"
                alt="Professional Nurse Community"
                className="w-full h-auto object-cover"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur p-4 rounded-xl shadow-lg flex items-center gap-3 border border-slate-100">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 tracking-tight">Verified Candidate</h4>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Job Ready</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24 px-6">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 grid grid-cols-2 gap-4 relative">
            <div className="space-y-4">
              <div className="h-48 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-center items-center text-center group transition-all">
                <Users size={32} className="text-[#ec4899] mb-3" />
                <h4 className="font-bold text-slate-900">Growing Network</h4>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Join thousands across the US</p>
              </div>
              <div className="h-40 bg-[#ec4899] rounded-2xl p-6 shadow-sm flex flex-col justify-center items-center text-center text-white">
                <h4 className="text-3xl font-bold mb-1">98%</h4>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Match Rate</p>
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="h-40 bg-emerald-500 rounded-2xl p-6 shadow-sm flex flex-col justify-center items-center text-center text-white">
                <ClipboardCheck size={32} className="mb-3" />
                <h4 className="font-bold">Fast Hiring</h4>
              </div>
              <div className="h-48 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-center items-center text-center group transition-all">
                <Heart size={32} className="text-red-500 mb-3" />
                <h4 className="font-bold text-slate-900">Elite Jobs</h4>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Top-tier health facilities</p>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-8">
            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tighter">Your career. <span className="text-[#ec4899]">In your control.</span></h2>
              <div className="h-1.5 w-16 bg-[#ec4899] rounded-full"></div>
            </div>

            <div className="space-y-4 text-base font-medium text-slate-600 leading-relaxed">
              <p>
                Healthcare systems across the United States are experiencing a significant demand for skilled and qualified nurses. Our platform connects professional nurses with healthcare organizations looking for reliable and experienced talent.
              </p>
              <p>
                By joining our community, you become part of a growing network where your professional profile can be shared with hospitals, clinics, and healthcare partners actively seeking nursing professionals.
              </p>
              <div className="p-6 bg-pink-50/50 rounded-xl border-l-[6px] border-[#ec4899] font-semibold text-[#db2777]">
                We help people get jobs. Join thousands of verified nurses who have advanced their careers through the NurseFlex platform.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 HOW IT WORKS SECTION */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-5xl font-bold text-slate-900 tracking-tight">How it works</h2>
            <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Four simple steps to success</p>
          </div>

          <div className="grid md:grid-cols-4 gap-12">
            {[
              {
                step: "01",
                title: "Create Your Profile",
                desc: "Register and complete your professional profile including specialization and certifications.",
                color: "bg-pink-600"
              },
              {
                step: "02",
                title: "Profile Review",
                desc: "Our team will review and verify your information to maintain community standards.",
                color: "bg-indigo-600"
              },
              {
                step: "03",
                title: "Get Verified",
                desc: "Once approved, your professional profile will receive its verified status badge.",
                color: "bg-emerald-600"
              },
              {
                step: "04",
                title: "Connect & Hire",
                desc: "Start connecting with healthcare employers searching for your specific expertise.",
                color: "bg-slate-900"
              }
            ].map((item, idx) => (
              <div key={idx} className="relative group">
                <div className={`w-14 h-14 ${item.color} text-white rounded-xl flex items-center justify-center text-xl font-bold mb-8 shadow-md group-hover:scale-110 transition-transform`}>
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">{item.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-7 left-20 right-[-2.5rem] h-px border-t-2 border-dashed border-slate-100 -z-10"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 CTA SECTION */}
      <section className="px-6 pb-24">
        <div className="max-w-[1440px] mx-auto bg-slate-900 rounded-3xl p-16 text-center relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-[#ec4899]"></div>
          <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">Ready to join the community?</h2>
          <p className="text-pink-100/60 font-bold text-[10px] uppercase tracking-[0.3em] mb-10">Join {nurseCount.toLocaleString()} nurses today</p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/auth/register" className="bg-[#ec4899] text-white font-bold px-10 py-4 rounded-xl text-lg hover:bg-[#db2777] transition-all shadow-none">
              Register as a Nurse
            </Link>
            <Link href="/auth/login" className="bg-slate-800 text-white font-bold px-10 py-4 rounded-xl text-lg hover:bg-slate-700 transition-all border border-white/10">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* 📜 FOOTER */}
      <footer className="bg-slate-50 py-16 px-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            <div className="space-y-6 max-w-sm">
              <Link href="/" className="text-2xl font-bold text-[#ec4899] tracking-tight">NurseFlex</Link>
              <p className="text-slate-500 font-medium leading-relaxed text-sm">
                Empowering nurses across the United States with a platform designed for professional growth and verified opportunities.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
              <div className="space-y-6">
                <h5 className="font-bold text-slate-900 text-[10px] uppercase tracking-widest">Platform</h5>
                <ul className="space-y-3 text-sm font-semibold text-slate-500">
                  <li><Link href="/about" className="hover:text-[#ec4899] transition-colors">About Us</Link></li>
                  <li><Link href="/contact" className="hover:text-[#ec4899] transition-colors">Contact Us</Link></li>
                  <li><Link href="/jobs" className="hover:text-[#ec4899] transition-colors">Job Search</Link></li>
                  <li><Link href="/blogs" className="hover:text-[#ec4899] transition-colors">Blogs</Link></li>
                </ul>
              </div>
              <div className="space-y-6">
                <h5 className="font-bold text-slate-900 text-[10px] uppercase tracking-widest">Legal</h5>
                <ul className="space-y-3 text-sm font-semibold text-slate-500">
                  <li><Link href="#" className="hover:text-[#ec4899] transition-colors">Privacy Policy</Link></li>
                  <li><Link href="#" className="hover:text-[#ec4899] transition-colors">Terms</Link></li>
                </ul>
              </div>
              <div className="space-y-6 col-span-2 md:col-span-1">
                <h5 className="font-bold text-slate-900 text-[10px] uppercase tracking-widest">For Businesses</h5>
                <ul className="space-y-3 text-sm font-semibold text-slate-500">
                  <li><Link href="/business" className="hover:text-[#ec4899] transition-colors">Hire Nurses</Link></li>
                  <li><Link href="/business/post-job" className="hover:text-[#ec4899] transition-colors">Post a Shift</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center py-8 border-t border-slate-200 gap-8">
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">© 2026 NurseFlex Community. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}