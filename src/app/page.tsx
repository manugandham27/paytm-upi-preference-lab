"use client";

import { useEffect, useState } from "react";
import { ClientLayoutWrapper } from "@/components/ClientLayoutWrapper";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  PlusCircle,
  FileSpreadsheet,
  FileText,
  PieChart as PieIcon,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const modeRes = await fetch("/api/demo");
      const modeData = await modeRes.json();
      const currentMode = modeData.activeMode || "REAL";

      const [qcRes, vocRes, barrierRes] = await Promise.all([
        fetch(`/api/qc?mode=${currentMode}`),
        fetch(`/api/voc?mode=${currentMode}`),
        fetch(`/api/respondents?mode=${currentMode}`),
      ]);

      const qc = await qcRes.json();
      const vocs = await vocRes.json();
      const respondents = await barrierRes.json();

      setData({
        mode: currentMode,
        stats: qc.stats || {},
        audit: qc.audit || {},
        vocs: vocs.vocs || [],
        respondents: respondents.respondents || [],
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const isDemo = data?.mode === "DEMO";
  const stats = data?.stats || { totalVocCount: 0, inDepthCount: 0, eligibleCount: 0, invalidCount: 0 };
  const vocs = data?.vocs || [];
  const isValidVocMet = stats.totalVocCount >= 50;

  // Compute Primary App distribution
  const primaryAppCounts: Record<string, number> = {};
  vocs.forEach((v: any) => {
    const app = v.respondent?.primaryUpiApp || "Unknown";
    primaryAppCounts[app] = (primaryAppCounts[app] || 0) + 1;
  });

  const primaryAppData = Object.keys(primaryAppCounts).map((key) => ({
    name: key,
    value: primaryAppCounts[key],
  }));

  const COLORS = ["#00baf2", "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

  // Compute Payment Occasion distribution
  const occasionCounts: Record<string, number> = {};
  vocs.forEach((v: any) => {
    const occ = v.occasionType || "Other";
    occasionCounts[occ] = (occasionCounts[occ] || 0) + 1;
  });

  const occasionData = Object.keys(occasionCounts).map((key) => ({
    name: key,
    count: occasionCounts[key],
  }));

  // Compute Barriers distribution
  const barrierCounts: Record<string, number> = {};
  vocs.forEach((v: any) => {
    const b = v.researcherBarrier || "Other";
    barrierCounts[b] = (barrierCounts[b] || 0) + 1;
  });

  const barrierData = Object.keys(barrierCounts)
    .map((key) => ({ name: key, count: barrierCounts[key] }))
    .sort((a, b) => b.count - a.count);

  return (
    <ClientLayoutWrapper>
      <div className="space-y-6">
        {/* Header Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-black tracking-tight text-white">
                Research Dashboard
              </h1>
              <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-paytm-cyan/20 text-paytm-cyan border border-paytm-cyan/40">
                {isDemo ? "DEMO MODE DATA" : "REAL RESEARCH DATA"}
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Paytm UPI Growth Challenge 2026 — Track A (Build Primary-App Preference)
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/add-voc"
              className="bg-paytm-cyan text-paytm-navy font-bold px-4 py-2.5 rounded-xl text-sm flex items-center space-x-2 shadow-lg hover:bg-cyan-400 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Record New VOC</span>
            </Link>

            <Link
              href="/submission"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm flex items-center space-x-2 transition-all shadow-md"
            >
              <FileText className="w-4 h-4" />
              <span>2-Page PDF Generator</span>
            </Link>
          </div>
        </div>

        {/* Anti-Fabrication & Progress Alert Banner */}
        {!isValidVocMet && !isDemo && (
          <div className="bg-amber-950/80 border-2 border-amber-500/80 p-5 rounded-2xl text-amber-200 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-amber-100 text-base">
                  Research Incomplete — {stats.totalVocCount} / 50 Valid VOCs Collected
                </h3>
                <p className="text-xs text-amber-300/90 mt-1 leading-relaxed">
                  Per strict challenge rules, findings and exports require exactly 50 verified Track A VOCs and 10 in-depth interviews.
                  Do NOT fabricate responses. Continue intaking real respondents or switch to DEMO MODE to evaluate platform features.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <Link
                href="/add-voc"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-3.5 py-2 rounded-lg transition-all"
              >
                Add Real VOC
              </Link>
            </div>
          </div>
        )}

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Valid Track A VOCs
              </span>
              <Users className="w-5 h-5 text-paytm-cyan" />
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-black text-white">{stats.totalVocCount}</span>
              <span className="text-xs text-slate-400 font-semibold">/ 50 Target</span>
            </div>
            <div className="mt-2 text-xs text-slate-400">
              {isValidVocMet ? (
                <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>50 VOC Requirement Met</span>
                </span>
              ) : (
                <span className="text-amber-400 font-semibold">
                  {50 - stats.totalVocCount} more needed
                </span>
              )}
            </div>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                In-Depth Interviews
              </span>
              <MessageSquare className="w-5 h-5 text-purple-400" />
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-black text-white">{stats.inDepthCount}</span>
              <span className="text-xs text-slate-400 font-semibold">/ 10 Target</span>
            </div>
            <div className="mt-2 text-xs text-slate-400">
              {stats.inDepthCount >= 10 ? (
                <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>10 In-Depth Benchmark Met</span>
                </span>
              ) : (
                <span className="text-purple-400 font-semibold">
                  {10 - stats.inDepthCount} more in-depth needed
                </span>
              )}
            </div>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Eligible Respondents
              </span>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-black text-white">{stats.eligibleCount}</span>
              <span className="text-xs text-emerald-400 font-semibold">100% Verified</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Satisfies 90d Paytm use + non-Paytm primary app
            </p>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Screening Rejections
              </span>
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-black text-white">{stats.invalidCount}</span>
              <span className="text-xs text-rose-400 font-semibold">Ineligible</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Rejected to preserve dataset integrity
            </p>
          </div>
        </div>

        {/* Analytics Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Primary App Share Distribution */}
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <PieIcon className="w-4 h-4 text-paytm-cyan" />
                  <span>Primary UPI App Share (Eligible Track A Users)</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Distribution of non-Paytm primary UPI apps among target cohort
                </p>
              </div>
            </div>

            {primaryAppData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={primaryAppData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {primaryAppData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs">
                <AlertTriangle className="w-8 h-8 mb-2 text-slate-600" />
                <span>No research data collected yet.</span>
              </div>
            )}
          </div>

          {/* Payment Occasion Breakdown */}
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">
                  Payment Occasions Where Paytm Loses Share
                </h2>
                <p className="text-xs text-slate-400">
                  Occasion breakdown across collected research records
                </p>
              </div>
              <Link href="/occasions" className="text-xs text-paytm-cyan hover:underline flex items-center space-x-1">
                <span>Matrix View</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {occasionData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={occasionData}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} />
                    <Bar dataKey="count" fill="#00baf2" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs">
                <AlertTriangle className="w-8 h-8 mb-2 text-slate-600" />
                <span>No payment occasion data collected yet.</span>
              </div>
            )}
          </div>
        </div>

        {/* Top Identified Barriers */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">
                Top Validated Barriers Preventing Paytm Usage
              </h2>
              <p className="text-xs text-slate-400">
                12-Category barrier frequency mapped from respondent verbatims
              </p>
            </div>
            <Link href="/barriers" className="text-xs text-paytm-cyan hover:underline flex items-center space-x-1">
              <span>Deep Dive</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {barrierData.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {barrierData.map((b, idx) => (
                <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <span className="text-xs font-semibold text-slate-300 truncate">{b.name}</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-lg font-black text-paytm-cyan">{b.count}</span>
                    <span className="text-[10px] text-slate-500 font-medium">VOCs</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              No barrier data recorded yet.
            </div>
          )}
        </div>

        {/* Recent Intake Activity Stream */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Recent VOC Collection Log</h2>
            <Link href="/respondents" className="text-xs text-paytm-cyan hover:underline">
              View All Respondents
            </Link>
          </div>

          {vocs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Respondent ID</th>
                    <th className="p-3">Primary App</th>
                    <th className="p-3">Payment Occasion</th>
                    <th className="p-3">Barrier</th>
                    <th className="p-3">Verbatim Preview</th>
                    <th className="p-3">Depth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {vocs.slice(0, 5).map((v: any) => (
                    <tr key={v.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-3 font-mono text-paytm-cyan font-semibold">
                        {v.respondent?.anonymousId}
                      </td>
                      <td className="p-3 font-medium text-white">{v.respondent?.primaryUpiApp}</td>
                      <td className="p-3 text-slate-300">{v.occasionType}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                          {v.researcherBarrier}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 max-w-xs truncate italic">
                        "{v.verbatimQuote}"
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            v.interviewDepth === "IN_DEPTH"
                              ? "bg-purple-950 text-purple-300 border border-purple-800"
                              : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {v.interviewDepth}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              Zero VOC records in current mode. Use the intake wizard or import file to collect data.
            </div>
          )}
        </div>
      </div>
    </ClientLayoutWrapper>
  );
}
