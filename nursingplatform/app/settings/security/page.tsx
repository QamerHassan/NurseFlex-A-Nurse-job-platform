'use client';
import SettingsLayout from '@/app/components/SettingsLayout';

export default function SecuritySettingsPage() {
    return (
        <SettingsLayout title="Security settings">
            <div className="space-y-12">
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <h3 className="text-lg font-bold">Account protection</h3>
                        <span className="bg-pink-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter">New</span>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group cursor-pointer hover:bg-slate-100 transition-all">
                        <p className="text-sm font-bold text-slate-700">2-Step Verification</p>
                        <button className="text-pink-600 font-bold text-sm">Set up</button>
                    </div>
                </section>

                <section>
                    <h3 className="text-lg font-bold mb-6">Third-party apps</h3>
                    <div className="py-8 border-t border-b border-slate-100">
                        <p className="text-slate-500 font-medium text-sm">No third-party applications have access to your account</p>
                    </div>
                </section>
            </div>
        </SettingsLayout>
    );
}
