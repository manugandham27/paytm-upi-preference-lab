"use client";

import { useEffect, useState } from "react";
import { ClientLayoutWrapper } from "@/components/ClientLayoutWrapper";
import { Sparkles, Plus, Save, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export default function SolutionsPage() {
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const modeRes = await fetch("/api/demo");
      const modeData = await modeRes.json();
      const currentMode = modeData.activeMode || "REAL";

      const res = await fetch(`/api/solutions?mode=${currentMode}`);
      const data = await res.json();
      setSolutions(data.solutions || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClientLayoutWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-paytm-cyan" />
            <span>Proposed Solution Interventions</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            3-5 evidence-backed product interventions designed to solve validated Track A barriers
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="space-y-6">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs">Loading solution concepts...</div>
          ) : solutions.length > 0 ? (
            solutions.map((sol, idx) => (
              <div key={sol.id} className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-lg bg-paytm-cyan/20 text-paytm-cyan border border-paytm-cyan/30 flex items-center justify-center font-bold text-sm">
                      #{idx + 1}
                    </span>
                    <h2 className="text-lg font-bold text-white">{sol.name}</h2>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-950 text-emerald-400 border border-slate-800">
                      Scalability Score: {sol.scalabilityScore} / 10
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-rose-400 font-bold uppercase text-[10px] block">Problem Addressed</span>
                    <p className="text-slate-300">{sol.problemAddressed}</p>

                    <span className="text-slate-400 font-bold uppercase text-[10px] block pt-2">Target User & Occasion</span>
                    <p className="text-slate-300">{sol.targetUser} ({sol.relevantOccasion})</p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-paytm-cyan font-bold uppercase text-[10px] block">VOC Evidence Link</span>
                    <p className="text-slate-300 italic">"{sol.vocEvidence}"</p>

                    <span className="text-emerald-400 font-bold uppercase text-[10px] block pt-2">User & Paytm Benefits</span>
                    <p className="text-slate-300 font-semibold">{sol.userBenefit}</p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-purple-400 font-bold uppercase text-[10px] block">Expected Behavior Change</span>
                    <p className="text-slate-300">{sol.expectedBehaviorChange}</p>

                    <span className="text-amber-400 font-bold uppercase text-[10px] block pt-2">Measurement Metric</span>
                    <p className="text-slate-300">{sol.measurementMetric}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-slate-900/80 p-12 text-center text-slate-500 text-xs rounded-2xl border border-slate-800">
              No solution concepts generated yet.
            </div>
          )}
        </div>
      </div>
    </ClientLayoutWrapper>
  );
}
