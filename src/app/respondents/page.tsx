"use client";

import { useEffect, useState } from "react";
import { ClientLayoutWrapper } from "@/components/ClientLayoutWrapper";
import { Users, Search, Filter, CheckCircle2, MessageSquare, ExternalLink, X } from "lucide-react";

export default function RespondentsPage() {
  const [respondents, setRespondents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterApp, setFilterApp] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedResp, setSelectedResp] = useState<any | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const modeRes = await fetch("/api/demo");
      const modeData = await modeRes.json();
      const currentMode = modeData.activeMode || "REAL";

      const res = await fetch(`/api/respondents?mode=${currentMode}`);
      const data = await res.json();
      setRespondents(data.respondents || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = respondents.filter((r) => {
    const matchesSearch =
      r.anonymousId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.occupation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.vocResponses?.[0]?.verbatimQuote || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesApp = filterApp === "ALL" || r.primaryUpiApp === filterApp;
    const matchesStatus = filterStatus === "ALL" || r.completionStatus === filterStatus;

    return matchesSearch && matchesApp && matchesStatus;
  });

  return (
    <ClientLayoutWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Users className="w-6 h-6 text-paytm-cyan" />
              <span>Respondents Directory</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Search, filter, and inspect verified Track A respondent profiles
            </p>
          </div>
          <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-950 text-slate-300 border border-slate-800">
            Total Intake: <span className="text-paytm-cyan font-bold">{respondents.length}</span> Respondents
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Respondent ID, City, Occupation, or Verbatim..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-paytm-cyan"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={filterApp}
              onChange={(e) => setFilterApp(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-white rounded-lg p-2 focus:outline-none"
            >
              <option value="ALL">All Primary Apps</option>
              <option value="Google Pay">Google Pay</option>
              <option value="PhonePe">PhonePe</option>
              <option value="BHIM">BHIM</option>
              <option value="Bank UPI app">Bank UPI app</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-white rounded-lg p-2 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="VALID_VOC">Valid VOC</option>
              <option value="IN_DEPTH">In-Depth Interview</option>
              <option value="INVALID_SCREENING">Screening Rejected</option>
            </select>
          </div>
        </div>

        {/* Respondent Table */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs">Loading respondents...</div>
          ) : filtered.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Age & Demographics</th>
                    <th className="p-3">Primary App</th>
                    <th className="p-3">Monthly UPI Vol</th>
                    <th className="p-3">Recent Occasion</th>
                    <th className="p-3">Track A Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filtered.map((r) => {
                    const voc = r.vocResponses?.[0] || {};
                    return (
                      <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-mono text-paytm-cyan font-bold">
                          {r.anonymousId}
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-white">{r.occupation}</div>
                          <div className="text-[11px] text-slate-400">
                            {r.ageRange} yrs • {r.city}
                          </div>
                        </td>
                        <td className="p-3 font-medium text-white">{r.primaryUpiApp}</td>
                        <td className="p-3">
                          <div className="font-semibold">{r.monthlyPaymentCount} txs/mo</div>
                          <div className="text-[11px] text-slate-400">₹{r.monthlyPaymentValue?.toLocaleString()}</div>
                        </td>
                        <td className="p-3">
                          <div className="text-slate-200">{voc.occasionType || "N/A"}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-xs">{voc.recentTxDescription}</div>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                              r.completionStatus === "IN_DEPTH"
                                ? "bg-purple-950 text-purple-300 border border-purple-800"
                                : r.completionStatus === "VALID_VOC"
                                ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                                : "bg-rose-950 text-rose-300 border border-rose-800"
                            }`}
                          >
                            {r.completionStatus}
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => setSelectedResp(r)}
                            className="bg-slate-800 hover:bg-slate-700 text-paytm-cyan px-2.5 py-1 rounded text-xs font-semibold flex items-center space-x-1"
                          >
                            <span>Inspect</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 text-xs">
              No matching respondents found.
            </div>
          )}
        </div>

        {/* Profile Modal Drawer */}
        {selectedResp && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 text-xs text-slate-200 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-base font-bold text-paytm-cyan">
                    {selectedResp.anonymousId}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Track A Eligible
                  </span>
                </div>
                <button
                  onClick={() => setSelectedResp(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Demographics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">Age Range</span>
                  <span className="font-semibold text-white">{selectedResp.ageRange}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">Occupation</span>
                  <span className="font-semibold text-white">{selectedResp.occupation}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">City</span>
                  <span className="font-semibold text-white">{selectedResp.city}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">Primary App</span>
                  <span className="font-semibold text-paytm-cyan">{selectedResp.primaryUpiApp}</span>
                </div>
              </div>

              {/* VOC Response Details */}
              {selectedResp.vocResponses?.[0] && (
                <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h3 className="font-bold text-white text-sm">Recent Transaction & Drop-off Context</h3>
                  <div>
                    <span className="text-slate-400 font-semibold">Payment Occasion: </span>
                    <span className="text-white">{selectedResp.vocResponses[0].occasionType} ({selectedResp.vocResponses[0].occasionCategory})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">Transaction Description: </span>
                    <span className="text-white">{selectedResp.vocResponses[0].recentTxDescription}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">Why App Chosen: </span>
                    <span className="text-white">{selectedResp.vocResponses[0].whyChosen}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">Why NOT Paytm: </span>
                    <span className="text-amber-300">{selectedResp.vocResponses[0].whyNotPaytm}</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Verbatim Quote</span>
                    <p className="italic text-slate-200">"{selectedResp.vocResponses[0].verbatimQuote}"</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">Identified Barrier: </span>
                    <span className="px-2 py-0.5 rounded bg-paytm-navy text-paytm-cyan font-bold">
                      {selectedResp.vocResponses[0].researcherBarrier}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">Researcher Insight: </span>
                    <span className="text-slate-300">{selectedResp.vocResponses[0].researcherInsight}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ClientLayoutWrapper>
  );
}
