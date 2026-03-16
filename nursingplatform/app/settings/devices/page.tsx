'use client';
import SettingsLayout from '@/app/components/SettingsLayout';

export default function DeviceManagementPage() {
    const sessions = [
        { device: 'Chrome Windows', date: 'March 6, 2026', ip: '223.123.72.6 Lahore', current: true }
    ];

    return (
        <SettingsLayout title="Device management">
            <div className="space-y-8">
                <p className="text-slate-500 font-medium text-sm">
                    You are currently signed into your NurseFlex account on these devices.
                </p>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 italic text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                <th className="pb-4 pt-2">Device</th>
                                <th className="pb-4 pt-2">Date Logged In</th>
                                <th className="pb-4 pt-2">IP Address</th>
                                <th className="pb-4 pt-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.map((session, idx) => (
                                <tr key={idx} className="border-b border-slate-50 group hover:bg-slate-50 transition-all">
                                    <td className="py-6 font-bold text-slate-700">{session.device}</td>
                                    <td className="py-6 text-slate-500 font-medium">{session.date}</td>
                                    <td className="py-6 text-slate-500 font-medium">{session.ip}</td>
                                    <td className="py-6 italic text-slate-400 font-bold">
                                        {session.current ? 'This device' : <button className="text-blue-600 hover:underline">Sign out</button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </SettingsLayout>
    );
}
