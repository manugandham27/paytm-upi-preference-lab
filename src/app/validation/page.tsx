"use client";

import { useEffect, useState } from "react";
import { ClientLayoutWrapper } from "@/components/ClientLayoutWrapper";
import { CheckSquare, Plus, Save, ThumbsUp, ThumbsDown } from "lucide-react";

export default function ValidationPage() {
  const [validations, setValidations] = useState<any[]>([]);
  const [solutions, setSolutions] = useState<any[]>([]);
  const [respondents, setRespondents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRecorder, setShowRecorder] = useState(false);

  const [form, setForm] = useState({
    solutionId: "",
    respondentId: "",
    solvesProblem: true,
    wouldChangeApp: true,
    targetOccasion: "Grocery",
    expectedFrequency: "Daily",
    perceivedBlockers: "",
    improvementSuggestions: "",
    existingAlternative: "PhonePe",
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

      const [valRes, solRes, respRes] = await Promise.all([
        fetch(`/api/validation?mode=${currentMode}`),
        fetch(`/api/solutions?mode=${currentMode}`),
        fetch(`/api/respondents?mode=${currentMode}`),
      ]);

      const valData = await valRes.json();
      const solData = await solRes.json();
      const respData = await respRes.json();

      setValidations(valData.validations || []);
      setSolutions(solData.solutions || []);
      setRespondents(respData.respondents || []);

      if (solData.solutions?.[0]) setForm((prev) => ({ ...prev, solutionId: solData.solutions[0].id }));
      if (respData.respondents?.[0]) setForm((prev) => ({ ...prev, respondentId: respData.respondents[0].id }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordValidation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/validation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setShowRecorder(false);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const total = validations.length;
  const solvesCount = validations.filter((v) => v.solvesProblem).length;
  const changeAppCount = validations.filter((v) => v.wouldChangeApp).length;
  const solvesPct = total > 0 ? Math.round((solvesCount / total) * 100) : 0;
  const changePct = total > 0 ? Math.round((changeAppCount / total) * 100) : 0;

  return (
    <ClientLayoutWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
              <CheckSquare className="w-6 h-6 text-emerald-400" />
              <span>Solution Validation Module</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Collect and quantify real-user validation feedback on proposed Paytm interventions
            </p>
          </div>

          <button
            onClick={() => setShowRecorder(!showRecorder)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Record User Feedback</span>
          </button>
        </div>

        {/* Validation Metrics Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400 font-semibold uppercase block">Total User Feedback</span>
            <div className="text-3xl font-black text-white mt-1">{total}</div>
            <span className="text-[10px] text-slate-500">Evaluations recorded</span>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400 font-semibold uppercase block">Solves Actual Problem</span>
            <div className="text-3xl font-black text-emerald-400 mt-1">{solvesPct}%</div>
            <span className="text-[10px] text-emerald-500">{solvesCount} / {total} positive</span>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400 font-semibold uppercase block">Would Change Primary App</span>
            <div className="text-3xl font-black text-paytm-cyan mt-1">{changePct}%</div>
            <span className="text-[10px] text-cyan-500">{changeAppCount} / {total} positive</span>
          </div>
        </div>

        {/* Feedback Recorder Form */}
        {showRecorder && (
          <form onSubmit={handleRecordValidation} className="bg-slate-900/90 p-6 rounded-2xl border border-emerald-800/50 shadow-2xl space-y-4 text-xs">
            <h2 className="text-base font-bold text-white">Record Real User Solution Feedback</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Target Solution Concept</label>
                <select
                  value={form.solutionId}
                  onChange={(e) => setForm({ ...form, solutionId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  required
                >
                  {solutions.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Respondent</label>
                <select
                  value={form.respondentId}
                  onChange={(e) => setForm({ ...form, respondentId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  required
                >
                  {respondents.map((r) => (
                    <option key={r.id} value={r.id}>{r.anonymousId} ({r.primaryUpiApp})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Q1. Does this solve a problem you actually experience?</label>
                <div className="flex space-x-4 pt-1">
                  <label className="flex items-center space-x-1 text-slate-200">
                    <input type="radio" checked={form.solvesProblem} onChange={() => setForm({ ...form, solvesProblem: true })} />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center space-x-1 text-slate-200">
                    <input type="radio" checked={!form.solvesProblem} onChange={() => setForm({ ...form, solvesProblem: false })} />
                    <span>No</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Q2. Would this change which UPI app you use?</label>
                <div className="flex space-x-4 pt-1">
                  <label className="flex items-center space-x-1 text-slate-200">
                    <input type="radio" checked={form.wouldChangeApp} onChange={() => setForm({ ...form, wouldChangeApp: true })} />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center space-x-1 text-slate-200">
                    <input type="radio" checked={!form.wouldChangeApp} onChange={() => setForm({ ...form, wouldChangeApp: false })} />
                    <span>No</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Q3. What would stop you from using it?</label>
                <input
                  type="text"
                  value={form.perceivedBlockers}
                  onChange={(e) => setForm({ ...form, perceivedBlockers: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  placeholder="e.g. Battery drain or complex permissions"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Q4. Existing app feature that solves this currently?</label>
                <input
                  type="text"
                  value={form.existingAlternative}
                  onChange={(e) => setForm({ ...form, existingAlternative: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  placeholder="e.g. PhonePe Home Screen Widget"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRecorder(false)}
                className="bg-slate-800 text-slate-300 px-4 py-2 rounded font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded flex items-center space-x-1"
              >
                <Save className="w-4 h-4" />
                <span>Save Validation Entry</span>
              </button>
            </div>
          </form>
        )}

        {/* Validation List */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-3 text-xs">
          <h2 className="text-base font-bold text-white">Validation Feedback Log</h2>
          {validations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Solution</th>
                    <th className="p-3">Respondent</th>
                    <th className="p-3">Solves Problem?</th>
                    <th className="p-3">Would Switch App?</th>
                    <th className="p-3">Perceived Blockers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {validations.map((val) => (
                    <tr key={val.id}>
                      <td className="p-3 font-semibold text-white">{val.solution?.name}</td>
                      <td className="p-3 font-mono text-paytm-cyan">{val.respondent?.anonymousId}</td>
                      <td className="p-3 font-bold">
                        {val.solvesProblem ? (
                          <span className="text-emerald-400">Yes</span>
                        ) : (
                          <span className="text-rose-400">No</span>
                        )}
                      </td>
                      <td className="p-3 font-bold">
                        {val.wouldChangeApp ? (
                          <span className="text-paytm-cyan">Yes</span>
                        ) : (
                          <span className="text-rose-400">No</span>
                        )}
                      </td>
                      <td className="p-3 text-slate-400">{val.perceivedBlockers || "None"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">No solution validation feedback logged yet.</div>
          )}
        </div>
      </div>
    </ClientLayoutWrapper>
  );
}
