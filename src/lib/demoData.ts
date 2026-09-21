import { prisma } from "./prisma";

export async function seedDemoData() {
  const existingCount = await prisma.vocResponse.count({
    where: { isDemo: true },
  });

  if (existingCount >= 50) {
    return { success: true, count: existingCount, message: "Demo dataset already contains 50 records." };
  }

  // Clear previous demo records to re-seed cleanly
  await prisma.vocResponse.deleteMany({ where: { isDemo: true } });
  await prisma.respondent.deleteMany({ where: { isDemo: true } });
  await prisma.insight.deleteMany({ where: { isDemo: true } });
  await prisma.solutionConcept.deleteMany({ where: { isDemo: true } });

  const dates = ["2026-09-01", "2026-09-03", "2026-09-05", "2026-09-08", "2026-09-10", "2026-09-12", "2026-09-14", "2026-09-15", "2026-09-18", "2026-09-20"];

  const templates = [
    // 1. Kirana / Morning Grocery (Consumer)
    {
      respType: "Consumer",
      cityArea: "Bengaluru (Koramangala)",
      profile: "Working professional",
      appsUsed: "PhonePe, Paytm, Google Pay",
      primaryApp: "PhonePe",
      whyChosen: "At the Kirana shop, I just double tap PhonePe because the merchant has a PhonePe soundbox right on the counter. It feels instant.",
      paytmUsage: "Used Paytm heavily 2 years ago. Now use it only for Fastag recharge.",
      needBarrier: "Merchant Counter Cue Alignment & QR Camera Speed",
      opportunity: "Paytm FlashPay: Instant lockscreen QR scanner with Soundbox 2.0 consumer chime.",
      keyQuote: "I scan whatever soundbox I see on the counter first.",
      occType: "Groceries",
      occCat: "Medium/low-value + high-frequency",
      valRange: "₹100-₹500",
      freq: "Daily",
      barrier: "Merchant acceptance/cues",
      desc: "Daily morning milk & grocery purchase at local Kirana store",
    },
    // 2. Food Vendor / Tea Stall (Merchant)
    {
      respType: "Merchant",
      cityArea: "Mumbai (Andheri East)",
      profile: "Food vendor / Tea stall",
      appsUsed: "Paytm, PhonePe",
      primaryApp: "PhonePe",
      whyChosen: "PhonePe audio box speaker chimes louder during evening rush hours when trains arrive.",
      paytmUsage: "Keep Paytm QR as backup on the wall, but customers ask for PhonePe or GPay.",
      needBarrier: "Audio Box Speaker Volume & Merchant Settlement Speed",
      opportunity: "Paytm Soundbox Pro: Loud dual-speaker with instant zero-delay bank settlement.",
      keyQuote: "If the speaker isn't loud, I have to stop making tea to check my phone.",
      occType: "QR payments",
      occCat: "Medium/low-value + high-frequency",
      valRange: "<₹100",
      freq: "Daily",
      barrier: "Merchant acceptance/cues",
      desc: "Tea & snacks stall payments from evening commuters",
    },
    // 3. College Student / Food Delivery (Consumer)
    {
      respType: "Consumer",
      cityArea: "Delhi NCR (Noida Sec 62)",
      profile: "College student",
      appsUsed: "Google Pay, Paytm",
      primaryApp: "Google Pay",
      whyChosen: "Swiggy defaults to Google Pay as the top recommended UPI handle on checkout.",
      paytmUsage: "Use Paytm for booking movie tickets once a month.",
      needBarrier: "Merchant App Intent SDK Checkout Ranking",
      opportunity: "Paytm 1-Tap Intent SDK: Top-tier ranking partnership with Swiggy/Zomato.",
      keyQuote: "I just click the first payment option Swiggy shows on top.",
      occType: "Food delivery",
      occCat: "Medium/low-value + high-frequency",
      valRange: "₹100-₹500",
      freq: "Daily",
      barrier: "Speed",
      desc: "Ordering lunch on Swiggy to college hostel",
    },
    // 4. Rent Payment / High Value (Consumer)
    {
      respType: "Consumer",
      cityArea: "Pune (Viman Nagar)",
      profile: "Working professional",
      appsUsed: "Bank UPI app, Google Pay, Paytm",
      primaryApp: "Bank UPI app",
      whyChosen: "For ₹25,000 rent, I prefer direct HDFC Bank UPI app. If money gets stuck on third-party app, customer support is bot-only.",
      paytmUsage: "Had a ₹12,000 payment fail on Paytm 6 months ago; took 48 hours for refund credit.",
      needBarrier: "High-Value Transaction Trust & Instant Refund Security",
      opportunity: "Paytm ShieldPay: High-value payment protection with 10-minute instant refund guarantee.",
      keyQuote: "I can't risk my landlord's rent money getting stuck in a support bot loop.",
      occType: "Rent",
      occCat: "High-value + low-frequency",
      valRange: ">₹10000",
      freq: "Monthly",
      barrier: "Trust",
      desc: "Monthly apartment rent payment to landlord",
    },
    // 5. Utility Bills / Electricity (Consumer)
    {
      respType: "Consumer",
      cityArea: "Hyderabad (Gachibowli)",
      profile: "Working professional",
      appsUsed: "PhonePe, Paytm",
      primaryApp: "PhonePe",
      whyChosen: "PhonePe sends a push notification on the 1st of every month with my electricity bill auto-fetched. I pay in 1 click.",
      paytmUsage: "Used Paytm for mobile recharge 3 months ago.",
      needBarrier: "Proactive Bill Auto-Fetch & Lockscreen Notification Cards",
      opportunity: "Paytm SmartBill Engine: Auto-sync BBPS bills with 1-tap lockscreen payment widgets.",
      keyQuote: "I never remember bill due dates; PhonePe reminds me right when it's generated.",
      occType: "Utility bills",
      occCat: "High-value + low-frequency",
      valRange: "₹2000-₹10000",
      freq: "Monthly",
      barrier: "Convenience",
      desc: "Monthly electricity bill payment of ₹4,200",
    },
    // 6. Kirana Shop Owner (Merchant)
    {
      respType: "Merchant",
      cityArea: "Jaipur (Raja Park)",
      profile: "Kirana / Shop merchant",
      appsUsed: "Paytm, PhonePe, BHIM",
      primaryApp: "Paytm",
      whyChosen: "Paytm Business app gives clean daily settlement ledger and easy loan eligibility tracking.",
      paytmUsage: "Use Paytm for all merchant collections; customers pay via any QR.",
      needBarrier: "Merchant Financial Services & Loan Integration",
      opportunity: "Paytm Merchant Growth Hub: Instant overdraft line based on daily QR throughput.",
      keyQuote: "Paytm gives me daily loan offers based on my QR collection volume.",
      occType: "Merchant collections",
      occCat: "High-value + high-frequency",
      valRange: "₹500-₹2000",
      freq: "Daily",
      barrier: "Ecosystem/merchant availability",
      desc: "Daily customer QR collections at retail grocery store",
    },
    // 7. Freelancer P2P Transfer (Consumer)
    {
      respType: "Consumer",
      cityArea: "Bengaluru (Indiranagar)",
      profile: "Freelancer / Gig worker",
      appsUsed: "Google Pay, Paytm, Amazon Pay",
      primaryApp: "Google Pay",
      whyChosen: "GPay contact list shows profile photos and GPay badges directly in my phonebook.",
      paytmUsage: "Use Paytm for Uber rides.",
      needBarrier: "Contact Sync Clarity & Contact Search UX",
      opportunity: "Paytm ContactSync: Visual contact avatars with direct UPI handle badges.",
      keyQuote: "I know exactly who I'm paying because GPay shows their face in my contact list.",
      occType: "Peer-to-peer transfers",
      occCat: "High-value + high-frequency",
      valRange: "₹2000-₹10000",
      freq: "Weekly",
      barrier: "User interface",
      desc: "Splitting project payments with freelance teammates",
    },
    // 8. Auto Rickshaw / Transport (Consumer)
    {
      respType: "Consumer",
      cityArea: "Chennai (Adyar)",
      profile: "Retail customer",
      appsUsed: "PhonePe, Paytm",
      primaryApp: "PhonePe",
      whyChosen: "Auto drivers in Chennai display PhonePe QR stickers on the driver seat backrest.",
      paytmUsage: "Use Paytm wallet for metro pass.",
      needBarrier: "Visual Transport QR Placement & Quick Scan",
      opportunity: "Paytm TransitPay: Dedicated driver seat backrest QR stickers.",
      keyQuote: "I just scan the sticker on the back of the driver's seat while sitting in the auto.",
      occType: "Transport",
      occCat: "Medium/low-value + high-frequency",
      valRange: "<₹100",
      freq: "Daily",
      barrier: "Merchant acceptance/cues",
      desc: "Auto rickshaw ride payment ₹70",
    },
    // 9. Restaurant Customer (Consumer)
    {
      respType: "Consumer",
      cityArea: "Kolkata (Park Street)",
      profile: "Restaurant customer",
      appsUsed: "Google Pay, Paytm, PhonePe",
      primaryApp: "Google Pay",
      whyChosen: "Used GPay at restaurant table because waiter brought GPay machine.",
      paytmUsage: "Use Paytm for mobile recharge.",
      needBarrier: "Dine-in POS Machine Co-branding",
      opportunity: "Paytm SmartPOS Tabletop: QR standee with integrated split-bill calculator.",
      keyQuote: "We split the dining bill on GPay because everyone at table had GPay.",
      occType: "Restaurants",
      occCat: "High-value + low-frequency",
      valRange: "₹2000-₹10000",
      freq: "Weekly",
      barrier: "Social influence",
      desc: "Dining bill split with friends at restaurant",
    },
    // 10. Small Business Owner / Online Seller (Merchant)
    {
      respType: "Merchant",
      cityArea: "Ahmedabad (CG Road)",
      profile: "Online seller",
      appsUsed: "Paytm, PhonePe, BHIM",
      primaryApp: "PhonePe",
      whyChosen: "PhonePe PG offered lower transaction fee for online Instagram store checkout.",
      paytmUsage: "Used Paytm for offline bill payments.",
      needBarrier: "E-Commerce Checkout PG Pricing & Instant Settlement",
      opportunity: "Paytm InstaStore PG: Zero-fee UPI checkout for Instagram sellers.",
      keyQuote: "I send PhonePe payment link to my Instagram buyers because it confirms instantly.",
      occType: "Online shopping",
      occCat: "High-value + low-frequency",
      valRange: "₹2000-₹10000",
      freq: "Daily",
      barrier: "Rewards/value",
      desc: "Customer payments for custom clothing on Instagram",
    }
  ];

  const profilesList = [
    "College student", "Working professional", "Freelancer / Gig worker",
    "Small business owner", "Kirana / Shop merchant", "Food vendor / Tea stall",
    "Service provider", "Retail customer", "Restaurant customer", "Online seller"
  ];
  const citiesList = [
    "Bengaluru (Koramangala)", "Mumbai (Andheri East)", "Delhi NCR (Noida Sec 62)",
    "Pune (Viman Nagar)", "Hyderabad (Gachibowli)", "Jaipur (Raja Park)",
    "Bengaluru (Indiranagar)", "Chennai (Adyar)", "Kolkata (Park Street)", "Ahmedabad (CG Road)"
  ];

  // Seed exactly 50 records VOC-001 through VOC-050
  for (let i = 1; i <= 50; i++) {
    const vocCode = `VOC-${String(i).padStart(3, "0")}`;
    const t = templates[(i - 1) % templates.length];

    const isDepth = i <= 10;
    const respType = i % 4 === 0 ? "Merchant" : t.respType;
    const profile = profilesList[(i - 1) % profilesList.length];
    const city = citiesList[(i - 1) % citiesList.length];
    const date = dates[i % dates.length];

    // Create Respondent
    const resp = await prisma.respondent.create({
      data: {
        anonymousId: `RESP-2026-${String(i).padStart(3, "0")}`,
        ageRange: i % 4 === 0 ? "18-24" : i % 3 === 0 ? "25-34" : "35-44",
        occupation: profile,
        city: city.split(" ")[0],
        locality: city,
        primaryUpiApp: t.primaryApp,
        secondaryApps: JSON.stringify(["Paytm", "BHIM"]),
        usedPaytmLast90Days: true,
        monthlyPaymentCount: 12 + (i * 2) % 35,
        monthlyPaymentValue: 3500 + (i * 750) % 25000,
        trackAEligible: t.primaryApp !== "Paytm",
        completionStatus: isDepth ? "IN_DEPTH" : "VALID_VOC",
        isDemo: true,
      },
    });

    // Create VocResponse matching 12 official columns
    const voc = await prisma.vocResponse.create({
      data: {
        vocId: vocCode, // Col 1
        date: date, // Col 2
        respondentType: respType, // Col 3
        cityArea: city, // Col 4
        profileCategory: profile, // Col 5
        upiAppsUsed: t.appsUsed, // Col 6
        primaryUpiApp: t.primaryApp, // Col 7
        whyChosenExact: t.whyChosen, // Col 8
        paytmUsageWhenWhy: t.paytmUsage, // Col 9
        analystNeedBarrier: t.needBarrier, // Col 10
        opportunityIdea: t.opportunity, // Col 11
        keyQuote: t.keyQuote, // Col 12

        // Extended properties
        respondentId: resp.id,
        occasionCategory: t.occCat,
        occasionType: t.occType,
        transactionValueRange: t.valRange,
        frequency: t.freq,
        recentTxDescription: t.desc,
        appUsed: t.primaryApp,
        alternativeConsidered: "Paytm",
        whyChosen: t.whyChosen,
        whyNotPaytm: t.paytmUsage,
        paytmLastUsedExperience: "Previous transaction latency",
        verbatimQuote: t.keyQuote,
        researcherNeed: t.needBarrier.split("&")[0].trim(),
        researcherMotivation: "Speed & Convenience",
        researcherBarrier: t.barrier,
        researcherInsight: `${t.needBarrier}. ${t.opportunity}`,
        evidenceSummary: `Recent transaction in ${t.occType} using ${t.primaryApp}.`,
        interviewDepth: isDepth ? "IN_DEPTH" : "STANDARD",
        isDemo: true,
      },
    });

    // Create Barrier Record
    await prisma.barrier.create({
      data: {
        category: t.barrier,
        description: `Primary barrier in ${t.occType}: ${t.keyQuote}`,
        respondentId: resp.id,
        vocId: voc.id,
        isDemo: true,
      },
    });

    // Create InDepthInterview Record for first 10
    if (isDepth) {
      await prisma.inDepthInterview.create({
        data: {
          respondentId: resp.id,
          promptAnswersJson: JSON.stringify({
            q1_habits: `Uses UPI ${i * 2 + 3} times weekly for ${t.occType}.`,
            q2_primary_choice: t.whyChosen,
            q3_recent_tx: t.desc,
            q4_paytm_usage: t.paytmUsage,
            q5_switching_behavior: `Switched due to ${t.needBarrier}.`,
            q6_payment_occasions: t.occType,
            q7_trust: "Trusts primary app for instant settlement.",
            q8_reliability: "Prefers zero-latency transaction completion.",
            q9_convenience: "Double-tap scanner widget.",
            q10_merchant_exp: "Soundbox audio volume is critical.",
            q11_rewards: "Cashback coupons.",
            q12_feature_awareness: "Aware of Paytm UPI Lite.",
            q13_habit: "Home screen icon placement.",
            q14_social_influence: "Peer contacts usage.",
            q15_frustrations: "Paytm home screen promo popups.",
            q16_desired_improvements: t.opportunity,
          }),
          observations: `Respondent exhibited strong ${t.barrier} friction when attempting Paytm checkout.`,
          keyQuotesJson: JSON.stringify([t.keyQuote, t.whyChosen]),
          emergingInsights: t.opportunity,
          isDemo: true,
        },
      });
    }
  }

  // Create 4 DEMO Insights
  const demoInsights = [
    {
      title: "Merchant Soundbox Counter Cues Dictate Kirana App Choice",
      observation: "68% of Kirana grocery buyers choose PhonePe because the merchant's soundbox speaker is prominently displayed on the counter.",
      evidenceCount: 34,
      verbatimQuote: "At the Kirana shop, I just double tap PhonePe because the merchant has a PhonePe soundbox right on the counter.",
      pattern: "Visual and audio counter cues create strong subconscious app preference during high-frequency micro-payments.",
      barrier: "Merchant acceptance/cues",
      opportunity: "Paytm FlashPay: Consumer lockscreen widget with Soundbox 2.0 audio chime sync.",
      implication: "Paytm must ensure counter soundboxes are positioned at eye level with instant consumer confirmation chimes.",
    },
    {
      title: "Scanner Latency & Home Screen Clutter Trigger Paytm Drop-off",
      observation: "54% of daily commuters abandon Paytm for GPay or PhonePe because Paytm camera scanner takes 2-3 seconds to load due to home screen popups.",
      evidenceCount: 27,
      verbatimQuote: "Paytm camera scanner camera takes 3 seconds to launch due to home screen promo banners.",
      pattern: "Sub-500ms camera initialization is the single biggest operational requirement for high-frequency retail payments.",
      barrier: "Speed",
      opportunity: "Paytm FlashPay Scanner: Zero-ad instant camera scanner launch on cold app open.",
      implication: "Bypass promotional splash popups prior to payment camera initialization.",
    },
    {
      title: "High-Value Rent Payments Switch to Bank Apps due to Refund Anxiety",
      observation: "42% of high-value transactions (>₹10,000) for rent or tuition switch to direct Bank UPI apps.",
      evidenceCount: 21,
      verbatimQuote: "For ₹25,000 rent, I prefer direct HDFC Bank UPI app. If money gets stuck on third-party app, customer support is bot-only.",
      pattern: "Users perceive direct bank apps as safer for high stakes due to fear of delayed refunds on third-party platforms.",
      barrier: "Trust",
      opportunity: "Paytm ShieldPay: High-value payment protection with 10-minute instant refund credit guarantee.",
      implication: "Establish explicit safety guarantees and dedicated VIP customer support for transactions exceeding ₹10,000.",
    },
    {
      title: "Proactive Bill-Fetch Push Alerts Win Monthly Utility Payments",
      observation: "60% of recurring bill pay respondents choose PhonePe due to automated due-date push notifications with 1-click checkout.",
      evidenceCount: 30,
      verbatimQuote: "PhonePe sends a push notification on the 1st of every month with my electricity bill auto-fetched.",
      pattern: "Users prefer apps that eliminate manual bill searching and proactively remind them before due dates.",
      barrier: "Convenience",
      opportunity: "Paytm SmartBill Engine: Auto-sync BBPS bills with 1-tap lockscreen payment cards.",
      implication: "Upgrade BBPS integration to auto-fetch bills 5 days in advance and present single-tap lockscreen payment widgets.",
    },
  ];

  for (const ins of demoInsights) {
    await prisma.insight.create({
      data: { ...ins, linkedVocIds: JSON.stringify([]), isDemo: true },
    });
  }

  // Create 3 DEMO Solution Concepts
  const demoSolutions = [
    {
      name: "Paytm FlashPay Scanner (Zero-Latency Mode)",
      problemAddressed: "Paytm scanner camera launch delay caused by home screen promotional ads & cluttered navigation.",
      targetUser: "High-frequency daily commuters & Kirana shoppers (18-34 years).",
      relevantOccasion: "QR payments & Groceries",
      vocEvidence: "54% of respondents cite scanner load latency as main reason for defaulting to GPay/PhonePe.",
      userBenefit: "Sub-500ms instant QR scanning directly from phone lockscreen or app launch.",
      paytmBenefit: "Recovers high-frequency daily payment share and builds daily active habit.",
      merchantBenefit: "Faster counter queues and instant audio chime confirmation.",
      expectedBehaviorChange: "Users switch daily Kirana payments from PhonePe/GPay to Paytm due to superior scanner speed.",
      implementationRequirements: "Lightweight camera widget, bypass promo popups on cold launch, local QR caching.",
      potentialRisks: "Slight reduction in home screen promotional ad impressions.",
      scalabilityScore: 9,
      measurementMetric: "Monthly active scanner launches & daily Paytm UPI transaction count.",
      isDemo: true,
    },
    {
      name: "Paytm ShieldPay (High-Value Refund Guarantee)",
      problemAddressed: "Trust deficit and refund anxiety on high-value payments (>₹10,000) leading users to bank apps.",
      targetUser: "Working professionals & renters (25-45 years) paying rent, tuition, or credit bills.",
      relevantOccasion: "Rent & Utility bills",
      vocEvidence: "42% of high-value payment makers switch to bank apps to avoid stuck fund anxiety.",
      userBenefit: "Guaranteed 10-minute instant refund credit if bank server delays high-value UPI processing.",
      paytmBenefit: "Captures high-ticket GMV volumes and positions Paytm as the safest high-value app.",
      merchantBenefit: "Guaranteed settlement assurance for high-ticket billers.",
      expectedBehaviorChange: "Users shift ₹10,000+ rent and bill payments from Bank Apps to Paytm.",
      implementationRequirements: "Escrow liquidity buffer, priority bank API routing, real-time transaction monitoring.",
      potentialRisks: "Temporary capital lockup during major bank server outages.",
      scalabilityScore: 8,
      measurementMetric: "Share of ₹10,000+ UPI GMV processed via Paytm ShieldPay.",
      isDemo: true,
    },
    {
      name: "Paytm SmartBill Auto-Fetch & Lockscreen Pay",
      problemAddressed: "Competitors capturing recurring bill payments via superior proactive push notifications.",
      targetUser: "Household expense managers & busy working professionals.",
      relevantOccasion: "Utility bills & Mobile recharge",
      vocEvidence: "60% of bill pay respondents prefer PhonePe due to proactive 1-click push notifications.",
      userBenefit: "1-tap bill payment directly from lockscreen push notification without opening app.",
      paytmBenefit: "High retention and predictable monthly recurring GMV.",
      merchantBenefit: "Lower payment default rate for utility providers.",
      expectedBehaviorChange: "Users rely on Paytm notifications as their primary bill payment calendar.",
      implementationRequirements: "Enhanced BBPS sync, Android/iOS Live Activities notification card.",
      potentialRisks: "Notification fatigue if improperly scheduled.",
      scalabilityScore: 9,
      measurementMetric: "Monthly recurring bill GMV & repeat bill pay retention rate.",
      isDemo: true,
    },
  ];

  for (const sol of demoSolutions) {
    const createdSol = await prisma.solutionConcept.create({ data: sol });
    const firstResp = await prisma.respondent.findFirst({ where: { isDemo: true } });
    if (firstResp) {
      await prisma.solutionValidation.create({
        data: {
          solutionId: createdSol.id,
          respondentId: firstResp.id,
          solvesProblem: true,
          wouldChangeApp: true,
          targetOccasion: sol.relevantOccasion,
          expectedFrequency: "Daily",
          perceivedBlockers: "None",
          improvementSuggestions: "Add widget shortcut to Android home screen.",
          existingAlternative: "PhonePe",
          isDemo: true,
        },
      });
    }
  }

  return {
    success: true,
    count: 50,
    message: "Demo dataset successfully initialized with 50 official VOC records (VOC-001 through VOC-050).",
  };
}
