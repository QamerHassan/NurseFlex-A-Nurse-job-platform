"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Zap, CheckCircle, Users,
  ClipboardCheck, Heart, ShieldCheck,
  Star, MapPin, Briefcase, TrendingUp,
  Clock, BadgeCheck, BookOpen, ArrowUpRight,
  ChevronRight
} from 'lucide-react';
import api from '@/lib/api';

// ─── Intersection Observer Hook for scroll animations ────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── Animated Blog Card ───────────────────────────────────────────────────────
function BlogCard({ blog, index }: { blog: any; index: number }) {
  const { ref, inView } = useInView(0.1);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView
          ? 'translateY(0) scale(1)'
          : 'translateY(48px) scale(0.97)',
        transition: `opacity 0.6s ease ${index * 0.12}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 0.12}s`,
      }}
    >
      <Link
        href={`/blogs`}
        style={{
          display: 'block',
          background: 'white',
          borderRadius: 20,
          overflow: 'hidden',
          border: `1px solid ${hovered ? 'rgba(20,184,166,0.3)' : 'rgba(0,0,0,0.06)'}`,
          boxShadow: hovered
            ? '0 20px 60px rgba(20,184,166,0.15), 0 4px 20px rgba(0,0,0,0.08)'
            : '0 2px 12px rgba(0,0,0,0.04)',
          transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
          transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
          textDecoration: 'none',
          height: '100%',
        }}
      >
        {/* Cover image */}
        <div style={{
          position: 'relative',
          height: 'clamp(140px, 22vw, 200px)',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #e0f2fe, #dcfce7)'
        }}>
          {blog.imageUrl ? (
            <img
              src={blog.imageUrl}
              alt={blog.title}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transform: hovered ? 'scale(1.06)' : 'scale(1)',
                transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
              }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: index % 2 === 0
                ? 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(20,184,166,0.15))'
                : 'linear-gradient(135deg, rgba(20,184,166,0.1), rgba(16,185,129,0.15))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BookOpen size={40} style={{ color: index % 2 === 0 ? '#2563eb' : '#14b8a6', opacity: 0.4 }} />
            </div>
          )}

          {/* Category pill overlay */}
          <div style={{
            position: 'absolute', top: 14, left: 14,
            background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
            padding: '4px 12px', borderRadius: 20,
            fontSize: 10, fontWeight: 700, color: '#0f172a',
            textTransform: 'uppercase', letterSpacing: '0.07em',
            border: '1px solid rgba(255,255,255,0.6)',
          }}>
            {blog.category || 'Nursing Tips'}
          </div>

          {/* Arrow icon on hover */}
          <div style={{
            position: 'absolute', top: 14, right: 14,
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, #14b8a6, #10b981)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'scale(1) rotate(0deg)' : 'scale(0.6) rotate(-45deg)',
            transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
            boxShadow: '0 4px 12px rgba(20,184,166,0.4)',
          }}>
            <ArrowUpRight size={16} style={{ color: 'white' }} />
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '20px 22px 22px' }}>
          {/* Date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Clock size={11} style={{ color: '#94a3b8' }} />
            <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>
              {blog.createdAt
                ? new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'Recent'}
            </span>
          </div>

          {/* Title */}
          <h3 style={{
            fontSize: 16, fontWeight: 700, color: '#0f172a',
            lineHeight: 1.4, marginBottom: 10,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
            transition: 'color 0.2s',
            ...(hovered ? { color: '#0d9488' } : {}),
          }}>
            {blog.title}
          </h3>

          {/* Summary */}
          <p style={{
            fontSize: 13, color: '#64748b', lineHeight: 1.6,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
            marginBottom: 16,
          }}>
            {blog.content || 'Read this insightful article from our nursing community.'}
          </p>

          {/* Read more */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12, fontWeight: 700,
            color: hovered ? '#14b8a6' : '#2563eb',
            transition: 'color 0.2s',
          }}>
            Read article
            <ArrowRight
              size={13}
              style={{
                transform: hovered ? 'translateX(4px)' : 'translateX(0)',
                transition: 'transform 0.2s',
              }}
            />
          </div>
        </div>
      </Link>
    </div>
  );
}

