"use client";
import { useEffect, useState } from 'react';

const TOOLS = [
  { key: 'gitleaks', label: 'Gitleaks', icon: '🔑', desc: 'Secret Scanning' },
  { key: 'sonarqube', label: 'SonarQube', icon: '🔍', desc: 'Static Analysis (SAST)' },
  { key: 'snyk', label: 'Snyk', icon: '📦', desc: 'Dependency Scanning' },
  { key: 'trivy', label: 'Trivy', icon: '🐳', desc: 'Container Image Scan' },
  { key: 'checkov', label: 'Checkov', icon: '🏗️', desc: 'Infra-as-Code Scan' },
];

function gateStyle(outcome) {
  switch (outcome) {
    case 'success':
      return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', label: 'PASS', dot: 'bg-emerald-400' };
    case 'failure':
      return { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/40', label: 'FAIL', dot: 'bg-red-400 animate-pulse' };
    case 'skipped':
      return { color: 'text-slate-500', bg: 'bg-slate-500/5', border: 'border-slate-600/30', label: 'SKIPPED', dot: 'bg-slate-500' };
    default:
      return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/40', label: 'PENDING', dot: 'bg-amber-400 animate-pulse' };
  }
}

export default function Home() {
  const [report, setReport] = useState({ status: 'loading', message: '', gates: {} });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/security-report', { cache: 'no-store' });
        const data = await res.json();
        setReport(data);
      } catch (e) {
        setReport({ status: 'error', message: 'System Link Offline', gates: {} });
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const isVulnerable = report.status === 'vulnerable';
  const isLoading = report.status === 'loading';
  const isError = report.status === 'error';
  const gates = report.gates || {};

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-slate-950 font-mono relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900 via-slate-950 to-slate-950"></div>
        <div className="flex flex-col items-center gap-6 relative z-10">
          <div className="w-12 h-12 border-4 border-slate-800 border-t-emerald-400 rounded-full animate-spin drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
          <p className="text-emerald-400/80 text-xs uppercase tracking-[0.4em] animate-pulse">Initializing Secure Uplink...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-1000 font-mono relative overflow-hidden ${isVulnerable ? 'bg-red-950' : isError ? 'bg-slate-900' : 'bg-slate-950'}`}>

      {/* Dynamic Background Effects */}
      <div className={`absolute inset-0 opacity-30 pointer-events-none transition-opacity duration-1000 bg-[radial-gradient(circle_at_50%_0%,_var(--tw-gradient-stops))] ${isVulnerable ? 'from-red-900 via-red-950 to-slate-950' : isError ? 'from-amber-900 via-slate-900 to-slate-950' : 'from-emerald-900 via-slate-950 to-slate-950'}`}></div>
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `linear-gradient(${isVulnerable ? '#ef4444' : isError ? '#f59e0b' : '#10b981'} 1px, transparent 1px), linear-gradient(90deg, ${isVulnerable ? '#ef4444' : isError ? '#f59e0b' : '#10b981'} 1px, transparent 1px)`, backgroundSize: '50px 50px' }}></div>

      <div className={`relative z-10 w-full max-w-4xl backdrop-blur-xl bg-slate-900/40 border rounded-[2rem] p-8 md:p-12 shadow-2xl transition-all duration-700 ${isVulnerable ? 'border-red-500/50 shadow-red-900/50' : isError ? 'border-amber-500/30 shadow-amber-900/30' : 'border-emerald-500/30 shadow-emerald-900/40 hover:shadow-emerald-900/60 hover:border-emerald-500/50'}`}>
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-2 h-12 rounded-full ${isVulnerable ? 'bg-red-500' : isError ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
            <div>
              <h2 className="text-[10px] uppercase tracking-[0.4em] text-slate-400 mb-1">Secure Operations Node</h2>
              <p className="text-white text-lg font-bold tracking-widest">ALPHA-GATE-01</p>
            </div>
          </div>
          <div className="text-left md:text-right bg-black/40 px-6 py-3 rounded-xl border border-white/5">
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-slate-400 mb-1">Defense Status</h2>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${isVulnerable ? 'bg-red-500' : isError ? 'bg-amber-400' : 'bg-emerald-400'}`}></div>
              <p className={`text-sm font-black tracking-tighter ${isVulnerable ? 'text-red-400' : isError ? 'text-amber-400' : 'text-emerald-400'}`}>
                {isVulnerable ? 'CRITICAL BREACH DETECTED' : isError ? 'CONNECTION LOST' : 'SYSTEM SECURE'}
              </p>
            </div>
          </div>
        </div>

        {/* Main Status */}
        <div className="flex flex-col items-center py-8 mb-4 relative">
          <div className={`absolute w-32 h-32 rounded-full blur-3xl opacity-20 ${isVulnerable ? 'bg-red-500' : isError ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
          <div className={`w-24 h-24 rounded-full flex items-center justify-center border-2 mb-6 transition-all duration-500 relative z-10 ${isVulnerable ? 'border-red-500 bg-red-950/50 shadow-[0_0_30px_rgba(239,68,68,0.3)]' : isError ? 'border-amber-500 bg-amber-950/50' : 'border-emerald-500 bg-emerald-950/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]'}`}>
            <span className="text-4xl">{isVulnerable ? '⚠️' : isError ? '📡' : '🛡️'}</span>
          </div>
          <h1 className={`text-5xl md:text-6xl font-black mb-3 text-center tracking-tighter relative z-10 ${isVulnerable || isError ? 'text-white' : 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400'}`}>
            DEV<span className={isVulnerable ? 'text-red-500' : isError ? 'text-amber-500' : ''}>SEC</span>OPS
          </h1>
          <p className="text-slate-400 text-sm tracking-widest uppercase">Continuous Security Pipeline</p>
        </div>

        {/* Per-Tool Status Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-8 relative z-10">
          {TOOLS.map((tool) => {
            const outcome = gates[tool.key];
            const style = gateStyle(outcome);
            return (
              <div
                key={tool.key}
                className={`group relative flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 cursor-default bg-slate-900/50 hover:bg-slate-800/80 ${style.border} ${outcome === 'success' ? 'hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]' : ''}`}
              >
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${style.bg}`}></div>
                <span className="text-3xl filter drop-shadow-md relative z-10">{tool.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 relative z-10">{tool.label}</span>
                <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full relative z-10">
                  <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                  <span className={`text-[9px] font-black uppercase tracking-tight ${style.color}`}>{style.label}</span>
                </div>
                {/* Tooltip */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-800 text-slate-200 text-[10px] px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-xl border border-slate-700 z-50 transform group-hover:-translate-y-1">
                  {tool.desc}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 border-b border-r border-slate-700 transform rotate-45"></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={`mt-10 p-5 rounded-2xl border transition-all duration-500 flex items-start gap-4 ${isVulnerable ? 'bg-red-950/40 border-red-500/50' : isError ? 'bg-amber-950/30 border-amber-500/30' : 'bg-emerald-950/20 border-emerald-500/20'}`}>
          <div className="mt-1">
            <div className={`w-2 h-2 rounded-full animate-pulse ${isVulnerable ? 'bg-red-500' : isError ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
          </div>
          <div>
            <p className={`text-xs font-bold mb-1 uppercase tracking-widest ${isVulnerable ? 'text-red-400' : isError ? 'text-amber-400' : 'text-emerald-500'}`}>
              {isVulnerable ? 'CRITICAL ALERT' : isError ? 'SYSTEM WARNING' : 'LATEST SECURE LOG'}
            </p>
            <p className="text-slate-300 text-sm font-light leading-relaxed">{report.message}</p>
          </div>
        </div>

      </div>

      <div className="mt-8 flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity">
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
        <div className="text-[10px] text-slate-400 uppercase tracking-[0.4em]">
          Live pipeline mirror — auto-sync active
        </div>
      </div>
    </main>
  );
}