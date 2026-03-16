import axios from 'axios';
import { getSession } from 'next-auth/react';
import { clearAllUserData } from './auth-utils';

// Backend ka base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Request Interceptor ---
api.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    const isBusinessPortal = window.location.pathname.startsWith('/business');
    const tokenKey = isBusinessPortal ? 'business_token' : 'token';
    const googleIdKey = isBusinessPortal ? 'business_x_google_user_id' : 'x-google-user-id';

    console.log(`🌐 API: Requesting ${config.url} [Portal: ${isBusinessPortal ? 'Business' : 'Nurse/Main'}]`);
    
    // 1. Check for Bearer token FIRST
    const token = localStorage.getItem(tokenKey);
    if (token && token !== 'null' && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`🌐 API: Using Bearer Token from ${tokenKey}`);
      return config;
    }

    // 2. [LOCKED] Check portal-specific Google ID SECOND (Prioritize storage over shared cookie)
    const backupGoogleId = localStorage.getItem(googleIdKey);
    if (backupGoogleId && backupGoogleId !== 'null' && backupGoogleId !== 'undefined') {
      config.headers['x-google-user-id'] = backupGoogleId;
      console.log(`🌐 API: Using LOCKED Google ID from ${googleIdKey}:`, backupGoogleId);
      return config;
    }

    // 3. [FALLBACK] Check for NextAuth session (Google Login) THIRD
    // Only fetch session if we absolutely have no other credentials
    if (!token && (!backupGoogleId || backupGoogleId === 'null' || backupGoogleId === 'undefined')) {
      try {
        const session = await getSession();
        if (session && session.user && (session.user as any).id) {
          config.headers['x-google-user-id'] = (session.user as any).id;
          console.log("🌐 API: Using Falling-back to Google Session Cookie:", (session.user as any).id);
          return config;
        }
      } catch (e) {
        console.error("🌐 API: Session check failed", e);
      }
    }

    console.warn("🌐 API: No auth found for request to", config.url);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- Response Interceptor ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginPage = typeof window !== 'undefined' && window.location.pathname.includes('/auth/login');
    
    if (error.response?.status === 401 && !isLoginPage) {
      const authHeader = error.config.headers['Authorization'];
      const googleHeader = error.config.headers['x-google-user-id'];
      
      console.error("🚫 API: 401 Error detected", { 
        url: error.config.url,
        hasAuth: !!authHeader,
        hasGoogle: !!googleHeader
      });

      // Redirect only if NO authentication was sent, or if it's a specific "expired" scenario
      // If we SENT a header and still got 401, it's a backend/secret issue
      if (!authHeader && !googleHeader) {
        console.warn("🚫 API: No credentials sent. Redirecting to login...");
        if (typeof window !== 'undefined') {
          // Check if we are already transitioning or trying to fetch NextAuth /api/auth endpoints
          if (!window.location.pathname.startsWith('/api/auth') && !window.location.search.includes('error=')) {
            const isBusinessPortal = window.location.pathname.startsWith('/business');
            window.location.href = `/auth/login?error=SessionExpired&portal=${isBusinessPortal ? 'business' : 'nurse'}`;
          }
        }
      } else {
        console.warn("🚫 API: 401 received despite sending credentials. Backend may have rejected them.");
      }
    }
    return Promise.reject(error);
  }
);

export default api;