// ─── Blog Section ─────────────────────────────────────────────────────────────
function BlogSection() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref: headerRef, inView: headerInView } = useInView(0.2);

  useEffect(() => {
    api.get('/blogs')
      .then(res => {
        const all = Array.isArray(res.data) ? res.data : [];
        setBlogs(all.filter((b: any) => b.status === 'Published' || !b.status).slice(0, 3));
      })
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && blogs.length === 0) return null;

  return (
    <section style={{ padding: 'clamp(40px, 8vw, 72px) clamp(16px, 4vw, 24px)', background: 'white' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Section header */}
        <div
          ref={headerRef}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: 48,
            flexWrap: 'wrap',
            gap: 16,
            opacity: headerInView ? 1 : 0,
            transform: headerInView ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <div style={{ flex: '1 1 260px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: 'linear-gradient(135deg, #14b8a6, #10b981)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(20,184,166,0.3)',
                flexShrink: 0,
              }}>
                <BookOpen size={15} style={{ color: 'white' }} />
              </div>
              <span style={{
                fontSize: 11, fontWeight: 700, color: '#10b981',
                textTransform: 'uppercase', letterSpacing: '0.1em',
              }}>
                From the Blog
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(22px, 4vw, 32px)',
              fontWeight: 800, color: '#0f172a',
              letterSpacing: '-0.02em', lineHeight: 1.2,
            }}>
              Insights for{' '}
              <span style={{
                background: 'linear-gradient(135deg, #2563eb, #14b8a6)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                nursing professionals
              </span>
            </h2>
            <p style={{ fontSize: 14, color: '#64748b', marginTop: 8, maxWidth: 400 }}>
              Tips, career advice, and stories from nurses across the US.
            </p>
          </div>

          <Link
            href="/blogs"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 22px', borderRadius: 12,
              border: '1px solid rgba(20,184,166,0.25)',
              background: 'rgba(20,184,166,0.05)',
              color: '#0d9488', fontSize: 13, fontWeight: 700,
              textDecoration: 'none', transition: 'all 0.2s',
              flexShrink: 0,
              alignSelf: 'flex-start',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(20,184,166,0.1)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(20,184,166,0.4)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(20,184,166,0.05)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(20,184,166,0.25)';
            }}
          >
            View all articles <ChevronRight size={15} />
          </Link>
        </div>

        {/* Cards grid */}
        {loading ? (
          /* Skeleton loaders — responsive grid */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
            gap: 24
          }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ height: 180, background: 'linear-gradient(90deg, #f1f5f9, #e2e8f0, #f1f5f9)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
                <div style={{ padding: 22 }}>
                  <div style={{ height: 12, width: '40%', borderRadius: 6, background: '#f1f5f9', marginBottom: 12 }} />
                  <div style={{ height: 16, width: '90%', borderRadius: 6, background: '#f1f5f9', marginBottom: 8 }} />
                  <div style={{ height: 16, width: '70%', borderRadius: 6, background: '#f1f5f9', marginBottom: 16 }} />
                  <div style={{ height: 11, width: '30%', borderRadius: 6, background: '#f1f5f9' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))',
            gap: 24,
            alignItems: 'stretch',
          }}>
            {blogs.map((blog, i) => (
              <BlogCard key={blog._id || blog.id || i} blog={blog} index={i} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          0%,100% { background-position: 200% 0; }
          50%      { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function LandingPage() {
  const [nurseCount, setNurseCount] = useState(12480);

  useEffect(() => {
    const interval = setInterval(() => {
      setNurseCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col text-slate-900">

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 sm:px-6 pt-6 pb-16 md:pt-0 md:pb-20">
        <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-blue-100/40 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[360px] h-[360px] bg-green-100/30 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-semibold">
              <Zap size={13} className="fill-green-500 text-green-500" />
              USA's #1 Nursing Job Platform
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-extrabold text-slate-900 leading-[1.08] tracking-tight">
                Find the right <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
                  nursing job
                </span>
                <br /> faster.
              </h1>
              <p className="text-base md:text-lg text-slate-500 max-w-md leading-relaxed pt-1">
                We connect verified nurses with top healthcare facilities across the US. Free for nurses, always.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link href="/auth/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3.5 rounded-xl text-base shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 transition-all group">
                Get started free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/jobs"
                className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 font-semibold text-sm transition-colors">
                Browse open jobs →
              </Link>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-3">
                {[11, 12, 13, 14, 15].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/80?u=${i}`} alt="nurse"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-sm object-cover" />
                ))}
              </div>
              <div>
                <p className="font-bold text-slate-900 text-lg leading-none">{nurseCount.toLocaleString()}+</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Registered nurses</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-2 border-t border-slate-100">
              {['Verified nurse profiles', 'Nationwide US network', 'Direct employer contact', '100% free for nurses'].map((f, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <CheckCircle size={12} className="text-green-600" />
                  </div>
                  {f}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block relative">
            <div className="absolute -inset-3 bg-gradient-to-br from-blue-500/15 to-green-500/15 rounded-3xl blur-2xl" />
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-2xl">
              <img src="/nurse_hero_professional_1773058826182.png" alt="Professional nurse" className="w-full h-auto object-cover" />
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-white/60">
                <div className="w-11 h-11 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-md shrink-0">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Elite Verified Candidate</p>
                  <p className="text-[11px] text-green-600 font-semibold mt-0.5">Pre-Screened · Immediate Availability</p>
                </div>
              </div>
            </div>
            <div className="absolute -left-8 top-1/3 bg-white rounded-2xl shadow-xl p-4 border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Briefcase size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm leading-none">8,400+</p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Active job listings</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAND ───────────────────────────────────────────────────────── */}
      <section className="bg-slate-900 py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
          {[
            { value: '12,600+', label: 'Registered Nurses' },
            { value: '8,400+', label: 'Active Job Listings' },
            { value: '2,300+', label: 'Healthcare Facilities' },
            { value: '98%', label: 'Placement Rate' },
          ].map((s, i) => (
            <div key={i} className="space-y-1">
              <p className={`text-xl sm:text-2xl font-bold ${i % 2 === 0 ? 'text-blue-400' : 'text-green-400'}`}>{s.value}</p>
              <p className="text-xs text-slate-400 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY NURSEFLEX ────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-xl mb-10 sm:mb-12">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-2">Why NurseFlex</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
              Everything you need to find <span className="text-blue-600">your next role.</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: BadgeCheck, color: 'text-blue-600', bg: 'bg-blue-50', title: 'Verified Profiles', desc: 'Every nurse on NurseFlex goes through our verification process so employers trust you from day one.' },
              { icon: MapPin, color: 'text-green-600', bg: 'bg-green-50', title: 'Jobs Near You', desc: 'Search by location, specialty, or salary. We have open roles in all 50 US states updated daily.' },
              { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', title: 'Fast Hiring', desc: 'Most nurses hear back from employers within 48 hours of applying. No waiting months for a reply.' },
              { icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', title: 'Career Growth', desc: 'Access free career resources, salary guides, and tips to help you move forward in your career.' },
              { icon: Heart, color: 'text-blue-600', bg: 'bg-blue-50', title: 'Free for Nurses', desc: 'NurseFlex is completely free for nurses. No hidden fees, no subscriptions, no surprises.' },
              { icon: Users, color: 'text-green-600', bg: 'bg-green-50', title: 'Strong Community', desc: 'Join thousands of nurses sharing tips, job leads, and support in our growing online network.' },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <div className={`w-11 h-11 ${card.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <card.icon size={20} className={card.color} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1.5">{card.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-2">Simple Process</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Get hired in 4 steps</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-blue-200 via-green-200 to-blue-200" />
            {[
              { step: '01', title: 'Create profile', desc: 'Sign up and add your skills, certifications, and experience.', color: 'bg-blue-600' },
              { step: '02', title: 'Browse jobs', desc: 'Search thousands of nursing roles by location and specialty.', color: 'bg-green-600' },
              { step: '03', title: 'Apply in one click', desc: 'Send your verified profile directly to employers instantly.', color: 'bg-blue-600' },
              { step: '04', title: 'Get hired', desc: 'Hear back fast and start your new role with confidence.', color: 'bg-green-600' },
            ].map((s, i) => (
              <div key={i} className="relative text-center">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${s.color} text-white rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold mx-auto mb-3 sm:mb-4 shadow-md relative z-10`}>
                  {s.step}
                </div>
                <h3 className="font-semibold text-slate-900 mb-1 sm:mb-1.5 text-xs sm:text-sm">{s.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed hidden sm:block">{s.desc}</p>
              </div>
            ))}
          </div>
          {/* Mobile step descriptions shown below grid */}
          <div className="grid grid-cols-2 gap-4 mt-4 sm:hidden">
            {[
              { step: '01', title: 'Create profile', desc: 'Sign up and add your skills, certifications, and experience.' },
              { step: '02', title: 'Browse jobs', desc: 'Search thousands of nursing roles by location and specialty.' },
              { step: '03', title: 'Apply in one click', desc: 'Send your verified profile directly to employers instantly.' },
              { step: '04', title: 'Get hired', desc: 'Hear back fast and start your new role with confidence.' },
            ].map((s, i) => (
              <p key={i} className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOP HIRING FACILITIES ─────────────────────────────────────────────── */}
      <section className="py-10 sm:py-12 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div>
              <p className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-1">Now Hiring</p>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Top facilities looking for nurses</h2>
              <p className="text-sm text-slate-400 mt-1">These organizations have open roles right now.</p>
            </div>
            <Link href="/jobs" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap">
              View all jobs →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[
              { name: 'Cedars-Sinai Medical Center', location: 'Los Angeles, CA', roles: 34, type: 'Hospital', color: 'bg-blue-50', text: 'text-blue-600' },
              { name: 'NYU Langone Health', location: 'New York, NY', roles: 21, type: 'Medical Center', color: 'bg-green-50', text: 'text-green-600' },
              { name: 'Houston Methodist', location: 'Houston, TX', roles: 18, type: 'Hospital', color: 'bg-blue-50', text: 'text-blue-600' },
              { name: 'Mayo Clinic', location: 'Rochester, MN', roles: 27, type: 'Clinic', color: 'bg-green-50', text: 'text-green-600' },
              { name: 'Johns Hopkins Hospital', location: 'Baltimore, MD', roles: 15, type: 'Teaching Hospital', color: 'bg-blue-50', text: 'text-blue-600' },
              { name: 'Cleveland Clinic', location: 'Cleveland, OH', roles: 22, type: 'Hospital', color: 'bg-green-50', text: 'text-green-600' },
            ].map((f, i) => (
              <Link href="/jobs" key={i}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group flex items-center gap-3 sm:gap-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${f.color} rounded-xl flex items-center justify-center shrink-0 font-bold ${f.text} text-base sm:text-lg`}>
                  {f.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-xs sm:text-sm truncate group-hover:text-blue-600 transition-colors">{f.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <MapPin size={10} className="text-slate-400 shrink-0" />
                    <span className="text-xs text-slate-400 truncate">{f.location}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-sm font-bold ${f.text}`}>{f.roles}</p>
                  <p className="text-[10px] text-slate-400">open roles</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOG SECTION — Live from API ──────────────────────────────────────── */}
      <BlogSection />

      {/* ── CTA BANNER ───────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-10 sm:py-12">
        <div className="max-w-4xl mx-auto bg-slate-900 rounded-2xl p-7 sm:p-10 text-center relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-t-2xl" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-500/10 rounded-full blur-2xl -ml-12 -mb-12" />
          <div className="relative z-10 space-y-4">
            <p className="text-xs font-semibold text-green-400 uppercase tracking-widest">Join today — it's free</p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              Ready to find your next nursing job?
            </h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Join {nurseCount.toLocaleString()}+ nurses already using NurseFlex. Create your profile in under 5 minutes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <Link href="/auth/register"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl text-sm transition-all shadow-lg shadow-blue-900/30">
                Create free account <ArrowRight size={16} />
              </Link>
              <Link href="/jobs"
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-xl text-sm transition-all border border-white/10">
                Browse jobs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-50 border-t border-slate-200 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-8 sm:gap-10 mb-8">
            <div className="max-w-xs space-y-3">
              <Link href="/" className="text-xl font-bold text-blue-600">NurseFlex</Link>
              <p className="text-sm text-slate-500 leading-relaxed">
                Connecting nurses with the best healthcare jobs across the United States.
              </p>
              <p className="text-xs text-slate-400">Free for nurses · Always.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10">
              {[
                { title: 'Platform', links: [{ label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }, { label: 'Find Jobs', href: '/jobs' }, { label: 'Blogs', href: '/blogs' }] },
                { title: 'Legal', links: [{ label: 'Privacy Policy', href: '#' }, { label: 'Terms of Use', href: '#' }] },
                { title: 'Business', links: [{ label: 'Hire Nurses', href: '/business' }, { label: 'Post a Job', href: '/business/post-job' }, { label: 'Business Hub', href: '/business' }] },
              ].map(col => (
                <div key={col.title} className="space-y-3">
                  <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">{col.title}</p>
                  <ul className="space-y-2">
                    {col.links.map(l => (
                      <li key={l.label}>
                        <Link href={l.href} className="text-sm text-slate-500 hover:text-blue-600 transition-colors">{l.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-slate-400 text-center sm:text-left">© 2026 NurseFlex Community. All rights reserved.</p>
            <p className="text-xs text-slate-400 text-center sm:text-right">Made for nurses, by people who care.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}