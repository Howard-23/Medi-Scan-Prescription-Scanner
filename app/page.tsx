"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamically import the main component to avoid SSR issues
const PrescriptionReader = dynamic(
  () => import("@/components/prescription-reader"),
  { ssr: false, loading: () => <LoadingScreen /> }
);

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950/20">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 animate-pulse" />
          <div className="absolute inset-1 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center">
            <svg 
              className="h-10 w-10 text-transparent bg-gradient-to-br from-cyan-500 to-violet-500 bg-clip-text" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              style={{ stroke: "url(#gradient)" }}
            >
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" 
              />
            </svg>
          </div>
          {/* Spinning rings */}
          <div className="absolute -inset-3 rounded-3xl border-2 border-cyan-200 dark:border-cyan-800 animate-spin" style={{ animationDuration: "3s" }} />
          <div className="absolute -inset-5 rounded-[2rem] border border-violet-200 dark:border-violet-800 animate-spin" style={{ animationDuration: "4s", animationDirection: "reverse" }} />
        </div>
        
        <h1 className="text-2xl font-bold gradient-text mb-2">MediScan</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
          Loading application...
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <Suspense fallback={<LoadingScreen />}>
        <PrescriptionReader />
      </Suspense>
    </main>
  );
}
