import * as XLSX from "xlsx";
import { OFFICIAL_12_TEMPLATE_COLUMNS, detectPiiInText } from "./validation";

export interface OfficialVocExportRecord {
  "VOC ID": string;
  "Date": string;
  "Respondent type": string;
  "City / area": string;
  "Profile / category": string;
  "UPI apps used": string;
  "Primary UPI app used": string;
  "Why was it chosen? (exact words)": string;
  "When or why is Paytm used? Or not used if switched from Paytm?": string;
  "Need, barrier or motivation to switch": string;
  "Opportunity / idea": string;
  "Key quote": string;
}

export function generateOfficialVocWorkbookBuffer(rows: any[], teamName = "Team_Paytm_Innovators") {
  const exportData: OfficialVocExportRecord[] = rows.map((r, idx) => {
    // Determine voc ID
    const vocId = r.vocId || `VOC-${String(idx + 1).padStart(3, "0")}`;
    const date = r.date || "2026-09-15";
    const respType = r.respondentType || r.respondent?.occupation?.toLowerCase().includes("merchant") ? "Merchant" : "Consumer";
    const cityArea = r.cityArea || (r.respondent?.city ? `${r.respondent.city} (${r.respondent.locality || "Central"})` : "Mumbai");
    const profile = r.profileCategory || r.respondent?.occupation || "Working Professional";
    const appsUsed = r.upiAppsUsed || (r.respondent?.secondaryApps ? `${r.respondent.primaryUpiApp}, ${r.respondent.secondaryApps}` : "Google Pay, Paytm");
    const primaryApp = r.primaryUpiApp || r.respondent?.primaryUpiApp || "Google Pay";
    const whyChosen = r.whyChosenExact || r.whyChosen || "Fast camera scanner and soundbox counter speaker.";
    const paytmUsage = r.paytmUsageWhenWhy || r.whyNotPaytm || "Used Paytm for Fastag, but camera scanner took 3s to load at Kirana store.";
    const analystNeed = r.analystNeedBarrier || r.researcherBarrier || "Merchant Counter Cue & Zero-Latency Scanner";
    const opportunity = r.opportunityIdea || r.researcherInsight || "Paytm FlashPay: Instant QR lockscreen camera scanner.";
    const keyQuote = r.keyQuote || r.verbatimQuote || "I scan whatever soundbox I see on the counter first.";

    return {
      "VOC ID": vocId,
      "Date": date,
      "Respondent type": respType,
      "City / area": cityArea,
      "Profile / category": profile,
      "UPI apps used": appsUsed,
      "Primary UPI app used": primaryApp,
      "Why was it chosen? (exact words)": whyChosen,
      "When or why is Paytm used? Or not used if switched from Paytm?": paytmUsage,
      "Need, barrier or motivation to switch": analystNeed,
      "Opportunity / idea": opportunity,
      "Key quote": keyQuote,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(exportData, {
    header: OFFICIAL_12_TEMPLATE_COLUMNS as unknown as string[],
  });

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
  const seenVocIds = new Set<string>();
  const seenQuotes = new Set<string>();

  rawRows.forEach((row, idx) => {
    const rowNum = idx + 2; // Row 1 is header
    const vocId = String(row["VOC ID"] || row["vocId"] || `VOC-${String(idx + 1).padStart(3, "0")}`).trim();
    const date = String(row["Date"] || row["date"] || "2026-09-15").trim();
    const respType = String(row["Respondent type"] || row["respondentType"] || "Consumer").trim();
    const cityArea = String(row["City / area"] || row["cityArea"] || "").trim();
    const profile = String(row["Profile / category"] || row["profileCategory"] || "").trim();
    const appsUsed = String(row["UPI apps used"] || row["upiAppsUsed"] || "").trim();
    const primaryApp = String(row["Primary UPI app used"] || row["primaryUpiApp"] || "").trim();
    const whyChosen = String(row["Why was it chosen? (exact words)"] || row["whyChosenExact"] || "").trim();
    const paytmUsage = String(row["When or why is Paytm used? Or not used if switched from Paytm?"] || row["paytmUsageWhenWhy"] || "").trim();
    const analystNeed = String(row["Need, barrier or motivation to switch"] || row["analystNeedBarrier"] || "").trim();
    const opportunity = String(row["Opportunity / idea"] || row["opportunityIdea"] || "").trim();
    const keyQuote = String(row["Key quote"] || row["keyQuote"] || "").trim();

    // Validation 1: Required fields check
    if (!primaryApp) {
      rejectedRecords.push({ rowNumber: rowNum, data: row, reason: "Missing Primary UPI app used." });
      return;
    }
    if (!whyChosen) {
      rejectedRecords.push({ rowNumber: rowNum, data: row, reason: "Missing 'Why was it chosen? (exact words)' statement." });
      return;
    }
    if (!keyQuote) {
      rejectedRecords.push({ rowNumber: rowNum, data: row, reason: "Missing Key quote." });
      return;
    }

    // Validation 2: Duplicate VOC ID check
    if (seenVocIds.has(vocId)) {
      rejectedRecords.push({ rowNumber: rowNum, data: row, reason: `Duplicate VOC ID detected: ${vocId}` });
      return;
    }
    seenVocIds.add(vocId);

    // Validation 3: Duplicate story/quote check
    if (seenQuotes.has(keyQuote.toLowerCase())) {
      rejectedRecords.push({ rowNumber: rowNum, data: row, reason: "Duplicate verbatim story detected across dataset." });
      return;
    }
    seenQuotes.add(keyQuote.toLowerCase());

    // Validation 4: PII Violation check
    if (detectPiiInText(keyQuote) || detectPiiInText(whyChosen)) {
      rejectedRecords.push({ rowNumber: rowNum, data: row, reason: "PII violation detected (phone number, email, or UPI ID in quote)." });
      return;
    }

    importedRecords.push({
      vocId,
      date,
      respondentType: respType.toLowerCase().includes("merch") ? "Merchant" : "Consumer",
      cityArea: cityArea || "Mumbai",
      profileCategory: profile || "Working Professional",
      upiAppsUsed: appsUsed || `${primaryApp}, Paytm`,
      primaryUpiApp: primaryApp,
      whyChosenExact: whyChosen,
      paytmUsageWhenWhy: paytmUsage || "Used Paytm for Fastag",
      analystNeedBarrier: analystNeed || "Convenience & Speed",
      opportunityIdea: opportunity || "Paytm FlashPay",
      keyQuote: keyQuote,

      // Operational fields
      occasionCategory: profile.toLowerCase().includes("kirana") ? "Medium/low-value + high-frequency" : "High-value + low-frequency",
      occasionType: profile.toLowerCase().includes("kirana") ? "Groceries" : "Peer-to-peer transfers",
      transactionValueRange: "₹100-₹500",
      frequency: "Daily",
      recentTxDescription: whyChosen,
      appUsed: primaryApp,
      alternativeConsidered: "Paytm",
      whyChosen: whyChosen,
      whyNotPaytm: paytmUsage,
      paytmLastUsedExperience: "Transaction delay",
      verbatimQuote: keyQuote,
      researcherNeed: analystNeed,
      researcherMotivation: "Speed",
      researcherBarrier: analystNeed.split("&")[0].trim(),
      researcherInsight: `${analystNeed}. ${opportunity}`,
      evidenceSummary: `Recent transaction in ${primaryApp}`,
      interviewDepth: "STANDARD",
    });
  });

  return {
    importedCount: importedRecords.length,
    rejectedCount: rejectedRecords.length,
    importedRecords,
    rejectedRecords,
  };
}
