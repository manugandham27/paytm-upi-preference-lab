import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateVocWorkbookBuffer } from "@/lib/excel";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode") || "REAL";
    const force = searchParams.get("force") === "true";
    const isDemoFilter = mode === "DEMO";

    const respondents = await prisma.respondent.findMany({
      where: { isDemo: isDemoFilter, trackAEligible: true },
      include: {
        vocResponses: true,
        inDepthInterview: true,
      },
      orderBy: { createdAt: "asc" },
    });

    if (!force && mode === "REAL" && respondents.length < 50) {
      return NextResponse.json(
        {
          error: "INCOMPLETE_DATASET",
          message: `Cannot generate official submission workbook. Only ${respondents.length} / 50 valid VOCs collected in real research dataset. Pass ?force=true to override or switch to Demo Mode.`,
          currentCount: respondents.length,
          targetCount: 50,
        },
        { status: 400 }
      );
    }

    const excelBuffer = generateVocWorkbookBuffer(respondents);

    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="Paytm_UPI_Growth_Challenge_Track_A_50_VOCs_${mode}.xlsx"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
