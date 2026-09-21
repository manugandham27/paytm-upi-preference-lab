"use client";

import { useEffect, useState } from "react";
import { ClientLayoutWrapper } from "@/components/ClientLayoutWrapper";
import { ShieldAlert, FileText, ChevronRight } from "lucide-react";
import { BARRIER_CATEGORIES } from "@/lib/validation";

export default function BarriersPage() {
  const [vocs, setVocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>(BARRIER_CATEGORIES[0]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const modeRes = await fetch("/api/demo");
      const modeData = await modeRes.json();
      const currentMode = modeData.activeMode || "REAL";

      const res = await fetch(`/api/voc?mode=${currentMode}`);
      const data = await res.json();
      setVocs(data.vocs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Group verbatims by barrier category
  const barrierMap: Record<string, any[]> = {};
  BARRIER_CATEGORIES.forEach((cat) => {
    barrierMap[cat] = vocs.filter(
      (v) => (v.researcherBarrier || "").toLowerCase() === cat.toLowerCase()
    );
  });

  return (
    <ClientLayoutWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
            <span>12-Category Barrier Analysis</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Root-cause barriers mapped to exact anonymized respondent verbatims
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-none">
          {BARRIER_CATEGORIES.map((cat) => {
            const count = barrierMap[cat]?.length || 0;
            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center space-x-2 border ${
                  isActive
                    ? "bg-paytm-navy text-paytm-cyan border-paytm-cyan shadow-md"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? "bg-paytm-cyan text-paytm-navy font-black" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Category Verbatims */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span className="text-paytm-cyan">{activeCategory} Barrier</span>
              </h2>
              <p className="text-xs text-slate-400">
                {barrierMap[activeCategory]?.length || 0} associated VOC verbatims in research database
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {barrierMap[activeCategory]?.length > 0 ? (
              barrierMap[activeCategory].map((voc) => (
                <div key={voc.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-paytm-cyan font-bold">
                      {voc.respondent?.anonymousId} ({voc.respondent?.occupation})
                    </span>
                    <span className="text-slate-400">{voc.occasionType}</span>
                  </div>

                  <p className="italic text-slate-200 text-sm">
                    "{voc.verbatimQuote}"
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-900">
                    <div>
                      <span className="font-semibold text-slate-300">Why Paytm Not Chosen: </span>
                      <span className="text-amber-300">{voc.whyNotPaytm}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-300">Researcher Insight: </span>
                      <span className="text-slate-300">{voc.researcherInsight}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                No verbatims assigned to this barrier category yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </ClientLayoutWrapper>
  );
}
