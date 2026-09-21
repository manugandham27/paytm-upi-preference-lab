import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOfficialVocWorkbookBuffer } from "@/lib/excel";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode") || "REAL";
    const teamName = searchParams.get("teamName") || "Team_Paytm_Innovators";
    const isDemoFilter = mode === "DEMO";

    const vocs = await prisma.vocResponse.findMany({
      where: { isDemo: isDemoFilter },
      include: { respondent: true },
      orderBy: { vocId: "asc" },
    });

    const excelBuffer = generateOfficialVocWorkbookBuffer(vocs, teamName);

    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${teamName}_VOC.xlsx"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
