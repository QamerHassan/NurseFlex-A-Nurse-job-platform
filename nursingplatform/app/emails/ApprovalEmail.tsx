import React from 'react';

export const ApprovalEmail = ({ businessName }: { businessName: string }) => (
  <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f8fafc', padding: '40px' }}>
    <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '24px', padding: '40px', textAlign: 'center' }}>
      <div style={{ 
        backgroundColor: '#4f46e5', 
        width: '60px', 
        height: '60px', 
        borderRadius: '16px', 
        margin: '0 auto 24px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', // Fixed from justifyCenter
        color: 'white', 
        fontSize: '24px', 
        fontWeight: 'bold' 
      }}>
        N
      </div>
      <h1 style={{ color: '#0f172a', fontSize: '28px', fontWeight: '900', margin: '0 0 16px' }}>
        Welcome to NurseFlex!
      </h1>
      <p style={{ color: '#64748b', fontSize: '16px', lineHeight: '24px', margin: '0 0 32px' }}>
        Hi <strong>{businessName}</strong>, your account has been verified and approved by our administration team. You now have full access to the Professional Tier features.
      </p>
      
      <div style={{ textAlign: 'left', backgroundColor: '#f1f5f9', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ margin: '0 0 12px', color: '#1e293b', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Next Steps:</h3>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', color: '#475569', fontSize: '14px' }}>
          <li style={{ marginBottom: '8px' }}>✅ Post your first nursing shift</li>
          <li style={{ marginBottom: '8px' }}>✅ Browse qualified nurse profiles</li>
          <li style={{ marginBottom: '0' }}>✅ Sync your listings with Discord</li>
        </ul>
      </div>

      <a href="http://127.0.0.1:3000/business/dashboard" style={{ 
        display: 'inline-block', 
        backgroundColor: '#4f46e5', 
        color: '#ffffff', 
        padding: '16px 32px', 
        borderRadius: '12px', 
        fontWeight: 'bold', 
        textDecoration: 'none'
      }}>
        Go to Business Dashboard
      </a>
    </div>
  </div>
);