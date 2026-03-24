"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, Search, Clock, Tag, Eye, BookOpen, ArrowRight, Image as ImageIcon } from 'lucide-react';
import api from '@/lib/api';

// ─── Clean text ───────────────────────────────────────────────────────────────
function cleanText(raw: string): string {
    if (!raw) return '';
    return raw.replace(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g, '').replace(/\[object Object\]/g, '').trim();
}

// ─── Blog Card ────────────────────────────────────────────────────────────────
function BlogCard({ blog, index }: { blog: any; index: number }) {
    const [hovered, setHovered] = useState(false);
    return (
        <Link
            href={`/blogs/${blog._id || blog.id}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: 'flex', flexDirection: 'column',
                background: 'white', borderRadius: 20, overflow: 'hidden',
                border: `1px solid ${hovered ? 'rgba(20,184,166,0.3)' : 'rgba(0,0,0,0.06)'}`,
                boxShadow: hovered ? '0 16px 48px rgba(20,184,166,0.14)' : '0 2px 12px rgba(0,0,0,0.04)',
                transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                textDecoration: 'none', height: '100%',
                animation: `fadeUp 0.5s ease ${index * 0.1}s both`,
            }}
        >
            {/* Cover image */}
            <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: 'linear-gradient(135deg, rgba(20,184,166,0.06), rgba(37,99,235,0.06))' }}>
                {blog.imageUrl ? (
                    <img src={blog.imageUrl} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', transform: hovered ? 'scale(1.06)' : 'scale(1)' }} />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BookOpen size={36} style={{ color: '#14b8a6', opacity: 0.3 }} />
                    </div>
                )}
                {/* Category pill */}
                {blog.category && (
                    <span style={{ position: 'absolute', top: 14, left: 14, fontSize: 10, fontWeight: 700, color: '#0f172a', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', padding: '4px 12px', borderRadius: 20, textTransform: 'uppercase' as const, letterSpacing: '0.07em' }}>
                        {blog.category}
                    </span>
                )}
            </div>

            {/* Content */}
            <div style={{ padding: '20px 22px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                    <Clock size={11} style={{ color: '#94a3b8' }} />
                    <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>
                        {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                    </span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: hovered ? '#0d9488' : '#0f172a', lineHeight: 1.4, marginBottom: 10, transition: 'color 0.2s', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden' }}>
                    {blog.title}
                </h3>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden', marginBottom: 16 }}>
                    {cleanText(blog.content)}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: hovered ? '#14b8a6' : '#2563eb', transition: 'color 0.2s' }}>
                    Read article
                    <ArrowRight size={13} style={{ transform: hovered ? 'translateX(4px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
                </div>
            </div>
        </Link>
    );
}

// ─── Main Public Blogs Page ───────────────────────────────────────────────────
export default function PublicBlogsPage() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        api.get('/blogs')
            .then(res => setBlogs(Array.isArray(res.data) ? res.data.filter((b: any) => b.status === 'Published' || !b.status) : []))
            .catch(() => setBlogs([]))
            .finally(() => setLoading(false));
    }, []);

    const categories = ['All', ...Array.from(new Set(blogs.map((b: any) => b.category).filter(Boolean)))];

    const filtered = blogs.filter(b => {
        const matchSearch = b.title?.toLowerCase().includes(search.toLowerCase()) || cleanText(b.content)?.toLowerCase().includes(search.toLowerCase());
        const matchCat = activeCategory === 'All' || b.category === activeCategory;
        return matchSearch && matchCat;
    });

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

            {/* Ambient blobs */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                <div style={{ position: 'absolute', top: '5%', right: '10%', width: '30%', height: '30%', background: 'radial-gradient(ellipse, rgba(20,184,166,0.07) 0%, transparent 70%)', filter: 'blur(40px)' }} />
                <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: '25%', height: '25%', background: 'radial-gradient(ellipse, rgba(37,99,235,0.05) 0%, transparent 70%)', filter: 'blur(40px)' }} />
            </div>

            <main style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px', position: 'relative', zIndex: 1 }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '6px 16px', borderRadius: 20, background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.2)' }}>
                        <BookOpen size={13} style={{ color: '#14b8a6' }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#0d9488', textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>NurseFlex Blog</span>
                    </div>
                    <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: 12, lineHeight: 1.2 }}>
                        Insights for{' '}
                        <span style={{ background: 'linear-gradient(135deg, #2563eb, #14b8a6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Nursing Professionals
                        </span>
                    </h1>
                    <p style={{ fontSize: 16, color: '#64748b', maxWidth: 480, margin: '0 auto' }}>
                        Tips, career advice, and stories from nurses across the US.
                    </p>
                </div>

                {/* Search + filters */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', marginBottom: 40 }}>
                    {/* Search */}
                    <div style={{ position: 'relative', width: '100%', maxWidth: 480 }}>
                        <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search articles…"
                            style={{ width: '100%', height: 46, borderRadius: 14, paddingLeft: 42, paddingRight: 16, background: 'white', border: '1px solid rgba(20,184,166,0.15)', fontSize: 14, color: '#0f172a', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' as const }}
                        />
                    </div>

                    {/* Category tabs */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const, justifyContent: 'center' }}>
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                                padding: '7px 18px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                                background: activeCategory === cat ? 'linear-gradient(135deg, #14b8a6, #10b981)' : 'white',
                                color: activeCategory === cat ? 'white' : '#64748b',
                                boxShadow: activeCategory === cat ? '0 4px 12px rgba(20,184,166,0.3)' : '0 1px 4px rgba(0,0,0,0.06)',
                                transition: 'all 0.2s', fontFamily: 'inherit',
                            }}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{ borderRadius: 20, overflow: 'hidden', background: 'white', border: '1px solid rgba(0,0,0,0.06)' }}>
                                <div style={{ height: 200, background: 'linear-gradient(90deg, #f1f5f9, #e2e8f0, #f1f5f9)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
                                <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <div style={{ height: 11, width: '40%', borderRadius: 6, background: '#f1f5f9' }} />
                                    <div style={{ height: 16, width: '90%', borderRadius: 6, background: '#f1f5f9' }} />
                                    <div style={{ height: 13, width: '70%', borderRadius: 6, background: '#f1f5f9' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '64px 24px' }}>
                        <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(20,184,166,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                            <ImageIcon size={28} style={{ color: '#14b8a6', opacity: 0.5 }} />
                        </div>
                        <p style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>No articles found</p>
                        <p style={{ fontSize: 13, color: '#94a3b8' }}>Try a different search or category.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24, alignItems: 'stretch' }}>
                        {filtered.map((blog, i) => (
                            <BlogCard key={blog._id || blog.id || i} blog={blog} index={i} />
                        ))}
                    </div>
                )}
            </main>

            <style>{`
                @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes shimmer { 0%,100% { background-position: 200% 0; } 50% { background-position: -200% 0; } }
                * { box-sizing: border-box; }
                input::placeholder { color: #94a3b8; }
            `}</style>
        </div>
    );
}