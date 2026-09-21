"use client";

import { useState } from "react";
import { ClientLayoutWrapper } from "@/components/ClientLayoutWrapper";
import { FileSpreadsheet, Upload, Download, CheckCircle2, AlertTriangle, FileText } from "lucide-react";

export default function DataIoPage() {
  const [uploading, setUploading] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [exportError, setExportError] = useState<string | null>(null);

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

  const handleExportWorkbook = async (force = false) => {
    setExportError(null);
    try {
      const modeRes = await fetch("/api/demo");
      const modeData = await modeRes.json();
      const currentMode = modeData.activeMode || "REAL";

      const url = `/api/export-excel?mode=${currentMode}${force ? "&force=true" : ""}`;
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
      a.download = `Paytm_UPI_Growth_Challenge_Track_A_50_VOCs_${currentMode}.xlsx`;
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
            <span>Data Import & Export Hub</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Import bulk CSV/XLSX research data or export the official Paytm 50-VOC Challenge Workbook
          </p>
        </div>

        {/* 2 Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Import CSV/XLSX */}
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
              <Upload className="w-5 h-5 text-paytm-cyan" />
              <div>
                <h2 className="text-base font-bold text-white">Import CSV / XLSX Research Records</h2>
                <p className="text-xs text-slate-400">Automatic column mapping & Track A eligibility screening</p>
              </div>
            </div>

            <div className="border-2 border-dashed border-slate-700 hover:border-paytm-cyan rounded-xl p-8 text-center space-y-3 bg-slate-950/60 transition-all cursor-pointer">
              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-xs text-slate-300">
                <span className="font-bold text-paytm-cyan">Click to browse</span> or drag and drop CSV / Excel file
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
                Select File
              </label>
            </div>

            {uploading && <div className="text-xs text-paytm-cyan font-semibold text-center">Parsing & validating records...</div>}

            {importResult && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                <h3 className="font-bold text-white">Import Summary</h3>
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Imported Valid Track A VOCs:</span>
                  <span>{importResult.importedCount || 0}</span>
                </div>
                <div className="flex justify-between text-rose-400 font-semibold">
                  <span>Rejected Ineligible Rows:</span>
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
                  <h2 className="text-base font-bold text-white">Export Official 50-VOC Workbook</h2>
                  <p className="text-xs text-slate-400">Download formatted Excel file matching Paytm challenge schema</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                The exported Excel workbook contains all 27 required columns for the 50 collected VOCs, complete with anonymized verbatims, identified barriers, and researcher insights.
              </p>

              {exportError && (
                <div className="bg-amber-950 border border-amber-700 text-amber-200 p-4 rounded-xl text-xs space-y-2">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="font-bold">Validation Warning</span>
                  </div>
                  <p>{exportError}</p>
                  <button
                    onClick={() => handleExportWorkbook(true)}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded text-[11px] mt-1"
                  >
                    Export Partial/Demo Dataset Anyway
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleExportWorkbook(false)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Official 50-VOC Excel Workbook</span>
            </button>
          </div>
        </div>
      </div>
    </ClientLayoutWrapper>
  );
}
