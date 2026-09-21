"use client";

import { useEffect, useState } from "react";
import { ClientLayoutWrapper } from "@/components/ClientLayoutWrapper";
import { MessageSquare, CheckCircle2, Plus, Save, User, FileText, ChevronRight } from "lucide-react";

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [respondents, setRespondents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRecorder, setShowRecorder] = useState(false);
  const [selectedRespId, setSelectedRespId] = useState("");

  const [promptAnswers, setPromptAnswers] = useState({
    q1_habits: "",
    q2_primary_choice: "",
    q3_recent_tx: "",
    q4_paytm_usage: "",
    q5_switching_behavior: "",
    q6_payment_occasions: "",
    q7_trust: "",
    q8_reliability: "",
    q9_convenience: "",
    q10_merchant_exp: "",
    q11_rewards: "",
    q12_feature_awareness: "",
    q13_habit: "",
    q14_social_influence: "",
    q15_frustrations: "",
    q16_desired_improvements: "",
  });

  const [observations, setObservations] = useState("");
  const [emergingInsights, setEmergingInsights] = useState("");
  const [keyQuote, setKeyQuote] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const modeRes = await fetch("/api/demo");
      const modeData = await modeRes.json();
      const currentMode = modeData.activeMode || "REAL";

      const [intRes, respRes] = await Promise.all([
        fetch(`/api/interviews?mode=${currentMode}`),
        fetch(`/api/respondents?mode=${currentMode}`),
      ]);

      const intData = await intRes.json();
      const respData = await respRes.json();

      setInterviews(intData.interviews || []);
      setRespondents(respData.respondents || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRespId) return alert("Please select a respondent.");

    try {
      const res = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          respondentId: selectedRespId,
          promptAnswers,
          observations,
          keyQuotes: [keyQuote],
          emergingInsights,
        }),
      });

      if (res.ok) {
        setShowRecorder(false);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const PROMPTS = [
    { key: "q1_habits", title: "1. UPI Habits & Daily Rhythm" },
    { key: "q2_primary_choice", title: "2. Primary App Choice Rationale" },
    { key: "q3_recent_tx", title: "3. Detailed Recent Transaction Walkthrough" },
    { key: "q4_paytm_usage", title: "4. Past vs Current Paytm Usage Patterns" },
    { key: "q5_switching_behavior", title: "5. Switching Triggers & History" },
    { key: "q6_payment_occasions", title: "6. Payment Occasion Distribution" },
    { key: "q7_trust", title: "7. Security & Brand Trust Perception" },
    { key: "q8_reliability", title: "8. Transaction Failures & Error Handling" },
    { key: "q9_convenience", title: "9. Speed & UI Friction" },
    { key: "q10_merchant_exp", title: "10. Merchant Soundbox & Counter Cues" },
    { key: "q11_rewards", title: "11. Rewards & Value Proposition Impact" },
    { key: "q12_feature_awareness", title: "12. Awareness of Paytm Features (UPI Lite, etc.)" },
    { key: "q13_habit", title: "13. Muscle Memory & Icon Placement" },
    { key: "q14_social_influence", title: "14. Peer & Contact Network Influence" },
    { key: "q15_frustrations", title: "15. Specific Frustrations with Paytm" },
    { key: "q16_desired_improvements", title: "16. Desired Improvements & Win-Back Triggers" },
  ];

  return (
    <ClientLayoutWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
              <MessageSquare className="w-6 h-6 text-purple-400" />
              <span>16-Point In-Depth Interview Studio</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Recorded session archive (Requirement: Minimum 10 in-depth interviews)
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-semibold text-slate-300">
              Completed: <span className="text-purple-400 font-bold">{interviews.length} / 10</span>
            </div>
            <button
              onClick={() => setShowRecorder(!showRecorder)}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-2 shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Record New Interview</span>
            </button>
          </div>
        </div>

        {/* Interview Recorder Form */}
        {showRecorder && (
          <form onSubmit={handleSaveInterview} className="bg-slate-900/90 p-6 rounded-2xl border border-purple-800/50 shadow-2xl space-y-6">
            <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Record 16-Point In-Depth Session</h2>
                <p className="text-xs text-slate-400">Select a Track A respondent and populate structured interview prompts.</p>
              </div>
              <select
                value={selectedRespId}
                onChange={(e) => setSelectedRespId(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-white p-2.5 rounded-lg"
                required
              >
                <option value="">Select Respondent ID...</option>
                {respondents.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.anonymousId} ({r.primaryUpiApp} • {r.occupation})
                  </option>
                ))}
              </select>
            </div>

            {/* 16 Prompts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
              {PROMPTS.map((p) => (
                <div key={p.key} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <label className="text-xs font-semibold text-purple-300 block">{p.title}</label>
                  <textarea
                    rows={2}
                    value={(promptAnswers as any)[p.key]}
                    onChange={(e) => setPromptAnswers({ ...promptAnswers, [p.key]: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    placeholder="Enter respondent's detailed response..."
                  />
                </div>
              ))}
            </div>

            {/* Verbatims & Insights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-800 pt-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Key Verbatim Quote</label>
                <textarea
                  rows={2}
                  value={keyQuote}
                  onChange={(e) => setKeyQuote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white italic"
                  placeholder="Exact quote from interview..."
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Interviewer Observations</label>
                <textarea
                  rows={2}
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white"
                  placeholder="Behavioral observations..."
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Emerging Insight</label>
                <textarea
                  rows={2}
                  value={emergingInsights}
                  onChange={(e) => setEmergingInsights(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white"
                  placeholder="Emerging strategic insight..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowRecorder(false)}
                className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-2 rounded-lg text-xs flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Interview Session</span>
              </button>
            </div>
          </form>
        )}

        {/* Interview List */}
        <div className="space-y-4">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs">Loading interview sessions...</div>
          ) : interviews.length > 0 ? (
            interviews.map((int: any) => {
              const answers = JSON.parse(int.promptAnswersJson || "{}");
              return (
                <div key={int.id} className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-md space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-purple-950 text-purple-300 border border-purple-800 flex items-center justify-center font-bold text-xs">
                        ID
                      </div>
                      <div>
                        <span className="font-mono text-sm font-bold text-paytm-cyan">
                          {int.respondent?.anonymousId}
                        </span>
                        <span className="text-xs text-slate-400 ml-2">
                          ({int.respondent?.primaryUpiApp} • {int.respondent?.occupation})
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                      16-Point Session
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-purple-400 font-semibold block mb-1">Primary App Choice Rationale</span>
                      <p>{answers.q2_primary_choice || "N/A"}</p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-purple-400 font-semibold block mb-1">Paytm Switching Triggers</span>
                      <p>{answers.q5_switching_behavior || "N/A"}</p>
                    </div>
                  </div>

                  {int.emergingInsights && (
                    <div className="bg-purple-950/40 p-3 rounded-xl border border-purple-800/40 text-xs">
                      <span className="text-purple-300 font-bold block mb-0.5">Emerging Strategic Insight</span>
                      <p className="text-purple-200">{int.emergingInsights}</p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-slate-900/80 p-12 text-center text-slate-500 text-xs rounded-2xl border border-slate-800">
              No in-depth interviews recorded yet. Click "Record New Interview" to begin.
            </div>
          )}
        </div>
      </div>
    </ClientLayoutWrapper>
  );
}
