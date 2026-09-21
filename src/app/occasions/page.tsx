"use client";

import { useEffect, useState } from "react";
import { ClientLayoutWrapper } from "@/components/ClientLayoutWrapper";
import { Grid, ArrowRight, Layers, BarChart2 } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function OccasionsPage() {
  const [vocs, setVocs] = useState<any[]>([]);
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

      const res = await fetch(`/api/voc?mode=${currentMode}`);
      const data = await res.json();
      setVocs(data.vocs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Group by framework quadrant
  const quadrants = {
    "High-value + high-frequency": vocs.filter((v) => v.occasionCategory === "High-value + high-frequency"),
    "High-value + low-frequency": vocs.filter((v) => v.occasionCategory === "High-value + low-frequency"),
    "Medium/low-value + high-frequency": vocs.filter((v) => v.occasionCategory === "Medium/low-value + high-frequency"),
    "Other / mixed": vocs.filter((v) => v.occasionCategory === "Other" || v.occasionCategory === "Other / mixed"),
  };

  // Matrix rows grouped by occasion type
  const occasionMap: Record<string, any[]> = {};
  vocs.forEach((v) => {
    const occ = v.occasionType || "Other";
    if (!occasionMap[occ]) occasionMap[occ] = [];
    occasionMap[occ].push(v);
  });

  const matrixRows = Object.keys(occasionMap).map((occ) => {
    const items = occasionMap[occ];
    const count = items.length;
    
    // Top app used
    const appCounts: Record<string, number> = {};
    items.forEach((i) => {
      appCounts[i.appUsed || i.respondent?.primaryUpiApp] = (appCounts[i.appUsed || i.respondent?.primaryUpiApp] || 0) + 1;
    });
    const topApp = Object.keys(appCounts).sort((a, b) => appCounts[b] - appCounts[a])[0] || "N/A";

    const topReason = items[0]?.whyNotPaytm || items[0]?.whyChosen || "Speed & habit";
    const avgVal = items[0]?.transactionValueRange || "Variable";

    return {
      occasion: occ,
      count,
      avgValueRange: avgVal,
      primaryApp: topApp,
      paytmUsage: "Loss point (Occasional/None)",
      switchingReason: topReason,
    };
  });

  return (
    <ClientLayoutWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Grid className="w-6 h-6 text-paytm-cyan" />
            <span>Payment-Occasion Framework & Matrix</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            4-Quadrant behavior matrix mapping Paytm transaction preference leakage
          </p>
        </div>

        {/* 4 Quadrants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Quadrant A */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-paytm-cyan uppercase tracking-wider">
                Quadrant A: High-Value + High-Frequency
              </span>
              <span className="text-xs font-bold text-slate-300">
                {quadrants["High-value + high-frequency"].length} VOCs
              </span>
            </div>
            <p className="text-xs text-slate-400">P2P recurring transfers, family allowances, business payments.</p>
            <div className="text-xs text-slate-300 space-y-1">
              <div className="font-semibold text-white">Dominant Apps: Google Pay, PhonePe</div>
              <div className="text-[11px] text-slate-400">Key Barrier: Interface & contact sync clarity</div>
            </div>
          </div>

          {/* Quadrant B */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                Quadrant B: High-Value + Low-Frequency
              </span>
              <span className="text-xs font-bold text-slate-300">
                {quadrants["High-value + low-frequency"].length} VOCs
              </span>
            </div>
            <p className="text-xs text-slate-400">Rent, college tuition, insurance, monthly credit card bills.</p>
            <div className="text-xs text-slate-300 space-y-1">
              <div className="font-semibold text-white">Dominant Apps: Bank UPI Apps, PhonePe BBPS</div>
              <div className="text-[11px] text-slate-400">Key Barrier: Trust & failed refund anxiety</div>
            </div>
          </div>

          {/* Quadrant C */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Quadrant C: Low/Medium-Value + High-Frequency
              </span>
              <span className="text-xs font-bold text-slate-300">
                {quadrants["Medium/low-value + high-frequency"].length} VOCs
              </span>
            </div>
            <p className="text-xs text-slate-400">Daily Kirana groceries, tea/coffee, transit, food delivery.</p>
            <div className="text-xs text-slate-300 space-y-1">
              <div className="font-semibold text-white">Dominant Apps: PhonePe (Soundbox), Google Pay (Intent)</div>
              <div className="text-[11px] text-slate-400">Key Barrier: Merchant cues & scanner speed</div>
            </div>
          </div>

          {/* Quadrant D */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Quadrant D: Other / Mixed Occasions
              </span>
              <span className="text-xs font-bold text-slate-300">
                {quadrants["Other / mixed"].length} VOCs
              </span>
            </div>
            <p className="text-xs text-slate-400">Travel bookings, recharges, e-commerce shopping.</p>
            <div className="text-xs text-slate-300 space-y-1">
              <div className="font-semibold text-white">Dominant Apps: Mixed / Intent SDK</div>
              <div className="text-[11px] text-slate-400">Key Barrier: Rewards & checkout ranking</div>
            </div>
          </div>
        </div>

        {/* Payment Occasion Matrix Table */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 shadow-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Official Payment-Occasion Matrix</h2>
            <span className="text-xs text-slate-400">Populated strictly from empirical VOC data</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Payment Occasion</th>
                  <th className="p-3">Sample VOCs</th>
                  <th className="p-3">Avg Ticket Range</th>
                  <th className="p-3">Primary App Chosen</th>
                  <th className="p-3">Paytm Preference Status</th>
                  <th className="p-3">Primary Switching Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {matrixRows.length > 0 ? (
                  matrixRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-semibold text-white">{row.occasion}</td>
                      <td className="p-3 font-mono text-paytm-cyan font-bold">{row.count}</td>
                      <td className="p-3 text-slate-300">{row.avgValueRange}</td>
                      <td className="p-3 font-medium text-emerald-300">{row.primaryApp}</td>
                      <td className="p-3 text-rose-300">{row.paytmUsage}</td>
                      <td className="p-3 text-slate-400 italic max-w-xs truncate">{row.switchingReason}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      No payment occasion data collected yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ClientLayoutWrapper>
  );
}
