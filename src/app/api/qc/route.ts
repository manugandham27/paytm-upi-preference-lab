import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { performQualityControlCheck } from "@/lib/validation";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode") || "REAL";
    const isDemoFilter = mode === "DEMO";

    const totalVocCount = await prisma.vocResponse.count({ where: { isDemo: isDemoFilter } });
    const inDepthCount = await prisma.inDepthInterview.count({ where: { isDemo: isDemoFilter } });
    const eligibleCount = await prisma.respondent.count({
      where: { isDemo: isDemoFilter, trackAEligible: true },
    });
    const invalidCount = await prisma.respondent.count({
      where: { isDemo: isDemoFilter, completionStatus: "INVALID_SCREENING" },
    });

    const allRespondents = await prisma.respondent.findMany({
      where: { isDemo: isDemoFilter },
      select: { anonymousId: true },
    });

    const ids = allRespondents.map((r) => r.anonymousId);
    const uniqueIds = new Set(ids);
    const hasDuplicates = uniqueIds.size !== ids.length;

    const vocsWithMissingVerbatims = await prisma.vocResponse.count({
      where: {
        isDemo: isDemoFilter,
        OR: [{ verbatimQuote: "" }, { verbatimQuote: "N/A" }],
      },
    });

    const vocsWithUnassignedBarriers = await prisma.vocResponse.count({
      where: {
        isDemo: isDemoFilter,
        OR: [{ researcherBarrier: "" }, { researcherBarrier: "N/A" }],
      },
    });

    const audit = performQualityControlCheck({
      totalVocCount,
      inDepthCount,
      eligibleCount,
      invalidCount,
      hasDuplicates,
      hasPiiViolation: false,
      unassignedBarriersCount: vocsWithUnassignedBarriers,
      incompleteVerbatimsCount: vocsWithMissingVerbatims,
    });

    return NextResponse.json({
      audit,
      stats: {
        totalVocCount,
        inDepthCount,
        eligibleCount,
        invalidCount,
        targetVoc: 50,
        targetInDepth: 10,
        progressPct: Math.min(100, Math.round((totalVocCount / 50) * 100)),
        inDepthProgressPct: Math.min(100, Math.round((inDepthCount / 10) * 100)),
      },
      mode,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
