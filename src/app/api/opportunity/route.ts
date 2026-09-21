import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode") || "REAL";
    const isDemoFilter = mode === "DEMO";

    const models = await prisma.opportunityModel.findMany({
      where: { isDemo: isDemoFilter },
      orderBy: { createdAt: "desc" },
    });

    // Compute empirical stats from dataset for real-time calculator baselines
    const vocs = await prisma.vocResponse.findMany({
      where: { isDemo: isDemoFilter },
      include: { respondent: true },
    });

    const totalSample = vocs.length;
    const avgMonthlyTxCount = totalSample > 0
      ? vocs.reduce((acc, v) => acc + (v.respondent?.monthlyPaymentCount || 15), 0) / totalSample
      : 18.5;

    const avgMonthlyValue = totalSample > 0
      ? vocs.reduce((acc, v) => acc + (v.respondent?.monthlyPaymentValue || 4500), 0) / totalSample
      : 8325;

    const avgTicketSize = avgMonthlyTxCount > 0 ? avgMonthlyValue / avgMonthlyTxCount : 450;

    return NextResponse.json({
      models,
      empiricalBaselines: {
        totalSample,
        avgMonthlyTxCount: Math.round(avgMonthlyTxCount * 10) / 10,
        avgMonthlyValue: Math.round(avgMonthlyValue),
        avgTicketSize: Math.round(avgTicketSize),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { segmentName, targetUserCount, avgMonthlyFreq, avgTicketSize, potentialShareShiftPct, assumptions, isDemo = false } = body;

    const targetUsers = Number(targetUserCount || 10000000);
    const freq = Number(avgMonthlyFreq || 18);
    const ticket = Number(avgTicketSize || 450);
    const shiftPct = Number(potentialShareShiftPct || 15) / 100;

    // GMV Potential = Users * Monthly Freq * Ticket * Share Shift % * 12 months
    const calculatedGmvPotential = targetUsers * freq * ticket * shiftPct * 12;

    const model = await prisma.opportunityModel.create({
      data: {
        segmentName: segmentName || "Urban UPI non-primary Paytm users",
        targetUserCount: targetUsers,
        avgMonthlyFreq: freq,
        avgTicketSize: ticket,
        potentialShareShiftPct: Number(potentialShareShiftPct || 15),
        calculatedGmvPotential,
        assumptionsJson: typeof assumptions === "string" ? assumptions : JSON.stringify(assumptions || []),
        isDemo: Boolean(isDemo),
      },
    });

    return NextResponse.json({ success: true, model });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
