"use client";

import { useState } from "react";
import { ClientLayoutWrapper } from "@/components/ClientLayoutWrapper";
import { FileSpreadsheet, Upload, Download, CheckCircle2, AlertTriangle, FileText, AlertCircle } from "lucide-react";

export default function DataIoPage() {
  const [uploading, setUploading] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [teamName, setTeamName] = useState("Team_Paytm_Innovators");
  const [showExportWarning, setShowExportWarning] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setImportResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      setImportResult(result);
    } catch (err: any) {
      setImportResult({ error: err.message });
    } finally {
      setUploading(false);
    }
  };

  const handleExportClick = async () => {
    const modeRes = await fetch("/api/demo");
    const modeData = await modeRes.json();
    const currentMode = modeData.activeMode || "REAL";

    if (currentMode === "DEMO") {
      setShowExportWarning(true);
    } else {
      executeExport(currentMode);
    }
  };

  const executeExport = async (mode: string) => {
    setShowExportWarning(false);
    setExportError(null);
    try {
      const sanitizedTeamName = teamName.trim().replace(/\s+/g, "_") || "Team_Paytm_Innovators";
      const url = `/api/export-excel?mode=${mode}&teamName=${sanitizedTeamName}`;
      const res = await fetch(url);

      if (!res.ok) {
        const errorData = await res.json();
        setExportError(errorData.message);
        return;
      }

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${sanitizedTeamName}_VOC.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e: any) {
      setExportError(e.message);
    }
  };

  return (
    <ClientLayoutWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <FileSpreadsheet className="w-6 h-6 text-paytm-cyan" />
            <span>Official VOC Import & Export Workspace</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Import bulk CSV/XLSX research data or export the official 12-column TeamName_VOC.xlsx workbook
          </p>
        </div>

        {/* 2 Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Import CSV/XLSX */}
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
              <Upload className="w-5 h-5 text-paytm-cyan" />
              <div>
                <h2 className="text-base font-bold text-white">Import Official VOC Workbook</h2>
                <p className="text-xs text-slate-400">Maps 12 official columns & validates duplicate VOC IDs and quotes</p>
              </div>
            </div>

            <div className="border-2 border-dashed border-slate-700 hover:border-paytm-cyan rounded-xl p-8 text-center space-y-3 bg-slate-950/60 transition-all cursor-pointer">
              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-xs text-slate-300">
                <span className="font-bold text-paytm-cyan">Click to select file</span> (.xlsx or .csv)
              </div>
              <input
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer"
              >
                Select Excel/CSV File
              </label>
            </div>

            {uploading && <div className="text-xs text-paytm-cyan font-semibold text-center">Validating & importing records...</div>}

            {importResult && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                <h3 className="font-bold text-white">Import Result</h3>
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Imported Valid VOC Records:</span>
                  <span>{importResult.importedCount || 0}</span>
                </div>
                <div className="flex justify-between text-rose-400 font-semibold">
                  <span>Rejected Invalid Rows:</span>
                  <span>{importResult.rejectedCount || 0}</span>
                </div>

                {importResult.rejectedRecords?.length > 0 && (
                  <div className="border-t border-slate-800 pt-2 space-y-1 max-h-32 overflow-y-auto">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Rejection Log:</span>
                    {importResult.rejectedRecords.map((r: any, idx: number) => (
                      <div key={idx} className="text-[11px] text-rose-300">
                        Row {r.rowNumber}: {r.reason}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card 2: Export Official Workbook */}
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
                <Download className="w-5 h-5 text-emerald-400" />
                <div>
                  <h2 className="text-base font-bold text-white">Export Official TeamName_VOC.xlsx</h2>
                  <p className="text-xs text-slate-400">Generates single-sheet Excel file matching the official 12-column template</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Team Name (For Filename)</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                  placeholder="e.g. Team_Paytm_Innovators"
                />
                <span className="text-[10px] text-slate-500 block mt-1">Output filename: <strong>{teamName || "TeamName"}_VOC.xlsx</strong></span>
              </div>

              {exportError && (
                <div className="bg-rose-950 border border-rose-700 text-rose-200 p-3 rounded-xl text-xs">
                  {exportError}
                </div>
              )}
            </div>

            <button
              onClick={handleExportClick}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export {teamName || "TeamName"}_VOC.xlsx</span>
            </button>
          </div>
        </div>

        {/* Demo Data Export Warning Modal */}
        {showExportWarning && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-amber-500 rounded-2xl max-w-md w-full p-6 space-y-4 text-xs text-slate-200 shadow-2xl">
              <div className="flex items-center space-x-2 text-amber-400">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <h3 className="font-bold text-base text-white">Export Synthetic Demo Dataset?</h3>
              </div>

              <p className="text-slate-300 leading-relaxed">
                You are currently in <strong>DEMO MODE</strong>. The exported workbook will contain synthetic test records (VOC-001 to VOC-050).
              </p>
              <p className="text-amber-300/90 font-semibold">
                Official competition submission requires REAL research data. Ensure you import your actual respondent interview records before final submission.
              </p>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => setShowExportWarning(false)}
                  className="bg-slate-800 text-slate-300 px-4 py-2 rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => executeExport("DEMO")}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-4 py-2 rounded"
                >
                  Export Demo Dataset Anyway
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ClientLayoutWrapper>
  );
}
