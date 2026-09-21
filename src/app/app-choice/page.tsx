"use client";

import { useEffect, useState } from "react";
import { ClientLayoutWrapper } from "@/components/ClientLayoutWrapper";
import { ArrowRightLeft, HelpCircle, ShieldAlert, Sparkles, AlertCircle } from "lucide-react";

export default function AppChoicePage() {
  const [vocs, setVocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOccasion, setSelectedOccasion] = useState<string>("ALL");

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

  const filteredVocs = vocs.filter(
    (v) => selectedOccasion === "ALL" || v.occasionType === selectedOccasion
  );

  const occasionList = Array.from(new Set(vocs.map((v) => v.occasionType || "Other")));

  return (
    <ClientLayoutWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
              <ArrowRightLeft className="w-6 h-6 text-paytm-cyan" />
              <span>App Choice & "Why Not Paytm?" Engine</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Deep dive into Paytm preference drop-offs, switching triggers, and win-back leverage points
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">Filter Occasion:</span>
            <select
              value={selectedOccasion}
              onChange={(e) => setSelectedOccasion(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-white p-2 rounded-lg"
            >
              <option value="ALL">All Occasions</option>
              {occasionList.map((occ) => (
                <option key={occ} value={occ}>
                  {occ}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVocs.length > 0 ? (
            filteredVocs.map((voc) => (
              <div
                key={voc.id}
                className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-md space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-paytm-cyan font-bold">
                      {voc.respondent?.anonymousId}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 text-emerald-400 border border-slate-800">
                      Used: {voc.appUsed || voc.respondent?.primaryUpiApp}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-white">
                    Occasion: <span className="text-slate-300">{voc.occasionType}</span> ({voc.transactionValueRange})
                  </div>

                  <p className="text-xs text-slate-400 italic">
                    "{voc.recentTxDescription}"
                  </p>
                </div>

                <div className="space-y-2 border-t border-slate-800/80 pt-3 text-xs">
                  <div>
                    <span className="text-emerald-400 font-semibold block">Why Chosen App?</span>
                    <p className="text-slate-300">{voc.whyChosen}</p>
                  </div>

                  <div>
                    <span className="text-amber-400 font-semibold block">Why NOT Paytm?</span>
                    <p className="text-amber-200/90">{voc.whyNotPaytm}</p>
                  </div>

                  <div>
                    <span className="text-purple-400 font-semibold block">Last Paytm Experience:</span>
                    <p className="text-slate-400">{voc.paytmLastUsedExperience}</p>
                  </div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Barrier:</span>
                  <span className="font-bold text-paytm-cyan">{voc.researcherBarrier}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-slate-900/80 p-12 text-center text-slate-500 text-xs rounded-2xl border border-slate-800">
              No matching records for selected occasion.
            </div>
          )}
        </div>
      </div>
    </ClientLayoutWrapper>
  );
}
