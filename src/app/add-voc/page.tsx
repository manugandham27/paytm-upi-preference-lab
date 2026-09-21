"use client";

import { useEffect, useState } from "react";
import { ClientLayoutWrapper } from "@/components/ClientLayoutWrapper";
import {
  PlusCircle,
  Search,
  Filter,
  Edit2,
  Trash2,
  Tag,
  CheckCircle2,
  AlertTriangle,
  X,
  Save,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import {
  OFFICIAL_12_TEMPLATE_COLUMNS,
  RESPONDENT_TYPES,
  PROFILES_CATEGORIES,
  PRIMARY_UPI_APPS,
  OCCASION_TYPES,
  BARRIER_CATEGORIES,
} from "@/lib/validation";

export default function AddVocPage() {
  const [vocs, setVocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVoc, setEditingVoc] = useState<any | null>(null);

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterApp, setFilterApp] = useState("ALL");
  const [filterMode, setFilterMode] = useState("ALL");

  // Form State matching 12 Official Columns
  const [formData, setFormData] = useState({
    vocId: "",
    date: new Date().toISOString().split("T")[0],
    respondentType: "Consumer",
    cityArea: "Mumbai (Bandra West)",
    profileCategory: "Working professional",
    upiAppsUsed: "Google Pay, Paytm",
    primaryUpiApp: "Google Pay",
    whyChosenExact: "",
    paytmUsageWhenWhy: "",
    analystNeedBarrier: "",
    opportunityIdea: "",
    keyQuote: "",
    isDemo: false,
  });

  useEffect(() => {
    fetchVocs();
  }, []);

  const fetchVocs = async () => {
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

  const handleOpenAddModal = () => {
    setEditingVoc(null);
    setFormData({
      vocId: `VOC-${String(vocs.length + 1).padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0],
      respondentType: "Consumer",
      cityArea: "Mumbai (Bandra West)",
      profileCategory: "Working professional",
      upiAppsUsed: "Google Pay, Paytm",
      primaryUpiApp: "Google Pay",
      whyChosenExact: "",
      paytmUsageWhenWhy: "",
      analystNeedBarrier: "",
      opportunityIdea: "",
      keyQuote: "",
      isDemo: false,
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (voc: any) => {
    setEditingVoc(voc);
    setFormData({
      vocId: voc.vocId || voc.id,
      date: voc.date || new Date().toISOString().split("T")[0],
      respondentType: voc.respondentType || "Consumer",
      cityArea: voc.cityArea || "Mumbai",
      profileCategory: voc.profileCategory || "Working Professional",
      upiAppsUsed: voc.upiAppsUsed || "Google Pay, Paytm",
      primaryUpiApp: voc.primaryUpiApp || "Google Pay",
      whyChosenExact: voc.whyChosenExact || voc.whyChosen || "",
      paytmUsageWhenWhy: voc.paytmUsageWhenWhy || voc.whyNotPaytm || "",
      analystNeedBarrier: voc.analystNeedBarrier || voc.researcherBarrier || "",
      opportunityIdea: voc.opportunityIdea || voc.researcherInsight || "",
      keyQuote: voc.keyQuote || voc.verbatimQuote || "",
      isDemo: Boolean(voc.isDemo),
    });
    setShowModal(true);
  };

  const handleSaveVoc = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVoc) {
        // PUT update
        await fetch("/api/voc", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingVoc.id, ...formData }),
        });
      } else {
        // POST create
        await fetch("/api/voc", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      setShowModal(false);
      fetchVocs();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteVoc = async (id: string) => {
    if (!confirm("Are you sure you want to delete this VOC record?")) return;
    try {
      await fetch(`/api/voc?id=${id}`, { method: "DELETE" });
      fetchVocs();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleDemoStatus = async (voc: any) => {
    try {
      await fetch("/api/voc", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: voc.id, isDemo: !voc.isDemo }),
      });
      fetchVocs();
    } catch (e) {
      console.error(e);
    }
  };

  // Filtered VOCs
  const filtered = vocs.filter((v) => {
    const matchesSearch =
      (v.vocId || "").toLowerCase().includes(search.toLowerCase()) ||
      (v.cityArea || "").toLowerCase().includes(search.toLowerCase()) ||
      (v.profileCategory || "").toLowerCase().includes(search.toLowerCase()) ||
      (v.whyChosenExact || "").toLowerCase().includes(search.toLowerCase()) ||
      (v.keyQuote || "").toLowerCase().includes(search.toLowerCase());

    const matchesType = filterType === "ALL" || v.respondentType === filterType;
    const matchesApp = filterApp === "ALL" || v.primaryUpiApp === filterApp;
    const matchesMode =
      filterMode === "ALL" || (filterMode === "REAL" ? !v.isDemo : v.isDemo);

    return matchesSearch && matchesType && matchesApp && matchesMode;
  });

  return (
    <ClientLayoutWrapper>
      <div className="space-y-6">
        {/* Header Title */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
              <PlusCircle className="w-6 h-6 text-paytm-cyan" />
              <span>VOC Data Collection Module</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Official 12-Column Paytm VOC intake, editor, import, and validator
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleOpenAddModal}
              className="bg-paytm-cyan hover:bg-cyan-400 text-paytm-navy font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-lg transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New VOC</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center gap-3 text-xs">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by VOC ID, City, Profile, Quote, or Reason..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-paytm-cyan"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-white rounded-lg p-2 focus:outline-none"
            >
              <option value="ALL">All Types</option>
              <option value="Consumer">Consumer</option>
              <option value="Merchant">Merchant</option>
            </select>

            <select
              value={filterApp}
              onChange={(e) => setFilterApp(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-white rounded-lg p-2 focus:outline-none"
            >
              <option value="ALL">All Primary Apps</option>
              {PRIMARY_UPI_APPS.map((app) => (
                <option key={app} value={app}>
                  {app}
                </option>
              ))}
            </select>

            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-white rounded-lg p-2 focus:outline-none"
            >
              <option value="ALL">All Datasets</option>
              <option value="REAL">Real Data</option>
              <option value="DEMO">Demo Data</option>
            </select>
          </div>
        </div>

        {/* Official 12-Column VOC Table */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs">Loading VOC records...</div>
          ) : filtered.length > 0 ? (
            <div className="overflow-x-auto max-h-[650px] scrollbar-thin">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 sticky top-0 z-10">
                  <tr>
                    <th className="p-3">Col 1: VOC ID</th>
                    <th className="p-3">Col 2: Date</th>
                    <th className="p-3">Col 3: Type</th>
                    <th className="p-3">Col 4: City / Area</th>
                    <th className="p-3">Col 5: Profile</th>
                    <th className="p-3">Col 7: Primary App</th>
                    <th className="p-3">Col 8: Why Chosen (Exact Words)</th>
                    <th className="p-3">Col 10: Analyst Need / Barrier</th>
                    <th className="p-3">Col 11: Opportunity / Idea</th>
                    <th className="p-3">Col 12: Key Quote</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filtered.map((voc) => (
                    <tr key={voc.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-mono text-paytm-cyan font-bold whitespace-nowrap">
                        {voc.vocId || "VOC-001"}
                      </td>
                      <td className="p-3 text-slate-400 whitespace-nowrap">{voc.date}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            voc.respondentType === "Merchant"
                              ? "bg-purple-950 text-purple-300 border border-purple-800"
                              : "bg-slate-800 text-slate-200"
                          }`}
                        >
                          {voc.respondentType || "Consumer"}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap font-medium text-white">{voc.cityArea}</td>
                      <td className="p-3 whitespace-nowrap">{voc.profileCategory}</td>
                      <td className="p-3 font-semibold text-paytm-cyan whitespace-nowrap">{voc.primaryUpiApp}</td>
                      <td className="p-3 max-w-xs truncate italic text-slate-300">
                        "{voc.whyChosenExact || voc.whyChosen}"
                      </td>
                      <td className="p-3 font-semibold text-amber-300 max-w-xs truncate">
                        {voc.analystNeedBarrier || voc.researcherBarrier}
                      </td>
                      <td className="p-3 text-emerald-300 max-w-xs truncate font-medium">
                        {voc.opportunityIdea || voc.researcherInsight}
                      </td>
                      <td className="p-3 max-w-xs truncate italic text-slate-400">
                        "{voc.keyQuote || voc.verbatimQuote}"
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleToggleDemoStatus(voc)}
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase transition-all ${
                            voc.isDemo
                              ? "bg-amber-950 text-amber-300 border border-amber-800 hover:bg-amber-900"
                              : "bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900"
                          }`}
                          title="Click to toggle REAL vs DEMO status"
                        >
                          {voc.isDemo ? "DEMO" : "REAL"}
                        </button>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleOpenEditModal(voc)}
                            className="p-1.5 hover:bg-slate-800 text-slate-300 rounded"
                            title="Edit VOC"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteVoc(voc.id)}
                            className="p-1.5 hover:bg-rose-950 text-rose-400 rounded"
                            title="Delete VOC"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 text-xs">
              No matching VOC records found. Click "Add New VOC" to create one.
            </div>
          )}
        </div>

        {/* Modal Form for Add/Edit VOC matching 12 Official Columns */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <form
              onSubmit={handleSaveVoc}
              className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 text-xs text-slate-200 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-paytm-cyan" />
                  <span>{editingVoc ? "Edit VOC Record" : "Add New Official VOC Record"}</span>
                </h2>
                <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 12 Official Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Col 1: VOC ID *</label>
                  <input
                    type="text"
                    value={formData.vocId}
                    onChange={(e) => setFormData({ ...formData, vocId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Col 2: Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Col 3: Respondent Type *</label>
                  <select
                    value={formData.respondentType}
                    onChange={(e) => setFormData({ ...formData, respondentType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  >
                    {RESPONDENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Col 4: City / Area *</label>
                  <input
                    type="text"
                    value={formData.cityArea}
                    onChange={(e) => setFormData({ ...formData, cityArea: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    placeholder="e.g. Bengaluru (Koramangala)"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Col 5: Profile / Category *</label>
                  <select
                    value={formData.profileCategory}
                    onChange={(e) => setFormData({ ...formData, profileCategory: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  >
                    {PROFILES_CATEGORIES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Col 7: Primary UPI App Used *</label>
                  <select
                    value={formData.primaryUpiApp}
                    onChange={(e) => setFormData({ ...formData, primaryUpiApp: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  >
                    {PRIMARY_UPI_APPS.map((app) => (
                      <option key={app} value={app}>{app}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Col 6: UPI Apps Used (Mention multiple if used for different occasions)</label>
                <input
                  type="text"
                  value={formData.upiAppsUsed}
                  onChange={(e) => setFormData({ ...formData, upiAppsUsed: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  placeholder="e.g. Google Pay, PhonePe, Paytm"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Col 8: Why was it chosen? (Exact words) *</label>
                <textarea
                  rows={2}
                  value={formData.whyChosenExact}
                  onChange={(e) => setFormData({ ...formData, whyChosenExact: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  placeholder="Unscripted respondent language..."
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Col 9: When or why is Paytm used? Or not used if switched from Paytm? *</label>
                <textarea
                  rows={2}
                  value={formData.paytmUsageWhenWhy}
                  onChange={(e) => setFormData({ ...formData, paytmUsageWhenWhy: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  placeholder="Usage context or drop-off reason..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Col 10: Need, barrier or motivation to switch (Analyst Derived) *</label>
                  <textarea
                    rows={2}
                    value={formData.analystNeedBarrier}
                    onChange={(e) => setFormData({ ...formData, analystNeedBarrier: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    placeholder="Analyst-derived insight..."
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Col 11: Opportunity / idea *</label>
                  <textarea
                    rows={2}
                    value={formData.opportunityIdea}
                    onChange={(e) => setFormData({ ...formData, opportunityIdea: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    placeholder="Direct Paytm product idea..."
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Col 12: Key quote (Anonymized verbatim) *</label>
                <textarea
                  rows={2}
                  value={formData.keyQuote}
                  onChange={(e) => setFormData({ ...formData, keyQuote: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white italic"
                  placeholder="Exact quote from respondent..."
                  required
                />
              </div>

              <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
                <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isDemo}
                    onChange={(e) => setFormData({ ...formData, isDemo: e.target.checked })}
                    className="rounded text-paytm-cyan focus:ring-paytm-cyan"
                  />
                  <span>Mark as DEMO / SYNTHETIC DATA record</span>
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-slate-800 text-slate-300 px-4 py-2 rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-paytm-cyan hover:bg-cyan-400 text-paytm-navy font-bold px-6 py-2 rounded flex items-center space-x-1"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingVoc ? "Update VOC" : "Save VOC Record"}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </ClientLayoutWrapper>
  );
}
