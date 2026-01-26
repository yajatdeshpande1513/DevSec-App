"use client";
import { useEffect, useState } from 'react';

export default function Home() {
  const [report, setReport] = useState({ status: 'loading', message: '' });
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/security-report', { cache: 'no-store' });
        const data = await res.json();
        setReport(data);
        if (data.status === 'vulnerable') setGlitch(true);
      } catch (e) {
        setReport({ status: 'error', message: 'Offline' });
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Fast polling for demo
    return () => clearInterval(interval);
  }, []);

  const isVulnerable = report.status === 'vulnerable';

  return (
    <main className={`flex min-h-screen flex-col items-center justify-center p-6 transition-all duration-1000 ${isVulnerable ? 'bg-red-950 text-red-200' : 'bg-slate-950 text-emerald-400'} font-mono overflow-hidden`}>
      
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      {/* Cyber Alert Banner */}
      {isVulnerable && (
        <div className="fixed top-0 w-full bg-red-600/90 backdrop-blur-md text-white py-3 text-center animate-bounce z-50 border-b-2 border-red-400 shadow-[0_0_20px_rgba(220,38,38,0.5)]">
          <span className="text-xl font-black uppercase tracking-widest">⚠️ SECURITY BREACH DETECTED ⚠️</span>
        </div>
      )}

      {/* Status HUD */}
      <div className="z-10 w-full max-w-4xl backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-2xl shadow-2xl">
        <div className="flex justify-between items-center border-b border-white/10 pb-6 mb-8">
          <div>
            <h2 className="text-xs uppercase tracking-[0.3em] opacity-50 mb-1">System Node</h2>
            <p className="text-lg">GATEKEEPER-ALPHA-01</p>
          </div>
          <div className="text-right">
            <h2 className="text-xs uppercase tracking-[0.3em] opacity-50 mb-1">Status</h2>
            <p className={`text-lg font-bold ${isVulnerable ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
              {isVulnerable ? '● COMPROMISED' : '● SECURE'}
            </p>
          </div>
        </div>

        {/* Interactive Centerpiece */}
        <div className="relative flex flex-col items-center py-12">
          <div className={`absolute -inset-10 rounded-full blur-3xl opacity-20 ${isVulnerable ? 'bg-red-600' : 'bg-emerald-500'}`}></div>
          <h1 className={`text-5xl md:text-7xl font-black text-center mb-4 transition-all ${glitch ? 'animate-pulse' : ''}`}>
            DEV<span className={isVulnerable ? 'text-red-600' : 'text-emerald-500'}>SEC</span>OPS
          </h1>
          <p className="text-center max-w-md opacity-70 leading-relaxed">
            Real-time automated security gates for Next.js applications using Gitleaks, Snyk, and SonarQube.
          </p>
        </div>

        {/* Scan Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {['SAST', 'SCA', 'IaC'].map((tech) => (
            <div key={tech} className="bg-white/5 border border-white/10 p-4 rounded-lg hover:bg-white/10 transition-colors cursor-crosshair group">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold opacity-60">{tech}</span>
                <div className={`h-2 w-2 rounded-full ${isVulnerable ? 'bg-red-500' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`}></div>
              </div>
              <p className="text-sm">Scan {isVulnerable ? 'Blocked' : 'Verified'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <footer className="mt-12 text-[10px] opacity-40 flex gap-8 uppercase tracking-widest">
        <span>Build: 2026.01.26</span>
        <span>Node: 20.x Alpine</span>
        <span>Environment: Hardened</span>
      </footer>

      {/* Add hidden secret for Gitleaks Testing */}
      const SECRET = "***REMOVED***"
    </main>
  );
}