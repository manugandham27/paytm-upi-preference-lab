import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode") || "REAL";
    const isDemoFilter = mode === "DEMO";

    const solutions = await prisma.solutionConcept.findMany({
      where: { isDemo: isDemoFilter },
      include: {
        validations: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ solutions, count: solutions.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      problemAddressed,
      targetUser,
      relevantOccasion,
      vocEvidence,
      userBenefit,
      paytmBenefit,
      merchantBenefit,
      expectedBehaviorChange,
      implementationRequirements,
      potentialRisks,
      scalabilityScore,
      measurementMetric,
      isDemo = false,
    } = body;

    const solution = await prisma.solutionConcept.create({
      data: {
        name,
        problemAddressed,
        targetUser,
        relevantOccasion,
        vocEvidence,
        userBenefit,
        paytmBenefit,
        merchantBenefit,
        expectedBehaviorChange,
        implementationRequirements,
        potentialRisks,
        scalabilityScore: Number(scalabilityScore || 8),
        measurementMetric,
        isDemo: Boolean(isDemo),
      },
    });

    return NextResponse.json({ success: true, solution });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
