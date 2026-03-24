import axios from 'axios';
import { getSession } from 'next-auth/react';

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
    const searchParams = new URLSearchParams(window.location.search);
    const portalParam = searchParams.get('portal');
    const isBusinessPortal = window.location.pathname.startsWith('/business') || portalParam === 'business';
    const isPublicAuthRoute = ['/auth/login', '/auth/register', '/business/login', '/business/register'].some(p => window.location.pathname.startsWith(p));
    
    const tokenKey = isBusinessPortal ? 'business_token' : 'token';
    const googleIdKey = isBusinessPortal ? 'business_x_google_user_id' : 'x-google-user-id';

    console.log(`🌐 API: [${isBusinessPortal ? 'BUSINESS' : 'NURSE'}] Requesting ${config.url} | PortalParam: ${portalParam} | Path: ${window.location.pathname}`);
    
    // Skip auth headers for public registration/login routes to avoid 403s from stale data
    if (isPublicAuthRoute && config.method === 'post') {
      console.log('🌐 API: Public Auth Route - Skipping auth headers');
      return config;
    }
    
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
    if (!token && (!backupGoogleId || backupGoogleId === 'null' || backupGoogleId === 'undefined')) {
      try {
        const session = await getSession();
        if (session && session.user && (session.user as any).id) {
          config.headers['x-google-user-id'] = (session.user as any).id;
          return config;
        }
      } catch (e) {
        console.error("🌐 API: Session check failed", e);
      }
    }

    // 4. [ADMIN BYPASS] Check for admin_token LAST if on admin route
    if (window.location.pathname.startsWith('/admin')) {
      const adminToken = sessionStorage.getItem('admin_token');
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
        console.log(`🌐 API: Using Admin Bypass Token`);
        return config;
      }
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- Response Interceptor ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthError = error.response?.status === 401 || error.response?.status === 403;
    if (isAuthError && typeof window !== 'undefined') {
        const path = window.location.pathname;
        const isLoginPage = path.includes('/auth/login') || path.includes('/business/login');
        const isAdminRoute = path.startsWith('/admin');

        if (!isLoginPage && !isAdminRoute) {
            const isBusinessPortal = path.startsWith('/business');
            if (isBusinessPortal) {
                window.location.href = '/business/login';
            } else {
                window.location.href = `/auth/login?portal=nurse`;
            }
        }
    }
    return Promise.reject(error);
  }
);

export default api;