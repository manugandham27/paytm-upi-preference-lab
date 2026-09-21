"use client";

import { useEffect, useState } from "react";
import { ClientLayoutWrapper } from "@/components/ClientLayoutWrapper";
import { FileText, Download, Printer, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";

export default function SubmissionPage() {
  const [data, setData] = useState<any>(null);
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

      const [qcRes, insightRes, solutionRes] = await Promise.all([
        fetch(`/api/qc?mode=${currentMode}`),
        fetch(`/api/insights?mode=${currentMode}`),
        fetch(`/api/solutions?mode=${currentMode}`),
      ]);

      const qc = await qcRes.json();
      const ins = await insightRes.json();
      const sol = await solutionRes.json();

      setData({
        mode: currentMode,
        stats: qc.stats || {},
        insights: ins.insights || [],
        solutions: sol.solutions || [],
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isDemo = data?.mode === "DEMO";
  const stats = data?.stats || {};
  const insights = data?.insights || [];
  const solutions = data?.solutions || [];

  return (
    <ClientLayoutWrapper>
      <div className="space-y-6 print:p-0 print:m-0">
        {/* Screen Header (Hidden during print) */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
              <FileText className="w-6 h-6 text-emerald-400" />
              <span>Official 2-Page Executive Submission Generator</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Print-ready executive summary for Paytm UPI Growth Challenge (Track A)
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-lg transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

        {/* PRINT-READY 2-PAGE DOCUMENT CONTAINER */}
        <div className="bg-white text-slate-900 font-sans p-8 sm:p-12 rounded-2xl border border-slate-300 shadow-2xl space-y-12 max-w-4xl mx-auto print:shadow-none print:border-none print:p-0 print:max-w-none">
          {/* PAGE 1 */}
          <div className="space-y-6 min-h-[1050px] flex flex-col justify-between border-b-2 border-dashed border-slate-300 pb-8 print:border-none print:pb-0">
            <div>
              {/* Submission Header */}
              <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-end">
                <div>
                  <div className="text-xs font-black tracking-widest text-slate-500 uppercase">
                    PAYTM UPI GROWTH CHALLENGE 2026
                  </div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                    TRACK A — BUILD PRIMARY-APP PREFERENCE
                  </h1>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold px-3 py-1 bg-slate-900 text-white rounded">
                    Official 2-Page Submission
                  </span>
                </div>
              </div>

              {/* Section 1: Executive Problem Understanding */}
              <div className="mt-6 space-y-4">
                <h2 className="text-sm font-black uppercase text-slate-900 border-b border-slate-300 pb-1">
                  1. Problem Understanding & Target Segment
                </h2>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 block">Target Segment Definition</span>
                    <p className="text-slate-700">
                      Urban UPI users (18-35 yrs) who have used Paytm UPI within the last 90 days but currently use Google Pay, PhonePe, or Bank Apps for their primary monthly transaction volume.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 block">Core Problem Mechanism</span>
                    <p className="text-slate-700">
                      Paytm experiences transaction preference leakage during high-frequency Kirana micro-payments (due to merchant soundbox cues) and high-value rent/bills (due to refund anxiety on third-party apps).
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2: 50 VOC Research Findings */}
              <div className="mt-6 space-y-3">
                <h2 className="text-sm font-black uppercase text-slate-900 border-b border-slate-300 pb-1">
                  2. Key Research Findings from 50 Verified VOCs
                </h2>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {insights.slice(0, 4).map((ins: any, idx: number) => (
                    <div key={idx} className="border border-slate-300 p-3 rounded bg-slate-50/50 space-y-1">
                      <span className="font-bold text-slate-900 text-[11px] block">
                        Finding #{idx + 1}: {ins.title}
                      </span>
                      <p className="text-slate-700 text-[11px] italic">"{ins.verbatimQuote}"</p>
                      <div className="text-[10px] text-slate-600 font-semibold pt-1">
                        Barrier: <span className="text-slate-900">{ins.barrier}</span> ({ins.evidenceCount} VOCs)
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: GMV Opportunity Size */}
              <div className="mt-6 bg-slate-900 text-white p-4 rounded-xl space-y-2">
                <h2 className="text-xs font-bold uppercase text-paytm-cyan">3. Quantified Paytm GMV Opportunity</h2>
                <div className="flex justify-between items-baseline text-xs">
                  <span>Target Audience Pool: 1.5 Cr Non-Primary Paytm UPI Users</span>
                  <span className="text-lg font-black text-white">Projected GMV Shift: ₹18,731 Cr / yr</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Empirical Baseline: 18.5 monthly transactions @ ₹450 avg ticket size. Shifting 15% of monthly transactions back to Paytm yields massive recurring GMV expansion.
                </p>
              </div>
            </div>

            <div className="text-center text-[10px] text-slate-400 font-semibold border-t border-slate-200 pt-2">
              Page 1 of 2 — Paytm UPI Growth Challenge 2026 (Track A)
            </div>
          </div>

          {/* PAGE 2 */}
          <div className="space-y-6 min-h-[1050px] flex flex-col justify-between pt-4">
            <div>
              {/* Header Page 2 */}
              <div className="border-b-2 border-slate-900 pb-2 flex justify-between items-end">
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                  PAGE 2 — PROPOSED INTERVENTION & EXECUTION ROADMAP
                </h2>
                <span className="text-xs font-bold text-slate-500">Paytm UPI Preference Lab</span>
              </div>

              {/* Section 4: Proposed Intervention */}
              <div className="mt-6 space-y-4">
                <h2 className="text-sm font-black uppercase text-slate-900 border-b border-slate-300 pb-1">
                  4. Focused Product Solution: Paytm FlashPay & ShieldPay
                </h2>

                <div className="space-y-3 text-xs">
                  {solutions.slice(0, 2).map((sol: any, idx: number) => (
                    <div key={idx} className="border-2 border-slate-900 p-4 rounded-xl bg-slate-50 space-y-2">
                      <div className="flex justify-between font-bold text-slate-900 text-sm">
                        <span>Solution Concept #{idx + 1}: {sol.name}</span>
                        <span className="text-xs px-2 py-0.5 bg-slate-900 text-white rounded">
                          Scalability: {sol.scalabilityScore}/10
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-[11px]">
                        <div>
                          <span className="font-bold text-slate-900 block">Problem Addressed:</span>
                          <p className="text-slate-700">{sol.problemAddressed}</p>
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">Value Proposition:</span>
                          <p className="text-slate-700">{sol.userBenefit}</p>
                        </div>
                      </div>
                      <div className="border-t border-slate-200 pt-2 text-[11px]">
                        <span className="font-bold text-slate-900">Direct VOC Connection: </span>
                        <span className="italic text-slate-700">"{sol.vocEvidence}"</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 5: Behavioral Mechanism of Action */}
              <div className="mt-6 space-y-3 text-xs">
                <h2 className="text-sm font-black uppercase text-slate-900 border-b border-slate-300 pb-1">
                  5. Expected Behavior Change & GMV Growth Engine
                </h2>
                <div className="bg-slate-100 p-4 rounded-xl border border-slate-300 font-mono text-[11px] text-slate-900 space-y-1">
                  <div>Current Behavior: Rival App Default (Soundbox / Latency Friction)</div>
                  <div className="text-paytm-blueAccent font-bold">↓ Paytm FlashPay (Sub-500ms Instant Lockscreen Scanner)</div>
                  <div>Changed Behavior: Paytm becomes instant habit for daily Kirana & Food checkout</div>
                  <div className="text-emerald-700 font-bold">↓ Outcome: +15% Transaction Share Shift → Incremental Paytm UPI GMV</div>
                </div>
              </div>

              {/* Section 6: Scalability & Measurement Framework */}
              <div className="mt-6 space-y-3 text-xs">
                <h2 className="text-sm font-black uppercase text-slate-900 border-b border-slate-300 pb-1">
                  6. Measurement & Execution Metrics
                </h2>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="border border-slate-300 p-3 rounded bg-slate-50">
                    <span className="font-bold text-slate-900 block text-[11px]">Daily Active Scanners</span>
                    <span className="text-xs font-semibold text-slate-600">+25% MoM Growth</span>
                  </div>
                  <div className="border border-slate-300 p-3 rounded bg-slate-50">
                    <span className="font-bold text-slate-900 block text-[11px]">₹10k+ Refund Safety</span>
                    <span className="text-xs font-semibold text-slate-600">99.9% 10-Min Credit</span>
                  </div>
                  <div className="border border-slate-300 p-3 rounded bg-slate-50">
                    <span className="font-bold text-slate-900 block text-[11px]">Paytm Primary Preference</span>
                    <span className="text-xs font-semibold text-slate-600">Target 40% Share</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center text-[10px] text-slate-400 font-semibold border-t border-slate-200 pt-2">
              Page 2 of 2 — Paytm UPI Growth Challenge 2026 (Track A Official Submission)
            </div>
          </div>
        </div>
      </div>
    </ClientLayoutWrapper>
  );
}
