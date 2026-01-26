"use client";
import { useEffect, useState } from 'react';

export default function Home() {
  const [report, setReport] = useState({ status: 'loading', message: '' });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/security-report');
        const data = await res.json();
        setReport(data);
      } catch (e) {
        setReport({ status: 'error', message: 'Failed to fetch security status' });
      }
    };
    fetchStatus();
  }, []);

  const isVulnerable = report.status === 'vulnerable';

  return (
    <main className={`flex min-h-screen flex-col items-center justify-center p-24 transition-colors ${isVulnerable ? 'bg-red-950' : 'bg-black'}`}>
      
      {isVulnerable && (
        <div className="fixed top-0 w-full bg-red-600 text-white p-4 text-center animate-pulse z-50">
          <strong>SECURITY ALERT:</strong> {report.message} (Detected: {report.timestamp})
        </div>
      )}

      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Gatekeeper Status:&nbsp;
          <code className={`font-bold ${isVulnerable ? 'text-red-500' : 'text-green-500'}`}>
            {isVulnerable ? 'VULNERABLE' : 'PROTECTED'}
          </code>
        </p>
      </div>
// const SECRET = "M68e9MywnSMVenyPvBeAFPEo"
      <div className="relative flex flex-col items-center mt-20">
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 text-center">
          Secure DevSecOps App 🚀
        </h1>
        {isVulnerable && <p className="text-red-400 mt-4 italic">Check GitHub Actions for details.</p>}
      </div>
    </main>
  );
}