import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode") || "REAL";
    const isDemoFilter = mode === "DEMO";

    const interviews = await prisma.inDepthInterview.findMany({
      where: { isDemo: isDemoFilter },
      include: {
        respondent: {
          include: { vocResponses: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ interviews, count: interviews.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { respondentId, promptAnswers, observations, keyQuotes, emergingInsights, isDemo = false } = body;

    const interview = await prisma.inDepthInterview.create({
      data: {
        respondentId,
        promptAnswersJson: typeof promptAnswers === "string" ? promptAnswers : JSON.stringify(promptAnswers),
        observations: observations || "",
        keyQuotesJson: typeof keyQuotes === "string" ? keyQuotes : JSON.stringify(keyQuotes || []),
        emergingInsights: emergingInsights || "",
        isDemo: Boolean(isDemo),
      },
    });

    // Update respondent completion status to IN_DEPTH
    await prisma.respondent.update({
      where: { id: respondentId },
      data: { completionStatus: "IN_DEPTH" },
    });

    return NextResponse.json({ success: true, interview });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
