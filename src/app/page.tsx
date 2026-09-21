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
  Award,
  Store,
  MapPin,
  Tag,
  Download,
  AlertCircle,
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

      const [qcRes, vocRes] = await Promise.all([
        fetch(`/api/qc?mode=${currentMode}`),
        fetch(`/api/voc?mode=${currentMode}`),
      ]);

      const qc = await qcRes.json();
      const vocs = await vocRes.json();

      setData({
        mode: currentMode,
        stats: qc.stats || {},
        checklist: qc.readinessChecklist || [],
        vocs: vocs.vocs || [],
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
  const stats = data?.stats || {};
  const checklist = data?.checklist || [];
  const vocs = data?.vocs || [];

  // Primary App distribution
  const primaryAppCounts: Record<string, number> = {};
  vocs.forEach((v: any) => {
    const app = v.primaryUpiApp || "Unknown";
    primaryAppCounts[app] = (primaryAppCounts[app] || 0) + 1;
  });

  const primaryAppData = Object.keys(primaryAppCounts).map((key) => ({
    name: key,
    value: primaryAppCounts[key],
  }));

  const COLORS = ["#00baf2", "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

  // Payment Occasion distribution
  const occasionCounts: Record<string, number> = {};
  vocs.forEach((v: any) => {
    const occ = v.occasionType || "Other";
    occasionCounts[occ] = (occasionCounts[occ] || 0) + 1;
  });

  const occasionData = Object.keys(occasionCounts).map((key) => ({
    name: key,
    count: occasionCounts[key],
  }));

  // City distribution
  const cityCounts: Record<string, number> = {};
  vocs.forEach((v: any) => {
    const city = (v.cityArea || "Unknown").split(" ")[0];
    cityCounts[city] = (cityCounts[city] || 0) + 1;
  });

  const cityData = Object.keys(cityCounts).map((key) => ({
    name: key,
    count: cityCounts[key],
  }));

  return (
    <ClientLayoutWrapper>
      <div className="space-y-6">
        {/* Header Title Bar */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-black tracking-tight text-white">
                Paytm Track A Research Dashboard
              </h1>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                  isDemo
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                }`}
              >
                {isDemo ? "DEMO / SYNTHETIC DATA" : "REAL RESEARCH DATA"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Paytm UPI Growth Challenge 2026 — Track A: Build Primary-App Preference
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/add-voc"
              className="bg-paytm-cyan text-paytm-navy font-bold px-4 py-2.5 rounded-xl text-sm flex items-center space-x-2 shadow-lg hover:bg-cyan-400 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add / Manage VOCs</span>
            </Link>

            <Link
              href="/data-io"
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm flex items-center space-x-2 transition-all border border-slate-700"
            >
              <FileSpreadsheet className="w-4 h-4 text-paytm-cyan" />
              <span>Export TeamName_VOC.xlsx</span>
            </Link>
          </div>
        </div>

        {/* Demo Warning Banner */}
        {isDemo && (
          <div className="bg-amber-950/80 border-2 border-amber-500/80 p-4 rounded-2xl text-amber-200 text-xs flex items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                <strong>DEMO DATASET ACTIVE</strong>: Currently showing 50 synthetic test records (VOC-001 through VOC-050). Real interview data entered by the researcher will replace these records.
              </span>
            </div>
          </div>
        )}

        {/* Research Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total VOCs</span>
            <span className="text-2xl font-black text-white mt-1 block">{stats.totalVocCount || 0}</span>
            <span className="text-[10px] text-slate-500 font-semibold">Target: 50</span>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Real VOCs</span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">{stats.realVocCount || 0}</span>
            <span className="text-[10px] text-emerald-500 font-semibold">Verified Interviews</span>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Consumers</span>
            <span className="text-2xl font-black text-paytm-cyan mt-1 block">{stats.consumersCount || 0}</span>
            <span className="text-[10px] text-slate-400 font-semibold">Shoppers / Students</span>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Merchants</span>
            <span className="text-2xl font-black text-purple-400 mt-1 block">{stats.merchantsCount || 0}</span>
            <span className="text-[10px] text-purple-400 font-semibold">Kirana / Vendors</span>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Cities / Areas</span>
            <span className="text-2xl font-black text-amber-400 mt-1 block">{stats.distinctCities || 0}</span>
            <span className="text-[10px] text-amber-500 font-semibold">Geographic Spread</span>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Primary Apps</span>
            <span className="text-2xl font-black text-rose-400 mt-1 block">{stats.distinctApps || 0}</span>
            <span className="text-[10px] text-slate-400 font-semibold">Competitor Pool</span>
          </div>
        </div>

        {/* Submission Readiness Checker */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Award className="w-5 h-5 text-paytm-cyan" />
                <span>Submission Readiness Checker</span>
              </h2>
              <p className="text-xs text-slate-400">
                Official 13-point compliance audit for Paytm UPI Growth Challenge submission
              </p>
            </div>
            <Link href="/quality-control" className="text-xs text-paytm-cyan hover:underline font-semibold">
              View Audit Detail
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {checklist.map((item: any) => (
              <div key={item.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <span className="font-bold text-white block">{item.title}</span>
                  <p className="text-[11px] text-slate-400 leading-tight">{item.detail}</p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black shrink-0 ${
                    item.status === "VERIFIED"
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                      : item.status === "DEMO_DATA"
                      ? "bg-amber-950 text-amber-300 border border-amber-800"
                      : "bg-rose-950 text-rose-300 border border-rose-800"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Primary App Share Distribution */}
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <PieIcon className="w-4 h-4 text-paytm-cyan" />
              <span>Primary UPI App Share</span>
            </h2>
            {primaryAppData.length > 0 ? (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={primaryAppData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {primaryAppData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-56 flex items-center justify-center text-slate-500 text-xs">No data</div>
            )}
          </div>

          {/* Payment Occasion Breakdown */}
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4">
            <h2 className="text-base font-bold text-white">Payment Occasions</h2>
            {occasionData.length > 0 ? (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={occasionData}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} />
                    <Bar dataKey="count" fill="#00baf2" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-56 flex items-center justify-center text-slate-500 text-xs">No data</div>
            )}
          </div>

          {/* City Distribution */}
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>City / Geographic Breakdown</span>
            </h2>
            {cityData.length > 0 ? (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cityData} layout="vertical">
                    <XAxis type="number" stroke="#94a3b8" fontSize={10} />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} />
                    <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-56 flex items-center justify-center text-slate-500 text-xs">No data</div>
            )}
          </div>
        </div>
      </div>
    </ClientLayoutWrapper>
  );
}
