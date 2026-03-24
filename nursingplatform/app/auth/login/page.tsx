'use client';
import { useState, useEffect, Suspense } from 'react';
import api from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn, useSession, signOut } from 'next-auth/react';
import { LogIn, Mail, Lock, Loader2, AlertCircle, User, LogOut, ArrowRight, Shield } from 'lucide-react';
import { clearPortalData } from '@/lib/auth-utils';

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAlreadyLoggedIn, setIsAlreadyLoggedIn] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const portal = searchParams.get('portal');
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    const syncUser = async () => {
      if (sessionStatus === 'authenticated' && session?.user) {
        const sessionRole = (session.user as any).role;
        if (sessionRole === 'BUSINESS') {
            router.push('/business/login');
            return;
        }
        const userId = (session.user as any).id;
        if (userId) {
          localStorage.setItem('x-google-user-id', userId);
          const localUser = localStorage.getItem('user');
          if (!localUser || JSON.parse(localUser).id !== userId) {
            try {
              const res = await api.get('/profile');
              const userData = { ...res.data.user, id: userId, role: (session.user as any).role || res.data.user.role, status: (session.user as any).status || res.data.user.status };
              localStorage.setItem('user', JSON.stringify(userData));
              setIsAlreadyLoggedIn(true);
            } catch (e) { console.error("Failed to sync user data in Login page", e); }
          }
        }
      }
    };

    const token = localStorage.getItem('token');
    
    if (token) {
      setIsAlreadyLoggedIn(true);
    } else if (sessionStatus === 'authenticated') {
      const sessionRole = (session?.user as any)?.role;
      if (sessionRole === 'BUSINESS') {
          router.push('/business/login');
      } else {
          setIsAlreadyLoggedIn(true);
          syncUser();
      }
    } else setIsAlreadyLoggedIn(false);

    const authError = searchParams.get('error');
    if (authError === 'AccessDenied' || authError === 'Configuration') {
      router.push('/auth/pending');
    }
  }, [sessionStatus, session, router, portal, searchParams]);

  const handleSignOut = async () => {
    clearPortalData('nurse');
    await signOut({ redirect: false });
    setIsAlreadyLoggedIn(false);
  };

  const handleGoogleSignIn = () => {
    clearPortalData('nurse');
    document.cookie = `next_auth_role=NURSE; path=/; max-age=300`;
    signIn('google', { callbackUrl: '/dashboard' });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', { email: email.trim(), password });
      const user = response.data.user;
      
      if (user.role === 'ADMIN') {
          sessionStorage.setItem('admin_session', 'true');
          sessionStorage.setItem('admin_token', response.data.access_token);
          router.push('/admin/dashboard');
          return;
      }

      if (user.role === 'BUSINESS') {
          router.push('/business/login');
          return;
      }

      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify({ ...user, status: user.status || 'APPROVED' }));
      router.push(user.isOnboarded ? '/dashboard' : '/onboarding');
    } catch (err: any) {
      const msg = err.response?.data?.message || '';
      if (msg.toLowerCase().includes('pending')) router.push('/auth/pending');
      else setError(msg || 'Login failed. Please check your credentials.');
    } finally { setLoading(false); }
  };

  const portalLabel = 'Nurse Portal';

  return (
    <div className="min-h-screen flex selection:bg-blue-100 selection:text-blue-900">
      {/* ── LEFT BRANDED PANEL ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-16 bg-blue-600">
        <div className="relative">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-white font-bold text-2xl tracking-tight">NurseFlex</span>
          </Link>
        </div>

        <div className="relative space-y-10">
          <div>
            <h1 className="text-5xl font-bold text-white leading-[1.1] tracking-tight max-w-lg">
                Find your next nursing role.
            </h1>
            <p className="mt-6 text-white/80 text-lg font-medium leading-relaxed max-w-md">
                Access exclusive nursing roles and work with premium facilities across the country.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 max-w-md">
            {[
              { value: '12K+', label: 'Verified Nurses' },
              { value: '500+', label: 'Hospitals' },
              { value: '24/7', label: 'Support' },
              { value: '98%', label: 'Match Rate' },
            ].map((s) => (
              <div key={s.label} className="group">
                <div className="text-3xl font-bold text-white group-hover:text-blue-100 transition-colors">{s.value}</div>
                <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mt-1 group-hover:text-white/70 transition-colors">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-6">
            <span className="text-white/40 text-xs font-bold tracking-widest uppercase">Trusted By</span>
            <div className="h-[1px] flex-1 bg-white/10"></div>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-tighter">© 2026 NurseFlex International</p>
        </div>
      </div>

      {/* ── RIGHT LOGIN FORM ── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white relative">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500"></div>
        
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link href="/" className="flex lg:hidden items-center gap-3 mb-10 justify-center">
            <span className="text-blue-600 font-bold text-xl tracking-tight">NurseFlex</span>
          </Link>

          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="p-0 mb-8 space-y-2">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold text-slate-900 tracking-tighter">
                  {isAlreadyLoggedIn ? 'Welcome back' : 'Sign in'}
                </CardTitle>
                <CardDescription className="text-slate-500 font-medium text-sm pt-1">
                  {isAlreadyLoggedIn
                    ? `Continue as ${session?.user?.email || 'Authenticated user'}`
                    : `Access your account.`}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {isAlreadyLoggedIn ? (
                <div className="space-y-3">
                  <Button
                    size="lg"
                    onClick={() => {
                        try {
                            const localUser = JSON.parse(localStorage.getItem('user') || '{}');
                            const sessionRole = (session?.user as any)?.role;
                            const role = sessionRole || localUser.role || 'NURSE';

                            if (role === 'BUSINESS') {
                                window.location.href = '/business/login';
                            } else {
                                const isOnboarded = (session?.user as any)?.isOnboarded || localUser.isOnboarded;
                                window.location.href = isOnboarded ? '/dashboard' : '/onboarding';
                            }
                        } catch (e) {
                            console.error("Redirect Error:", e);
                            setError("Unable to redirect. Please try again.");
                        }
                    }}
                    className="w-full py-6 text-base font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-none"
                  >
                    Continue to portal
                  </Button>
                  <Button variant="ghost" onClick={handleSignOut} className="w-full py-6 text-slate-500 font-bold rounded-xl hover:bg-slate-50 transition-all gap-2">
                    <LogOut size={18} /> Sign out
                  </Button>
                </div>
              ) : (
                <>
                  <form className="space-y-4" onSubmit={handleLogin}>
                    {error && (
                      <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-lg p-3 text-sm text-red-600">
                        <AlertCircle size={18} className="shrink-0" />
                        <span className="font-semibold">{error}</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-bold text-slate-700">Email address</Label>
                      <Input
                        id="email" type="email" required
                        className="h-12 border-slate-300 rounded-lg focus-visible:ring-blue-600 focus-visible:border-blue-600 transition-all font-medium"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="password" className="text-xs font-bold text-slate-700">Password</Label>
                        <Link href="/auth/forgot" className="text-xs font-bold text-blue-600 hover:underline">Forgot password?</Link>
                      </div>
                      <Input
                        id="password" type="password" required
                        className="h-12 border-slate-300 rounded-lg focus-visible:ring-blue-600 focus-visible:border-blue-600 transition-all font-medium"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>

                    <Button type="submit" size="lg" disabled={loading} className="w-full h-12 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-none">
                      {loading ? "Signing in..." : "Sign in"}
                    </Button>
                  </form>

                    <>
                      <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center">
                          <span className="bg-white px-4 text-xs font-bold text-slate-400">or</span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="lg"
                        onClick={handleGoogleSignIn}
                        className="w-full h-12 border-slate-300 rounded-lg font-bold bg-white hover:bg-slate-50 text-slate-700 transition-all"
                      >
                        Continue with Google
                      </Button>
                    </>
                </>
              )}
            </CardContent>

            <CardFooter className="p-0 mt-8 justify-center">
              <p className="text-sm font-medium text-slate-500">
                New to NurseFlex?{' '}
                <Link href="/auth/register" className="text-blue-600 font-bold hover:underline">
                  Create an account
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-blue-600" size={48} /></div>}>
      <LoginContent />
    </Suspense>
  );
}