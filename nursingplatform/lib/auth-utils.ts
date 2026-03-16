/**
 * Clears ALL user-related data from localStorage.
 * Call this on every logout to prevent data leaking to the next user.
 */
export const ALL_USER_STORAGE_KEYS = [
    // Nurse / general user
    'token',
    'user',
    'nurseName',
    'uploadedResumeName',
    'uploadedResumeUrl',
    // Recent search history (dashboard)
    'nurseflex_recent_titles',
    'nurseflex_recent_locations',
    // Business / employer
    'business_token',
    'hospital_token',
    'business_user',
    'business_x_google_user_id',
    'userType',
    'pending_business_approvals',
    'active_business_accounts',
    'verified_nurses',
    // Any other ad-hoc keys
    'onboarding_complete',
    'x-google-user-id',
];

export function clearPortalData(portal: 'business' | 'nurse'): void {
    if (typeof window === 'undefined') return;
    const keys = portal === 'business' 
        ? ['business_token', 'business_user', 'business_x_google_user_id']
        : ['token', 'user', 'x-google-user-id', 'nurseName', 'uploadedResumeName', 'uploadedResumeUrl'];
    
    keys.forEach(key => localStorage.removeItem(key));
}

export function clearAllUserData(): void {
    if (typeof window === 'undefined') return;
    ALL_USER_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
}
