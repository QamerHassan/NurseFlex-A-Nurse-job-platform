"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { User, Mail, Lock, Loader2, UserPlus, Phone, MapPin, Award, BookOpen, Clock, FileUp, CheckCircle2, ArrowRight, LogOut, Shield, AlertCircle } from 'lucide-react';
import { signIn, useSession, signOut } from 'next-auth/react';
import { clearAllUserData } from '@/lib/auth-utils';

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";

function RegisterContent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    state: '',
    licenseNumber: '',
    specialization: '',
    experience: '',
    yearsOfExperience: '',
    password: '',
    role: 'NURSE' as 'NURSE' | 'BUSINESS'
  });
  const [resume, setResume] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isAlreadyLoggedIn, setIsAlreadyLoggedIn] = useState(false);
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const searchParams = useSearchParams();
  const portal = searchParams.get('portal');

  useEffect(() => {
    if (portal === 'business') {
      setFormData(prev => ({ ...prev, role: 'BUSINESS' }));
    }
  }, [portal]);

  useEffect(() => {
    const isBusiness = portal === 'business';
    const tokenKey = isBusiness ? 'business_token' : 'token';
    const token = localStorage.getItem(tokenKey);
    if (token || (sessionStatus === 'authenticated' && session)) {
      setIsAlreadyLoggedIn(true);
    }
  }, [sessionStatus, session, portal]);

  const handleSignOut = async () => {
    clearAllUserData();
    await signOut({ redirect: false });
    setIsAlreadyLoggedIn(false);
  };

  const handleGoogleSignIn = () => {
    clearAllUserData();
    document.cookie = `next_auth_role=${formData.role}; path=/; max-age=300`;
    const callbackUrl = formData.role === 'BUSINESS' ? '/business/dashboard' : '/dashboard';
    signIn('google', { callbackUrl });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        state: formData.state,
        licenseNumber: formData.licenseNumber,
        specialization: formData.specialization,
        yearsOfExperience: formData.yearsOfExperience,
        resumeUrl: resumeUrl || 'MockURL_Internal' // In a real app, this would be the uploaded S3 link
      });
      clearAllUserData();
      await signOut({ redirect: false });
      setSuccess(true);
    } catch (err: any) {
      console.error('❌ Register Error:', err);
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <Card className="max-w-md w-full border border-slate-200 shadow-sm p-6 text-center rounded-xl">
            <CardHeader className="p-0 mb-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={32} className="text-emerald-500" />
                </div>
                <div className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">
                        Account created
                    </CardTitle>
                    <CardDescription className="text-slate-500 font-medium text-sm pt-2">
                        {formData.role === 'BUSINESS'
                            ? "We are currently reviewing your profile. You'll hear from us soon."
                            : "Your profile is under review. We'll verify your details and notify you."}
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="flex flex-col gap-3">
                    {formData.role === 'BUSINESS' && (
                    <Button asChild size="lg" className="h-12 font-bold rounded-lg bg-[#ec4899] hover:bg-[#db2777] text-white">
                        <Link href="/business/dashboard">Go to Dashboard</Link>
                    </Button>
                    )}
                    <Button asChild variant="ghost" size="lg" className="h-12 font-bold rounded-lg text-slate-500">
                        <Link href="/">Return to home</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex selection:bg-pink-100 selection:text-pink-900">
      {/* ── LEFT BRANDED PANEL ── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col justify-between p-16 bg-[#ec4899]">
        <div className="relative">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-white font-bold text-2xl tracking-tight">NurseFlex</span>
          </Link>
        </div>

        <div className="relative space-y-12">
          <div className="max-w-lg">
            <h1 className="text-5xl font-bold text-white leading-[1.1] tracking-tighter mb-6">
              The top site for <span className="text-pink-100">verified nurses</span> in the USA.
            </h1>
            <p className="text-white/80 text-xl font-medium leading-relaxed">
              Find top-tier roles and grow your career with NurseFlex.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { text: 'Verified Nurse Profiles' },
              { text: 'Exclusive Job Opportunities' },
              { text: 'Real-time Shift Management' },
              { text: 'Direct Hire Opportunities' },
            ].map(({ text }) => (
              <div key={text} className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-white/60" />
                <span className="text-white text-base font-semibold">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative border-t border-white/10 pt-8">
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">© 2026 NurseFlex International</p>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-lg py-12">

          {/* Mobile logo */}
          <Link href="/" className="flex lg:hidden items-center gap-3 mb-12 justify-center">
            <span className="text-[#ec4899] font-bold text-2xl tracking-tight">NurseFlex</span>
          </Link>

          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="p-0 mb-8 space-y-2 text-center md:text-left">
              <div className="space-y-1">
                <CardTitle className="text-3xl font-bold text-slate-900 tracking-tighter">
                  Create account
                </CardTitle>
                <CardDescription className="text-slate-500 font-medium text-sm pt-2">
                  Joining as <span className="text-[#ec4899] font-bold">{formData.role === 'BUSINESS' ? 'Employer' : 'Nurse'}</span>
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {isAlreadyLoggedIn ? (
                <div className="space-y-3">
                  <div className="bg-amber-50 text-amber-700 border border-amber-100 rounded-lg p-5 mb-4">
                    <p className="text-sm font-bold mb-1">
                       Already signed in
                    </p>
                    <p className="text-sm text-amber-600/90 font-medium">You have an active session. Proceed to your portal or sign out to create a new account.</p>
                  </div>
                  <Button
                    size="lg"
                    onClick={() => {
                      const user = JSON.parse(localStorage.getItem('user') || '{}');
                      const role = (session?.user as any)?.role || user.role;
                      router.push(role === 'BUSINESS' ? '/business/dashboard' : '/dashboard');
                    }}
                    className="w-full h-14 font-bold rounded-lg bg-[#ec4899] hover:bg-[#db2777] shadow-none"
                  >
                    Go to Portal
                  </Button>
                  <Button variant="ghost" size="lg" onClick={handleSignOut} className="w-full h-14 text-slate-500 font-bold rounded-lg hover:bg-slate-50 transition-all gap-2">
                    Sign out & register new account
                  </Button>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="mb-8 bg-red-50 border border-red-100/50 rounded-2xl p-5 text-sm text-red-600 font-bold flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
                      <AlertCircle className="shrink-0 mt-0.5" size={18} />
                       {error}
                    </div>
                  )}

                  {/* Role switch */}
                  {!portal && (
                    <Tabs defaultValue="NURSE" className="mb-8 w-full" onValueChange={(v) => setFormData(f => ({ ...f, role: v as any }))}>
                        <TabsList className="w-full h-12 p-1 bg-slate-100 border border-slate-200 rounded-lg">
                            <TabsTrigger value="NURSE" className="flex-1 rounded-md font-bold data-[state=active]:bg-white data-[state=active]:text-[#ec4899] text-xs">Professional</TabsTrigger>
                            <TabsTrigger value="BUSINESS" className="flex-1 rounded-md font-bold data-[state=active]:bg-white data-[state=active]:text-[#ec4899] text-xs">Employer</TabsTrigger>
                        </TabsList>
                    </Tabs>
                  )}

                  <form onSubmit={handleRegister} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-x-4 gap-y-4">
                        {/* Name */}
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-xs font-bold text-slate-700">Full name</Label>
                            <Input id="name" required className="h-11 border-slate-300 rounded-lg focus-visible:ring-[#ec4899] font-medium" placeholder="Jane Doe"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-bold text-slate-700">Email address</Label>
                            <Input id="email" type="email" required className="h-11 border-slate-300 rounded-lg focus-visible:ring-[#ec4899] font-medium" placeholder="jane@example.com"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        </div>

                        {/* Phone */}
                        <div className="space-y-1.5">
                            <Label htmlFor="phone" className="text-xs font-bold text-slate-700">Phone number</Label>
                            <Input id="phone" type="tel" required className="h-11 border-slate-300 rounded-lg focus-visible:ring-[#ec4899] font-medium" placeholder="(555) 000-0000"
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                        </div>

                        {/* State */}
                        <div className="space-y-1.5">
                            <Label htmlFor="state" className="text-xs font-bold text-slate-700">State / City</Label>
                            <Input id="state" required className="h-11 border-slate-300 rounded-lg focus-visible:ring-[#ec4899] font-medium" placeholder="CA, Los Angeles"
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
                        </div>

                        {formData.role === 'NURSE' && (
                            <>
                                {/* License */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="license" className="text-xs font-bold text-slate-700">License number</Label>
                                    <Input id="license" required className="h-11 border-slate-300 rounded-lg focus-visible:ring-[#ec4899] font-medium" placeholder="RN-123456"
                                        onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })} />
                                </div>

                                {/* Experience */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="experience" className="text-xs font-bold text-slate-700">Years of experience</Label>
                                    <Input id="experience" type="number" required className="h-11 border-slate-300 rounded-lg focus-visible:ring-[#ec4899] font-medium" placeholder="5"
                                        onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })} />
                                </div>

                                {/* Resume Upload */}
                                <div className="space-y-1.5 md:col-span-2">
                                    <Label htmlFor="resume" className="text-xs font-bold text-slate-700">Upload resume</Label>
                                    <Input id="resume" type="file" required className="h-11 border-slate-300 rounded-lg focus-visible:ring-[#ec4899] file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-pink-50 file:text-[#ec4899] hover:file:bg-pink-100 cursor-pointer pt-2"
                                        onChange={(e) => setResume(e.target.files?.[0] || null)} />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-xs font-bold text-slate-700">Password</Label>
                        <Input id="password" type="password" required className="h-11 border-slate-300 rounded-lg focus-visible:ring-[#ec4899] font-medium" placeholder="••••••••"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                    </div>

                    <Button type="submit" size="lg" disabled={loading} className="w-full h-12 mt-4 bg-[#ec4899] hover:bg-[#db2777] text-white font-bold rounded-lg shadow-none transition-all group disabled:opacity-50">
                      {loading ? "Creating account..." : "Create account"}
                    </Button>
                  </form>

                  <div className="relative my-10">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">or</span>
                    </div>
                  </div>

                  <Button onClick={handleGoogleSignIn} variant="outline" size="lg" className="w-full h-12 border-slate-300 rounded-lg font-bold bg-white hover:bg-slate-50 text-slate-700 transition-all group shadow-none">
                    Continue with Google
                  </Button>

                  <p className="text-center text-sm font-medium text-slate-500 mt-10">
                    Member of NurseFlex?{' '}
                    <Link href="/auth/login" className="text-[#ec4899] font-bold hover:underline">Sign in here</Link>
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-pink-600" size={48} /></div>}>
      <RegisterContent />
    </Suspense>
  );
}
