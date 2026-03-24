"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import { Loader2, ArrowLeft, Calendar, User, Tag, Eye, Clock, BookOpen } from 'lucide-react';
import api from '@/lib/api';

// ─── Strip base64 blobs accidentally embedded in text ────────────────────────
function cleanText(raw: string): string {
    if (!raw) return '';
    return raw
        .replace(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g, '')
        .replace(/\[object Object\]/g, '')
        .trim();
}

export default function BlogDetailPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [readProgress, setReadProgress] = useState(0);

  // ── Reading progress bar ──────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setReadProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id || id === 'undefined') { setLoading(false); return; }
      try {
        const res = await api.get(`/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
        setError("Article not found or unavailable.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center gap-4 mt-20">
        <div style={{
          width: 52, height: 52, borderRadius: 16,
          background: 'linear-gradient(135deg, #14b8a6, #10b981)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(20,184,166,0.35)',
          animation: 'pulse 1.5s ease infinite'
        }}>
          <BookOpen size={24} style={{ color: 'white' }} />
        </div>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
          Loading Article…
        </p>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:0.7;transform:scale(0.97)}50%{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error || !blog) return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-6 mt-20">
        <div style={{ background: 'white', padding: '48px', borderRadius: 28, textAlign: 'center', border: '1px solid rgba(20,184,166,0.1)', boxShadow: '0 8px 40px rgba(0,0,0,0.06)', maxWidth: 480, width: '100%' }}>
          <p style={{ fontSize: 72, fontWeight: 800, color: '#f1f5f9', marginBottom: 16, lineHeight: 1 }}>404</p>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 20 }}>{error || "Article Not Found"}</h2>
          <Link href="/blogs" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: '#14b8a6', textDecoration: 'none', padding: '10px 24px', borderRadius: 12, background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.2)' }}>
            <ArrowLeft size={15} /> Back to Articles
          </Link>
        </div>
      </div>
    </div>
  );

  // ── Read time estimate ────────────────────────────────────────────────────
  const wordCount = [
    blog.content || '',
    ...(Array.isArray(blog.sections) ? blog.sections.filter((s: any) => s.type === 'text').map((s: any) => s.content || '') : [])
  ].join(' ').split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'white', fontFamily: "'DM Sans', system-ui, sans-serif", color: '#0f172a' }}>
      <Navbar />

      {/* ── Reading progress bar ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, zIndex: 999,
        height: 3, width: `${readProgress}%`,
        background: 'linear-gradient(90deg, #2563eb, #14b8a6, #10b981)',
        transition: 'width 0.1s linear',
        boxShadow: '0 0 8px rgba(20,184,166,0.5)',
      }} />

      <main style={{ paddingTop: 48, paddingBottom: 80 }}>

        {/* ── Full-width header area ── */}
        <div style={{ maxWidth: '88%', margin: '0 auto', paddingLeft: '6%', paddingRight: '6%' }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, paddingTop: 24 }}>
            <Link href="/blogs" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 11, fontWeight: 700, color: '#64748b',
              textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#14b8a6')}
              onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
            >
              <ArrowLeft size={14} /> Back to Articles
            </Link>
            {blog.category && (
              <>
                <span style={{ color: '#cbd5e1', fontSize: 12 }}>·</span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontSize: 10, fontWeight: 700, color: '#10b981',
                  background: 'rgba(16,185,129,0.08)', padding: '4px 12px',
                  borderRadius: 20, border: '1px solid rgba(16,185,129,0.2)',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                }}>
                  <Tag size={10} /> {blog.category}
                </span>
              </>
            )}
          </div>

          {/* Title — large but readable, NOT all-caps */}
          <h1 style={{
            fontSize: 'clamp(32px, 4.5vw, 56px)',
            fontWeight: 800,
            color: '#0f172a',
            lineHeight: 1.18,
            letterSpacing: '-0.025em',
            marginBottom: 24,
            maxWidth: '88%',
          }}>
            {blog.title}
          </h1>

          {/* Meta row */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20,
            paddingTop: 20, paddingBottom: 20,
            borderTop: '1px solid rgba(20,184,166,0.1)',
            borderBottom: '1px solid rgba(20,184,166,0.1)',
            marginBottom: 40,
          }}>
            {/* Author */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 12,
                background: 'linear-gradient(135deg, #2563eb, #14b8a6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 800, fontSize: 13,
              }}>
                {(blog.author || 'A')[0].toUpperCase()}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>{blog.author || 'Admin'}</p>
                <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500, marginTop: 2 }}>NurseFlex Editorial</p>
              </div>
            </div>

            <div style={{ width: 1, height: 28, background: 'rgba(20,184,166,0.15)' }} />

            {/* Date */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b', fontWeight: 600 }}>
              <Calendar size={13} style={{ color: '#14b8a6' }} />
              {new Date(blog.createdAt || new Date()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>

            {/* Read time */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b', fontWeight: 600 }}>
              <Clock size={13} style={{ color: '#14b8a6' }} />
              {readTime} min read
            </div>

            {blog.views !== undefined && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b', fontWeight: 600 }}>
                <Eye size={13} style={{ color: '#14b8a6' }} />
                {blog.views.toLocaleString()} views
              </div>
            )}
          </div>

          {/* Cover image — full width of container */}
          {blog.imageUrl && (
            <div style={{ borderRadius: 24, overflow: 'hidden', marginBottom: 48, boxShadow: '0 8px 40px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.05)' }}>
              <img
                src={blog.imageUrl}
                alt={blog.title}
                style={{ width: '100%', height: 460, objectFit: 'cover', objectPosition: 'center', display: 'block' }}
              />
            </div>
          )}

          {/* ── Article body ── */}
          <div style={{ width: '100%' }}>
            {Array.isArray(blog.sections) && blog.sections.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
                {blog.sections.map((section: any, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      animation: `fadeUp 0.5s ease ${idx * 0.08}s both`,
                    }}
                  >
                    {section.type === 'text' ? (
                      <p style={{
                        fontSize: 18,
                        lineHeight: 1.85,
                        color: '#374151',
                        fontWeight: 400,
                        whiteSpace: 'pre-wrap',
                        letterSpacing: '0.01em',
                      }}>
                        {cleanText(section.content)}
                      </p>
                    ) : section.content ? (
                      <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <img
                          src={section.content}
                          style={{ width: '100%', height: 480, objectFit: 'cover', objectPosition: 'center', display: 'block', transition: 'transform 0.6s ease' }}
                          alt={`section-image-${idx}`}
                          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
                          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                        />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{
                fontSize: 18,
                lineHeight: 1.85,
                color: '#374151',
                fontWeight: 400,
                whiteSpace: 'pre-wrap',
                letterSpacing: '0.01em',
              }}>
                {cleanText(blog.content)}
              </p>
            )}
          </div>

          {/* ── Author footer ── */}
          <div style={{
            marginTop: 64, paddingTop: 36,
            borderTop: '1px solid rgba(20,184,166,0.12)',
            display: 'flex', flexDirection: 'column',
            gap: 24,
          }}>
            {/* Author card */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '24px 28px', borderRadius: 20,
              background: 'linear-gradient(135deg, rgba(20,184,166,0.04), rgba(16,185,129,0.03))',
              border: '1px solid rgba(20,184,166,0.12)',
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 18, flexShrink: 0,
                background: 'linear-gradient(135deg, #2563eb, #14b8a6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 800, fontSize: 18,
                boxShadow: '0 4px 16px rgba(20,184,166,0.3)',
              }}>NF</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>NurseFlex Editorial Team</p>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
                  Dedicated to empowering nursing professionals with career insights, tips, and industry updates across the United States.
                </p>
              </div>
            </div>

            {/* Bottom actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <Link href="/blogs" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '11px 24px', borderRadius: 12,
                background: 'rgba(20,184,166,0.07)', border: '1px solid rgba(20,184,166,0.2)',
                color: '#0d9488', fontSize: 13, fontWeight: 700, textDecoration: 'none',
                transition: 'all 0.2s',
              }}>
                <ArrowLeft size={14} /> More Articles
              </Link>

              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                style={{
                  padding: '11px 24px', borderRadius: 12,
                  background: 'linear-gradient(135deg, #14b8a6, #10b981)',
                  border: 'none', color: 'white',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(20,184,166,0.3)',
                  transition: 'opacity 0.2s',
                }}
              >
                ↑ Back to Top
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer style={{ background: '#0f172a', padding: '40px 24px', marginTop: 40 }}>
        <div style={{ maxWidth: '88%', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>NurseFlex</span>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            © {new Date().getFullYear()} NurseFlex Community · All rights reserved.
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
        ::selection { background: rgba(20,184,166,0.15); }
      `}</style>
    </div>
  );
}