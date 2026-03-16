'use client';
import { useState } from 'react';
import SettingsLayout from '@/app/components/SettingsLayout';
import { ChevronRight } from 'lucide-react';

export default function CommunicationsSettingsPage() {
    const [onlineStatus, setOnlineStatus] = useState(true);
    const [readReceipts, setReadReceipts] = useState(true);

    return (
        <SettingsLayout title="Communications settings">
            <div className="space-y-10">
                <div className="flex items-center justify-between py-6 border-b border-slate-100 group cursor-pointer hover:bg-slate-50 px-2 rounded-xl transition-all">
                    <p className="font-bold text-slate-900">Email</p>
                    <ChevronRight size={20} className="text-slate-400" />
                </div>

                <div className="py-6 border-b border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-slate-900">Show online status</p>
                        <button
                            onClick={() => setOnlineStatus(!onlineStatus)}
                            className={`w-12 h-6 rounded-full transition-all relative ${onlineStatus ? 'bg-blue-600' : 'bg-slate-300'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${onlineStatus ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                        Show people you message when you are on NurseFlex. When this is off, people you message will not see your online status, and you will not be able to see theirs.
                    </p>
                </div>

                <div className="py-6 border-b border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-slate-900">Show read receipts</p>
                        <button
                            onClick={() => setReadReceipts(!readReceipts)}
                            className={`w-12 h-6 rounded-full transition-all relative ${readReceipts ? 'bg-blue-600' : 'bg-slate-300'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${readReceipts ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                        Show people when you've read their message. When this is off, people won't see when you've read their messages, and you won't see when they've read yours.
                    </p>
                </div>
            </div>
        </SettingsLayout>
    );
}
