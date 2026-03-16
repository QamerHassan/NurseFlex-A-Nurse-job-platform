import Script from 'next/script';
import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function GoogleOneTap() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [debugMsg, setDebugMsg] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Suppress the noisy GSI_LOGGER FedCM AbortError
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const originalError = console.error;
      console.error = (...args: any[]) => {
        if (args[0] && typeof args[0] === 'string' && args[0].includes('[GSI_LOGGER]:') &&
          (args[0].includes('AbortError') || args[0].includes('NetworkError'))) {
          return;
        }
        originalError.apply(console, args);
      };

      return () => {
        console.error = originalError;
      };
    }
  }, []);

  const initializeOneTap = () => {
    const isBusinessPortal = pathname.startsWith('/business');
    const tokenKey = isBusinessPortal ? 'business_token' : 'token';
    const localToken = typeof window !== 'undefined' ? localStorage.getItem(tokenKey) : null;

    if (status === 'authenticated' || status === 'loading' || localToken) {
      if (localToken) console.log(`ℹ️ Google One Tap: Suppressed because ${tokenKey} exists in storage.`);
      return;
    }

    if (!window.google || !window.google.accounts) {
      console.warn('⚠️ Google One Tap: SDK not found');
      setDebugMsg('SDK not found');
      return;
    }

    async function handleCredentialResponse(response: any) {
      console.log(`✅ Google One Tap [${isBusinessPortal ? 'Business' : 'Nurse'}]: Credential received`);
      const role = isBusinessPortal ? 'BUSINESS' : 'NURSE';
      document.cookie = `next_auth_role=${role}; path=/; max-age=300`;

      try {
        const result = await signIn('google-one-tap', {
          credential: response.credential,
          redirect: false
        });

        if (result?.error) {
          console.error('❌ Google One Tap: Sign-in failed', result.error);
          setDebugMsg('Sign-in failed: ' + result.error);
        } else {
          console.log('✅ Google One Tap: Sign-in successful! Fetching profile...');

          try {
            // Fetch profile to get role and onboarding status
            const res = await api.get('/profile');
            const user = res.data.user;

            // Sync to localStorage as Backup
            const userKey = user.role === 'BUSINESS' ? 'business_user' : 'user';
            const googleIdKey = user.role === 'BUSINESS' ? 'business_x_google_user_id' : 'x-google-user-id';

            localStorage.setItem(userKey, JSON.stringify(user));
            localStorage.setItem(googleIdKey, user.id); // Fixed: Added this sync

            // Perform Role-Based Redirect
            if (user.role === 'BUSINESS') {
              router.push('/business/dashboard');
            } else {
              if (user.isOnboarded) {
                router.push('/dashboard');
              } else {
                router.push('/onboarding');
              }
            }
          } catch (profileErr) {
            console.warn('⚠️ Google One Tap: Profile fetch failed, falling back to reload', profileErr);
            window.location.reload();
          }
        }
      } catch (err) {
        console.error('❌ Google One Tap: Error during sign-in', err);
        setDebugMsg('Error during sign-in');
      }
    }

    try {
      console.log('🔍 Google One Tap: Initializing SDK...');
      setDebugMsg('Initializing...');
      
      // 🛠️ DEV BYPASS: Clear Google's "cool-down" state to show prompt more often during testing
      if (typeof document !== 'undefined') {
        document.cookie = 'g_state=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      }

      window.google.accounts.id.initialize({
        client_id: (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '466790197396-mo966f4e104ntbgcsvovf5u9aq8nd1jc.apps.googleusercontent.com').replace(/["']/g, '').trim(),
        callback: handleCredentialResponse,
        auto_select: false, // Changed to false to avoid aggressive cookie errors
        use_fedcm_for_prompt: false, // Absolutely MANDATORY to be FALSE for localhost visibility
        itp_support: true,
        context: 'use', // Stronger context prompt for the user
        cancel_on_tap_outside: false // Prevent accidental dismissal that triggers Google's cooldown!
      });

      // Show the prompt
      setTimeout(() => {
        console.log('✨ Google One Tap: Sending prompt command...');
        window.google.accounts.id.prompt((notification: any) => {
          const reason = notification.getNotDisplayedReason();
          const skipped = notification.getSkippedReason();

          if (notification.isNotDisplayed()) {
            console.warn('❌ One Tap Not Displayed. Reason:', reason);
            setDebugMsg(`Hidden: ${reason}`);
          } else if (notification.isSkippedMoment()) {
            console.warn('⚠️ One Tap Skipped. Reason:', skipped);
            setDebugMsg(`Skipped: ${skipped}`);
          } else {
            console.log('✅ One Tap Prompted Successfully');
            setDebugMsg('Prompt Successful');
          }
        });
      }, 1000); // 1s delay to ensure full script readiness
    } catch (e: any) {
      console.error('❌ Google One Tap Initialization Error:', e);
      setDebugMsg(`Init Error: ${e.message}`);
    }
  };

  useEffect(() => {
    if (!mounted || status === 'authenticated' || status === 'loading') return;

    const isBusinessPortal = pathname.startsWith('/business');
    const tokenKey = isBusinessPortal ? 'business_token' : 'token';
    const localToken = typeof window !== 'undefined' ? localStorage.getItem(tokenKey) : null;
    
    if (localToken) {
        setDebugMsg('Hidden: Logged in (local storage)');
        return;
    }

    // If script is already loaded by a previous mount or SSR, run initialize immediately
    if (window.google && window.google.accounts && window.google.accounts.id) {
        console.log('⚡ SDK already loaded, initializing immediately.');
        initializeOneTap();
    } else {
        // Manual script injection guarantees execution on every mount
        const scriptId = 'google-gsi-client';
        let script = document.getElementById(scriptId) as HTMLScriptElement;
        
        if (!script) {
            script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        }
        
        script.onload = initializeOneTap;
    }

    return () => {
        // We don't remove the script to avoid network spam, 
        // but we can cancel any pending prompts if needed
        if (window.google && window.google.accounts && window.google.accounts.id) {
            window.google.accounts.id.cancel();
        }
    };
  }, [mounted, status, pathname]);

  if (!mounted) return null;

  return (
    <>
      {/* Visual Debugger - Always visible during this test */}
      {debugMsg && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-md shadow-lg z-[9999] text-sm font-mono max-w-sm">
          <strong>Google Auth Debug:</strong><br/>
          {debugMsg}
        </div>
      )}
    </>
  );
}

// Add types for Google script
declare global {
  interface Window {
    google: any;
  }
}
