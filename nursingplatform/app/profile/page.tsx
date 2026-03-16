"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Upload, FileText, CheckCircle, Camera, Loader2, User, Mail, Phone, Briefcase } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingPDF, setUploadingPDF] = useState(false);
  const [resumeName, setResumeName] = useState("");

  // Cloudinary Config (Replace with your actual keys)
  const CLOUD_NAME = "your_cloud_name";
  const UPLOAD_PRESET = "your_preset_name";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        setProfile(res.data);
        if (res.data.resumeUrl) setResumeName("Current_Resume.pdf");
      } catch (err) {
        console.error("Profile load failed, using mock data for development");
        // Fallback mock data for development
        setProfile({
          email: "nurse@example.com",
          profile: {
            name: "Sarah Jenkins",
            experience: 8,
            status: "Under Review", // or "Verified"
            specialization: "ICU / Critical Care"
          }
        });
      }
    };
    fetchProfile();
  }, []);

  // 1. Profile Picture Upload (Cloudinary)
  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImg(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();

      await api.post('/users/update-profile', { profilePicture: data.secure_url });
      setProfile({ ...profile, profilePicture: data.secure_url });
      alert("Photo Updated!");
    } catch (err) {
      alert("Image upload failed");
    } finally {
      setUploadingImg(false);
    }
  };

  // 2. Resume PDF Upload (Backend / Future Cloudinary)
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPDF(true);
    try {
      // Simulation: Yahan aap apna backend endpoint hit karenge
      // await api.post('/users/upload-resume', formData); 
      setResumeName(file.name);
      alert("Resume Updated Successfully!");
    } catch (err) {
      alert("Resume upload failed");
    } finally {
      setUploadingPDF(false);
    }
  };

  if (!profile) return (
    <div className="h-screen flex items-center justify-center font-bold uppercase tracking-widest text-slate-300 animate-pulse">
      Loading Profile...
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in duration-700">
      <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-8">My Account</h1>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        {/* Header/Banner Section */}
        <div className="bg-slate-900 h-32 w-full relative"></div>

        <div className="px-10 pb-10">
          {/* Avatar Section */}
          <div className="relative -mt-16 mb-8 inline-block">
            <div className="w-36 h-36 bg-white rounded-2xl p-1.5 shadow-xl overflow-hidden border border-slate-100">
              <div className="w-full h-full rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden">
                {profile.profilePicture ? (
                  <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={64} className="text-slate-200" />
                )}
              </div>
            </div>
            <label className="absolute bottom-2 right-2 bg-[#ec4899] text-white p-3.5 rounded-xl shadow-lg cursor-pointer hover:bg-[#db2777] transition-all hover:scale-110 active:scale-95 border-4 border-white">
              {uploadingImg ? <Loader2 className="animate-spin" size={20} /> : <Camera size={20} />}
              <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
            </label>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{profile.profile?.name || "Bilal Hassan"}</h2>
                {profile.profile?.status === 'Verified' && (
                  <div className="w-7 h-7 bg-[#ec4899] text-white rounded-full flex items-center justify-center shadow-lg shadow-pink-100 animate-in zoom-in duration-500" title="Verified Nurse">
                    <CheckCircle size={16} />
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-slate-400 font-bold text-xs uppercase tracking-widest"><Mail size={14} /> {profile.email}</span>
                <span className="flex items-center gap-1.5 text-slate-400 font-bold text-xs uppercase tracking-widest"><Briefcase size={14} /> {profile.profile?.experience || 0} Yrs Exp</span>
              </div>
            </div>

            {profile.profile?.status === 'Verified' ? (
              <div className="bg-pink-50 text-[#ec4899] px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-wider border border-pink-100 flex items-center gap-2">
                <CheckCircle size={14} /> Verified Professional
              </div>
            ) : (
              <div className="bg-orange-50 text-orange-600 px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-wider border border-orange-100 flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" /> Profile Under Review
              </div>
            )}
          </div>

          {/* Resume Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Documents & Credentials</h3>
            <div className="border-4 border-dashed border-slate-50 rounded-3xl p-10 text-center hover:border-pink-200 transition-all group relative">
              <input type="file" id="resume" className="hidden" onChange={handleResumeUpload} accept=".pdf" disabled={uploadingPDF} />
              <label htmlFor="resume" className="cursor-pointer">
                <div className={`bg-slate-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#ec4899] group-hover:text-white transition-all duration-500 ${uploadingPDF ? 'animate-bounce' : ''}`}>
                  {uploadingPDF ? <Loader2 className="animate-spin" /> : <FileText size={28} />}
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Update Your Resume</h3>
                <p className="text-slate-400 text-sm font-medium mt-2">Current: <span className="text-[#ec4899] underline">{resumeName || "No file uploaded"}</span></p>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}