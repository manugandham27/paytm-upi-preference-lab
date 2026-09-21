import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode") || "REAL";
    const isDemoFilter = mode === "DEMO";

    const respondents = await prisma.respondent.findMany({
      where: { isDemo: isDemoFilter },
      include: {
        vocResponses: true,
        inDepthInterview: true,
        barriers: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ respondents, count: respondents.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
