"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import { Loader2, ArrowLeft, Calendar, User, Tag, Eye } from 'lucide-react';
import api from '@/lib/api';

export default function BlogDetailPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id || id === 'undefined') {
        setLoading(false);
        return;
      }
      try {
        // Assume API has GET /blogs/:id that returns a single blog
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-[#ec4899] mt-20">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading Insight...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-6 mt-20">
          <div className="bg-white p-12 rounded-[3rem] text-center border border-slate-100 shadow-xl max-w-lg w-full">
            <h1 className="text-6xl font-black text-slate-200 mb-6 italic">404</h1>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">{error || "Article Not Found"}</h2>
            <Link href="/blogs" className="inline-flex items-center gap-2 text-sm font-bold text-[#ec4899] uppercase tracking-widest hover:gap-4 transition-all">
              <ArrowLeft size={16} /> Back to Insights
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-pink-100">
      <Navbar />

      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen">
        <Link href="/blogs" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#ec4899] transition-colors mb-12 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Career Advice
        </Link>

        {blog.category && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-pink-50 text-[#ec4899] rounded-lg text-[10px] font-black uppercase tracking-widest mb-6 border border-pink-100 shadow-sm">
            <Tag size={12} /> {blog.category}
          </div>
        )}

        <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight italic uppercase mb-8">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-12 border-y border-slate-100 py-6">
          <div className="flex items-center gap-2">
            <User size={14} className="text-[#ec4899]" /> By {blog.author || 'Admin'}
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-[#ec4899]" /> {new Date(blog.createdAt || new Date()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          {blog.views !== undefined && (
            <div className="flex items-center gap-2">
              <Eye size={14} className="text-[#ec4899]" /> {blog.views} Views
            </div>
          )}
        </div>

        {blog.imageUrl && (
          <div className="rounded-[3rem] overflow-hidden mb-16 shadow-2xl border border-slate-100">
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-full h-auto max-h-[600px] object-cover"
            />
          </div>
        )}

        {/* Article Content */}
        {Array.isArray(blog.sections) && blog.sections.length > 0 ? (
          <div className="space-y-12">
            {blog.sections.map((section: any, idx: number) => (
              <div key={idx} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                {section.type === 'text' ? (
                  <article className="prose prose-lg prose-slate max-w-none 
                    prose-headings:font-black prose-headings:italic prose-headings:uppercase prose-headings:tracking-tight
                    prose-p:font-medium prose-p:leading-relaxed prose-p:text-slate-600
                    prose-strong:font-black prose-strong:text-slate-900
                    prose-a:text-[#ec4899] prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                    prose-img:rounded-3xl prose-img:shadow-xl
                    prose-blockquote:border-l-4 prose-blockquote:border-[#ec4899] prose-blockquote:bg-pink-50 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic prose-blockquote:text-slate-700
                    whitespace-pre-wrap text-lg
                  ">
                    {section.content}
                  </article>
                ) : (
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 group">
                    <img 
                      src={section.content} 
                      className="w-full h-auto object-cover max-h-[700px] hover:scale-[1.01] transition-transform duration-500" 
                      alt={`insight-visual-${idx}`} 
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <article className="prose prose-lg prose-slate max-w-none 
            prose-headings:font-black prose-headings:italic prose-headings:uppercase prose-headings:tracking-tight
            prose-p:font-medium prose-p:leading-relaxed prose-p:text-slate-600
            prose-strong:font-black prose-strong:text-slate-900
            prose-a:text-[#ec4899] prose-a:font-bold prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-3xl prose-img:shadow-xl
            prose-blockquote:border-l-4 prose-blockquote:border-[#ec4899] prose-blockquote:bg-pink-50 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic prose-blockquote:text-slate-700
            whitespace-pre-wrap text-lg
          ">
            {blog.content}
          </article>
        )}

        {/* Author Bio / Footer */}
        <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-tr from-[#ec4899] to-pink-400 rounded-full flex items-center justify-center text-white font-black italic shadow-lg">
              NF
            </div>
            <div>
              <h4 className="font-black text-slate-900 italic uppercase">NurseFlex Editorial Team</h4>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Empowering Healthcare Professionals</p>
            </div>
          </div>

          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="px-6 py-3 bg-slate-100 text-slate-900 hover:bg-slate-200 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-colors flex items-center gap-2">
            Back to Top
          </button>
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 text-center text-sm border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-black italic text-white text-xl tracking-tighter">NurseFlex</span>
          <p className="font-bold uppercase tracking-widest text-[10px]">© {new Date().getFullYear()} NurseFlex Community. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}