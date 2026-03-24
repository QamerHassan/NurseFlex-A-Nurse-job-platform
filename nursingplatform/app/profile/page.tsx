"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
  Upload, FileText, CheckCircle2, Camera, Loader2,
  User, Mail, Phone, Briefcase, MapPin, Save,
  Edit3, X, AlertCircle, ShieldCheck, Star
} from 'lucide-react';
import { Badge } from "@/app/components/ui/badge";
import { Skeleton } from "@/app/components/ui/skeleton";

// ─── Backend base URL ─────────────────────────────────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl text-white font-semibold text-sm shadow-2xl animate-in slide-in-from-bottom-4 duration-300 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
      {type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
      {message}
      <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100"><X size={14} /></button>
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingPDF, setUploadingPDF] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '', email: '', experience: '', bio: '',
    phone: '', location: '', specialization: '', skills: [] as string[],
  });

  const [newSkill, setNewSkill] = useState('');

  // ── Fetch profile ──────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        const d = res.data;
        setProfile(d);
        setForm({
          name: d.name || d.user?.name || '',
          email: d.user?.email || '',
          experience: d.experience?.toString() || '0',
          bio: d.bio || '',
          phone: d.phone || '',
          location: d.location || '',
          specialization: d.specialization || '',
          skills: Array.isArray(d.skills) ? d.skills : [],
        });
      } catch (err) {
        console.error('Profile load failed:', err);
        showToast('Failed to load profile.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [field]: e.target.value }));

  // ── Save profile ───────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.name.trim()) { showToast('Name is required.', 'error'); return; }
    setSaving(true);
    try {
      await api.patch('/profile/update', {
        ...form,
        experience: parseInt(form.experience) || 0,
      });
      setProfile((p: any) => ({
        ...p, ...form,
        experience: parseInt(form.experience) || 0,
        user: { ...p.user, name: form.name, email: form.email },
      }));
      setIsEditing(false);
      showToast('Profile updated successfully!');
    } catch (err) {
      console.error('Save error:', err);
      showToast('Failed to save profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Profile picture upload (backend) ─────────────────────────────────────
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      showToast('Only image files are allowed.', 'error'); return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be under 5MB.', 'error'); return;
    }

    // Show local preview instantly
    const localUrl = URL.createObjectURL(file);
    setPreviewImg(localUrl);
    setUploadingImg(true);

    try {
      const fd = new FormData();
      fd.append('file', file);

      // Upload to backend (same pattern as resume)
      const uploadRes = await api.post('/profile/upload-picture', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const newUrl = uploadRes.data.url || uploadRes.data.profilePicture;

      // Save URL to profile
      await api.patch('/profile/update', { profilePicture: newUrl });
      setProfile((p: any) => ({ ...p, profilePicture: newUrl }));
      setPreviewImg(null);
      showToast('Profile photo updated!');
    } catch (err: any) {
      console.error('Image upload error:', err);
      setPreviewImg(null);
      // If backend endpoint doesn't exist yet, keep local preview
      showToast(
        err?.response?.status === 404
          ? 'Upload endpoint not set up yet. Contact your backend developer.'
          : 'Image upload failed. Please try again.',
        'error'
      );
    } finally {
      setUploadingImg(false);
    }
  };

  // ── Resume upload (backend) ────────────────────────────────────────────────
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { showToast('Only PDF files are allowed.', 'error'); return; }
    if (file.size > 5 * 1024 * 1024) { showToast('File size must be under 5MB.', 'error'); return; }

    setUploadingPDF(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const uploadRes = await api.post('/applications/upload-resume', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const newUrl = uploadRes.data.url;
      await api.patch('/profile/update', { resumeUrl: newUrl });
      setProfile((p: any) => ({ ...p, resumeUrl: newUrl }));
      showToast(`Resume "${file.name}" uploaded!`);
    } catch (err) {
      console.error('Resume upload error:', err);
      showToast('Resume upload failed.', 'error');
    } finally {
      setUploadingPDF(false);
    }
  };

  // ── Skills ─────────────────────────────────────────────────────────────────
  const addSkill = () => {
    const s = newSkill.trim();
    if (!s || form.skills.includes(s)) { setNewSkill(''); return; }
    setForm(p => ({ ...p, skills: [...p.skills, s] }));
    setNewSkill('');
  };

  const removeSkill = (skill: string) =>
    setForm(p => ({ ...p, skills: p.skills.filter((s: string) => s !== skill) }));

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4 font-sans">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-48 rounded-2xl" />
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  );

  const rawPic = previewImg || profile?.profilePicture;
  const avatarSrc = rawPic
    ? (rawPic.startsWith('http') || rawPic.startsWith('blob:') || rawPic.startsWith('data:'))
      ? rawPic
      : `${API_BASE}${rawPic}`
    : null;
  const resumeUrl = profile?.resumeUrl
    ? (profile.resumeUrl.startsWith('http') ? profile.resumeUrl : `${API_BASE}${profile.resumeUrl}`)
    : null;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto px-4 py-5 space-y-4 font-sans">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Page title ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="text-sm text-slate-400 mt-0.5">Manage your nurse profile and documents.</p>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)}
            className="h-9 px-4 rounded-xl border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 text-sm font-medium flex items-center gap-2 transition-all">
            <Edit3 size={14} /> Edit Profile
          </button>
        )}
      </div>

      {/* ── Profile card ── */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        {/* Banner */}
        <div className="h-20 bg-gradient-to-r from-blue-600 to-green-600 relative">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_50%,white,transparent)]" />
        </div>

        <div className="px-6 pb-6">
          {/* Avatar row */}
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="relative">
              <div className="w-20 h-20 bg-white rounded-2xl p-1 shadow-lg border border-slate-100 overflow-hidden">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                      // If URL fails, hide img and show fallback
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                      (e.currentTarget.nextSibling as HTMLElement)?.removeAttribute('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-full h-full bg-gradient-to-br from-blue-50 to-green-50 rounded-xl flex items-center justify-center ${avatarSrc ? 'hidden' : ''}`}>
                  <User size={32} className="text-slate-300" />
                </div>
              </div>
              {/* Camera upload */}
              <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center text-white cursor-pointer shadow-md hover:scale-110 transition-transform border-2 border-white">
                {uploadingImg ? <Loader2 size={12} className="animate-spin" /> : <Camera size={12} />}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImg} />
              </label>
            </div>

            {/* Status badge — only show if APPROVED */}
            {profile?.status === 'APPROVED' && (
              <Badge className="text-xs font-semibold border px-3 py-1 bg-green-50 text-green-700 border-green-100">
                <ShieldCheck size={11} className="inline mr-1" />Verified Nurse
              </Badge>
            )}
          </div>

          {/* View mode */}
          {!isEditing ? (
            <div className="space-y-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{form.name || 'Set Your Name'}</h2>
                {form.specialization && (
                  <p className="text-sm text-blue-600 font-semibold mt-0.5">{form.specialization}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: Mail, value: form.email, color: 'text-slate-400' },
                  { icon: Phone, value: form.phone, color: 'text-slate-400' },
                  { icon: MapPin, value: form.location, color: 'text-slate-400' },
                  { icon: Briefcase, value: form.experience ? `${form.experience} yrs exp` : null, color: 'text-blue-600' },
                ].filter(d => d.value).map((d, i) => (
                  <span key={i} className={`flex items-center gap-1.5 text-xs font-medium ${d.color}`}>
                    <d.icon size={12} className="shrink-0" />{d.value}
                  </span>
                ))}
              </div>
              {form.bio && <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">{form.bio}</p>}

              {/* Skills */}
              {form.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {form.skills.map((s: string) => (
                    <span key={s} className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">{s}</span>
                  ))}
                </div>
              )}
            </div>

          ) : (
            /* Edit mode */
            <div className="space-y-4">
              {/* Name + Experience + Specialization */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { label: 'Full Name', key: 'name', placeholder: 'Your full name', type: 'text' },
                  { label: 'Experience (Years)', key: 'experience', placeholder: '2', type: 'number' },
                  { label: 'Specialization', key: 'specialization', placeholder: 'e.g. ICU / ER', type: 'text' },
                ].map(f => (
                  <div key={f.key} className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{f.label}</label>
                    <input
                      type={f.type}
                      value={(form as any)[f.key]}
                      onChange={set(f.key)}
                      placeholder={f.placeholder}
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white outline-none text-sm font-medium text-slate-900 transition-all"
                    />
                  </div>
                ))}
              </div>

              {/* Phone + Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { label: 'Phone', key: 'phone', placeholder: '+1-XXX-XXX-XXXX' },
                  { label: 'Location', key: 'location', placeholder: 'City, State' },
                ].map(f => (
                  <div key={f.key} className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{f.label}</label>
                    <input
                      value={(form as any)[f.key]}
                      onChange={set(f.key)}
                      placeholder={f.placeholder}
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white outline-none text-sm font-medium text-slate-900 transition-all"
                    />
                  </div>
                ))}
              </div>

              {/* Bio */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Professional Bio</label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={set('bio')}
                  placeholder="Tell employers about yourself..."
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-green-500 focus:bg-white outline-none text-sm font-medium text-slate-900 resize-none transition-all leading-relaxed"
                />
                <p className="text-[11px] text-slate-400">{form.bio.length} characters</p>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Skills</label>
                <div className="flex gap-2">
                  <input
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="e.g. BLS, ACLS, IV Therapy..."
                    className="flex-1 h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-green-500 focus:bg-white outline-none text-sm font-medium transition-all"
                  />
                  <button type="button" onClick={addSkill}
                    className="h-10 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-all">
                    Add
                  </button>
                </div>
                {form.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.skills.map((s: string) => (
                      <span key={s} className="flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
                        {s}
                        <button onClick={() => removeSkill(s)} className="ml-0.5 hover:text-red-500 transition-colors"><X size={11} /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-1">
                <button onClick={handleSave} disabled={saving}
                  className="h-10 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold text-sm flex items-center gap-2 shadow-md transition-all disabled:opacity-60">
                  {saving ? <><Loader2 size={14} className="animate-spin" />Saving...</> : <><Save size={14} />Save Changes</>}
                </button>
                <button onClick={() => setIsEditing(false)}
                  className="h-10 px-5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 text-sm font-medium transition-all">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Documents section ── */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center">
            <FileText size={14} className="text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-sm">Resume / CV</p>
            <p className="text-xs text-slate-400">Upload your latest resume (PDF, max 5MB)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Upload area */}
          <div>
            <label htmlFor="resume-upload"
              className={`flex flex-col items-center justify-center h-36 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${uploadingPDF ? 'border-blue-300 bg-blue-50' : 'border-slate-200 hover:border-green-300 hover:bg-green-50/30'}`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-2 transition-all ${uploadingPDF ? 'bg-blue-100' : 'bg-slate-50 group-hover:bg-green-100'}`}>
                {uploadingPDF ? <Loader2 size={20} className="text-blue-600 animate-spin" /> : <Upload size={20} className="text-slate-400" />}
              </div>
              <p className="text-sm font-semibold text-slate-700">
                {uploadingPDF ? 'Uploading...' : 'Click to upload resume'}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">PDF only · Max 5MB</p>
              {resumeUrl && <p className="text-xs text-green-600 font-semibold mt-1.5 flex items-center gap-1"><CheckCircle2 size={11} />Resume on file</p>}
            </label>
            <input
              id="resume-upload"
              type="file"
              className="hidden"
              accept=".pdf"
              onChange={handleResumeUpload}
              disabled={uploadingPDF}
            />
          </div>

          {/* PDF preview */}
          <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden" style={{ height: '144px' }}>
            {resumeUrl ? (
              <div className="w-full h-full relative">
                <iframe
                  src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                  className="w-full h-full border-none"
                  title="Resume Preview"
                />
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer"
                  className="absolute bottom-2 right-2 h-7 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold flex items-center gap-1 shadow-md transition-all">
                  <FileText size={11} /> View Full
                </a>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-2">
                <FileText size={28} className="text-slate-300" />
                <p className="text-xs text-slate-400 font-medium">No resume uploaded yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] text-slate-300 uppercase tracking-widest">
        NurseFlex · Your Nursing Profile
      </p>
    </div>
  );
}