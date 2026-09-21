import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { evaluateTrackAEligibility } from "@/lib/validation";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode") || "REAL"; // REAL or DEMO
    const isDemoFilter = mode === "DEMO";

    const vocs = await prisma.vocResponse.findMany({
      where: { isDemo: isDemoFilter },
      include: {
        respondent: true,
        barriers: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ vocs, count: vocs.length, mode });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      usedPaytmLast90Days,
      primaryUpiApp,
      ageRange,
      occupation,
      city,
      locality,
      secondaryApps,
      monthlyPaymentCount,
      monthlyPaymentValue,
      occasionCategory,
      occasionType,
      transactionValueRange,
      frequency,
      recentTxDescription,
      appUsed,
      alternativeConsidered,
      whyChosen,
      whyNotPaytm,
      paytmLastUsedExperience,
      verbatimQuote,
      researcherNeed,
      researcherMotivation,
      researcherBarrier,
      researcherInsight,
      evidenceSummary,
      interviewDepth,
      isDemo = false,
    } = body;

    // 1. Strict Track A Screening Check
    const screening = evaluateTrackAEligibility({
      usedPaytmLast90Days: Boolean(usedPaytmLast90Days),
      primaryUpiApp: String(primaryUpiApp || ""),
    });

    // Generate anonymous ID
    const count = await prisma.respondent.count();
    const anonymousId = `RESP-2026-${String(count + 1).padStart(3, "0")}`;

    if (!screening.isEligible) {
      // Record as INVALID_SCREENING respondent for audit trail without adding to VOC pool
      const invalidResp = await prisma.respondent.create({
        data: {
          anonymousId,
          ageRange: ageRange || "N/A",
          occupation: occupation || "N/A",
          city: city || "N/A",
          locality: locality || "",
          primaryUpiApp: primaryUpiApp || "Paytm",
          secondaryApps: JSON.stringify(secondaryApps || []),
          usedPaytmLast90Days: Boolean(usedPaytmLast90Days),
          monthlyPaymentCount: Number(monthlyPaymentCount || 0),
          monthlyPaymentValue: Number(monthlyPaymentValue || 0),
          trackAEligible: false,
          completionStatus: "INVALID_SCREENING",
          isDemo: Boolean(isDemo),
        },
      });

      return NextResponse.json(
        {
          isEligible: false,
          reason: screening.reason,
          respondentId: invalidResp.id,
          message: "Respondent rejected by Track A screening rule.",
        },
        { status: 422 }
      );
    }

    // 2. Create Eligible Respondent & VOC Record
    const respondent = await prisma.respondent.create({
      data: {
        anonymousId,
        ageRange: ageRange || "25-34",
        occupation: occupation || "Working Professional",
        city: city || "Mumbai",
        locality: locality || "",
        primaryUpiApp: primaryUpiApp,
        secondaryApps: JSON.stringify(secondaryApps || []),
        usedPaytmLast90Days: true,
        monthlyPaymentCount: Number(monthlyPaymentCount || 15),
        monthlyPaymentValue: Number(monthlyPaymentValue || 5000),
        trackAEligible: true,
        completionStatus: interviewDepth === "IN_DEPTH" ? "IN_DEPTH" : "VALID_VOC",
        isDemo: Boolean(isDemo),
      },
    });

    const voc = await prisma.vocResponse.create({
      data: {
        respondentId: respondent.id,
        occasionCategory: occasionCategory || "Medium/low-value + high-frequency",
        occasionType: occasionType || "Grocery",
        transactionValueRange: transactionValueRange || "₹100-₹500",
        frequency: frequency || "Daily",
        recentTxDescription: recentTxDescription || "Recent transaction",
        appUsed: appUsed || primaryUpiApp,
        alternativeConsidered: alternativeConsidered || "Paytm",
        whyChosen: whyChosen || "Speed",
        whyNotPaytm: whyNotPaytm || "Habit",
        paytmLastUsedExperience: paytmLastUsedExperience || "Slower scan",
        verbatimQuote: verbatimQuote || "Used primary app.",
        researcherNeed: researcherNeed || "Speed",
        researcherMotivation: researcherMotivation || "Convenience",
        researcherBarrier: researcherBarrier || "Convenience",
        researcherInsight: researcherInsight || "Friction driven.",
        evidenceSummary: evidenceSummary || "Recent behavior",
        interviewDepth: interviewDepth || "STANDARD",
        isDemo: Boolean(isDemo),
      },
    });

    // Create associated Barrier record
    if (researcherBarrier) {
      await prisma.barrier.create({
        data: {
          category: researcherBarrier,
          description: `Primary barrier in ${occasionType}: ${verbatimQuote}`,
          respondentId: respondent.id,
          vocId: voc.id,
          isDemo: Boolean(isDemo),
        },
      });
    }

    return NextResponse.json({
      isEligible: true,
      respondent,
      voc,
      message: "Valid VOC record saved successfully.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
