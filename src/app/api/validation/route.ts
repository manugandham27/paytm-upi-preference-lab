import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode") || "REAL";
    const isDemoFilter = mode === "DEMO";

    const validations = await prisma.solutionValidation.findMany({
      where: { isDemo: isDemoFilter },
      include: {
        solution: true,
        respondent: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ validations, count: validations.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      solutionId,
      respondentId,
      solvesProblem,
      wouldChangeApp,
      targetOccasion,
      expectedFrequency,
      perceivedBlockers,
      improvementSuggestions,
      existingAlternative,
      isDemo = false,
    } = body;

    const validation = await prisma.solutionValidation.create({
      data: {
        solutionId,
        respondentId,
        solvesProblem: Boolean(solvesProblem),
        wouldChangeApp: Boolean(wouldChangeApp),
        targetOccasion: targetOccasion || "Grocery",
        expectedFrequency: expectedFrequency || "Daily",
        perceivedBlockers: perceivedBlockers || "None",
        improvementSuggestions: improvementSuggestions || "",
        existingAlternative: existingAlternative || "PhonePe",
        isDemo: Boolean(isDemo),
      },
    });

    return NextResponse.json({ success: true, validation });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
