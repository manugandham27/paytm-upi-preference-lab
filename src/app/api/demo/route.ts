import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedDemoData } from "@/lib/demoData";

export async function GET() {
  try {
    const meta = await prisma.researchMetadata.findUnique({
      where: { id: "default" },
    });
    const mode = meta?.activeMode || "REAL";

    const realVocCount = await prisma.vocResponse.count({ where: { isDemo: false } });
    const realDepthCount = await prisma.inDepthInterview.count({ where: { isDemo: false } });

    const demoVocCount = await prisma.vocResponse.count({ where: { isDemo: true } });
    const demoDepthCount = await prisma.inDepthInterview.count({ where: { isDemo: true } });

    return NextResponse.json({
      activeMode: mode,
      realDataStats: {
        vocCount: realVocCount,
        inDepthCount: realDepthCount,
      },
      demoDataStats: {
        vocCount: demoVocCount,
        inDepthCount: demoDepthCount,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mode, action } = body;

    if (action === "SEED_DEMO") {
      const res = await seedDemoData();
      return NextResponse.json(res);
    }

    if (mode === "REAL" || mode === "DEMO") {
      await prisma.researchMetadata.upsert({
        where: { id: "default" },
        update: { activeMode: mode },
        create: { id: "default", activeMode: mode },
      });
      return NextResponse.json({ success: true, activeMode: mode });
    }

    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
