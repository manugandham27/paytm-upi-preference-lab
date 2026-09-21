"use client";

import { useState } from "react";
import { ClientLayoutWrapper } from "@/components/ClientLayoutWrapper";
import {
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  UserCheck,
  CreditCard,
  HelpCircle,
  Save,
  AlertOctagon,
} from "lucide-react";
import {
  PRIMARY_UPI_APPS,
  OCCASION_CATEGORIES,
  OCCASION_TYPES,
  BARRIER_CATEGORIES,
  evaluateTrackAEligibility,
} from "@/lib/validation";

export default function AddVocPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [screeningError, setScreeningError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    usedPaytmLast90Days: true,
    primaryUpiApp: "Google Pay",
    ageRange: "25-34",
    occupation: "Working Professional",
    city: "Mumbai",
    locality: "",
    secondaryApps: ["Paytm", "BHIM"],
    monthlyPaymentCount: 20,
    monthlyPaymentValue: 8000,
    occasionCategory: "Medium/low-value + high-frequency",
    occasionType: "Grocery",
    transactionValueRange: "₹100-₹500",
    frequency: "Daily",
    recentTxDescription: "",
    appUsed: "Google Pay",
    alternativeConsidered: "Paytm",
    whyChosen: "",
    whyNotPaytm: "",
    paytmLastUsedExperience: "",
    verbatimQuote: "",
    researcherNeed: "",
    researcherMotivation: "",
    researcherBarrier: "Convenience",
    researcherInsight: "",
    evidenceSummary: "",
    interviewDepth: "STANDARD",
    isDemo: false,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      // Evaluate screening
      const screening = evaluateTrackAEligibility({
        usedPaytmLast90Days: formData.usedPaytmLast90Days,
        primaryUpiApp: formData.primaryUpiApp,
      });

      if (!screening.isEligible) {
        setScreeningError(screening.reason);
        return;
      }
      setScreeningError(null);
    }
    setStep((s) => s + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg(null);
    setScreeningError(null);

    try {
      const res = await fetch("/api/voc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok || !result.isEligible) {
        setScreeningError(result.reason || result.message || "Respondent rejected by screening rules.");
        setSubmitting(false);
        return;
      }

      setSuccessMsg(`Valid VOC recorded successfully! Respondent ID: ${result.respondent?.anonymousId}`);
      // Reset form
      setStep(1);
    } catch (err: any) {
      setScreeningError(err.message || "Failed to submit VOC.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ClientLayoutWrapper>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Title */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-paytm-cyan/20 text-paytm-cyan flex items-center justify-center font-bold">
              +
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Record Track A VOC & Respondent</h1>
              <p className="text-xs text-slate-400">
                Step-by-step intake wizard with strict Track A screening enforcement
              </p>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4 text-xs font-medium">
            <span className={step >= 1 ? "text-paytm-cyan font-bold" : "text-slate-500"}>
              1. Track A Screening
            </span>
            <span className={step >= 2 ? "text-paytm-cyan font-bold" : "text-slate-500"}>
              2. Profile & Behavior
            </span>
            <span className={step >= 3 ? "text-paytm-cyan font-bold" : "text-slate-500"}>
              3. Occasion & App Choice
            </span>
            <span className={step >= 4 ? "text-paytm-cyan font-bold" : "text-slate-500"}>
              4. Barrier & Verbatim
            </span>
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="bg-emerald-950 border border-emerald-700 text-emerald-200 p-4 rounded-xl flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-semibold">{successMsg}</span>
          </div>
        )}

        {/* Screening Error / Rejection Notice */}
        {screeningError && (
          <div className="bg-rose-950 border border-rose-700 text-rose-200 p-4 rounded-xl space-y-2">
            <div className="flex items-center space-x-2">
              <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" />
              <h3 className="font-bold text-sm">Track A Disqualification Notice</h3>
            </div>
            <p className="text-xs text-rose-300 leading-relaxed">{screeningError}</p>
            <p className="text-[11px] text-rose-400 italic">
              Record logged as INVALID_SCREENING for research quality audit compliance.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-6">
          {/* STEP 1: Strict Screening */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <UserCheck className="w-5 h-5 text-paytm-cyan" />
                  <span>Step 1: Official Track A Respondent Screening</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Respondents qualify ONLY if they have used Paytm in the last 90 days AND Paytm is NOT their primary app.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <label className="text-sm font-semibold text-slate-200 block">
                    Q1. Have you used Paytm UPI in the last 90 days? *
                  </label>
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center space-x-2 text-sm text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name="usedPaytmLast90Days"
                        checked={formData.usedPaytmLast90Days === true}
                        onChange={() => handleChange("usedPaytmLast90Days", true)}
                        className="text-paytm-cyan focus:ring-paytm-cyan"
                      />
                      <span>Yes (Required for Track A)</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name="usedPaytmLast90Days"
                        checked={formData.usedPaytmLast90Days === false}
                        onChange={() => handleChange("usedPaytmLast90Days", false)}
                        className="text-paytm-cyan focus:ring-paytm-cyan"
                      />
                      <span>No (Ineligible)</span>
                    </label>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <label className="text-sm font-semibold text-slate-200 block">
                    Q2. Which UPI application do you use for the largest share of your UPI payments? *
                  </label>
                  <select
                    value={formData.primaryUpiApp}
                    onChange={(e) => handleChange("primaryUpiApp", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-paytm-cyan"
                  >
                    {PRIMARY_UPI_APPS.map((app) => (
                      <option key={app} value={app}>
                        {app} {app === "Paytm" ? "(Ineligible for Track A)" : ""}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-400 italic">
                    Note: Selecting Paytm will trigger Track A disqualification rule.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Demographics & Profile */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-base font-bold text-white">Step 2: Respondent Demographic Profile</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Do NOT collect PII (No phone number, email, UPI ID, or bank account info).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Age Range</label>
                  <select
                    value={formData.ageRange}
                    onChange={(e) => handleChange("ageRange", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                  >
                    <option value="18-24">18-24 years</option>
                    <option value="25-34">25-34 years</option>
                    <option value="35-44">35-44 years</option>
                    <option value="45+">45+ years</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Occupation</label>
                  <select
                    value={formData.occupation}
                    onChange={(e) => handleChange("occupation", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                  >
                    <option value="Student">Student</option>
                    <option value="Working Professional">Working Professional</option>
                    <option value="Business Owner">Business Owner</option>
                    <option value="Freelancer/Gig Worker">Freelancer/Gig Worker</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                    placeholder="e.g. Mumbai, Bengaluru, Delhi NCR"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Locality (Optional)</label>
                  <input
                    type="text"
                    value={formData.locality}
                    onChange={(e) => handleChange("locality", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                    placeholder="e.g. Koramangala, Bandra West"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Approx. Monthly UPI Tx Count</label>
                  <input
                    type="number"
                    value={formData.monthlyPaymentCount}
                    onChange={(e) => handleChange("monthlyPaymentCount", Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Approx. Monthly UPI Value (₹)</label>
                  <input
                    type="number"
                    value={formData.monthlyPaymentValue}
                    onChange={(e) => handleChange("monthlyPaymentValue", Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Occasion & App Choice */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-base font-bold text-white">Step 3: Payment Occasion & App Choice Drop-Off</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Focus on ACTUAL recent transaction behavior over hypothetical intent.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Occasion Quadrant</label>
                  <select
                    value={formData.occasionCategory}
                    onChange={(e) => handleChange("occasionCategory", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                  >
                    {OCCASION_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Payment Occasion Type</label>
                  <select
                    value={formData.occasionType}
                    onChange={(e) => handleChange("occasionType", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                  >
                    {OCCASION_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">App Used for Recent Tx</label>
                  <select
                    value={formData.appUsed}
                    onChange={(e) => handleChange("appUsed", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                  >
                    {PRIMARY_UPI_APPS.map((app) => (
                      <option key={app} value={app}>{app}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Transaction Value Range</label>
                  <select
                    value={formData.transactionValueRange}
                    onChange={(e) => handleChange("transactionValueRange", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                  >
                    <option value="<₹100">&lt;₹100</option>
                    <option value="₹100-₹500">₹100-₹500</option>
                    <option value="₹500-₹2000">₹500-₹2000</option>
                    <option value="₹2000-₹10000">₹2000-₹10,000</option>
                    <option value=">₹10000">&gt;₹10,000</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Recent Transaction Description *
                  </label>
                  <input
                    type="text"
                    value={formData.recentTxDescription}
                    onChange={(e) => handleChange("recentTxDescription", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                    placeholder="e.g. Paid ₹240 for morning milk & groceries at local Kirana"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Why was this specific app chosen? *
                  </label>
                  <textarea
                    rows={2}
                    value={formData.whyChosen}
                    onChange={(e) => handleChange("whyChosen", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    placeholder="e.g. Merchant had PhonePe QR soundbox on counter and home screen widget opened instantly."
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Why was Paytm NOT chosen for this transaction? *
                  </label>
                  <textarea
                    rows={2}
                    value={formData.whyNotPaytm}
                    onChange={(e) => handleChange("whyNotPaytm", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    placeholder="e.g. Paytm scanner camera takes 3 seconds to launch due to home screen promo banner."
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Barrier & Verbatim Synthesis */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-base font-bold text-white">Step 4: Barrier Tagging & Researcher Synthesis</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Synthesize the underlying root cause barrier and exact anonymized respondent quote.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Primary Barrier Category *</label>
                  <select
                    value={formData.researcherBarrier}
                    onChange={(e) => handleChange("researcherBarrier", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                  >
                    {BARRIER_CATEGORIES.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Interview Depth Tag</label>
                  <select
                    value={formData.interviewDepth}
                    onChange={(e) => handleChange("interviewDepth", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                  >
                    <option value="STANDARD">STANDARD VOC</option>
                    <option value="IN_DEPTH">IN-DEPTH INTERVIEW (16-Point Session)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Anonymized Respondent Verbatim (Exact Quote) *
                  </label>
                  <textarea
                    rows={3}
                    value={formData.verbatimQuote}
                    onChange={(e) => handleChange("verbatimQuote", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white italic"
                    placeholder="e.g. 'At the Kirana store, I just double tap PhonePe because the merchant has a PhonePe soundbox on the counter.'"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Identified Core Need</label>
                    <input
                      type="text"
                      value={formData.researcherNeed}
                      onChange={(e) => handleChange("researcherNeed", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                      placeholder="e.g. Zero-latency camera launch"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">User Motivation</label>
                    <input
                      type="text"
                      value={formData.researcherMotivation}
                      onChange={(e) => handleChange("researcherMotivation", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                      placeholder="e.g. Counter checkout speed"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Key Researcher Insight</label>
                  <textarea
                    rows={2}
                    value={formData.researcherInsight}
                    onChange={(e) => handleChange("researcherInsight", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    placeholder="e.g. Counter branding and widget speed dictate micro-transaction app selection."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-paytm-cyan hover:bg-cyan-400 text-paytm-navy font-bold px-5 py-2 rounded-lg text-xs flex items-center space-x-1"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-lg text-xs flex items-center space-x-2 shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>{submitting ? "Saving VOC..." : "Save Valid VOC"}</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </ClientLayoutWrapper>
  );
}
