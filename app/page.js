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
      <main className="min-h-screen flex items-center justify-center p-6 bg-slate-950 font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-white/10 border-t-emerald-400 rounded-full animate-spin" />
          <p className="text-white/40 text-xs uppercase tracking-[0.3em]">Connecting to Secure Node...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen flex flex-col items-center justify-center p-6 transition-all duration-1000 font-mono ${isVulnerable ? 'bg-red-950' : isError ? 'bg-slate-900' : 'bg-slate-950'}`}>
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `linear-gradient(${isVulnerable ? '#ef4444' : isError ? '#f59e0b' : '#10b981'} 1px, transparent 1px), linear-gradient(90deg, ${isVulnerable ? '#ef4444' : isError ? '#f59e0b' : '#10b981'} 1px, transparent 1px)`, backgroundSize: '50px 50px' }}></div>

      <div className={`relative z-10 w-full max-w-3xl backdrop-blur-md bg-white/5 border-2 rounded-3xl p-8 shadow-2xl transition-all ${isVulnerable ? 'border-red-500 shadow-red-500/20' : isError ? 'border-amber-500/50 shadow-amber-500/20' : 'border-emerald-500/50 shadow-emerald-500/20'}`}>
        
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-1">Secure Node</h2>
            <p className="text-white text-sm font-bold tracking-widest">ALPHA-GATE-01</p>
          </div>
            <div className="text-right">
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-1">Defense Status</h2>
            <p className={`text-sm font-black tracking-tighter ${isVulnerable ? 'text-red-500 animate-pulse' : isError ? 'text-amber-400' : 'text-emerald-400'}`}>
              {isVulnerable ? '● CRITICAL BREACH' : isError ? '● CONNECTION LOST' : '● ACTIVE PROTECTION'}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center py-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center border-2 mb-4 transition-all ${isVulnerable ? 'border-red-500 bg-red-500/10' : isError ? 'border-amber-500 bg-amber-500/10' : 'border-emerald-500 bg-emerald-500/10'}`}>
            <span className="text-3xl">{isVulnerable ? '⚠️' : isError ? '📡' : '🛡️'}</span>
          </div>
          <h1 className={`text-4xl font-black mb-2 text-center tracking-tighter ${isVulnerable || isError ? 'text-white' : 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400'}`}>
            DEV<span className={isVulnerable ? 'text-red-500' : isError ? 'text-amber-500' : ''}>SEC</span>OPS
          </h1>
        </div>

        {/* Per-Tool Status Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-8">
          {TOOLS.map((tool) => {
            const outcome = gates[tool.key];
            const style = gateStyle(outcome);
            return (
              <div
                key={tool.key}
                className={`group relative flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all hover:scale-105 cursor-default ${style.bg} ${style.border}`}
              >
                 <span className="text-2xl">{tool.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">{tool.label}</span>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                  <span className={`text-[9px] font-black uppercase tracking-tight ${style.color}`}>{style.label}</span>
                </div>
                {/* Tooltip */}
                <div className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 text-white text-[9px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {tool.desc}
                </div>
              </div>
            );
          })}
        </div>

        <div className={`mt-8 p-4 rounded-xl border transition-all ${isVulnerable ? 'bg-red-500/20 border-red-500' : isError ? 'bg-amber-500/10 border-amber-500/40' : 'bg-emerald-500/5 border-emerald-500/30'}`}>
          <p className={`text-xs font-bold mb-1 ${isVulnerable ? 'text-red-400' : isError ? 'text-amber-400' : 'text-emerald-500'}`}>
            {isVulnerable ? 'ANALYSIS RESULT' : isError ? 'CONNECTION ERROR' : 'SYSTEM LOG'}
          </p>
          <p className="text-white text-sm italic">{report.message}</p>
        </div>

      </div>

      <div className="mt-6 text-[10px] text-white/20 uppercase tracking-[0.4em]">
        Live pipeline mirror — updates automatically every 5 seconds
      </div>
    </main>
  );
}