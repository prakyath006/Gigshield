"use client";
import { useState } from "react";
import { ChevronRight, ChevronLeft, Shield, Zap, CheckCircle, Brain, MapPin, User, Bike, IndianRupee } from "lucide-react";
import { PageType, Worker } from "../types";
import { useApp } from "../context/AppContext";
import { calculateDynamicPremium, generateRiskProfile } from "../data";

interface OnboardingPageProps {
  onNavigate: (page: PageType) => void;
}

export default function OnboardingPage({ onNavigate }: OnboardingPageProps) {
  const { addWorker } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    platform: "" as Worker["platform"] | "",
    city: "",
    zone: "",
    vehicleType: "" as Worker["vehicleType"] | "",
    avgWeeklyEarnings: "",
    avgWeeklyHours: "",
    avgDeliveriesPerDay: "",
    selectedPlan: "standard" as "basic" | "standard" | "premium",
  });

  const totalSteps = 4;

  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const demoWorker: Worker = {
    id: "NEW",
    name: formData.name || "Demo User",
    phone: formData.phone || "+91 99999 99999",
    email: formData.email || "demo@email.com",
    platform: (formData.platform as Worker["platform"]) || "zomato",
    city: formData.city || "Mumbai",
    zone: formData.zone || "Andheri",
    vehicleType: (formData.vehicleType as Worker["vehicleType"]) || "motorcycle",
    avgWeeklyEarnings: parseInt(formData.avgWeeklyEarnings) || 5000,
    avgWeeklyHours: parseInt(formData.avgWeeklyHours) || 45,
    avgDeliveriesPerDay: parseInt(formData.avgDeliveriesPerDay) || 20,
    registrationDate: new Date().toISOString().split("T")[0],
    riskScore: 35,
    riskLevel: "low",
  };

  const premiumCalc = calculateDynamicPremium(demoWorker, formData.selectedPlan);
  const riskProfile = generateRiskProfile(demoWorker);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-10">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="flex-1 flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              i + 1 <= step ? "gradient-bg text-white" : "bg-[var(--color-surface-light)] text-[var(--color-text-muted)]"
            }`}>
              {i + 1 < step ? <CheckCircle size={16} /> : i + 1}
            </div>
            {i < totalSteps - 1 && (
              <div className={`flex-1 h-0.5 rounded ${i + 1 < step ? "gradient-bg" : "bg-[var(--color-surface-lighter)]"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="glass rounded-3xl p-8">
        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="animate-fade-in space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white">
                <User size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Personal Details</h2>
                <p className="text-sm text-[var(--color-text-secondary)]">Let&apos;s get you started in under 2 minutes</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input className="input-field" placeholder="Enter your full name" value={formData.name} onChange={(e) => updateField("name", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input className="input-field" placeholder="+91 98765 43210" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input className="input-field" placeholder="your@email.com" value={formData.email} onChange={(e) => updateField("email", e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Delivery Platform</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {(["zomato", "swiggy", "zepto", "blinkit", "dunzo"] as const).map((p) => (
                    <button key={p} onClick={() => updateField("platform", p)}
                      className={`p-3 rounded-xl text-sm font-medium transition-all cursor-pointer border ${
                        formData.platform === p
                          ? "gradient-bg border-transparent text-white"
                          : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]"
                      }`}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Work Details */}
        {step === 2 && (
          <div className="animate-fade-in space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white">
                <MapPin size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Work Details</h2>
                <p className="text-sm text-[var(--color-text-secondary)]">Help us understand your delivery profile</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <select className="input-field" value={formData.city} onChange={(e) => updateField("city", e.target.value)}>
                    <option value="">Select city</option>
                    {["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Zone / Area</label>
                  <input className="input-field" placeholder="e.g., Andheri West" value={formData.zone} onChange={(e) => updateField("zone", e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Vehicle Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {([
                    { val: "bicycle", label: "🚲 Bicycle" },
                    { val: "motorcycle", label: "🏍️ Motorcycle" },
                    { val: "scooter", label: "🛵 Scooter" },
                    { val: "ev_scooter", label: "⚡ EV Scooter" },
                  ] as const).map((v) => (
                    <button key={v.val} onClick={() => updateField("vehicleType", v.val)}
                      className={`p-3 rounded-xl text-sm font-medium transition-all cursor-pointer border ${
                        formData.vehicleType === v.val
                          ? "gradient-bg border-transparent text-white"
                          : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]"
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Avg Weekly Earnings (₹)</label>
                  <input className="input-field" type="number" placeholder="5000" value={formData.avgWeeklyEarnings} onChange={(e) => updateField("avgWeeklyEarnings", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Avg Weekly Hours</label>
                  <input className="input-field" type="number" placeholder="45" value={formData.avgWeeklyHours} onChange={(e) => updateField("avgWeeklyHours", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Deliveries/Day</label>
                  <input className="input-field" type="number" placeholder="20" value={formData.avgDeliveriesPerDay} onChange={(e) => updateField("avgDeliveriesPerDay", e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: AI Risk Profile */}
        {step === 3 && (
          <div className="animate-fade-in space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white">
                <Brain size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">AI Risk Profile</h2>
                <p className="text-sm text-[var(--color-text-secondary)]">Our ML model analyzed 15+ factors for you</p>
              </div>
            </div>

            {/* Risk Score */}
            <div className="flex items-center gap-6 p-6 rounded-2xl bg-[var(--color-surface)]">
              <div className="relative w-24 h-24">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-surface-lighter)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="url(#scoreGrad)" strokeWidth="8"
                    strokeDasharray={`${riskProfile.overallScore * 2.51} 251`} strokeLinecap="round" />
                  <defs>
                    <linearGradient id="scoreGrad"><stop stopColor="#6366f1" /><stop offset="1" stopColor="#06b6d4" /></linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{riskProfile.overallScore}</span>
                </div>
              </div>
              <div>
                <div className="text-lg font-semibold">Risk Score: {riskProfile.overallScore}/100</div>
                <div className="text-sm text-[var(--color-text-secondary)]">Zone: {riskProfile.zoneRiskLevel.replace("_", " ").toUpperCase()} risk</div>
                <div className="text-sm text-[var(--color-primary-light)] mt-1">Recommended: {riskProfile.recommendedPlan.toUpperCase()} plan</div>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="space-y-3">
              {riskProfile.factors.map((factor, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-surface)]">
                  <div className={`w-2 h-2 rounded-full ${factor.impact === "negative" ? "bg-red-400" : factor.impact === "positive" ? "bg-emerald-400" : "bg-amber-400"}`} />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{factor.name}</div>
                    <div className="text-xs text-[var(--color-text-muted)]">{factor.description}</div>
                  </div>
                  <div className="text-sm font-semibold">{factor.score}/100</div>
                  <div className="w-20 h-2 rounded-full bg-[var(--color-surface-lighter)] overflow-hidden">
                    <div className={`h-full rounded-full ${factor.impact === "negative" ? "bg-red-400" : "bg-emerald-400"}`} style={{ width: `${factor.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Choose Plan & Dynamic Premium Visualization */}
        {step === 4 && (
          <div className="animate-fade-in space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white">
                <IndianRupee size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Choose Your Plan</h2>
                <p className="text-sm text-[var(--color-text-secondary)]">AI-personalized weekly premium — see how each factor adjusts your price</p>
              </div>
            </div>

            {/* Plan Selection */}
            <div className="grid grid-cols-3 gap-3">
              {(["basic", "standard", "premium"] as const).map((plan) => {
                const calc = calculateDynamicPremium(demoWorker, plan);
                return (
                  <button key={plan} onClick={() => updateField("selectedPlan", plan)}
                    className={`p-4 rounded-2xl text-left transition-all cursor-pointer border ${
                      formData.selectedPlan === plan ? "gradient-border glass" : "glass"
                    }`}
                  >
                    <div className="text-sm font-semibold capitalize mb-1">{plan}</div>
                    <div className="text-2xl font-black gradient-text">₹{calc.finalPremium}</div>
                    <div className="text-xs text-[var(--color-text-muted)]">per week</div>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Premium Breakdown — Visual */}
            <div className="p-5 rounded-2xl bg-[var(--color-surface)]">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Brain size={16} className="text-[var(--color-primary-light)]" /> ML Premium Breakdown
              </h4>

              {/* Visual bar chart of adjustments */}
              <div className="space-y-3 mb-4">
                {premiumCalc.breakdown.map((item, i) => {
                  const maxAmt = Math.max(...premiumCalc.breakdown.map(b => Math.abs(b.amount)));
                  const barWidth = maxAmt > 0 ? Math.max(8, (Math.abs(item.amount) / maxAmt) * 100) : 50;
                  const isDiscount = item.amount < 0;
                  const isBase = item.type === "base";

                  return (
                    <div key={i} className="group">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[var(--color-text-secondary)] font-medium">{item.label}</span>
                        <span className={`font-bold ${isDiscount ? "text-emerald-400" : isBase ? "text-indigo-400" : "text-amber-400"}`}>
                          {item.amount >= 0 ? "+" : ""}₹{item.amount}
                        </span>
                      </div>
                      <div className="h-3 rounded-full bg-[var(--color-surface-lighter)] overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isDiscount ? "bg-emerald-500" : isBase ? "bg-gradient-to-r from-indigo-500 to-indigo-600" : "bg-gradient-to-r from-amber-500 to-amber-600"
                          }`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total line */}
              <div className="border-t border-[var(--color-border)] pt-3 flex items-center justify-between font-bold">
                <span>Weekly Stabilization Fee</span>
                <span className="gradient-text text-xl">₹{premiumCalc.finalPremium}/week</span>
              </div>
            </div>

            {/* Hyper-Local Factor Explanation */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/5 to-cyan-500/5 border border-indigo-500/20">
              <div className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
                How ML Adjusts Your Price
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    factor: "Zone Risk",
                    detail: demoWorker.city === "Mumbai" ? "Mumbai monsoon zone → +25%" : `${demoWorker.city || "City"} weather data → adjusted`,
                    impact: "high",
                  },
                  {
                    factor: "Vehicle Type",
                    detail: demoWorker.vehicleType === "ev_scooter" ? "EV handles floods better → -10%" : demoWorker.vehicleType === "bicycle" ? "Bicycle vulnerable → +15%" : "Standard exposure",
                    impact: demoWorker.vehicleType === "ev_scooter" ? "low" : "medium",
                  },
                  {
                    factor: "Season",
                    detail: new Date().getMonth() >= 5 && new Date().getMonth() <= 8 ? "Monsoon active → +30%" : "Off-season → neutral",
                    impact: new Date().getMonth() >= 5 && new Date().getMonth() <= 8 ? "high" : "low",
                  },
                  {
                    factor: "Work Hours",
                    detail: (parseInt(formData.avgWeeklyHours) || 45) > 42 ? ">42 hrs/wk exposure → +10%" : "Standard hours → neutral",
                    impact: (parseInt(formData.avgWeeklyHours) || 45) > 42 ? "medium" : "low",
                  },
                ].map((f) => (
                  <div key={f.factor} className="flex items-start gap-2 p-2 rounded-lg bg-[var(--color-surface)]">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      f.impact === "high" ? "bg-red-400" : f.impact === "medium" ? "bg-amber-400" : "bg-emerald-400"
                    }`} />
                    <div>
                      <div className="text-xs font-semibold">{f.factor}</div>
                      <div className="text-[10px] text-[var(--color-text-muted)]">{f.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key insight */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <Zap size={16} className="text-emerald-400 shrink-0" />
              <p className="text-xs text-[var(--color-text-secondary)]">
                Your premium is <strong>₹{premiumCalc.finalPremium}/week</strong> — auto-deducted on your payout day. If heavy rain hits your zone, Floor pays you instantly. No forms. No waiting.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--color-border)]">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : onNavigate("landing")}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <button
            onClick={async () => {
              if (step < totalSteps) {
                setStep(step + 1);
              } else {
                // Actually add the worker to state via API!
                const { createWorker, createPolicy } = await import("../services/api");
                const workerRes = await createWorker(demoWorker as any);
                if (workerRes && workerRes._id) {
                  await createPolicy({
                    workerId: workerRes._id,
                    workerName: workerRes.name,
                    plan: formData.selectedPlan,
                    platform: workerRes.platform,
                    weeklyPremium: premiumCalc.finalPremium,
                  });
                }
                setTimeout(() => onNavigate("dashboard"), 500);
              }
            }}
            className="btn-primary inline-flex items-center gap-2"
          >
            {step === totalSteps ? (
              <>
                <Shield size={16} /> Activate Policy
              </>
            ) : (
              <>
                Next <ChevronRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
