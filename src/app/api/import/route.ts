import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseAndValidateImportBuffer } from "@/lib/excel";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const isDemo = formData.get("isDemo") === "true";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parseResult = parseAndValidateImportBuffer(buffer);

    let savedCount = 0;
    for (const rec of parseResult.importedRecords) {
      const resp = await prisma.respondent.create({
        data: {
          anonymousId: rec.anonymousId,
          ageRange: rec.ageRange,
          occupation: rec.occupation,
          city: rec.city,
          locality: rec.locality,
          primaryUpiApp: rec.primaryUpiApp,
          secondaryApps: rec.secondaryApps,
          usedPaytmLast90Days: rec.usedPaytmLast90Days,
          monthlyPaymentCount: rec.monthlyPaymentCount,
          monthlyPaymentValue: rec.monthlyPaymentValue,
          trackAEligible: rec.trackAEligible,
          completionStatus: rec.completionStatus,
          isDemo,
        },
      });

      const vocData = rec.vocResponse;
      const voc = await prisma.vocResponse.create({
        data: {
          respondentId: resp.id,
          occasionCategory: vocData.occasionCategory,
          occasionType: vocData.occasionType,
          transactionValueRange: vocData.transactionValueRange,
          frequency: vocData.frequency,
          recentTxDescription: vocData.recentTxDescription,
          appUsed: vocData.appUsed,
          alternativeConsidered: vocData.alternativeConsidered,
          whyChosen: vocData.whyChosen,
          whyNotPaytm: vocData.whyNotPaytm,
          paytmLastUsedExperience: vocData.paytmLastUsedExperience,
          verbatimQuote: vocData.verbatimQuote,
          researcherNeed: vocData.researcherNeed,
          researcherMotivation: vocData.researcherMotivation,
          researcherBarrier: vocData.researcherBarrier,
          researcherInsight: vocData.researcherInsight,
          evidenceSummary: vocData.evidenceSummary,
          interviewDepth: vocData.interviewDepth,
          isDemo,
        },
      });

      if (vocData.researcherBarrier) {
        await prisma.barrier.create({
          data: {
            category: vocData.researcherBarrier,
            description: `Imported barrier: ${vocData.verbatimQuote}`,
            respondentId: resp.id,
            vocId: voc.id,
            isDemo,
          },
        });
      }

      savedCount++;
    }

    return NextResponse.json({
      success: true,
      importedCount: savedCount,
      rejectedCount: parseResult.rejectedCount,
      rejectedRecords: parseResult.rejectedRecords,
      message: `Successfully imported ${savedCount} valid Track A records. Rejected ${parseResult.rejectedCount} invalid records.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
