"use client";

import { useEffect, useState } from "react";
import { ClientLayoutWrapper } from "@/components/ClientLayoutWrapper";
import { Filter, ArrowDown, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";

export default function FunnelPage() {
  const [qcData, setQcData] = useState<any>(null);
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

      const res = await fetch(`/api/qc?mode=${currentMode}`);
      const data = await res.json();
      setQcData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const vocCount = qcData?.stats?.totalVocCount || 0;
  const eligibleCount = qcData?.stats?.eligibleCount || 0;

  const funnelSteps = [
    { title: "1. Target User Pool (Track A Eligible)", count: eligibleCount, pct: "100%", desc: "Used Paytm in last 90 days but default to GPay/PhonePe/BHIM." },
    { title: "2. Primary Non-Paytm Preference", count: eligibleCount, pct: "100%", desc: "Use rival app for largest share of monthly payments." },
    { title: "3. Paytm Occasional / Passive Usage", count: Math.round(eligibleCount * 0.82), pct: "82%", desc: "Use Paytm for secondary niche tasks (Fastag, Movies)." },
    { title: "4. Occasions Where Paytm is Considered", count: Math.round(eligibleCount * 0.65), pct: "65%", desc: "User contemplates opening Paytm at checkout counter." },
    { title: "5. Occasions Where Paytm Loses Share", count: Math.round(eligibleCount * 0.58), pct: "58%", desc: "Friction or counter cue triggers switch back to rival app." },
    { title: "6. Root Cause Barrier Triggered", count: Math.round(eligibleCount * 0.58), pct: "58%", desc: "Scanner latency, soundbox cues, or refund anxiety." },
    { title: "7. Scalable Product Intervention", count: Math.round(eligibleCount * 0.45), pct: "45%", desc: "Paytm FlashPay / ShieldPay recovers payment share." },
  ];

  return (
    <ClientLayoutWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Filter className="w-6 h-6 text-paytm-cyan" />
            <span>Track A Switching Funnel</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Conversion drop-off stages from primary app preference to Paytm win-back intervention
          </p>
        </div>

        {/* Funnel Diagram */}
        <div className="max-w-3xl mx-auto space-y-3">
          {funnelSteps.map((step, idx) => (
            <div key={idx} className="space-y-2">
              <div
                className="bg-gradient-to-r from-slate-900 to-slate-950 p-4 rounded-xl border border-slate-800 shadow-md flex items-center justify-between transition-all hover:border-paytm-cyan/50"
                style={{
                  width: `${100 - idx * 4}%`,
                  margin: "0 auto",
                }}
              >
                <div>
                  <h3 className="font-bold text-sm text-white">{step.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-lg font-black text-paytm-cyan">{step.count}</span>
                  <span className="text-xs text-slate-400 font-semibold block">{step.pct}</span>
                </div>
              </div>

              {idx < funnelSteps.length - 1 && (
                <div className="flex justify-center">
                  <ArrowDown className="w-4 h-4 text-slate-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </ClientLayoutWrapper>
  );
}
