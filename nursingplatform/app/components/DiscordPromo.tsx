"use client";
import React from 'react';

export default function DiscordPromo() {
  return (
    <div className="bg-[#5865F2] rounded-[3rem] p-12 text-white relative overflow-hidden group shadow-2xl shadow-indigo-200/50">
      {/* Background Decorative Circles */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-md">
          <span className="bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Community Hub</span>
          <h2 className="text-4xl font-black italic tracking-tighter mt-4 mb-4 uppercase">Join the NurseFlex Squad</h2>
          <p className="font-bold text-indigo-100 leading-relaxed">
            Nurses se connect karein, shift tips share karein aur exclusive job alerts sab se pehle payein. 
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex -space-x-4 mb-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-12 h-12 rounded-2xl bg-indigo-400 border-4 border-[#5865F2] flex items-center justify-center font-black text-xs">
                {i === 4 ? "+2k" : "👤"}
              </div>
            ))}
          </div>
          <a 
            href="https://discord.gg/your-invite-link" 
            target="_blank"
            className="bg-white text-[#5865F2] px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10"
          >
            Connect to Discord 💬
          </a>
        </div>
      </div>
    </div>
  );
}