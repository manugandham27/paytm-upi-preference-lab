import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode") || "REAL";
    const isDemoFilter = mode === "DEMO";

    const insights = await prisma.insight.findMany({
      where: { isDemo: isDemoFilter },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ insights, count: insights.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, observation, evidenceCount, verbatimQuote, pattern, barrier, opportunity, implication, linkedVocIds, isDemo = false } = body;

    const insight = await prisma.insight.create({
      data: {
        title,
        observation,
        evidenceCount: Number(evidenceCount || 1),
        verbatimQuote,
        pattern,
        barrier,
        opportunity,
        implication,
        linkedVocIds: typeof linkedVocIds === "string" ? linkedVocIds : JSON.stringify(linkedVocIds || []),
        isDemo: Boolean(isDemo),
      },
    });

    return NextResponse.json({ success: true, insight });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
