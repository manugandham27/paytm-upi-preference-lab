"use client";

import { useEffect, useState } from "react";
import { ClientLayoutWrapper } from "@/components/ClientLayoutWrapper";
import { Award, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

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

  const audit = qcData?.audit;
  const checks = audit?.checks || [];
  const passedCount = audit?.passedCount || 0;
  const totalCount = audit?.totalCount || 13;
  const isFullyCompliant = audit?.isFullyCompliant;

  return (
    <ClientLayoutWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Award className="w-6 h-6 text-paytm-cyan" />
              <span>Research Quality Control & Track A Audit</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Automated 13-point compliance verification engine ensuring zero anti-fabrication violations
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center space-x-1.5 ${
                isFullyCompliant
                  ? "bg-emerald-950 text-emerald-300 border border-emerald-700"
                  : "bg-amber-950 text-amber-300 border border-amber-700"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isFullyCompliant ? "100% FULLY COMPLIANT" : `${passedCount} / ${totalCount} CHECKS PASSED`}</span>
            </span>
          </div>
        </div>

        {/* Audit Checklist Table */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 shadow-lg p-6 space-y-4">
          <h2 className="text-base font-bold text-white">13-Point Compliance Checklist</h2>

          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs">Auditing dataset...</div>
          ) : (
            <div className="space-y-3">
              {checks.map((check: any) => (
                <div
                  key={check.id}
                  className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition-all ${
                    check.passed
                      ? "bg-slate-950 border-slate-800 text-slate-200"
                      : "bg-amber-950/40 border-amber-800/60 text-amber-200"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {check.passed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h3 className="font-bold text-sm text-white">{check.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{check.description}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded ${
                        check.passed
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                          : "bg-amber-950 text-amber-300 border border-amber-800"
                      }`}
                    >
                      {check.detail}
                    </span>
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
