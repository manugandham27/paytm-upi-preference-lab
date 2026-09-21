"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Database, Play, AlertTriangle, RefreshCw, CheckCircle2 } from "lucide-react";

interface NavbarProps {
  currentMode: string;
  onModeToggle: (newMode: string) => void;
  onRefresh?: () => void;
}

export function Navbar({ currentMode, onModeToggle, onRefresh }: NavbarProps) {
  const [stats, setStats] = useState<{ vocCount: number; inDepthCount: number } | null>(null);
  const [loadingSeed, setLoadingSeed] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/qc?mode=${currentMode}`);
      const data = await res.json();
      if (data.stats) {
        setStats({ vocCount: data.stats.totalVocCount, inDepthCount: data.stats.inDepthCount });
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [currentMode]);

  const handleSeedDemo = async () => {
    setLoadingSeed(true);
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "SEED_DEMO" }),
      });
      await res.json();
      fetchStats();
      if (onRefresh) onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSeed(false);
    }
  };

  const isDemo = currentMode === "DEMO";
  const vocCount = stats?.vocCount ?? 0;
  const inDepthCount = stats?.inDepthCount ?? 0;
  const isVocTargetMet = vocCount >= 50;
  const isInDepthTargetMet = inDepthCount >= 10;

  return (
    <header className="sticky top-0 z-40 bg-paytm-navy text-white shadow-md border-b border-paytm-blueAccent/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Track Badge */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-paytm-cyan flex items-center justify-center font-bold text-paytm-navy text-xl shadow-sm">
            P
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-white">Paytm UPI Preference Lab</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-paytm-cyan/20 text-paytm-cyan border border-paytm-cyan/40">
                Track A — 2026
              </span>
            </div>
            <p className="text-xs text-slate-300 hidden sm:block">
              Build Primary-App Preference Research & Validation Engine
            </p>
          </div>
        </div>

        {/* Live Research Progress Counters */}
        <div className="flex items-center space-x-3 sm:space-x-6">
          <div className="flex items-center space-x-2 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700/60">
            <span className="text-xs text-slate-300">Valid VOCs:</span>
            <span className={`text-sm font-bold ${isVocTargetMet ? "text-emerald-400" : "text-amber-400"}`}>
              {vocCount} / 50
            </span>
            {isVocTargetMet ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />
            )}
          </div>

          <div className="flex items-center space-x-2 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700/60 hidden md:flex">
            <span className="text-xs text-slate-300">In-Depth:</span>
            <span className={`text-sm font-bold ${isInDepthTargetMet ? "text-emerald-400" : "text-cyan-400"}`}>
              {inDepthCount} / 10
            </span>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => onModeToggle("REAL")}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                !isDemo
                  ? "bg-emerald-600 text-white shadow-sm font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              REAL DATA
            </button>
            <button
              onClick={() => onModeToggle("DEMO")}
              className={`px-3 py-1 rounded text-xs font-medium transition-all flex items-center space-x-1 ${
                isDemo
                  ? "bg-paytm-cyan text-paytm-navy font-bold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Play className="w-3 h-3" />
              <span>DEMO MODE</span>
            </button>
          </div>

          {/* Seed Demo Data Button */}
          {isDemo && (
            <button
              onClick={handleSeedDemo}
              disabled={loadingSeed}
              className="bg-paytm-cyan/20 hover:bg-paytm-cyan/30 text-paytm-cyan border border-paytm-cyan/40 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1 transition-all"
              title="Generate 50 synthetic DEMO Track A responses"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingSeed ? "animate-spin" : ""}`} />
              <span className="hidden lg:inline">{loadingSeed ? "Seeding..." : "Seed 50 Demo VOCs"}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
