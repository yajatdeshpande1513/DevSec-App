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
    case 'scanning':
      return { color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/40', label: 'SCANNING...', dot: 'bg-cyan-400 animate-ping' };
    default:
      return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/40', label: 'PENDING', dot: 'bg-amber-400 animate-pulse' };
  }
}

export default function Home() {
  const [report, setReport] = useState({ status: 'loading', message: '', gates: {}, history: [] });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/security-report', { cache: 'no-store' });
        const data = await res.json();
        setReport(data);
      } catch (e) {
        setReport({ status: 'error', message: 'System Link Offline', gates: {}, history: [] });
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const isVulnerable = report.status === 'vulnerable';
  const isLoading = report.status === 'loading';
  const isError = report.status === 'error';
  const isScanning = report.status === 'scanning';
  const gates = report.gates || {};
  const history = report.history || [];

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

  // Determine global background styling
  let mainBg = 'bg-slate-950';
  let gradientStops = 'from-emerald-900 via-slate-950 to-slate-950';
  let gridColor = '#10b981';
  let headerColor = 'text-emerald-400';
  let dotColor = 'bg-emerald-500';
  
  if (isVulnerable) {
    mainBg = 'bg-red-950';
    gradientStops = 'from-red-900 via-red-950 to-slate-950';
    gridColor = '#ef4444';
    headerColor = 'text-red-400';
    dotColor = 'bg-red-500';
  } else if (isError) {
    mainBg = 'bg-slate-900';
    gradientStops = 'from-amber-900 via-slate-900 to-slate-950';
    gridColor = '#f59e0b';
    headerColor = 'text-amber-400';
    dotColor = 'bg-amber-500';
  } else if (isScanning) {
    mainBg = 'bg-slate-950';
    gradientStops = 'from-cyan-900 via-slate-950 to-slate-950';
    gridColor = '#06b6d4';
    headerColor = 'text-cyan-400';
    dotColor = 'bg-cyan-500';
  }

  return (
    <main className={`min-h-screen flex flex-col items-center py-12 px-6 transition-colors duration-1000 font-mono relative overflow-x-hidden ${mainBg}`}>
      {/* Dynamic Background Effects */}
      <div className={`fixed inset-0 opacity-30 pointer-events-none transition-opacity duration-1000 bg-[radial-gradient(circle_at_50%_0%,_var(--tw-gradient-stops))] ${gradientStops}`}></div>
      <div className="fixed inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`, backgroundSize: '50px 50px' }}></div>

      <div className={`relative z-10 w-full max-w-4xl backdrop-blur-xl bg-slate-900/40 border rounded-[2rem] p-8 md:p-12 shadow-2xl transition-all duration-700 
        ${isVulnerable ? 'border-red-500/50 shadow-red-900/50' : 
          isError ? 'border-amber-500/30 shadow-amber-900/30' : 
          isScanning ? 'border-cyan-500/50 shadow-cyan-900/50 animate-[pulse_3s_ease-in-out_infinite]' : 
          'border-emerald-500/30 shadow-emerald-900/40 hover:shadow-emerald-900/60 hover:border-emerald-500/50'}`}>
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-2 h-12 rounded-full ${dotColor} ${isScanning ? 'animate-pulse' : ''}`}></div>
            <div>
              <h2 className="text-[10px] uppercase tracking-[0.4em] text-slate-400 mb-1">Secure Operations Node</h2>
              <p className="text-white text-lg font-bold tracking-widest">ALPHA-GATE-01</p>
            </div>
          </div>
          <div className="text-left md:text-right bg-black/40 px-6 py-3 rounded-xl border border-white/5">
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-slate-400 mb-1">Defense Status</h2>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isError ? '' : 'animate-pulse'} ${dotColor}`}></div>
              <p className={`text-sm font-black tracking-tighter ${headerColor}`}>
                {isVulnerable ? 'CRITICAL BREACH DETECTED' : isError ? 'CONNECTION LOST' : isScanning ? 'PIPELINE RUNNING...' : 'SYSTEM SECURE'}
              </p>
            </div>
          </div>
        </div>

        {/* Main Status */}
        <div className="flex flex-col items-center py-8 mb-4 relative">
          <div className={`absolute w-32 h-32 rounded-full blur-3xl opacity-20 ${dotColor}`}></div>
          <div className={`w-24 h-24 rounded-full flex items-center justify-center border-2 mb-6 transition-all duration-500 relative z-10 
            ${isVulnerable ? 'border-red-500 bg-red-950/50 shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 
              isError ? 'border-amber-500 bg-amber-950/50' : 
              isScanning ? 'border-cyan-500 bg-cyan-950/50 shadow-[0_0_30px_rgba(6,182,212,0.3)]' :
              'border-emerald-500 bg-emerald-950/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]'}`}>
            <span className={`text-4xl ${isScanning ? 'animate-spin-slow' : ''}`}>{isVulnerable ? '⚠️' : isError ? '📡' : isScanning ? '⚙️' : '🛡️'}</span>
          </div>
          <h1 className={`text-5xl md:text-6xl font-black mb-3 text-center tracking-tighter relative z-10 ${isVulnerable || isError ? 'text-white' : isScanning ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-300 to-cyan-400' : 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400'}`}>
            DEV<span className={isVulnerable ? 'text-red-500' : isError ? 'text-amber-500' : isScanning ? 'text-blue-500' : ''}>SEC</span>OPS
          </h1>
          <p className="text-slate-400 text-sm tracking-widest uppercase">{isScanning ? 'Executing Security Gates...' : 'Continuous Security Pipeline'}</p>
        </div>

        {/* Per-Tool Status Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-8 relative z-10">
          {TOOLS.map((tool) => {
            const outcome = gates[tool.key];
            const style = gateStyle(outcome);
            return (
              <div
                key={tool.key}
                className={`group relative flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 cursor-default bg-slate-900/50 hover:bg-slate-800/80 ${style.border} ${outcome === 'success' ? 'hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]' : outcome === 'scanning' ? 'shadow-[0_0_15px_rgba(6,182,212,0.2)]' : ''}`}
              >
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${style.bg}`}></div>
                <span className={`text-3xl filter drop-shadow-md relative z-10 ${outcome === 'scanning' ? 'animate-bounce' : ''}`}>{tool.icon}</span>
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

        <div className={`mt-10 p-5 rounded-2xl border transition-all duration-500 flex items-start gap-4 
          ${isVulnerable ? 'bg-red-950/40 border-red-500/50' : 
            isError ? 'bg-amber-950/30 border-amber-500/30' : 
            isScanning ? 'bg-cyan-950/30 border-cyan-500/30' :
            'bg-emerald-950/20 border-emerald-500/20'}`}>
          <div className="mt-1">
            <div className={`w-2 h-2 rounded-full ${isError ? '' : 'animate-pulse'} ${dotColor}`}></div>
          </div>
          <div>
            <p className={`text-xs font-bold mb-1 uppercase tracking-widest ${headerColor}`}>
              {isVulnerable ? 'CRITICAL ALERT' : isError ? 'SYSTEM WARNING' : isScanning ? 'SCAN IN PROGRESS' : 'LATEST SECURE LOG'}
            </p>
            <p className="text-slate-300 text-sm font-light leading-relaxed">{report.message}</p>
          </div>
        </div>
      </div>

      {/* Terminal History Log */}
      {history.length > 0 && (
        <div className="relative z-10 w-full max-w-4xl mt-8 backdrop-blur-md bg-slate-950/80 border border-slate-800 rounded-xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-700"></div>
              <div className="w-3 h-3 rounded-full bg-slate-700"></div>
              <div className="w-3 h-3 rounded-full bg-slate-700"></div>
            </div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pipeline Telemetry History</h3>
          </div>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {history.map((log, i) => {
              // Ensure log handles strings if they were saved as simple strings instead of objects
              let parsed = log;
              if (typeof log === 'string') {
                try { parsed = JSON.parse(log); } catch (e) { parsed = { status: 'unknown', message: log }; }
              }
              const isVuln = parsed.status === 'vulnerable';
              const isScan = parsed.status === 'scanning';
              return (
                <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 text-xs font-mono border-b border-slate-900/50 pb-2 last:border-0 last:pb-0">
                  <span className="text-slate-500 whitespace-nowrap opacity-70">
                    [{parsed.timestamp ? new Date(parsed.timestamp).toLocaleTimeString() : '00:00:00'}]
                  </span>
                  <span className={`whitespace-nowrap font-bold ${isVuln ? 'text-red-400' : isScan ? 'text-cyan-400' : 'text-emerald-400'}`}>
                    {isVuln ? 'BREACH' : isScan ? 'IN_PROG' : 'SECURE'}
                  </span>
                  <span className="text-slate-300 truncate" title={parsed.message}>{parsed.message}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity relative z-10">
        <div className={`w-1.5 h-1.5 rounded-full ${isScanning ? 'bg-cyan-500 animate-pulse' : 'bg-emerald-500 animate-ping'}`}></div>
        <div className="text-[10px] text-slate-400 uppercase tracking-[0.4em]">
          {isScanning ? 'Receiving telemetry...' : 'Live pipeline mirror — auto-sync active'}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .animate-spin-slow { animation: spin 4s linear infinite; }
      `}} />
    </main>
  );
}