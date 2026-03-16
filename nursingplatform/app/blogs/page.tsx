"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import { Loader2, ArrowRight, Calendar, Tag } from 'lucide-react';
import api from '@/lib/api';

export default function PublicBlogsPage() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                // Fetch from the backend API you have setup for blogs
                // Note: Assuming /blogs endpoint returns the list of blogs. 
                // Based on admin panel, it fetches from http://localhost:3001/blogs
                const res = await api.get('/blogs');
                // Filter out drafts if necessary, though public api should probably only return published
                const publishedBlogs = Array.isArray(res.data)
                    ? res.data.filter(b => b.status === "Published")
                    : [];
                setBlogs(publishedBlogs);
            } catch (err) {
                console.error("Failed to fetch blogs:", err);
                setError("Failed to load articles. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-pink-100">
            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
                        Resources
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                        Nursing Tips <span className="text-pink-600">&</span> Career Insights
                    </h1>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed">
                        Expert resources to help you find your next role or hire the best talent.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center font-bold border border-red-100 max-w-xl mx-auto">
                        ⚠️ {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-pink-500">
                        <Loader2 className="w-10 h-10 animate-spin mb-4" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Loading articles...</p>
                    </div>
                ) : blogs.length === 0 && !error ? (
                    <div className="bg-white p-12 rounded-3xl text-center border border-slate-100 shadow-sm max-w-2xl mx-auto">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <Tag size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Articles Yet</h3>
                        <p className="text-slate-500 font-medium">Check back soon for latest insights and updates.</p>
                    </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {blogs.map((blog, idx) => (
                        <Link 
                            href={`/blogs/${blog._id || blog.id}`} 
                            key={blog._id || blog.id} 
                            className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-6"
                            style={{ animationDelay: `${idx * 150}ms`, animationFillMode: 'both' }}
                        >
                            <div className="w-full h-64 overflow-hidden relative">
                                {blog.imageUrl ? (
                                    <img
                                        src={blog.imageUrl}
                                        alt={blog.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-pink-50 to-indigo-50 flex items-center justify-center">
                                        <span className="font-black italic text-pink-200 text-4xl tracking-tighter">NF</span>
                                    </div>
                                )}
                                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] text-pink-600 shadow-sm border border-white/50">
                                    {blog.category || 'Career Advice'}
                                </div>
                            </div>

                            <div className="p-10 flex-1 flex flex-col">
                                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6">
                                    <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                                        <Calendar size={12} />
                                    </div>
                                    {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 leading-tight mb-4 group-hover:text-pink-600 transition-colors line-clamp-2">
                                    {blog.title}
                                </h2>
                                <p className="text-base font-medium text-slate-500 line-clamp-3 mb-8 flex-1 leading-relaxed">
                                    {blog.content}
                                </p>

                                <div className="flex items-center gap-3 text-pink-600 font-black text-[11px] uppercase tracking-[0.2em] mt-auto group-hover:gap-5 transition-all">
                                    Explore Insight <ArrowRight size={16} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                )}
            </main>

            {/* Basic Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 text-center text-sm">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <span className="font-black italic text-white text-xl tracking-tighter">NurseFlex</span>
                    <p className="font-bold uppercase tracking-widest text-[10px]">© {new Date().getFullYear()} NurseFlex Community. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
