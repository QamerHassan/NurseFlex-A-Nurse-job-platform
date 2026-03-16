"use client";
import React, { useState, useEffect } from 'react';
import { 
    Loader2, Search, Filter, 
    MoreVertical, Plus, Edit, 
    Trash2, ExternalLink, Globe, 
    Clock, CheckCircle2, AlertCircle, 
    Image as ImageIcon, FileText, Send, 
    X, Download, ChevronRight, 
    ArrowUpRight
} from 'lucide-react';
import api from '@/lib/api';

import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState<any>({ 
    title: '', 
    content: '', 
    status: 'Published', 
    category: 'Nursing Tips',
    imageUrl: '',
    sections: [] // Array of { type: 'text' | 'image', content: string }
  });

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/blogs');
      setBlogs(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error("Fetch Error:", err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, imageUrl: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const startEdit = (blog: any) => {
    setIsEditing(true);
    setEditId(blog._id || blog.id); 
    setFormData({
      title: blog.title,
      content: blog.content,
      status: blog.status || 'Published',
      category: blog.category || 'Nursing Tips',
      imageUrl: blog.imageUrl,
      sections: Array.isArray(blog.sections) ? blog.sections : []
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      const token = sessionStorage.getItem("admin_token");
      const res = await api.delete(`/blogs/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 200 || res.status === 204) {
        fetchBlogs();
      }
    } catch (err) { console.error("Delete failed!"); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const token = sessionStorage.getItem("admin_token");
    const url = isEditing ? `/blogs/${editId}` : '/blogs';
    const method = isEditing ? 'put' : 'post';

    try {
      const res = await (api as any)[method](url, formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.status === 200 || res.status === 201) {
        closeModal();
        fetchBlogs();
      }
    } catch (err) { console.error("Network Error!"); }
    finally { setSubmitting(false); }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditId(null);
    setFormData({ title: '', content: '', status: 'Published', category: 'Nursing Tips', imageUrl: '', sections: [] });
  };

  const addSection = (type: 'text' | 'image') => {
    const newSection = { type, content: '' };
    setFormData({ ...formData, sections: [...formData.sections, newSection] });
  };

  const updateSection = (index: number, content: string) => {
    const updatedSections = [...formData.sections];
    updatedSections[index].content = content;
    setFormData({ ...formData, sections: updatedSections });
  };

  const removeSection = (index: number) => {
    setFormData({ ...formData, sections: formData.sections.filter((_: any, i: number) => i !== index) });
  };

  const handleSectionImage = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateSection(index, reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...formData.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    setFormData({ ...formData, sections: newSections });
  };

  if (loading) return (
    <div className="flex h-[60vh] flex-col items-center justify-center space-y-6">
        <div className="relative">
            <div className="absolute inset-0 bg-pink-500 blur-2xl opacity-10 animate-pulse"></div>
            <Loader2 className="animate-spin text-pink-500 relative z-10" size={48} />
        </div>
        <p className="text-sm font-medium text-slate-400">Loading articles...</p>
    </div>
  );

  return (
    <>
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900">Nursing Tips</h1>
            <p className="text-sm text-slate-500 font-medium">Manage articles and career resources.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm w-full md:w-80 transition-all focus-within:ring-2 focus-within:ring-pink-500/10 focus-within:border-pink-500/30">
                <Search className="text-slate-400" size={18} />
                <Input 
                    placeholder="Search articles..." 
                    className="h-10 border-none focus-visible:ring-0 font-medium text-sm bg-transparent placeholder:text-slate-400 p-0" 
                />
            </div>
            <Button 
                onClick={() => setIsModalOpen(true)}
                className="h-12 bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 rounded-xl transition-all shadow-sm flex items-center gap-2 group whitespace-nowrap"
            >
                New Article <Plus size={18} className="group-hover:rotate-90 transition-transform" />
            </Button>
        </div>
      </header>

      {/* Grid / List */}
      <div className="space-y-6">
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {blogs.map((blog) => (
              <Card key={blog._id || blog.id} className="group border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2.5rem] overflow-hidden hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1">
                <div className="flex flex-col sm:flex-row h-full">
                  {/* Thumbnail Side */}
                  <div className="sm:w-48 h-48 sm:h-auto relative overflow-hidden">
                    <img 
                        src={blog.imageUrl} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        alt="thumb" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Content Side */}
                  <div className="flex-1 p-8 flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Badge className="bg-pink-50 text-pink-600 border-none font-black text-[9px] uppercase tracking-[0.15em] px-3 py-1 shadow-none rounded-lg">
                                {blog.category}
                            </Badge>
                            <span className={`w-2 h-2 rounded-full ${blog.status === 'Published' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
                        </div>
                        
                        <div 
                            onClick={() => setSelectedBlog(blog)}
                            className="cursor-pointer group/title"
                        >
                            <h3 className="text-xl font-bold text-slate-900 group-hover/title:text-pink-600 transition-colors leading-tight line-clamp-2">
                                {blog.title}
                            </h3>
                            <p className="text-sm text-slate-400 font-medium mt-2 line-clamp-2">
                                {blog.content}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-50">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <Clock size={14} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                        </div>
                        
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                            <Button 
                                variant="ghost" size="icon" onClick={() => startEdit(blog)}
                                className="h-10 w-10 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-all"
                            >
                                <Edit size={18} />
                            </Button>
                            <Button 
                                variant="ghost" size="icon" onClick={() => handleDelete(blog._id || blog.id)}
                                className="h-10 w-10 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            >
                                <Trash2 size={18} />
                            </Button>
                        </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="p-32 text-center space-y-6 bg-white border border-slate-100 rounded-[3rem] shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] mx-auto flex items-center justify-center text-slate-200">
                <ImageIcon size={48} />
            </div>
            <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900 italic uppercase">Silence is Gold...</h3>
                <p className="text-sm text-slate-400 font-medium tracking-wide">But sharing insights is better. Start your first article.</p>
            </div>
            <Button 
                onClick={() => setIsModalOpen(true)} 
                className="bg-pink-600 text-white font-black h-12 px-8 rounded-2xl uppercase text-[10px] tracking-[0.2em] mt-6 shadow-xl shadow-pink-500/20 hover:bg-pink-700 transition-all active:scale-95"
            >
                Create First Article
            </Button>
          </div>
        )}
      </div>

      {/* FORM MODAL */}
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
         <DialogContent className="sm:max-w-xl bg-white rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
             <div className="bg-slate-900 p-8 text-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">{isEditing ? "Edit Article" : "New Article"}</DialogTitle>
                    <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Fill in the details below</DialogDescription>
                </DialogHeader>
             </div>

             <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-6">
                    {/* Primary Level: Title */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Article Title</label>
                        <Input 
                            required 
                            value={formData.title} 
                            placeholder="Enter a catchy title..." 
                            className="h-14 px-5 bg-slate-50 border-slate-200 rounded-2xl font-bold text-xl focus-visible:ring-pink-500/20 placeholder:text-slate-300 shadow-sm" 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, title: e.target.value})} 
                        />
                    </div>

                    {/* Secondary Level: Metadata Card */}
                    <div className="bg-slate-50/50 rounded-[2.5rem] p-8 border border-slate-100 flex flex-col md:flex-row gap-8">
                        <div className="space-y-2 flex-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Featured Image</label>
                            <label className="relative flex flex-col items-center justify-center h-44 bg-white border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer hover:bg-slate-50 transition-all p-2 text-center group overflow-hidden shadow-sm">
                                <input type="file" onChange={handleImageChange} className="hidden" />
                                {formData.imageUrl ? (
                                    <div className="relative w-full h-full">
                                        <img src={formData.imageUrl} className="w-full h-full object-cover rounded-2xl" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold uppercase rounded-2xl">Change Image</div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                                            <ImageIcon size={24} />
                                        </div>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Primary Thumbnail</p>
                                    </div>
                                )}
                            </label>
                        </div>
                        
                        <div className="flex flex-col gap-5 min-w-[200px]">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Category</label>
                                <select 
                                    className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl font-bold text-xs outline-none focus:border-pink-500 transition-all appearance-none shadow-sm"
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                >
                                    <option>Nursing Tips</option>
                                    <option>Industry News</option>
                                    <option>Success Stories</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Status</label>
                                <select 
                                    className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl font-bold text-xs outline-none focus:border-pink-500 transition-all appearance-none shadow-sm"
                                    value={formData.status}
                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                                >
                                    <option>Published</option>
                                    <option>Draft</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Tertiary Level: Sections */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between ml-1">
                            <div className="space-y-0.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Content Sections</label>
                                <p className="text-[9px] text-slate-400 font-medium">Add text or images to build your article</p>
                            </div>
                            <div className="flex gap-2">
                                <Button type="button" size="sm" onClick={() => addSection('text')} className="h-9 px-4 text-[10px] font-bold rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-100 border-none transition-all shadow-none">
                                    Add Text Section
                                </Button>
                                <Button type="button" size="sm" onClick={() => addSection('image')} className="h-9 px-4 text-[10px] font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 border-none transition-all shadow-none">
                                    Add Image Section
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {formData.sections.map((section: any, index: number) => (
                                <div key={index} className="relative group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all animate-in zoom-in-95 duration-200">
                                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                        <Button 
                                            type="button" size="icon" onClick={() => moveSection(index, 'up')} disabled={index === 0}
                                            className="h-8 w-8 bg-white border border-slate-100 rounded-full shadow-sm text-slate-400 hover:text-pink-600 hover:bg-pink-50 disabled:opacity-30"
                                        >
                                            <ArrowUpRight size={14} className="-rotate-45" />
                                        </Button>
                                        <Button 
                                            type="button" size="icon" onClick={() => moveSection(index, 'down')} disabled={index === formData.sections.length - 1}
                                            className="h-8 w-8 bg-white border border-slate-100 rounded-full shadow-sm text-slate-400 hover:text-pink-600 hover:bg-pink-100 disabled:opacity-30"
                                        >
                                            <ArrowUpRight size={14} className="rotate-[135deg]" />
                                        </Button>
                                        <Button 
                                            type="button" size="icon" onClick={() => removeSection(index)}
                                            className="h-8 w-8 bg-white border border-slate-100 rounded-full shadow-sm text-red-400 hover:text-white hover:bg-red-500"
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>

                                    <div className="flex items-center gap-3 mb-6">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${section.type === 'text' ? 'bg-pink-50 text-pink-500' : 'bg-slate-50 text-slate-500'}`}>
                                            {section.type === 'text' ? <FileText size={16} /> : <ImageIcon size={16} />}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-300">
                                            {section.type === 'text' ? 'Text' : 'Image'} Block
                                        </span>
                                    </div>

                                    {section.type === 'text' ? (
                                        <Textarea 
                                            value={section.content}
                                            onChange={(e) => updateSection(index, e.target.value)}
                                            placeholder="Sharing is caring... write your insights here."
                                            className="min-h-[150px] bg-slate-50/50 border-none px-6 py-5 rounded-2xl focus-visible:ring-0 font-medium text-base text-slate-600 leading-relaxed placeholder:text-slate-300"
                                        />
                                    ) : (
                                        <div className="space-y-4 text-center">
                                            {section.content ? (
                                                <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-inner group/img">
                                                    <img src={section.content} className="w-full h-full object-cover" />
                                                    <label className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer font-bold text-[10px] uppercase">
                                                        Replace Section Image
                                                        <input type="file" className="hidden" onChange={(e) => handleSectionImage(index, e)} />
                                                    </label>
                                                </div>
                                            ) : (
                                                <label className="flex flex-col items-center justify-center h-56 bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-[2rem] cursor-pointer hover:bg-slate-50 hover:border-pink-200 transition-all gap-3 group/upload">
                                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-sm group-hover/upload:text-pink-400 transition-colors">
                                                        <ImageIcon size={24} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Image Asset</p>
                                                        <p className="text-[8px] text-slate-300 font-medium uppercase">PNG, JPG or WebP up to 5MB</p>
                                                    </div>
                                                    <input type="file" className="hidden" onChange={(e) => handleSectionImage(index, e)} />
                                                </label>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                            
                            {formData.sections.length === 0 && (
                                <div className="text-center py-20 border-2 border-dashed border-slate-50 rounded-[3rem] bg-slate-50/30">
                                    <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center mx-auto text-slate-200 mb-4 shadow-sm">
                                        <Plus size={32} />
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic leading-tight">Your story starts here</p>
                                    <p className="text-[10px] text-slate-300 mt-1 uppercase tracking-wider font-bold">Use the buttons to add text and images</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Short Preview Summary</label>
                        <Textarea 
                            required 
                            value={formData.content} 
                            placeholder="Hook the readers with a short intro..." 
                            rows={3} 
                            className="p-5 bg-slate-50 border-slate-200 rounded-2xl font-medium text-sm focus-visible:ring-pink-500/20 placeholder:text-slate-300" 
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, content: e.target.value})} 
                        />
                    </div>
                </div>

                <div className="flex gap-4 pt-8 sticky bottom-0 bg-white/100 mt-8">
                    <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={closeModal} 
                        className="h-14 flex-1 rounded-2xl font-bold uppercase text-[10px] tracking-widest text-slate-400 hover:text-slate-900 border border-slate-100 hover:bg-slate-50 transition-all"
                    >
                        Back to List
                    </Button>
                    <Button 
                        type="submit" 
                        disabled={submitting}
                        className="h-14 flex-[2] bg-pink-600 text-white hover:bg-pink-700 rounded-2xl font-black uppercase text-[11px] tracking-[0.15em] gap-3 shadow-xl shadow-pink-500/20 transition-all active:scale-[0.98]"
                    >
                        {isEditing ? <Edit size={18} /> : <Send size={18} />}
                        {submitting ? "Processing..." : (isEditing ? "Save Refinements" : "Launch Article")}
                    </Button>
                </div>
             </form>
         </DialogContent>
      </Dialog>
      
      <footer className="pt-20 text-center">
            <p className="text-[10px] font-bold text-slate-200 uppercase tracking-widest">NurseFlex Content Manager</p>
      </footer>
    </div>

    {/* READING MODE modal moved outside to ensure true fullscreen coverage */}
    {selectedBlog && (
      <div className="fixed inset-0 bg-white z-[600] overflow-y-auto animate-in fade-in duration-500 custom-scrollbar">
        <div className="sticky top-0 bg-white/80 backdrop-blur-3xl border-b border-slate-100 px-6 h-20 flex justify-between items-center z-50">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center text-white">
                  <FileText size={20} />
              </div>
              <span className="font-bold uppercase text-slate-400 text-[10px] tracking-widest">Article Preview</span>
           </div>
           <Button 
              onClick={() => setSelectedBlog(null)} 
              className="bg-pink-600 hover:bg-pink-700 text-white px-8 h-12 rounded-xl font-bold text-sm uppercase tracking-wider transition-all active:scale-95 shadow-xl shadow-pink-500/20"
          >
              Close Preview <X size={20} className="ml-2" />
          </Button>
        </div>
        <article className="max-w-4xl mx-auto px-6 py-16 space-y-8">
          <div className="space-y-6 text-center max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-4">
                  <Badge className="bg-pink-50 text-pink-600 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border-none">{selectedBlog.category}</Badge>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Clock size={12} /> {new Date(selectedBlog.createdAt).toLocaleDateString()}
                  </p>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">{selectedBlog.title}</h1>
          </div>

          {selectedBlog.imageUrl && (
              <div className="relative group rounded-3xl overflow-hidden shadow-xl border border-slate-200">
                  <img src={selectedBlog.imageUrl} className="w-full h-auto object-cover max-h-[500px]" alt="banner" />
              </div>
          )}

          {/* Render Multi-Sections */}
          {Array.isArray(selectedBlog.sections) && selectedBlog.sections.length > 0 ? (
              <div className="space-y-12">
                  {selectedBlog.sections.map((section: any, idx: number) => (
                      <div key={idx} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                          {section.type === 'text' ? (
                              <div className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap font-medium prose prose-primary max-w-none px-4">
                                  {section.content}
                              </div>
                          ) : (
                              <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-100 group">
                                  <img src={section.content} className="w-full h-auto object-cover max-h-[600px] hover:scale-[1.01] transition-transform duration-500" alt={`section-${idx}`} />
                              </div>
                          )}
                      </div>
                  ))}
              </div>
          ) : (
              <div className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap font-medium prose prose-slate max-w-none px-4">
                  {selectedBlog.content}
              </div>
          )}
        </article>
      </div>
    )}
    </>
  );
}