import { NextResponse } from "next/server";
import { prisma, ensureInitialData } from "@/lib/prisma";
import { evaluateTrackAEligibility } from "@/lib/validation";

export async function GET(req: Request) {
  try {
    await ensureInitialData();

    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode") || "REAL";
    const isDemoFilter = mode === "DEMO";

    const vocs = await prisma.vocResponse.findMany({
      where: { isDemo: isDemoFilter },
      include: { respondent: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ vocs, count: vocs.length, mode });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      vocId,
      date,
      respondentType,
      cityArea,
      profileCategory,
      upiAppsUsed,
      primaryUpiApp,
      whyChosenExact,
      paytmUsageWhenWhy,
      analystNeedBarrier,
      opportunityIdea,
      keyQuote,
      usedPaytmLast90Days = true,
      isDemo = false,
      interviewDepth = "STANDARD",
    } = body;

    // Screening Rule
    const screening = evaluateTrackAEligibility({
      usedPaytmLast90Days: Boolean(usedPaytmLast90Days),
      primaryUpiApp: String(primaryUpiApp || ""),
    });

    const count = await prisma.vocResponse.count();
    const generatedVocId = vocId || `VOC-${String(count + 1).padStart(3, "0")}`;

    // Create Respondent
    const respondent = await prisma.respondent.create({
      data: {
        anonymousId: `RESP-${generatedVocId}`,
        ageRange: "25-34",
        occupation: profileCategory || "Working Professional",
        city: (cityArea || "Mumbai").split(" ")[0],
        locality: cityArea || "Mumbai",
        primaryUpiApp: primaryUpiApp || "Google Pay",
        secondaryApps: JSON.stringify(upiAppsUsed ? upiAppsUsed.split(",") : ["Paytm"]),
        usedPaytmLast90Days: Boolean(usedPaytmLast90Days),
        monthlyPaymentCount: 20,
        monthlyPaymentValue: 5000,
        trackAEligible: screening.isEligible,
        completionStatus: interviewDepth === "IN_DEPTH" ? "IN_DEPTH" : "VALID_VOC",
        isDemo: Boolean(isDemo),
      },
    });

    // Create VocResponse matching 12 columns
    const voc = await prisma.vocResponse.create({
      data: {
        vocId: generatedVocId,
        date: date || new Date().toISOString().split("T")[0],
        respondentType: respondentType || "Consumer",
        cityArea: cityArea || "Mumbai",
        profileCategory: profileCategory || "Working Professional",
        upiAppsUsed: upiAppsUsed || `${primaryUpiApp}, Paytm`,
        primaryUpiApp: primaryUpiApp || "Google Pay",
        whyChosenExact: whyChosenExact || "Speed",
        paytmUsageWhenWhy: paytmUsageWhenWhy || "Used for Fastag",
        analystNeedBarrier: analystNeedBarrier || "Convenience",
        opportunityIdea: opportunityIdea || "Paytm FlashPay",
        keyQuote: keyQuote || whyChosenExact || "Used primary app",

        respondentId: respondent.id,
        occasionCategory: "Medium/low-value + high-frequency",
        occasionType: "Groceries",
        transactionValueRange: "₹100-₹500",
        frequency: "Daily",
        recentTxDescription: whyChosenExact,
        appUsed: primaryUpiApp,
        alternativeConsidered: "Paytm",
        whyChosen: whyChosenExact,
        whyNotPaytm: paytmUsageWhenWhy,
        paytmLastUsedExperience: "Previous transaction delay",
        verbatimQuote: keyQuote || whyChosenExact,
        researcherNeed: analystNeedBarrier,
        researcherMotivation: "Convenience",
        researcherBarrier: (analystNeedBarrier || "Convenience").split("&")[0].trim(),
        researcherInsight: `${analystNeedBarrier}. ${opportunityIdea}`,
        evidenceSummary: `Recent transaction in ${primaryUpiApp}`,
        interviewDepth: interviewDepth || "STANDARD",
        isDemo: Boolean(isDemo),
      },
    });

    return NextResponse.json({ success: true, voc, respondent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing VOC ID for update." }, { status: 400 });
    }

    const updatedVoc = await prisma.vocResponse.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, voc: updatedVoc });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing ID for deletion." }, { status: 400 });
    }

    await prisma.vocResponse.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "VOC record deleted." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, isDemo } = body;

    const updated = await prisma.vocResponse.update({
      where: { id },
      data: { isDemo: Boolean(isDemo) },
    });

    return NextResponse.json({ success: true, voc: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
