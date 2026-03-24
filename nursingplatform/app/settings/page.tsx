'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import SettingsLayout from '@/app/components/SettingsLayout';
import { Info, ExternalLink } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { clearAllUserData } from '@/lib/auth-utils';

export default function AccountSettingsPage() {
    const [userProfile, setUserProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/profile');
                setUserProfile(res.data);
            } catch (err) {
                console.error("Settings profile fetch error");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSignOut = async () => {
        // Wipe every localStorage key so next user starts clean
        clearAllUserData();
        await signOut({ callbackUrl: '/auth/login' });
    };

    return (
        <SettingsLayout title="Account settings">
            <div className="space-y-10">
                {/* Account Type */}
                <div className="flex items-center justify-between py-6 border-b border-slate-100 group">
                    <div>
                        <p className="text-sm font-bold text-slate-900 mb-1">Account type:</p>
                        <p className="text-slate-500 font-medium">Nurse / Caregiver</p>
                    </div>
                    <button className="text-blue-600 font-bold border border-blue-600 px-4 py-2 rounded-xl text-sm hover:bg-blue-50 transition-all text-nowrap">
                        Change account type
                    </button>
                </div>

                {/* Email */}
                <div className="flex items-center justify-between py-6 border-b border-slate-100">
                    <div>
                        <p className="text-sm font-bold text-slate-900 mb-1">Email</p>
                        <p className="text-slate-500 font-medium">{userProfile?.user?.email || (loading ? 'Loading...' : '')}</p>
                    </div>
                    <button className="text-blue-600 font-bold border border-blue-600 px-4 py-2 rounded-xl text-sm hover:bg-blue-50 transition-all text-nowrap">
                        Change email
                    </button>
                </div>

                {/* Phone */}
                <div className="flex items-center justify-between py-6 border-b border-slate-100">
                    <div>
                        <p className="text-sm font-bold text-slate-900 mb-1">Phone number</p>
                        <p className="text-slate-500 font-medium">{userProfile?.phoneNumber || '+92 324 5963808'}</p>
                    </div>
                    <button className="text-blue-600 font-bold border border-blue-600 px-4 py-2 rounded-xl text-sm hover:bg-blue-50 transition-all text-nowrap">
                        Change phone number
                    </button>
                </div>

                {/* Passkey */}
                <div className="flex items-center justify-between py-6 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900">Passkey</p>
                        <Info size={16} className="text-blue-600 cursor-pointer" />
                    </div>
                    <button className="text-blue-600 font-bold border border-blue-600 px-4 py-2 rounded-xl text-sm hover:bg-blue-50 transition-all text-nowrap">
                        Create passkey
                    </button>
                </div>

                {/* Social Accounts (Bottom Info) */}
                <div className="flex items-center justify-between py-6">
                    <p className="text-slate-500 font-medium text-sm truncate mr-4">{userProfile?.user?.email || ''}</p>
                    <button
                        onClick={handleSignOut}
                        className="text-blue-600 font-bold border border-blue-600 px-6 py-2 rounded-xl text-sm hover:bg-blue-50 transition-all text-nowrap"
                    >
                        Sign out
                    </button>
                </div>

                {/* Close Account */}
                <div className="pt-2 text-left">
                    <button className="text-rose-600 font-bold text-sm hover:underline flex items-center gap-1 group">
                        Close my account <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </div>
            </div>
        </SettingsLayout>
    );
}
