import React from 'react';
import LoginForm from './LoginForm';

export default function BusinessLogin({ searchParams }: { searchParams: { callbackUrl?: string } }) {
  const callbackUrl = searchParams.callbackUrl || '/business/dashboard';

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
      <LoginForm callbackUrl={callbackUrl} />
    </div>
  );
}
