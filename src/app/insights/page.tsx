"use client";

import { useEffect, useState } from "react";
import { ClientLayoutWrapper } from "@/components/ClientLayoutWrapper";
import { Lightbulb, Plus, Save, Sparkles, CheckCircle2 } from "lucide-react";

export default function InsightsPage() {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    observation: "",
    evidenceCount: 10,
    verbatimQuote: "",
    pattern: "",
    barrier: "Convenience",
    opportunity: "",
    implication: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const modeRes = await fetch("/api/demo");
      const modeData = await modeRes.json();
      const currentMode = modeData.activeMode || "REAL";

      const res = await fetch(`/api/insights?mode=${currentMode}`);
      const data = await res.json();
      setInsights(data.insights || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInsight = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setShowForm(false);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ClientLayoutWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Lightbulb className="w-6 h-6 text-amber-400" />
              <span>Evidence-Backed Insight Engine</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Structured findings: Observation → Evidence → Verbatim → Pattern → Barrier → Opportunity → Implication
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-4 py-2 rounded-xl text-xs flex items-center space-x-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Synthesize New Insight</span>
          </button>
        </div>

        {/* New Insight Form */}
        {showForm && (
          <form onSubmit={handleCreateInsight} className="bg-slate-900/90 p-6 rounded-2xl border border-amber-500/50 shadow-2xl space-y-4 text-xs">
            <h2 className="text-base font-bold text-white">Synthesize Evidence-Backed Insight</h2>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Insight Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                placeholder="e.g. Soundbox Counter Branding Dictates Low-Ticket Kirana App Choice"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Observation (What respondents did)</label>
                <textarea
                  rows={2}
                  value={form.observation}
                  onChange={(e) => setForm({ ...form, observation: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Representative Verbatim</label>
                <textarea
                  rows={2}
                  value={form.verbatimQuote}
                  onChange={(e) => setForm({ ...form, verbatimQuote: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white italic"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Behavior Pattern</label>
                <textarea
                  rows={2}
                  value={form.pattern}
                  onChange={(e) => setForm({ ...form, pattern: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Product Opportunity</label>
                <textarea
                  rows={2}
                  value={form.opportunity}
                  onChange={(e) => setForm({ ...form, opportunity: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-slate-800 text-slate-300 px-4 py-2 rounded font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2 rounded flex items-center space-x-1"
              >
                <Save className="w-4 h-4" />
                <span>Save Insight</span>
              </button>
            </div>
          </form>
        )}

        {/* Insight Cards */}
        <div className="space-y-4">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs">Loading insights...</div>
          ) : insights.length > 0 ? (
            insights.map((ins) => (
              <div key={ins.id} className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span>{ins.title}</span>
                  </h2>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Evidence: {ins.evidenceCount} VOCs
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-3">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 font-bold block uppercase text-[10px] mb-1">Observation</span>
                      <p className="text-slate-200">{ins.observation}</p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 font-bold block uppercase text-[10px] mb-1">Representative Verbatim</span>
                      <p className="italic text-amber-200">"{ins.verbatimQuote}"</p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 font-bold block uppercase text-[10px] mb-1">Common Pattern</span>
                      <p className="text-slate-300">{ins.pattern}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 font-bold block uppercase text-[10px] mb-1">Root Barrier</span>
                      <span className="font-bold text-rose-400">{ins.barrier}</span>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 font-bold block uppercase text-[10px] mb-1">Paytm Product Opportunity</span>
                      <p className="text-paytm-cyan font-semibold">{ins.opportunity}</p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 font-bold block uppercase text-[10px] mb-1">Strategic Implication</span>
                      <p className="text-slate-300">{ins.implication}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-slate-900/80 p-12 text-center text-slate-500 text-xs rounded-2xl border border-slate-800">
              No insights synthesized yet.
            </div>
          )}
        </div>
      </div>
    </ClientLayoutWrapper>
  );
}
