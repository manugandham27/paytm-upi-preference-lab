"use client";

import { useEffect, useState } from "react";
import { ClientLayoutWrapper } from "@/components/ClientLayoutWrapper";
import { Calculator, CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react";

export default function OpportunityPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Calculator Form State
  const [targetUsers, setTargetUsers] = useState(15000000); // 1.5 Cr users
  const [monthlyFreq, setMonthlyFreq] = useState(18.5);
  const [ticketSize, setTicketSize] = useState(450);
  const [shareShiftPct, setShareShiftPct] = useState(15);
  const [segmentName, setSegmentName] = useState("Urban Non-Primary Paytm UPI Users");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const modeRes = await fetch("/api/demo");
      const modeData = await modeRes.json();
      const currentMode = modeData.activeMode || "REAL";

      const res = await fetch(`/api/opportunity?mode=${currentMode}`);
      const oppData = await res.json();
      setData(oppData);

      if (oppData.empiricalBaselines) {
        setMonthlyFreq(oppData.empiricalBaselines.avgMonthlyTxCount || 18.5);
        setTicketSize(oppData.empiricalBaselines.avgTicketSize || 450);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Modelled Calculation
  const monthlyShiftValuePerUser = monthlyFreq * ticketSize * (shareShiftPct / 100);
  const annualGmvOpportunity = targetUsers * monthlyShiftValuePerUser * 12;
  const annualGmvCrores = annualGmvOpportunity / 10000000;

  return (
    <ClientLayoutWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Calculator className="w-6 h-6 text-paytm-cyan" />
            <span>Evidence-Based GMV Opportunity Calculator</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Quantify potential Paytm UPI GMV recovery by shifting payment preference in validated occasion pools
          </p>
        </div>

        {/* 3-Part Data Separation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Part 1: Empirical Data */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-emerald-500/40 space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <h2 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                1. ACTUAL RESEARCH DATA
              </h2>
            </div>
            <p className="text-xs text-slate-400">Empirical baselines calculated strictly from collected VOC dataset.</p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-slate-950 p-2 rounded">
                <span className="text-slate-400">Sample Size:</span>
                <span className="font-bold text-white">{data?.empiricalBaselines?.totalSample || 0} VOCs</span>
              </div>
              <div className="flex justify-between bg-slate-950 p-2 rounded">
                <span className="text-slate-400">Empirical Avg Freq:</span>
                <span className="font-bold text-white">{data?.empiricalBaselines?.avgMonthlyTxCount || 18.5} txs/mo</span>
              </div>
              <div className="flex justify-between bg-slate-950 p-2 rounded">
                <span className="text-slate-400">Empirical Avg Ticket:</span>
                <span className="font-bold text-white">₹{data?.empiricalBaselines?.avgTicketSize || 450}</span>
              </div>
            </div>
          </div>

          {/* Part 2: Researcher Assumptions */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-amber-500/40 space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <h2 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                2. RESEARCHER ASSUMPTIONS
              </h2>
            </div>
            <p className="text-xs text-slate-400">Market size & target share shift extrapolations.</p>
            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Target User Pool (Count)</label>
                <input
                  type="number"
                  value={targetUsers}
                  onChange={(e) => setTargetUsers(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Target Share Shift (%)</label>
                <input
                  type="number"
                  value={shareShiftPct}
                  onChange={(e) => setShareShiftPct(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Part 3: Modelled Opportunity */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-paytm-cyan/50 space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
              <span className="w-2 h-2 rounded-full bg-paytm-cyan" />
              <h2 className="text-xs font-extrabold text-paytm-cyan uppercase tracking-wider">
                3. MODELLED GMV OPPORTUNITY
              </h2>
            </div>
            <p className="text-xs text-slate-400">Projected annual Paytm UPI GMV increase.</p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-1">
              <span className="text-xs text-slate-400 font-medium uppercase block">Annual GMV Potential</span>
              <div className="text-3xl font-black text-paytm-cyan">
                ₹{annualGmvCrores.toLocaleString(undefined, { maximumFractionDigits: 2 })} Cr
              </div>
              <span className="text-[10px] text-slate-500 block">
                (₹{Math.round(annualGmvOpportunity).toLocaleString()} per annum)
              </span>
            </div>
          </div>
        </div>

        {/* Formula Explanation */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-3 text-xs text-slate-300">
          <h2 className="text-sm font-bold text-white flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-paytm-cyan" />
            <span>Opportunity Estimation Formula & Mechanics</span>
          </h2>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-paytm-cyan text-sm">
            Annual GMV Shift = Target Users ({targetUsers.toLocaleString()}) × Monthly Freq ({monthlyFreq}) × Avg Ticket Size (₹{ticketSize}) × Share Shift ({shareShiftPct}%) × 12 Months
          </div>
          <p className="text-slate-400 leading-relaxed">
            By eliminating low-latency camera scanner friction (Paytm FlashPay) and providing high-value refund guarantees (ShieldPay), Paytm can shift 15% of monthly transactions back to Paytm UPI, unlocking over ₹{annualGmvCrores.toFixed(0)} Crore in incremental annual GMV.
          </p>
        </div>
      </div>
    </ClientLayoutWrapper>
  );
}
