'use client';
import SettingsLayout from '@/app/components/SettingsLayout';
import Link from 'next/link';

export default function PrivacySettingsPage() {
    return (
        <SettingsLayout title="Privacy settings">
            <div className="space-y-12">
                <section>
                    <h3 className="text-xl font-bold mb-4">Types of data collected</h3>
                    <p className="text-slate-600 font-medium leading-relaxed text-sm">
                        We collect different types of data depending on how you interact with us. This includes, for example, when you're on our site, responding to our promotional materials, and using our services to help you find a job. For example, we may collect your email address and resume information when you create your account. As another example, we may collect information about your activity on our site, such as the searches you conduct and jobs you apply to. For more information on the types of data we collect, check out the <Link href="#" className="text-pink-600 underline">"Data collection and use"</Link> section of our Privacy Policy.
                    </p>
                </section>

                <section>
                    <h3 className="text-xl font-bold mb-4">How my data is used and disclosed</h3>
                    <p className="text-slate-600 font-medium leading-relaxed text-sm">
                        NurseFlex uses data to help people get jobs. How we use and disclose your data also depends on how you use our site. We go into much greater detail in the <Link href="#" className="text-pink-600 underline">"Data collection and use"</Link> and <Link href="#" className="text-pink-600 underline">"Who we share your data with"</Link> sections of our Privacy Policy explaining our use and disclosure of your data, but this can include to provide our services to you, to protect you when you use our site, and to measure, improve, and promote our services.
                    </p>
                </section>

                <section className="space-y-6">
                    <div className="border-t border-slate-100 pt-8">
                        <h4 className="font-bold text-lg mb-2">Cookies</h4>
                        <p className="text-slate-500 text-sm italic">
                            Our Cookie Policy explains how we use cookies, web beacons and similar technologies, including some offered by third-parties, to collect data about you. For more information about our use of these technologies and your ability to opt-out of them, please check out our <Link href="#" className="text-pink-600 underline">Cookie Policy</Link>.
                        </p>
                    </div>

                    <div className="border-t border-slate-100 pt-8">
                        <h4 className="font-bold text-lg mb-2">Accessing and Deleting My Data</h4>
                        <p className="text-slate-500 text-sm italic">
                            NurseFlex offers all of its users rights to access and delete their data, as detailed in the <Link href="#" className="text-pink-600 underline">"Your personal data rights"</Link> section of our Privacy Policy. To access or delete your data held by NurseFlex, just fill out this <Link href="#" className="text-pink-600 underline">personal data request form</Link>.
                        </p>
                    </div>

                    <div className="border-t border-slate-100 pt-8">
                        <h4 className="font-bold text-lg mb-2">Make My Resume Hidden</h4>
                        <p className="text-slate-500 text-sm italic">
                            You can also set your NurseFlex Resume to "not searchable" by visiting your <Link href="#" className="text-pink-600 underline">resume privacy settings</Link>. For more information on what it means to have a "searchable" or "not searchable" NurseFlex Resume, please visit the <Link href="#" className="text-pink-600 underline">"Data collection and use"</Link> section of our Privacy Policy.
                        </p>
                    </div>
                </section>
            </div>
        </SettingsLayout>
    );
}
