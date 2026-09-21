# Paytm UPI Preference Lab — Track A
### Build Primary-App Preference (Paytm UPI Growth Challenge 2026)

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://paytm-upi-preference-lab.vercel.app)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-00baf2?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-002970?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-5.19-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io)

🌐 **Live Production Web Application**: [https://paytm-upi-preference-lab.vercel.app](https://paytm-upi-preference-lab.vercel.app)  
🐙 **GitHub Repository**: [https://github.com/manugandham27/paytm-upi-preference-lab](https://github.com/manugandham27/paytm-upi-preference-lab)

---

## 📌 Executive Summary

**Paytm UPI Preference Lab** is a specialized research, insight synthesis, product validation, and submission generator platform engineered specifically for **Track A (Build Primary-App Preference)** of the Paytm UPI Growth Challenge 2026.

The platform enables research teams to recruit respondents, verify Track A eligibility, conduct 16-point in-depth interviews, analyze payment-occasion drop-off patterns, quantify potential Paytm GMV recovery, synthesize evidence-backed insights, validate proposed product interventions, and produce both the official **50-VOC Excel Workbook** and executive **2-Page Submission PDF**.

---

## 🎯 Track A Respondent Eligibility Rules

Per official challenge criteria, a respondent qualifies for the core research pool **ONLY IF**:

1. **Criterion A**: They have used Paytm UPI within the last 90 days.
2. **Criterion B**: Paytm is **NOT** currently their primary UPI application for the largest share of their UPI payments (e.g. primary app is Google Pay, PhonePe, BHIM, or Bank App).

The system enforces strict pre-screening intake rules before admitting any respondent record into the core VOC dataset. Ineligible intake attempts are logged separately for quality audit compliance without corrupting the dataset.

---

## ⚡ Key Platform Capabilities & Modules

### 1. Strict Screening & Intake Wizard (`/add-voc`)
- 4-step intake flow: Track A Screener $\rightarrow$ Demographic Profile (no PII) $\rightarrow$ Occasion & Drop-off Context $\rightarrow$ Barrier Tagging & Verbatim Synthesis.
- Auto-disqualifies ineligible respondents with audit logging.

### 2. Anti-Fabrication & Dual-Dataset Architecture
- **REAL Data Mode**: Starts cleanly at 0/50 valid VOCs and 0/10 In-depth interviews with progress warnings.
- **DEMO Mode Toggle**: Allows evaluators to test all interactive charts, matrices, and calculators using 50 pre-seeded synthetic Track A records without contaminating real research metrics.

### 3. 16-Point In-Depth Interview Studio (`/interviews`)
- Structured interview recorder for the 10 required in-depth sessions.
- Explores habits, primary app choice, soundbox counter cues, camera scanner latency, security trust, refund anxiety, and win-back levers.

### 4. Payment-Occasion 4-Quadrant Framework (`/occasions`)
- Categorizes transactions into High-Value/High-Freq, High-Value/Low-Freq, Low-Value/High-Freq, and Mixed quadrants.
- Interactive occasion matrix showing primary app preference leakage.

### 5. App Choice & "Why Not Paytm?" Engine (`/app-choice`)
- Deep-dive into competitor strengths vs Paytm drop-off points (e.g., soundbox counter cues at Kirana stores, intent SDK checkout ranking, contact sync clarity).

### 6. Switching Funnel & 12-Category Barrier Analysis (`/funnel` & `/barriers`)
- 7-stage conversion funnel visualizer.
- 12-category barrier classifier (Convenience, Reliability, Speed, Habit, Trust, Rewards, Merchant Cues, etc.) mapped directly to anonymized verbatims.

### 7. Evidence-Backed Insight Engine (`/insights`)
- Structured insight cards: Observation $\rightarrow$ Evidence $\rightarrow$ Verbatim $\rightarrow$ Pattern $\rightarrow$ Barrier $\rightarrow$ Opportunity $\rightarrow$ Implication.

### 8. Evidence-Based GMV Opportunity Calculator (`/opportunity`)
- Formula-based model:
  $$\text{Annual GMV Shift} = \text{Target Users} \times \text{Monthly Freq} \times \text{Avg Ticket Size} \times \text{Share Shift \%} \times 12$$
- Explicit visual separation between **Actual Research Data**, **Researcher Assumptions**, and **Modelled GMV Potential**.

### 9. Solution Concepts & Validation Hub (`/solutions` & `/validation`)
- 3 candidate interventions:
  - **Paytm FlashPay**: Zero-latency lockscreen camera scanner bypasses home screen promotional popups.
  - **Paytm ShieldPay**: 10-minute instant refund credit guarantee on high-value payments (>₹10,000).
  - **Paytm SmartBill**: Proactive 1-tap lockscreen bill auto-fetch.
- Real user validation feedback recorder evaluating problem-solving effectiveness and app-switch likelihood.

### 10. Research Quality Control & Audit (`/quality-control`)
- Automated 13-point compliance verification checklist ensuring zero PII and zero data fabrication.

### 11. Data Import & Export Workspace (`/data-io`)
- CSV/XLSX file importer with field mapping and rejection logging.
- Exporter generating official **50-VOC Excel Workbook** matching Paytm challenge column schema.

### 12. Executive 2-Page PDF Submission Generator (`/submission`)
- Print-ready executive document formatted into exact Page 1 (Problem Understanding & Research Findings) and Page 2 (Solution & GMV Growth Engine) layouts.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Paytm brand color system (`#002970` Navy, `#00baf2` Cyan)
- **Database**: Prisma ORM with SQLite engine (`prisma/dev.db`)
- **Charts**: Recharts (PieChart, BarChart, Funnels)
- **Excel Processing**: SheetJS (`xlsx`)

---

## ⚙️ Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/manugandham27/paytm-upi-preference-lab.git
cd paytm-upi-preference-lab

# 2. Install dependencies
npm install

# 3. Setup SQLite database & run schema push
npx prisma db push

# 4. Seed demo dataset (50 VOCs, 10 In-depth interviews)
npx tsx prisma/seed.ts

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the platform.

---

## 🚀 Deployment

The project is optimized for deployment on Vercel:

```bash
# Deploy to Vercel Production
npx vercel --prod --yes
```

Live Production Link: [https://paytm-upi-preference-lab.vercel.app](https://paytm-upi-preference-lab.vercel.app)

---

## 📄 License

Created for the Paytm UPI Growth Challenge 2026 — Track A.
