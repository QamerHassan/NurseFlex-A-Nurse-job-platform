import React, { useEffect, useState, useRef } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function GoogleOneTap() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const initialized = useRef(false);
  const promptTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clientId = (
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    '466790197396-mo966f4e104ntbgcsvovf5u9aq8nd1jc.apps.googleusercontent.com'
  ).replace(/["']/g, '').trim();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCredentialResponse = async (response: any) => {
    console.log("✅ Google One Tap credential received");
    const isBusinessPortal = pathname.startsWith('/business');
    const role = isBusinessPortal ? 'BUSINESS' : 'NURSE';
    document.cookie = `next_auth_role=${role}; path=/; max-age=300`;

    try {
      const result = await signIn('google-one-tap', {
        credential: response.credential,
        redirect: false,
      });

      if (!result?.error) {
        const res = await api.get('/profile');
        const user = res.data.user;
        const userKey = user.role === 'BUSINESS' ? 'business_user' : 'user';
        const googleIdKey = user.role === 'BUSINESS' ? 'business_x_google_user_id' : 'x-google-user-id';
        localStorage.setItem(userKey, JSON.stringify(user));
        localStorage.setItem(googleIdKey, user.id);
        if (user.role === 'BUSINESS') router.push('/business/dashboard');
        else router.push(user.isOnboarded ? '/dashboard' : '/onboarding');
      }
    } catch (err) {
      console.error('❌ Google One Tap Auth Error:', err);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).handleGoogleResponse = handleCredentialResponse;
    }
  }, [pathname]);

  useEffect(() => {
    if (!mounted || status === 'authenticated' || status === 'loading') return;

    const isNursePortal =
      (pathname === '/' || pathname.startsWith('/auth')) &&
      !pathname.startsWith('/business') &&
      !pathname.startsWith('/jobs'); // Disable auto-prompt on jobs page per user request

    if (!isNursePortal) return;

    initialized.current = false;

    const runInit = () => {
      if (!window.google?.accounts?.id || initialized.current) return;
      initialized.current = true;

      console.log("🔍 Google One Tap: Initializing...");

      // Clear Google's cooldown suppression cookie
      document.cookie = 'g_state=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

      window.google.accounts.id.cancel();

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        // Keep FedCM OFF — classic iframe-based One Tap popup
        use_fedcm_for_prompt: false,
        itp_support: true,
        auto_select: false,
        cancel_on_tap_outside: false,
        context: 'signin',
      });

      promptTimeout.current = setTimeout(() => {
        window.google.accounts.id.prompt((notification: any) => {
          const reason = notification.isNotDisplayed()
            ? `not displayed — ${notification.getNotDisplayedReason()}`
            : notification.isSkippedMoment()
              ? `skipped — ${notification.getSkippedReason()}`
              : 'displayed ✅';
          console.log("📢 One Tap status:", reason);
        });
      }, 800);
    };

    const interval = setInterval(() => {
      if (window.google?.accounts?.id) {
        clearInterval(interval);
        runInit();
      }
    }, 300);

    return () => {
      clearInterval(interval);
      if (promptTimeout.current) clearTimeout(promptTimeout.current);
    };
  }, [mounted, status, pathname]);

  if (!mounted) return null;
  return null;
}

declare global {
  interface Window { google: any; handleGoogleResponse: any; }
}