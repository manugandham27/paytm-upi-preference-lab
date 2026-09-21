"use client";

import { Info, Play } from "lucide-react";

interface DemoBannerProps {
  currentMode: string;
  onSwitchToReal: () => void;
}

export function DemoBanner({ currentMode, onSwitchToReal }: DemoBannerProps) {
  if (currentMode !== "DEMO") return null;

  return (
    <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-200 px-4 py-2.5 text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-between gap-2 shadow-inner">
      <div className="flex items-center space-x-2">
        <span className="bg-amber-500 text-slate-950 text-xs font-extrabold px-2 py-0.5 rounded flex items-center space-x-1">
          <Play className="w-3 h-3 fill-current" />
          <span>DEMO MODE ACTIVE</span>
        </span>
        <span>
          Showing synthetic test dataset (50 VOCs, 10 In-depth interviews) for UI inspection. Demo data never populates official submission exports.
        </span>
      </div>
      <button
        onClick={onSwitchToReal}
        className="underline font-semibold hover:text-white shrink-0 text-xs"
      >
        Switch to Real Data Mode
      </button>
    </div>
  );
}
