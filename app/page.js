"use client";
import { useEffect, useState } from 'react';

export default function Home() {
  const [report, setReport] = useState({ status: 'loading', message: '' });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/security-report', { cache: 'no-store' });
        const data = await res.json();
        setReport(data);
      } catch (e) {
        setReport({ status: 'error', message: 'System Link Offline' });
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); 
    return () => clearInterval(interval);
  }, []);

  const isVulnerable = report.status === 'vulnerable';

  return (
    <main className={`min-h-screen flex items-center justify-center p-6 transition-all duration-1000 font-mono ${isVulnerable ? 'bg-red-950' : 'bg-slate-950'}`}>
      
      {/* Cyber Grid Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `linear-gradient(${isVulnerable ? '#ef4444' : '#10b981'} 1px, transparent 1px), linear-gradient(90deg, ${isVulnerable ? '#ef4444' : '#10b981'} 1px, transparent 1px)`, backgroundSize: '50px 50px' }}></div>

      {/* Main Glass Card */}
      <div className={`relative z-10 w-full max-w-2xl backdrop-blur-md bg-white/5 border-2 rounded-3xl p-8 shadow-2xl transition-all ${isVulnerable ? 'border-red-500 shadow-red-500/20' : 'border-emerald-500/50 shadow-emerald-500/20'}`}>
        
        {/* Header Status HUD */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-1">Secure Node</h2>
            <p className="text-white text-sm font-bold tracking-widest">ALPHA-GATE-01</p>
          </div>
          <div className="text-right">
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-1">Defense Status</h2>
            <p className={`text-sm font-black tracking-tighter ${isVulnerable ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
              {isVulnerable ? '● CRITICAL BREACH' : '● ACTIVE PROTECTION'}
            </p>
          </div>
        </div>

        {/* Central Visual */}
        <div className="flex flex-col items-center py-10">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center border-2 mb-6 transition-all ${isVulnerable ? 'border-red-500 bg-red-500/10' : 'border-emerald-500 bg-emerald-500/10'}`}>
            <span className="text-4xl">{isVulnerable ? '⚠️' : '🛡️'}</span>
          </div>
          <h1 className={`text-5xl font-black mb-2 text-center tracking-tighter ${isVulnerable ? 'text-white' : 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400'}`}>
            DEV<span className={isVulnerable ? 'text-red-500' : ''}>SEC</span>OPS
          </h1>
          <p className="text-white/60 text-center text-sm max-w-xs uppercase tracking-widest leading-relaxed">
            Automated Security Infrastructure for Next.js
          </p>
        </div>

        {/* Dynamic Alert Box */}
        <div className={`mt-8 p-4 rounded-xl border transition-all ${isVulnerable ? 'bg-red-500/20 border-red-500' : 'bg-emerald-500/5 border-emerald-500/30'}`}>
          <p className={`text-xs font-bold mb-1 ${isVulnerable ? 'text-red-400' : 'text-emerald-500'}`}>
            {isVulnerable ? 'ANALYSIS RESULT' : 'SYSTEM LOG'}
          </p>
          <p className="text-white text-sm italic">{report.message}</p>
          {isVulnerable && <p className="text-[10px] text-red-400/60 mt-2">TIMESTAMP: {report.timestamp}</p>}
        </div>

      </div>

      {/* Footer Cyber Decoration */}
      <div className="fixed bottom-6 text-[10px] text-white/20 uppercase tracking-[0.5em] flex gap-10">
        <span>Gitleaks: {isVulnerable ? 'FAIL' : 'PASS'}</span>
        <span>Snyk: {isVulnerable ? 'BLOCK' : 'PASS'}</span>
        <span>Sonar: VERIFIED</span>
      </div>
    </main>
  );
}