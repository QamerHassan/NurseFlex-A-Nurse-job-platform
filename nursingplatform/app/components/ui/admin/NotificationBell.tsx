"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function NotificationBell() {
  const [count, setCount] = useState(1); // Mock notification count

  return (
    <Link href="/admin/approvals" className="relative p-2 hover:bg-slate-100 rounded-full transition-all group">
      <span className="text-xl">🔔</span>
      {count > 0 && (
        <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
          {count}
        </span>
      )}
      {/* Tooltip */}
      <div className="absolute top-12 right-0 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        New PDF Approval Pending
      </div>
    </Link>
  );
}