import React from 'react';
import { getServerSession } from "next-auth/next";
import { redirect } from 'next/navigation';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import HubLayoutClient from './HubLayoutClient';

export default async function BusinessLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions) as any;

  if (!session || session.user?.role !== 'BUSINESS') {
    console.log("🚫 BusinessLayout: No session or wrong role. Redirecting to login.", { 
      hasSession: !!session, 
      role: session?.user?.role 
    });
    redirect('/business/login');
  }

  // Handle pending status on the server
  if (session.user?.status === 'PENDING') {
    redirect('/auth/pending');
  }

  if (session.user?.status === 'REJECTED') {
    redirect('/auth/pending');
  }

  return (
    <HubLayoutClient initialUser={session.user}>
      {children}
    </HubLayoutClient>
  );
}