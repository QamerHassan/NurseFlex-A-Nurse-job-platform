"use client";
import React, { useState, useEffect } from 'react';
import {
    Loader2, Search, Plus, Edit,
    Trash2, Clock, FileText, Send,
    X, Image as ImageIcon, ArrowUp, ArrowDown,
    Eye, BookOpen, Lock
} from 'lucide-react';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';

import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription,
} from "@/app/components/ui/dialog";

// ─── Strip base64 / garbage from text ────────────────────────────────────────
function cleanText(raw: string): string {
    if (!raw) return '';
    return raw
        .replace(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g, '')
        .replace(/\[object Object\]/g, '')
        .trim();
}

// ─── Article section renderer ─────────────────────────────────────────────────
function ArticleSection({ section, idx }: { section: any; idx: number }) {
    if (section.type === 'text') {
        const clean = cleanText(section.content);
        if (!clean) return null;
        return (
            <div style={{ animation: `fadeUp 0.45s ease ${idx * 0.07}s both` }}>
                <p style={{ fontSize: 17, color: '#374151', lineHeight: 1.9, whiteSpace: 'pre-wrap', letterSpacing: '0.01em', margin: 0 }}>
                    {clean}
                </p>
            </div>
        );
    }
    if (section.type === 'image' && section.content) {
        return (
            <div style={{ animation: `fadeUp 0.45s ease ${idx * 0.07}s both`, borderRadius: 20, overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.06)' }}>
                <img src={section.content} alt={`article-image-${idx + 1}`}
                    style={{ width: '100%', display: 'block', height: 480, objectFit: 'cover', objectPosition: 'center', transition: 'transform 0.6s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
            </div>
        );
    }
    return null;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function BlogsPage() {
    const { data: session } = useSession();
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState<any | null>(null);
    const [readProgress, setReadProgress] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [formData, setFormData] = useState<any>({
        title: '', content: '', status: 'Published', category: 'Nursing Tips', imageUrl: '', sections: [],
    });

    // ── Admin check — session OR localStorage OR admin_token ─────────────────
    const isAdmin = (() => {
        const role = (session?.user as any)?.role;
        if (role === 'ADMIN' || role === 'admin') return true;
        try {
            const u = JSON.parse(localStorage.getItem('user') || 'null');
            if (u?.role === 'ADMIN' || u?.role === 'admin') return true;
        } catch { /* ignore */ }
        if (typeof window !== 'undefined' && sessionStorage.getItem('admin_token')) return true;
        return false;
    })();

    // ── Reading progress bar ──────────────────────────────────────────────────
    useEffect(() => {
        if (!selectedBlog) return;
        const el = document.getElementById('preview-scroll');
        if (!el) return;
        const fn = () => {
            const { scrollTop, scrollHeight, clientHeight } = el;
            const total = scrollHeight - clientHeight;
            setReadProgress(total > 0 ? (scrollTop / total) * 100 : 0);
        };
        el.addEventListener('scroll', fn, { passive: true });
        return () => el.removeEventListener('scroll', fn);
    }, [selectedBlog]);

    // ── Fetch ─────────────────────────────────────────────────────────────────
    const fetchBlogs = async () => {
        try {
            const res = await api.get('/blogs');
            setBlogs(Array.isArray(res.data) ? res.data : []);
        } catch (err) { console.error('Fetch error:', err); }
        finally { setLoading(false); }
    };
    useEffect(() => { fetchBlogs(); }, []);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setFormData((p: any) => ({ ...p, imageUrl: reader.result as string }));
        reader.readAsDataURL(file);
    };

    const startEdit = (blog: any) => {
        if (!isAdmin) return;
        setIsEditing(true); setEditId(blog._id || blog.id);
        setFormData({ title: blog.title, content: blog.content, status: blog.status || 'Published', category: blog.category || 'Nursing Tips', imageUrl: blog.imageUrl, sections: Array.isArray(blog.sections) ? blog.sections : [] });
        setSelectedBlog(null); setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!isAdmin) return;
        if (!confirm('Delete this article?')) return;
        try {
            const token = sessionStorage.getItem('admin_token');
            await api.delete(`/blogs/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchBlogs();
        } catch (err) { console.error('Delete error:', err); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); if (!isAdmin) return;
        setSubmitting(true);
        try {
            const token = sessionStorage.getItem('admin_token');
            const url = isEditing ? `/blogs/${editId}` : '/blogs';
            const method = isEditing ? 'put' : 'post';
            const res = await (api as any)[method](url, formData, { headers: { Authorization: `Bearer ${token}` } });
            if (res.status === 200 || res.status === 201) { closeModal(); fetchBlogs(); }
        } catch (err) { console.error('Submit error:', err); }
        finally { setSubmitting(false); }
    };

    const closeModal = () => {
        setIsModalOpen(false); setIsEditing(false); setEditId(null);
        setFormData({ title: '', content: '', status: 'Published', category: 'Nursing Tips', imageUrl: '', sections: [] });
    };

    const addSection = (type: 'text' | 'image') =>
        setFormData((p: any) => ({ ...p, sections: [...p.sections, { type, content: '' }] }));
    const updateSection = (i: number, content: string) =>
        setFormData((p: any) => { const s = [...p.sections]; s[i] = { ...s[i], content }; return { ...p, sections: s }; });
    const removeSection = (i: number) =>
        setFormData((p: any) => ({ ...p, sections: p.sections.filter((_: any, idx: number) => idx !== i) }));
    const moveSection = (i: number, dir: 'up' | 'down') => {
        const target = dir === 'up' ? i - 1 : i + 1;
        setFormData((p: any) => {
            const s = [...p.sections]; if (target < 0 || target >= s.length) return p;
            [s[i], s[target]] = [s[target], s[i]]; return { ...p, sections: s };
        });
    };
    const handleSectionImage = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => updateSection(i, reader.result as string);
        reader.readAsDataURL(file);
    };

    const filtered = blogs.filter(b =>
        b.title?.toLowerCase().includes(search.toLowerCase()) ||
        b.category?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-blue-600" size={36} />
            <p className="text-sm text-slate-400">Loading articles...</p>
        </div>
    );

    return (
        <>
            <div className="space-y-8 font-sans">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Blog Articles</h1>
                        <p className="text-sm text-slate-400 mt-0.5">
                            {isAdmin ? 'Write and manage nursing tips and career guides.' : 'Read the latest nursing tips and career guides.'}
                        </p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2 bg-white px-4 h-11 rounded-xl border border-slate-200 shadow-sm flex-1 md:w-72 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
                            <Search size={16} className="text-slate-400 shrink-0" />
                            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles..."
                                className="h-full border-none focus-visible:ring-0 text-sm bg-transparent p-0 placeholder:text-slate-400" />
                        </div>
                        {isAdmin && (
                            <button onClick={() => setIsModalOpen(true)}
                                className="h-11 px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl flex items-center gap-2 transition-all shrink-0">
                                <Plus size={16} /> New Article
                            </button>
                        )}
                    </div>
                </div>

                {/* Grid */}
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filtered.map(blog => (
                            <Card key={blog._id || blog.id} className="group border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                                <div className="flex h-full">
                                    {blog.imageUrl && (
                                        <div className="w-40 shrink-0 overflow-hidden">
                                            <img src={blog.imageUrl} alt="cover" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        </div>
                                    )}
                                    <CardContent className="p-6 flex flex-col justify-between flex-1">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Badge className="bg-blue-50 text-blue-600 border-none text-[10px] font-semibold uppercase tracking-wide px-2.5 py-0.5 rounded-lg">{blog.category}</Badge>
                                                <span className={`w-2 h-2 rounded-full ${blog.status === 'Published' ? 'bg-green-500' : 'bg-slate-300'}`} />
                                            </div>
                                            <div className="cursor-pointer" onClick={() => { setSelectedBlog(blog); setReadProgress(0); }}>
                                                <h3 className="font-semibold text-slate-900 hover:text-blue-600 transition-colors leading-snug line-clamp-2">{blog.title}</h3>
                                                <p className="text-sm text-slate-400 mt-1 line-clamp-2 leading-relaxed">{cleanText(blog.content)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                                            <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                                                <Clock size={12} />
                                                {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                <button onClick={() => { setSelectedBlog(blog); setReadProgress(0); }} title="Read"
                                                    className="h-9 w-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-green-600 hover:bg-green-50 transition-all">
                                                    <Eye size={15} />
                                                </button>
                                                {isAdmin && (
                                                    <>
                                                        <button onClick={() => startEdit(blog)} title="Edit"
                                                            className="h-9 w-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                                                            <Edit size={15} />
                                                        </button>
                                                        <button onClick={() => handleDelete(blog._id || blog.id)} title="Delete"
                                                            className="h-9 w-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all">
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-xl mx-auto flex items-center justify-center">
                            <ImageIcon size={28} className="text-slate-300" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-700">No articles yet</p>
                            <p className="text-sm text-slate-400 mt-1">
                                {isAdmin ? 'Create your first article to get started.' : 'Articles will appear here once published.'}
                            </p>
                        </div>
                        {isAdmin && (
                            <button onClick={() => setIsModalOpen(true)} className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all">
                                Write First Article
                            </button>
                        )}
                    </div>
                )}

                <p className="text-center text-[10px] text-slate-300 uppercase tracking-widest pt-4">NurseFlex Content Manager</p>
            </div>

            {/* ══════ CREATE / EDIT MODAL — admin only ══════ */}
            <Dialog open={isModalOpen && isAdmin} onOpenChange={open => !open && closeModal()}>
                <DialogContent className="sm:max-w-2xl bg-white rounded-2xl border-none shadow-2xl p-0 overflow-hidden">
                    <div className="bg-slate-900 px-8 py-6">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-white">{isEditing ? 'Edit Article' : 'New Article'}</DialogTitle>
                            <DialogDescription className="text-xs text-slate-400 mt-0.5">Fill in the details below and publish when ready.</DialogDescription>
                        </DialogHeader>
                    </div>
                    <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[72vh] overflow-y-auto">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Title</label>
                            <Input required value={formData.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((p: any) => ({ ...p, title: e.target.value }))}
                                placeholder="Enter article title..." className="h-12 bg-slate-50 border-slate-200 rounded-xl font-semibold text-slate-900 focus-visible:ring-blue-500/20" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Category</label>
                                <select value={formData.category} onChange={e => setFormData((p: any) => ({ ...p, category: e.target.value }))}
                                    className="w-full h-12 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:border-blue-500 transition-all">
                                    <option>Nursing Tips</option><option>Industry News</option><option>Success Stories</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Status</label>
                                <select value={formData.status} onChange={e => setFormData((p: any) => ({ ...p, status: e.target.value }))}
                                    className="w-full h-12 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:border-blue-500 transition-all">
                                    <option>Published</option><option>Draft</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Cover Image</label>
                                <label className="flex items-center justify-center h-12 bg-slate-50 border border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all overflow-hidden">
                                    {formData.imageUrl ? <img src={formData.imageUrl} className="w-full h-full object-cover" alt="cover" />
                                        : <span className="text-xs text-slate-400 flex items-center gap-1.5"><ImageIcon size={14} /> Upload cover</span>}
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Short Summary</label>
                            <Textarea required rows={2} value={formData.content} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData((p: any) => ({ ...p, content: e.target.value }))}
                                placeholder="A short intro shown on the article card..." className="bg-slate-50 border-slate-200 rounded-xl text-sm focus-visible:ring-blue-500/20 resize-none" />
                        </div>

                        {/* Sections */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Article Body — Sections</label>
                                    <p className="text-[10px] text-slate-300 mt-0.5">Add text and images in any order you want.</p>
                                </div>
                                <div className="flex gap-2">
                                    <button type="button" onClick={() => addSection('text')} className="h-8 px-3 text-[11px] font-semibold rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all flex items-center gap-1.5">
                                        <FileText size={11} /> + Text
                                    </button>
                                    <button type="button" onClick={() => addSection('image')} className="h-8 px-3 text-[11px] font-semibold rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all flex items-center gap-1.5">
                                        <ImageIcon size={11} /> + Image
                                    </button>
                                </div>
                            </div>

                            {formData.sections.length > 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' as const, padding: '10px 14px', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                                    <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginRight: 4 }}>Layout:</span>
                                    {formData.sections.map((s: any, i: number) => (
                                        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: s.type === 'text' ? 'rgba(37,99,235,0.08)' : 'rgba(16,185,129,0.08)', color: s.type === 'text' ? '#2563eb' : '#10b981', border: `1px solid ${s.type === 'text' ? 'rgba(37,99,235,0.15)' : 'rgba(16,185,129,0.15)'}` }}>
                                            {i + 1}. {s.type === 'text' ? 'Text' : 'Image'}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {formData.sections.length === 0 ? (
                                <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                                    <BookOpen size={24} className="mx-auto text-slate-200 mb-3" />
                                    <p className="text-sm font-semibold text-slate-400">No body sections yet</p>
                                    <p className="text-xs text-slate-300 mt-1">Add text blocks and images — they appear in the order you add them.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {formData.sections.map((section: any, i: number) => (
                                        <div key={i} style={{ background: 'white', borderRadius: 14, border: `1px solid ${section.type === 'text' ? 'rgba(37,99,235,0.1)' : 'rgba(16,185,129,0.12)'}`, padding: 16 }}>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span style={{ width: 24, height: 24, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: section.type === 'text' ? 'rgba(37,99,235,0.1)' : 'rgba(16,185,129,0.1)', fontSize: 11, fontWeight: 800, color: section.type === 'text' ? '#2563eb' : '#10b981' }}>{i + 1}</span>
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${section.type === 'text' ? 'text-blue-500' : 'text-green-600'}`}>
                                                        {section.type === 'text' ? <FileText size={11} /> : <ImageIcon size={11} />}
                                                        {section.type === 'text' ? 'Text Block' : 'Image Block'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button type="button" onClick={() => moveSection(i, 'up')} disabled={i === 0} className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-20 transition-all"><ArrowUp size={12} /></button>
                                                    <button type="button" onClick={() => moveSection(i, 'down')} disabled={i === formData.sections.length - 1} className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-20 transition-all"><ArrowDown size={12} /></button>
                                                    <button type="button" onClick={() => removeSection(i)} className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"><X size={12} /></button>
                                                </div>
                                            </div>
                                            {section.type === 'text' ? (
                                                <Textarea value={section.content} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateSection(i, e.target.value)}
                                                    placeholder="Write your paragraph here..." className="bg-slate-50 border-slate-200 rounded-lg text-sm focus-visible:ring-blue-500/20 resize-none min-h-[100px]" />
                                            ) : (
                                                <label className="flex flex-col items-center justify-center h-36 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50/20 transition-all overflow-hidden">
                                                    {section.content ? <img src={section.content} className="w-full h-full object-cover" alt="section" /> : (
                                                        <div className="text-center"><ImageIcon size={24} className="text-slate-300 mx-auto mb-2" /><span className="text-xs font-semibold text-slate-400">Click to upload image</span></div>
                                                    )}
                                                    <input type="file" className="hidden" accept="image/*" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSectionImage(i, e)} />
                                                </label>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 pt-2 sticky bottom-0 bg-white pb-1">
                            <button type="button" onClick={closeModal} className="flex-1 h-12 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 font-semibold text-sm transition-all">Cancel</button>
                            <button type="submit" disabled={submitting} className="flex-[2] h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70">
                                {isEditing ? <Edit size={16} /> : <Send size={16} />}
                                {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Publish Article'}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ══════ FULL SCREEN PREVIEW ══════ */}
            {selectedBlog && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 600, background: 'white', display: 'flex', flexDirection: 'column' }}>
                    {/* Progress bar */}
                    <div style={{ position: 'absolute', top: 0, left: 0, height: 3, zIndex: 10, width: `${readProgress}%`, background: 'linear-gradient(90deg, #2563eb, #14b8a6, #10b981)', transition: 'width 0.1s linear', boxShadow: '0 0 8px rgba(20,184,166,0.5)' }} />

                    {/* Top bar */}
                    <div style={{ height: 60, padding: '0 28px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', flexShrink: 0, position: 'relative', zIndex: 5 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #2563eb, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FileText size={15} style={{ color: 'white' }} />
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Article Preview</span>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: selectedBlog.status === 'Published' ? 'rgba(16,185,129,0.1)' : 'rgba(0,0,0,0.05)', color: selectedBlog.status === 'Published' ? '#059669' : '#94a3b8', border: `1px solid ${selectedBlog.status === 'Published' ? 'rgba(16,185,129,0.2)' : 'rgba(0,0,0,0.08)'}` }}>
                                {selectedBlog.status || 'Published'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {isAdmin && (
                                <button onClick={() => startEdit(selectedBlog)} style={{ height: 36, padding: '0 16px', borderRadius: 10, border: '1px solid rgba(0,0,0,0.1)', background: 'white', color: '#475569', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <Edit size={13} /> Edit
                                </button>
                            )}
                            <button onClick={() => setSelectedBlog(null)} style={{ height: 36, padding: '0 16px', borderRadius: 10, border: 'none', background: '#0f172a', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <X size={13} /> Close
                            </button>
                        </div>
                    </div>

                    {/* Article body */}
                    <div id="preview-scroll" style={{ flex: 1, overflowY: 'auto', padding: '48px 10% 80px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                            {selectedBlog.category && (
                                <span style={{ fontSize: 10, fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,0.08)', padding: '4px 14px', borderRadius: 20, border: '1px solid rgba(16,185,129,0.2)', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
                                    {selectedBlog.category}
                                </span>
                            )}
                            <span style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 5 }}>
                                <Clock size={11} />
                                {new Date(selectedBlog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>

                        <h1 style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, letterSpacing: '-0.025em', marginBottom: 16 }}>
                            {selectedBlog.title}
                        </h1>

                        {selectedBlog.content && cleanText(selectedBlog.content) && (
                            <p style={{ fontSize: 18, color: '#64748b', lineHeight: 1.7, marginBottom: 36 }}>
                                {cleanText(selectedBlog.content)}
                            </p>
                        )}

                        {/* 1. Cover image */}
                        {selectedBlog.imageUrl && (
                            <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 48, boxShadow: '0 12px 48px rgba(0,0,0,0.14)', border: '1px solid rgba(0,0,0,0.06)' }}>
                                <img src={selectedBlog.imageUrl} alt={selectedBlog.title} style={{ width: '100%', height: 460, objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
                            </div>
                        )}

                        {/* 2. Sections in exact order */}
                        {Array.isArray(selectedBlog.sections) && selectedBlog.sections.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
                                {selectedBlog.sections.map((section: any, idx: number) => (
                                    <ArticleSection key={idx} section={section} idx={idx} />
                                ))}
                            </div>
                        ) : selectedBlog.content ? (
                            <p style={{ fontSize: 17, color: '#374151', lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>
                                {cleanText(selectedBlog.content)}
                            </p>
                        ) : null}

                        {/* Footer */}
                        <div style={{ marginTop: 56, paddingTop: 28, borderTop: '1px solid rgba(20,184,166,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #2563eb, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 14 }}>NF</div>
                                <div>
                                    <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>NurseFlex Editorial</p>
                                    <p style={{ fontSize: 11, color: '#94a3b8' }}>Empowering healthcare professionals</p>
                                </div>
                            </div>
                            <button onClick={() => document.getElementById('preview-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })}
                                style={{ padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #14b8a6, #10b981)', color: 'white', fontSize: 12, fontWeight: 700, boxShadow: '0 4px 12px rgba(20,184,166,0.3)' }}>
                                ↑ Back to Top
                            </button>
                        </div>
                    </div>

                    <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
                </div>
            )}
        </>
    );
}