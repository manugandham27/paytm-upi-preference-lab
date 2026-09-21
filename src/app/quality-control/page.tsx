"use client";

import { useEffect, useState } from "react";
import { ClientLayoutWrapper } from "@/components/ClientLayoutWrapper";
import { Award, CheckCircle2, AlertTriangle, ShieldCheck, AlertCircle } from "lucide-react";

export default function QualityControlPage() {
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

  const isDemo = qcData?.mode === "DEMO";
  const checklist = qcData?.readinessChecklist || [];
  const verifiedCount = checklist.filter((item: any) => item.status === "VERIFIED").length;

  return (
    <ClientLayoutWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Award className="w-6 h-6 text-paytm-cyan" />
              <span>Submission Readiness Checker</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Official 13-point verification checklist based on Paytm UPI Growth Challenge requirements
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center space-x-1.5 ${
                verifiedCount === 13
                  ? "bg-emerald-950 text-emerald-300 border border-emerald-700"
                  : "bg-amber-950 text-amber-300 border border-amber-700"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{verifiedCount === 13 ? "100% SUBMISSION READY" : `${verifiedCount} / 13 ITEMS VERIFIED`}</span>
            </span>
          </div>
        </div>

        {/* Demo Warning Banner */}
        {isDemo && (
          <div className="bg-amber-950/80 border-2 border-amber-500/80 p-4 rounded-2xl text-amber-200 text-xs flex items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                <strong>DEMO DATASET ACTIVE</strong>: Submission readiness checks are currently showing synthetic demo status. Import or enter real research records to achieve full 100% verified status for official submission.
              </span>
            </div>
          </div>
        )}

        {/* Checklist Table */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 shadow-lg p-6 space-y-4">
          <h2 className="text-base font-bold text-white">Official 13-Point Challenge Requirements</h2>

          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs">Auditing readiness...</div>
          ) : (
            <div className="space-y-3">
              {checklist.map((item: any) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition-all ${
                    item.status === "VERIFIED"
                      ? "bg-slate-950 border-slate-800 text-slate-200"
                      : item.status === "DEMO_DATA"
                      ? "bg-amber-950/40 border-amber-800/60 text-amber-200"
                      : "bg-rose-950/40 border-rose-800/60 text-rose-200"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {item.status === "VERIFIED" ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h3 className="font-bold text-sm text-white">{item.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-xs font-black px-3 py-1 rounded ${
                        item.status === "VERIFIED"
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                          : item.status === "DEMO_DATA"
                          ? "bg-amber-950 text-amber-300 border border-amber-800"
                          : "bg-rose-950 text-rose-300 border border-rose-800"
                      }`}
                    >
                      {item.status === "VERIFIED"
                        ? "VERIFIED"
                        : item.status === "DEMO_DATA"
                        ? "DEMO DATA"
                        : "NOT VERIFIED"}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">{item.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ClientLayoutWrapper>
  );
}
