import React from 'react';

export const NurseVerificationEmail = ({ nurseName }: { nurseName: string }) => (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f0f9ff', padding: '40px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '32px', padding: '40px', textAlign: 'center', border: '1px solid #e0f2fe' }}>
            <div style={{
                backgroundColor: '#2563eb',
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                margin: '0 auto 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '28px',
                fontWeight: 'bold'
            }}>
                NF
            </div>
            <h1 style={{ color: '#0f172a', fontSize: '32px', fontWeight: '900', margin: '0 0 16px', letterSpacing: '-1px' }}>
                You're Verified! 🎉
            </h1>
            <p style={{ color: '#475569', fontSize: '18px', lineHeight: '28px', margin: '0 0 32px', fontWeight: '500' }}>
                Hi <strong>{nurseName}</strong>, great news! Your professional nurse profile has been reviewed and verified by the NurseFlex team.
            </p>

            <div style={{ textAlign: 'left', backgroundColor: '#f8fafc', borderRadius: '24px', padding: '24px', marginBottom: '32px', border: '1px solid #f1f5f9' }}>
                <h3 style={{ margin: '0 0 12px', color: '#1e293b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '900' }}>What's New:</h3>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', color: '#64748b', fontSize: '15px' }}>
                    <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>✅ <strong>Verified Badge</strong> now active on your profile</li>
                    <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>✅ Higher visibility to premium healthcare employers</li>
                    <li style={{ marginBottom: '0', display: 'flex', alignItems: 'center', gap: '8px' }}>✅ Direct resume sharing enabled for staffing partners</li>
                </ul>
            </div>

            <a href="http://127.0.0.1:3000/profile" style={{
                display: 'inline-block',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                padding: '20px 40px',
                borderRadius: '16px',
                fontWeight: '900',
                textDecoration: 'none',
                fontSize: '16px',
                boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.2)'
            }}>
                View Your Verified Profile
            </a>

            <p style={{ marginTop: '32px', color: '#94a3b8', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                © 2026 NurseFlex Community. All rights reserved.
            </p>
        </div>
    </div>
);
