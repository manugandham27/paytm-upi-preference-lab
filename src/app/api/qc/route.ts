import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auditSubmissionReadiness } from "@/lib/validation";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode") || "REAL";
    const isDemoFilter = mode === "DEMO";

    const totalVocCount = await prisma.vocResponse.count({ where: { isDemo: isDemoFilter } });
    const realVocCount = await prisma.vocResponse.count({ where: { isDemo: false } });
    const demoVocCount = await prisma.vocResponse.count({ where: { isDemo: true } });

    const realInDepthCount = await prisma.inDepthInterview.count({ where: { isDemo: false } });
    const totalInDepthCount = await prisma.inDepthInterview.count({ where: { isDemo: isDemoFilter } });

    const vocs = await prisma.vocResponse.findMany({
      where: { isDemo: isDemoFilter },
      select: {
        respondentType: true,
        cityArea: true,
        profileCategory: true,
        primaryUpiApp: true,
        occasionType: true,
        keyQuote: true,
        analystNeedBarrier: true,
        opportunityIdea: true,
        vocId: true,
      },
    });

    const consumersCount = vocs.filter((v) => v.respondentType.toLowerCase() === "consumer").length;
    const merchantsCount = vocs.filter((v) => v.respondentType.toLowerCase() === "merchant").length;

    const distinctCities = new Set(vocs.map((v) => v.cityArea)).size;
    const distinctProfiles = new Set(vocs.map((v) => v.profileCategory)).size;
    const distinctApps = new Set(vocs.map((v) => v.primaryUpiApp)).size;
    const distinctOccasions = new Set(vocs.map((v) => v.occasionType)).size;

    const recordsWithQuotes = vocs.filter((v) => v.keyQuote && v.keyQuote.length > 5).length;
    const recordsWithBarriers = vocs.filter((v) => v.analystNeedBarrier && v.analystNeedBarrier.length > 3).length;
    const recordsWithOpportunities = vocs.filter((v) => v.opportunityIdea && v.opportunityIdea.length > 3).length;

    const ids = vocs.map((v) => v.vocId);
    const hasDuplicates = new Set(ids).size !== ids.length;

    const readinessChecklist = auditSubmissionReadiness({
      totalVocCount,
      realVocCount,
      demoVocCount,
      realInDepthCount,
      distinctProfilesCount: distinctProfiles,
      distinctCitiesCount: distinctCities,
      distinctOccasionsCount: distinctOccasions,
      hasPiiViolation: false,
      hasDuplicates,
      isDemoMode: isDemoFilter,
    });

    return NextResponse.json({
      readinessChecklist,
      stats: {
        totalVocCount,
        realVocCount,
        demoVocCount,
        realInDepthCount,
        totalInDepthCount,
        consumersCount,
        merchantsCount,
        distinctCities,
        distinctProfiles,
        distinctApps,
        distinctOccasions,
        recordsWithQuotes,
        recordsWithBarriers,
        recordsWithOpportunities,
        targetVoc: 50,
        targetInDepth: 10,
        progressPct: Math.min(100, Math.round((totalVocCount / 50) * 100)),
      },
      mode,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
