import * as XLSX from "xlsx";
import { evaluateTrackAEligibility } from "./validation";

export interface VocExportRecord {
  "Respondent ID": string;
  "Track A Eligible": string;
  "Age Range": string;
  "Occupation": string;
  "City": string;
  "Locality": string;
  "Primary UPI App": string;
  "Secondary UPI Apps": string;
  "Used Paytm Last 90 Days": string;
  "Monthly UPI Tx Count": number;
  "Monthly UPI Value (₹)": number;
  "Occasion Framework Quadrant": string;
  "Payment Occasion Type": string;
  "Recent Tx Description": string;
  "Transaction Value Range": string;
  "App Used for Tx": string;
  "Alternative App Considered": string;
  "Why App Chosen": string;
  "Why Paytm Not Chosen": string;
  "Paytm Last Experience": string;
  "Barrier Category": string;
  "Anonymised Respondent Verbatim": string;
  "Identified Core Need": string;
  "User Motivation": string;
  "Researcher Insight": string;
  "Behavioral Evidence": string;
  "Interview Depth": string;
}

export function generateVocWorkbookBuffer(rows: any[]) {
  const exportData: VocExportRecord[] = rows.map((r) => {
    const voc = r.vocResponses && r.vocResponses[0] ? r.vocResponses[0] : r;
    return {
      "Respondent ID": r.anonymousId || r.id,
      "Track A Eligible": r.trackAEligible ? "Yes" : "No",
      "Age Range": r.ageRange || "N/A",
      "Occupation": r.occupation || "N/A",
      "City": r.city || "N/A",
      "Locality": r.locality || "N/A",
      "Primary UPI App": r.primaryUpiApp || "N/A",
      "Secondary UPI Apps": Array.isArray(r.secondaryApps) ? r.secondaryApps.join(", ") : r.secondaryApps || "N/A",
      "Used Paytm Last 90 Days": r.usedPaytmLast90Days ? "Yes" : "No",
      "Monthly UPI Tx Count": r.monthlyPaymentCount || 0,
      "Monthly UPI Value (₹)": r.monthlyPaymentValue || 0,
      "Occasion Framework Quadrant": voc.occasionCategory || "N/A",
      "Payment Occasion Type": voc.occasionType || "N/A",
      "Recent Tx Description": voc.recentTxDescription || "N/A",
      "Transaction Value Range": voc.transactionValueRange || "N/A",
      "App Used for Tx": voc.appUsed || "N/A",
      "Alternative App Considered": voc.alternativeConsidered || "N/A",
      "Why App Chosen": voc.whyChosen || "N/A",
      "Why Paytm Not Chosen": voc.whyNotPaytm || "N/A",
      "Paytm Last Experience": voc.paytmLastUsedExperience || "N/A",
      "Barrier Category": voc.researcherBarrier || "N/A",
      "Anonymised Respondent Verbatim": voc.verbatimQuote || "N/A",
      "Identified Core Need": voc.researcherNeed || "N/A",
      "User Motivation": voc.researcherMotivation || "N/A",
      "Researcher Insight": voc.researcherInsight || "N/A",
      "Behavioral Evidence": voc.evidenceSummary || "N/A",
      "Interview Depth": voc.interviewDepth || r.completionStatus || "STANDARD",
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Paytm Track A 50 VOCs");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  return excelBuffer;
}

export function parseAndValidateImportBuffer(fileBuffer: Buffer) {
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet);

  const importedRecords: any[] = [];
  const rejectedRecords: { rowNumber: number; data: any; reason: string }[] = [];

  rawRows.forEach((row, idx) => {
    const rowNum = idx + 2; // 1-indexed header is row 1
    const usedPaytm = String(row["Used Paytm Last 90 Days"] || row["usedPaytmLast90Days"] || "Yes").toLowerCase().includes("y");
    const primaryApp = String(row["Primary UPI App"] || row["primaryUpiApp"] || "").trim();

    if (!primaryApp) {
      rejectedRecords.push({ rowNumber: rowNum, data: row, reason: "Missing Primary UPI App choice." });
      return;
    }

    const screening = evaluateTrackAEligibility({ usedPaytmLast90Days: usedPaytm, primaryUpiApp: primaryApp });
    if (!screening.isEligible) {
      rejectedRecords.push({ rowNumber: rowNum, data: row, reason: screening.reason });
      return;
    }

    importedRecords.push({
      anonymousId: row["Respondent ID"] || row["anonymousId"] || `IMP-RESP-${Date.now()}-${idx}`,
      ageRange: row["Age Range"] || row["ageRange"] || "25-34",
      occupation: row["Occupation"] || row["occupation"] || "Working Professional",
      city: row["City"] || row["city"] || "Mumbai",
      locality: row["Locality"] || row["locality"] || "",
      primaryUpiApp: primaryApp,
      secondaryApps: JSON.stringify([row["Secondary UPI Apps"] || "Paytm"]),
      usedPaytmLast90Days: usedPaytm,
      monthlyPaymentCount: Number(row["Monthly UPI Tx Count"] || row["monthlyPaymentCount"] || 20),
      monthlyPaymentValue: Number(row["Monthly UPI Value (₹)"] || row["monthlyPaymentValue"] || 5000),
      trackAEligible: true,
      completionStatus: String(row["Interview Depth"] || "").toUpperCase().includes("IN") ? "IN_DEPTH" : "VALID_VOC",
      vocResponse: {
        occasionCategory: row["Occasion Framework Quadrant"] || row["occasionCategory"] || "Medium/low-value + high-frequency",
        occasionType: row["Payment Occasion Type"] || row["occasionType"] || "Grocery",
        transactionValueRange: row["Transaction Value Range"] || row["transactionValueRange"] || "₹100-₹500",
        frequency: row["Frequency"] || "Daily",
        recentTxDescription: row["Recent Tx Description"] || row["recentTxDescription"] || "Local payment",
        appUsed: row["App Used for Tx"] || primaryApp,
        alternativeConsidered: row["Alternative App Considered"] || "Paytm",
        whyChosen: row["Why App Chosen"] || row["whyChosen"] || "Fast response",
        whyNotPaytm: row["Why Paytm Not Chosen"] || row["whyNotPaytm"] || "Habitual app preference",
        paytmLastUsedExperience: row["Paytm Last Experience"] || "Usual experience",
        verbatimQuote: row["Anonymised Respondent Verbatim"] || row["verbatimQuote"] || "I usually prefer my main app.",
        researcherNeed: row["Identified Core Need"] || "Speed",
        researcherMotivation: row["User Motivation"] || "Convenience",
        researcherBarrier: row["Barrier Category"] || "Convenience",
        researcherInsight: row["Researcher Insight"] || "User prefers minimal friction.",
        evidenceSummary: row["Behavioral Evidence"] || "Recent transaction",
        interviewDepth: String(row["Interview Depth"] || "").toUpperCase().includes("IN") ? "IN_DEPTH" : "STANDARD",
      },
    });
  });

  return {
    importedCount: importedRecords.length,
    rejectedCount: rejectedRecords.length,
    importedRecords,
    rejectedRecords,
  };
}
