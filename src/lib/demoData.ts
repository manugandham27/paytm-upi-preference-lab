import { prisma } from "./prisma";

export async function seedDemoData() {
  // Check if demo data already exists
  const existingDemoCount = await prisma.respondent.count({
    where: { isDemo: true },
  });

  if (existingDemoCount >= 50) {
    return { success: true, count: existingDemoCount, message: "Demo data already initialized." };
  }

  // Clear any existing demo records to re-seed cleanly
  await prisma.respondent.deleteMany({ where: { isDemo: true } });

  const cities = ["Bengaluru", "Mumbai", "Delhi NCR", "Hyderabad", "Pune", "Chennai", "Jaipur", "Ahmedabad", "Kolkata", "Lucknow"];
  const occupations = ["Working Professional", "Student", "Business Owner", "Freelancer/Gig Worker"];
  const primaryApps = ["Google Pay", "PhonePe", "PhonePe", "Google Pay", "BHIM", "Bank UPI app"];
  const secondaryAppsList = [
    ["Paytm", "BHIM"],
    ["Paytm", "PhonePe"],
    ["Paytm", "Google Pay"],
    ["Paytm"],
  ];
  
  const occasionTemplates = [
    {
      category: "Medium/low-value + high-frequency",
      type: "Grocery",
      valRange: "₹100-₹500",
      freq: "Daily",
      desc: "Daily morning milk & bread purchase at local Kirana store",
      appUsed: "PhonePe",
      whyChosen: "QR Soundbox speaker was PhonePe, phone auto-opened PhonePe from widget",
      whyNotPaytm: "Paytm scanner felt slow last time and took 3 seconds to render QR camera",
      paytmLastExperience: "Transaction got stuck on processing screen for 10 seconds last month during peak evening hour",
      verbatim: "At the grocery store, I just double tap PhonePe because the merchant has a PhonePe soundbox right on the counter. It feels natural and instant.",
      need: "Instant QR scan & single-tap flow at counter",
      motivation: "Speed and merchant cue alignment",
      barrier: "Merchant acceptance/cues",
      insight: "Merchant counter branding and widget accessibility dictate low-ticket habitual app selection.",
      depth: "IN_DEPTH",
      promptAnswers: {
        q1_habits: "Uses UPI 4-5 times daily for small purchases under ₹300.",
        q2_primary_choice: "PhonePe due to home screen shortcut and soundbox matching at Kirana shops.",
        q3_recent_tx: "Bought groceries for ₹240 using PhonePe QR scan.",
        q4_paytm_usage: "Used Paytm heavily 2 years ago, now uses it only once a month for Fastag.",
        q5_switching_behavior: "Switched when PhonePe soundbox became ubiquitous in neighborhood stores.",
        q6_payment_occasions: "Uses GPay for rent/bills, PhonePe for Kirana, Paytm rarely.",
        q7_trust: "Trusts Paytm for wallet, but UPI feels slower than PhonePe.",
        q8_reliability: "Has experienced 1 failed transaction on Paytm 3 months back.",
        q9_convenience: "PhonePe home screen widget is faster to open.",
        q10_merchant_exp: "Merchants always display PhonePe or GPay QR codes prominently.",
        q11_rewards: "Cashbacks have degraded across all apps, so rewards don't drive app choice.",
        q12_feature_awareness: "Aware of Paytm UPI Lite but hasn't activated it.",
        q13_habit: "Muscle memory opens PhonePe when unlocking phone at shop counter.",
        q14_social_influence: "Friends all share PhonePe number for bill splitting.",
        q15_frustrations: "Paytm home screen is cluttered with too many ads and insurance banners.",
        q16_desired_improvements: "Clean payment screen with instant scanner on app launch."
      }
    },
    {
      category: "High-value + high-frequency",
      type: "P2P transfers",
      valRange: "₹2000-₹10000",
      freq: "Weekly",
      desc: "Sending weekly money to family member & splitting group expenses",
      appUsed: "Google Pay",
      whyChosen: "Contact list search is seamless; all contacts show GPay badge directly in phonebook",
      whyNotPaytm: "Harder to search non-Paytm contacts; feared wrong VPA transfer",
      paytmLastExperience: "Search bar brought up Paytm wallet transfer instead of UPI ID option",
      verbatim: "When sending money to friends or family, Google Pay shows who is on GPay right in my contact list. Paytm forces me to choose between Wallet or UPI.",
      need: "Frictionless contact-to-contact UPI resolution",
      motivation: "Confidence in recipient identity and zero-error contact matching",
      barrier: "User interface",
      insight: "P2P preference is driven by contact sync clarity and reduced cognitive friction when searching recipients.",
      depth: "IN_DEPTH",
      promptAnswers: {
        q1_habits: "Sends ₹5,000 to home every week.",
        q2_primary_choice: "Google Pay for all P2P payments.",
        q3_recent_tx: "Sent ₹3,500 to roommate for apartment internet bill.",
        q4_paytm_usage: "Used Paytm for movie tickets last week.",
        q5_switching_behavior: "Switched to GPay 1.5 years ago for clean contact UI.",
        q6_payment_occasions: "P2P transfers and online food delivery.",
        q7_trust: "Google brand feels extremely secure for large P2P sums.",
        q8_reliability: "Zero failed P2P transactions on GPay.",
        q9_convenience: "Direct contact sync with avatars.",
        q10_merchant_exp: "N/A for P2P.",
        q11_rewards: "GPay scratch cards used to be good, now mostly discount coupons.",
        q12_feature_awareness: "Knows Paytm bank balance check is quick.",
        q13_habit: "Always taps GPay icon on home dock.",
        q14_social_influence: "Roommates all send GPay request links.",
        q15_frustrations: "Paytm popup promos distract when trying to pay quickly.",
        q16_desired_improvements: "Dedicated lightweight P2P mode in Paytm."
      }
    },
    {
      category: "High-value + low-frequency",
      type: "Bills",
      valRange: ">₹10000",
      freq: "Monthly",
      desc: "Monthly credit card bill payment and electricity bill of ₹14,500",
      appUsed: "PhonePe",
      whyChosen: "Auto-reminder notification popped up 3 days before due date with 1-click pay",
      whyNotPaytm: "Did not receive timely bill fetch alert on Paytm",
      paytmLastExperience: "Bill status didn't update immediately after payment 2 months ago",
      verbatim: "PhonePe sends me a push notification exactly on the 1st of every month with my electricity bill pre-fetched. I just click the notification and pay.",
      need: "Proactive bill fetch & automated due reminders",
      motivation: "Avoiding late fees and peace of mind",
      barrier: "Convenience",
      insight: "High-value bill payments are captured by apps that proactively fetch bills and provide instant payment confirmation.",
      depth: "IN_DEPTH",
      promptAnswers: {
        q1_habits: "Pays electricity, Wi-Fi, and credit cards once a month.",
        q2_primary_choice: "PhonePe for all recurring utility bills.",
        q3_recent_tx: "Paid ₹12,400 credit card bill.",
        q4_paytm_usage: "Uses Paytm for mobile recharge occasionally.",
        q5_switching_behavior: "PhonePe auto-fetched bills seamlessly.",
        q6_payment_occasions: "High-value monthly bill payments.",
        q7_trust: "High trust in PhonePe BBPS integration.",
        q8_reliability: "Never missed a bill due date with PhonePe reminders.",
        q9_convenience: "1-click pay from push notification.",
        q10_merchant_exp: "BBPS biller receipts generate instantly.",
        q11_rewards: "Earns small coin rewards on PhonePe.",
        q12_feature_awareness: "Aware of Paytm Automatic Recurring UPI.",
        q13_habit: "Relies on notification triggers rather than opening app manually.",
        q14_social_influence: "Spouse uses PhonePe for household bills.",
        q15_frustrations: "Paytm navigation to Bill Payments requires scrolling past 4 sections.",
        q16_desired_improvements: "Unified bill dashboard with push reminders."
      }
    },
    {
      category: "Medium/low-value + high-frequency",
      type: "Food",
      valRange: "₹500-₹2000",
      freq: "Daily",
      desc: "Ordering lunch on Swiggy and dinner on Zomato",
      appUsed: "Google Pay",
      whyChosen: "Default UPI Intent seamlessly pops up GPay without typing UPI ID",
      whyNotPaytm: "Paytm intent option was listed 4th in Swiggy payment sheet",
      paytmLastExperience: "Paytm app launch took 4 seconds due to splash screen promo",
      verbatim: "On Swiggy, Google Pay is the top recommended option. It auto-redirects, I put my PIN, and I'm back in the app in 5 seconds.",
      need: "Top-tier merchant checkout SDK positioning & instant intent launch",
      motivation: "Zero friction food ordering",
      barrier: "Speed",
      insight: "Merchant app checkout ranking creates immense default bias toward top-listed intent handles.",
      depth: "IN_DEPTH",
      promptAnswers: {
        q1_habits: "Orders food online 5-6 times a week.",
        q2_primary_choice: "Google Pay for in-app checkout.",
        q3_recent_tx: "Paid ₹680 for lunch on Swiggy.",
        q4_paytm_usage: "Has Paytm wallet balance of ₹150.",
        q5_switching_behavior: "Swiggy defaulted to GPay as top UPI handle.",
        q6_payment_occasions: "Food delivery & quick commerce.",
        q7_trust: "High trust in GPay intent flow.",
        q8_reliability: "Fast intent completion.",
        q9_convenience: "Auto-launch without typing VPA.",
        q10_merchant_exp: "Merchant app integration is instant.",
        q11_rewards: "GPay scratch card after 3 food orders.",
        q12_feature_awareness: "Not aware if Paytm offers cashback on Swiggy.",
        q13_habit: "Click top payment option on Swiggy list.",
        q14_social_influence: "Coworkers use GPay.",
        q15_frustrations: "Paytm requires extra steps if wallet is default.",
        q16_desired_improvements: "Make Paytm UPI intent 1-tap checkout."
      }
    },
    {
      category: "High-value + low-frequency",
      type: "Rent",
      valRange: ">₹10000",
      freq: "Monthly",
      desc: "Monthly house rent of ₹28,000 to landlord bank account",
      appUsed: "Bank UPI app",
      whyChosen: "Perceived higher security and higher transaction limit approval for ₹25,000+ amounts",
      whyNotPaytm: "Worried about daily UPI limit cap or bank server failure on third-party app",
      paytmLastExperience: "Had a high-value transfer fail 6 months ago, took 48 hours for refund",
      verbatim: "For rent payments over ₹20,000, I prefer using my HDFC Bank UPI app directly. If a large amount gets stuck on a third-party app, customer support is exhausting.",
      need: "High-value transaction assurance & instant refund guarantee",
      motivation: "Risk mitigation and financial security",
      barrier: "Trust",
      insight: "High-ticket payments switch to bank apps due to fear of locked funds and poor customer support response for failed transactions.",
      depth: "IN_DEPTH",
      promptAnswers: {
        q1_habits: "Pays rent and tuition fees monthly.",
        q2_primary_choice: "HDFC PayZapp / Bank UPI for large amounts.",
        q3_recent_tx: "Paid ₹28,000 rent to landlord.",
        q4_paytm_usage: "Uses Paytm for movie tickets and metro recharge.",
        q5_switching_behavior: "Switched rent payments after a ₹15,000 failure on third-party app.",
        q6_payment_occasions: "Large monthly transfers >₹10,000.",
        q7_trust: "Bank direct app feels safer for high amounts.",
        q8_reliability: "Direct bank server connection reduces failure probability.",
        q9_convenience: "Bank app has direct branch support.",
        q10_merchant_exp: "Landlord prefers direct bank reference number.",
        q11_rewards: "Bank credit points.",
        q12_feature_awareness: "Aware of Paytm UPI Lite.",
        q13_habit: "Uses bank app only around 1st of month.",
        q14_social_influence: "Landlord suggested bank NEFT/UPI.",
        q15_frustrations: "Third-party customer support uses bots for stuck funds.",
        q16_desired_improvements: "Dedicated high-value priority protection & instant resolution."
      }
    }
  ];

  const additionalOccasions = [
    { type: "Transport", cat: "Medium/low-value + high-frequency", val: "<₹100", app: "PhonePe", barrier: "Speed", desc: "Auto rickshaw payment ₹60", verbatim: "Scanned PhonePe QR on auto back-seat. Instant payment." },
    { type: "Shopping", cat: "High-value + low-frequency", val: "₹2000-₹10000", app: "Google Pay", barrier: "Habit", desc: "Bought clothes at Zudio ₹3,400", verbatim: "Used GPay at retail counter by habit." },
    { type: "Recharge", cat: "Medium/low-value + high-frequency", val: "₹500-₹2000", app: "PhonePe", barrier: "Convenience", desc: "Jio annual data recharge ₹1,559", verbatim: "PhonePe sent recharge expiry alert 2 days prior." },
    { type: "Education", cat: "High-value + low-frequency", val: ">₹10000", app: "Bank UPI app", barrier: "Trust", desc: "College semester fee ₹45,000", verbatim: "Used HDFC app because college portal recommended bank UPI." },
    { type: "Healthcare", cat: "High-value + low-frequency", val: "₹2000-₹10000", app: "Google Pay", barrier: "Reliability", desc: "Pharmacy bill ₹2,100", verbatim: "Used GPay because pharmacy QR scanner was fast." },
    { type: "Travel", cat: "High-value + low-frequency", val: "₹2000-₹10000", app: "PhonePe", barrier: "Rewards/value", desc: "Flight ticket booking ₹6,500", verbatim: "PhonePe gave flat ₹250 cashback coupon on MakeMyTrip." },
  ];

  // Seed 50 DEMO respondents & VOCs
  for (let i = 1; i <= 50; i++) {
    const isDepth = i <= 10; // First 10 are IN_DEPTH
    const template = occasionTemplates[(i - 1) % occasionTemplates.length];
    const extra = additionalOccasions[(i - 1) % additionalOccasions.length];
    
    const occType = isDepth ? template.type : extra.type;
    const occCat = isDepth ? template.category : extra.cat;
    const valRange = isDepth ? template.valRange : extra.val;
    const appUsed = isDepth ? template.appUsed : extra.app;
    const barrierCat = isDepth ? template.barrier : extra.barrier;
    const verbatimText = isDepth ? template.verbatim : extra.verbatim;
    const descText = isDepth ? template.desc : extra.desc;

    const resp = await prisma.respondent.create({
      data: {
        anonymousId: `DEMO-RESP-2026-${String(i).padStart(3, "0")}`,
        ageRange: i % 4 === 0 ? "18-24" : i % 3 === 0 ? "25-34" : i % 2 === 0 ? "35-44" : "45+",
        occupation: occupations[i % occupations.length],
        city: cities[i % cities.length],
        locality: `Sector ${i * 3}, Phase ${i % 5 + 1}`,
        primaryUpiApp: appUsed,
        secondaryApps: JSON.stringify(secondaryAppsList[i % secondaryAppsList.length]),
        usedPaytmLast90Days: true,
        monthlyPaymentCount: 15 + (i * 3) % 40,
        monthlyPaymentValue: 4000 + (i * 850) % 35000,
        trackAEligible: true,
        completionStatus: isDepth ? "IN_DEPTH" : "VALID_VOC",
        isDemo: true,
      },
    });

    const voc = await prisma.vocResponse.create({
      data: {
        respondentId: resp.id,
        occasionCategory: occCat,
        occasionType: occType,
        transactionValueRange: valRange,
        frequency: i % 2 === 0 ? "Daily" : "Weekly",
        recentTxDescription: descText,
        appUsed: appUsed,
        alternativeConsidered: "Paytm",
        whyChosen: isDepth ? template.whyChosen : `Faster scan and familiar interface on ${appUsed}`,
        whyNotPaytm: isDepth ? template.whyNotPaytm : "Paytm app home screen had too many ads and slower load time",
        paytmLastUsedExperience: isDepth ? template.paytmLastExperience : "Transaction took 8 seconds to process last time",
        verbatimQuote: verbatimText,
        researcherNeed: isDepth ? template.need : "Zero-friction scanning & instant receipt confirmation",
        researcherMotivation: isDepth ? template.motivation : "Speed and habit alignment",
        researcherBarrier: barrierCat,
        researcherInsight: isDepth ? template.insight : "Users default to rival apps when Paytm home screen presents layout clutter or delayed camera launch.",
        evidenceSummary: `Recent transaction of ${valRange} in ${occType} category using ${appUsed}.`,
        interviewDepth: isDepth ? "IN_DEPTH" : "STANDARD",
        isDemo: true,
      },
    });

    // Create Barrier record
    await prisma.barrier.create({
      data: {
        category: barrierCat,
        description: `Primary barrier in ${occType}: ${verbatimText}`,
        respondentId: resp.id,
        vocId: voc.id,
        isDemo: true,
      },
    });

    // Create InDepthInterview record for first 10
    if (isDepth) {
      await prisma.inDepthInterview.create({
        data: {
          respondentId: resp.id,
          promptAnswersJson: JSON.stringify(template.promptAnswers),
          observations: `Respondent showed strong non-Paytm muscle memory. Needs single-tap payment widget.`,
          keyQuotesJson: JSON.stringify([verbatimText, template.whyNotPaytm]),
          emergingInsights: template.insight,
          isDemo: true,
        },
      });
    }
  }

  // Create 4 DEMO Insights
  const demoInsights = [
    {
      title: "Merchant Soundbox Cues Dictate Kirana App Choice",
      observation: "68% of respondents paying at local Kirana stores choose PhonePe because the merchant's soundbox speaker is prominently displayed on the counter.",
      evidenceCount: 34,
      verbatimQuote: "At the grocery store, I just double tap PhonePe because the merchant has a PhonePe soundbox right on the counter. It feels natural and instant.",
      pattern: "Visual and audio counter cues create strong subconscious app preference during high-frequency low-ticket retail transactions.",
      barrier: "Merchant acceptance/cues",
      opportunity: "Paytm Soundbox 2.0 consumer-side widget integration & instant scanning shortcuts.",
      implication: "Paytm must incentivize merchants to place Paytm Soundboxes at eye level and offer instant consumer confirmation notifications.",
    },
    {
      title: "Home Screen Clutter and Scanner Latency Cause Paytm Drop-off",
      observation: "54% of respondents reported abandoning Paytm for GPay or PhonePe because the Paytm camera scanner takes 2-3 seconds to launch due to home screen promos.",
      evidenceCount: 27,
      verbatimQuote: "Paytm app launch took 4 seconds due to splash screen promo. PhonePe scanner opens immediately.",
      pattern: "Low-latency camera access is the single biggest operational requirement for high-frequency micro-payments.",
      barrier: "Speed",
      opportunity: "Paytm FlashPay Mode: Zero-ad instant camera scanner launch on app open.",
      implication: "Remove home screen promotional splash popups prior to payment camera initialization.",
    },
    {
      title: "High-Value Payments Switch to Bank Apps due to Failed-Tx Refund Anxiety",
      observation: "42% of high-value transactions (>₹10,000) for rent or tuition are routed through Bank UPI apps instead of Paytm.",
      evidenceCount: 21,
      verbatimQuote: "For rent payments over ₹20,000, I prefer using my HDFC Bank UPI app directly. If a large amount gets stuck on a third-party app, customer support is exhausting.",
      pattern: "Users perceive direct bank apps as safer for high stakes due to fear of delayed refunds on third-party platforms.",
      barrier: "Trust",
      opportunity: "Paytm ShieldPay: High-value transaction protection with instant 10-minute refund guarantee for stuck UPI funds.",
      implication: "Build explicit safety guarantees and dedicated VIP customer support resolution for transactions exceeding ₹10,000.",
    },
    {
      title: "Proactive Bill-Fetch Push Alerts Win Monthly Utility Payments",
      observation: "60% of recurring bill pay respondents choose PhonePe because of automated due-date push notifications with 1-click checkout.",
      evidenceCount: 30,
      verbatimQuote: "PhonePe sends me a push notification exactly on the 1st of every month with my electricity bill pre-fetched. I just click the notification and pay.",
      pattern: "Users prefer apps that eliminate manual bill searching and proactively remind them before due dates.",
      barrier: "Convenience",
      opportunity: "Paytm SmartBill Engine: Proactive bill auto-sync with 1-tap lockscreen payment cards.",
      implication: "Upgrade BBPS integration to auto-fetch bills 5 days in advance and present single-tap lockscreen payment widgets.",
    },
  ];

  for (const ins of demoInsights) {
    await prisma.insight.create({
      data: {
        ...ins,
        linkedVocIds: JSON.stringify([]),
        isDemo: true,
      },
    });
  }

  // Create 3 DEMO Solution Concepts
  const demoSolutions = [
    {
      name: "Paytm FlashPay Scanner (Zero-Latency Mode)",
      problemAddressed: "Paytm scanner launch delay caused by home screen promotional ads & cluttered navigation.",
      targetUser: "High-frequency daily commuters & Kirana shoppers (18-34 years).",
      relevantOccasion: "Medium/low-value + high-frequency (Grocery, Food, Transport).",
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
      relevantOccasion: "High-value + low-frequency (Rent, Bills, Education).",
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
      relevantOccasion: "High-value + low-frequency (Bills, Electricity, Water, Broadband).",
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
    const createdSol = await prisma.solutionConcept.create({
      data: sol,
    });

    // Add DEMO validations for each solution concept
    for (let j = 1; j <= 5; j++) {
      const respId = (await prisma.respondent.findFirst({ where: { isDemo: true } }))?.id;
      if (respId) {
        await prisma.solutionValidation.create({
          data: {
            solutionId: createdSol.id,
            respondentId: respId,
            solvesProblem: j <= 4, // 80% positive
            wouldChangeApp: j <= 4,
            targetOccasion: sol.relevantOccasion,
            expectedFrequency: j % 2 === 0 ? "Daily" : "Weekly",
            perceivedBlockers: j === 5 ? "Need to ensure phone battery doesn't drain with widget" : "None",
            improvementSuggestions: "Add widget shortcut to Android home screen.",
            existingAlternative: "PhonePe",
            isDemo: true,
          },
        });
      }
    }
  }

  // Create DEMO Opportunity Model
  await prisma.opportunityModel.create({
    data: {
      segmentName: "Urban Working Professionals & Students (Track A Non-Primary Paytm Users)",
      targetUserCount: 15000000,
      avgMonthlyFreq: 18.5,
      avgTicketSize: 450,
      potentialShareShiftPct: 15.0,
      calculatedGmvPotential: 18731250000, // ₹18,731.25 Cr
      assumptionsJson: JSON.stringify([
        "Target pool: 15 million urban UPI users who have used Paytm in 90 days but use GPay/PhonePe primarily.",
        "Average user makes 18.5 UPI transactions per month across Kirana, Food, Bills, and P2P.",
        "Average transaction ticket size is ₹450 across all payment occasions.",
        "Implementing Paytm FlashPay and SmartBill can shift 15% of their monthly transactions back to Paytm."
      ]),
      isDemo: true,
    },
  });

  return { success: true, count: 50, message: "Demo dataset successfully generated (50 VOCs, 10 In-depth, 4 Insights, 3 Solutions)." };
}
