"use client";
import { useState, useEffect } from "react";
import {
  Zap, CheckCircle, Clock, AlertTriangle, XCircle, Shield, Brain, MapPin,
  CloudRain, Thermometer, Wind, ArrowRight, Radio, Smartphone, CreditCard,
  Eye,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { detectFraud } from "../data";
import { Claim } from "../types";

const STATUS_CFG: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  paid: { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: <CheckCircle size={14} />, label: "Paid" },
  auto_approved: { color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30", icon: <Zap size={14} />, label: "Auto Approved" },
  approved: { color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30", icon: <CheckCircle size={14} />, label: "Approved" },
  under_review: { color: "bg-amber-500/20 text-amber-400 border-amber-500/30", icon: <Clock size={14} />, label: "Under Review" },
  flagged: { color: "bg-red-500/20 text-red-400 border-red-500/30", icon: <AlertTriangle size={14} />, label: "Flagged" },
  rejected: { color: "bg-red-500/20 text-red-400 border-red-500/30", icon: <XCircle size={14} />, label: "Rejected" },
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  weather: <CloudRain size={18} />,
  environmental: <Wind size={18} />,
  social: <AlertTriangle size={18} />,
  platform: <Zap size={18} />,
};

// Claim lifecycle timeline
function ClaimTimeline({ claim }: { claim: Claim }) {
  const steps = [
    {
      label: "Disruption Detected",
      detail: `${claim.disruptionEvent}`,
      icon: <Radio size={14} />,
      time: claim.eventDate,
      done: true,
      color: "text-blue-400",
    },
    {
      label: "Claim Auto-Created",
      detail: "Zero-touch parametric trigger fired",
      icon: <Zap size={14} />,
      time: claim.filedDate,
      done: true,
      color: "text-indigo-400",
    },
    {
      label: "AI Fraud Check",
      detail: `Fraud score: ${claim.fraudScore}% — ${claim.fraudScore < 20 ? "Clean" : claim.fraudScore < 50 ? "Minor anomaly" : "Suspicious"}`,
      icon: <Brain size={14} />,
      time: claim.processedDate || claim.filedDate,
      done: true,
      color: claim.fraudScore > 50 ? "text-red-400" : "text-emerald-400",
    },
    {
      label: "Payout Approved",
      detail: `₹${claim.amount} approved for ${claim.lostHours} lost hours`,
      icon: <CheckCircle size={14} />,
      time: claim.processedDate || claim.filedDate,
      done: claim.status === "auto_approved" || claim.status === "approved" || claim.status === "paid",
      color: "text-cyan-400",
    },
    {
      label: "UPI Transfer Sent",
      detail: "Instant payout to worker's linked account",
      icon: <CreditCard size={14} />,
      time: claim.paidDate || claim.processedDate || "Processing...",
      done: claim.status === "paid" || claim.status === "auto_approved",
      color: "text-emerald-400",
    },
    {
      label: "Worker Notified",
      detail: "Push notification + SMS sent",
      icon: <Smartphone size={14} />,
      time: claim.paidDate || "—",
      done: claim.status === "paid" || claim.status === "auto_approved",
      color: "text-violet-400",
    },
  ];

  return (
    <div className="space-y-0">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-3">
          {/* Vertical line + dot */}
          <div className="flex flex-col items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
              step.done ? `${step.color} bg-current/10` : "text-[var(--color-text-muted)] bg-[var(--color-surface-lighter)]"
            }`}>
              <div className={step.done ? step.color : "text-[var(--color-text-muted)]"}>{step.icon}</div>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-0.5 h-8 ${step.done ? "bg-[var(--color-primary)]/30" : "bg-[var(--color-border)]"}`} />
            )}
          </div>
          {/* Content */}
          <div className="pt-0.5 pb-4">
            <div className={`text-sm font-semibold ${step.done ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]"}`}>
              {step.label}
            </div>
            <div className="text-xs text-[var(--color-text-muted)]">{step.detail}</div>
            <div className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{step.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Push notification mockup
function NotificationPreview({ claim }: { claim: Claim }) {
  return (
    <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 border border-indigo-500/20">
      <div className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
        Zero-Touch Notification Preview
      </div>
      <div className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)]">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg gradient-bg flex items-center justify-center">
            <Shield size={12} className="text-white" />
          </div>
          <span className="text-xs font-bold">Floor</span>
          <span className="text-[10px] text-[var(--color-text-muted)] ml-auto">just now</span>
        </div>
        <div className="text-sm font-semibold mb-1">
          ₹{claim.amount} Buffer Released! 💰
        </div>
        <div className="text-xs text-[var(--color-text-secondary)]">
          {claim.disruptionEvent} detected in your zone. ₹{claim.amount} for {claim.lostHours} lost hours has been credited to your UPI account. Stay safe! 🛡️
        </div>
      </div>
    </div>
  );
}

export default function ClaimsPage() {
  const [claims, setClaims] = useState<any[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<any | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"detail" | "timeline">("detail");


  useEffect(() => {
    import("../services/api").then(({ fetchClaims }) => {
      fetchClaims().then((data: any) => {
        if (data) setClaims(data);
      });
    });
  }, []);

  const filteredClaims = filter === "all" ? claims : claims.filter((c) => c.status === filter);

  // Summary stats
  const totalPaid = claims.filter((c) => c.status === "paid" || c.status === "auto_approved").reduce((s, c) => s + c.amount, 0);
  const autoRate = claims.length > 0 ? Math.round((claims.filter((c) => c.autoTriggered).length / claims.length) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Disruption <span className="gradient-text">Payouts</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Zero-touch parametric claims with 4-layer AI fraud detection
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Claims", value: claims.length, color: "text-indigo-400" },
          { label: "Total Paid", value: `₹${totalPaid.toLocaleString()}`, color: "text-emerald-400" },
          { label: "Auto-Triggered", value: `${autoRate}%`, color: "text-cyan-400" },
          { label: "Avg Processing", value: "4.2 min", color: "text-violet-400" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-4">
            <div className="text-xs text-[var(--color-text-muted)] mb-1">{s.label}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["all", "auto_approved", "paid", "approved", "under_review", "flagged"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer border ${
              filter === f
                ? "gradient-bg border-transparent text-white"
                : "bg-transparent border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]"
            }`}
          >
            {f === "all" ? "All Claims" : f.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Claims List */}
        <div className="lg:col-span-2 space-y-3">
          {filteredClaims.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <Radio size={32} className="mx-auto mb-3 text-[var(--color-text-muted)] opacity-40" />
              <p className="text-sm text-[var(--color-text-muted)]">No claims found.</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Go to Triggers to simulate a disruption.</p>
            </div>
          ) : (
            filteredClaims.map((claim) => (
              <button
                key={claim._id || claim.id}
                onClick={() => setSelectedClaim(claim)}
                className={`w-full text-left p-4 rounded-2xl transition-all cursor-pointer border ${
                  (selectedClaim?._id || selectedClaim?.id) === (claim._id || claim.id)
                    ? "glass border-[var(--color-primary)]"
                    : "glass border-transparent hover:border-[var(--color-border-light)]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-primary-light)]">
                      {TYPE_ICONS[claim.type]}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{claim.workerName}</div>
                      <div className="text-xs text-[var(--color-text-muted)] font-mono">{claim._id || claim.id}</div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_CFG[claim.status]?.color}`}>
                    {STATUS_CFG[claim.status]?.icon}
                    {STATUS_CFG[claim.status]?.label}
                  </span>
                </div>
                <div className="text-xs text-[var(--color-text-secondary)] truncate">{claim.disruptionEvent}</div>
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="text-[var(--color-text-muted)]">{claim.eventDate}</span>
                  <span className="font-bold text-emerald-400">₹{claim.amount}</span>
                </div>
                {claim.autoTriggered && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-[var(--color-primary-light)]">
                    <Zap size={12} /> Zero-touch auto-trigger
                  </div>
                )}
              </button>
            ))
          )}
        </div>

        {/* Claim Detail */}
        <div className="lg:col-span-3">
          {selectedClaim ? (
            <div className="glass rounded-2xl p-6 space-y-5 animate-fade-in sticky top-24">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{selectedClaim.disruptionEvent}</h3>
                  <div className="text-sm text-[var(--color-text-muted)]">
                    {selectedClaim._id || selectedClaim.id} • {selectedClaim.workerName} • {selectedClaim.eventDate}
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border ${STATUS_CFG[selectedClaim.status]?.color}`}>
                  {STATUS_CFG[selectedClaim.status]?.icon}
                  {STATUS_CFG[selectedClaim.status]?.label}
                </span>
              </div>

              {/* View toggle */}
              <div className="flex gap-2">
                {[
                  { key: "detail" as const, label: "Details", icon: <Eye size={14} /> },
                  { key: "timeline" as const, label: "Lifecycle", icon: <ArrowRight size={14} /> },
                ].map((v) => (
                  <button
                    key={v.key}
                    onClick={() => setViewMode(v.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                      viewMode === v.key ? "gradient-bg border-transparent text-white" : "bg-transparent border-[var(--color-border)] text-[var(--color-text-secondary)]"
                    }`}
                  >
                    {v.icon} {v.label}
                  </button>
                ))}
              </div>

              {viewMode === "timeline" ? (
                <div className="space-y-5">
                  <ClaimTimeline claim={selectedClaim} />
                  <NotificationPreview claim={selectedClaim} />
                </div>
              ) : (
                <>
                  <p className="text-sm text-[var(--color-text-secondary)]">{selectedClaim.description}</p>

                  {/* Key metrics */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-[var(--color-surface)]">
                      <div className="text-xs text-[var(--color-text-muted)]">Payout</div>
                      <div className="text-lg font-bold text-emerald-400">₹{selectedClaim.amount}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--color-surface)]">
                      <div className="text-xs text-[var(--color-text-muted)]">Lost Hours</div>
                      <div className="text-lg font-bold">{selectedClaim.lostHours}hrs</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--color-surface)]">
                      <div className="text-xs text-[var(--color-text-muted)]">Location</div>
                      <div className="text-sm font-medium truncate">{selectedClaim.location.area}</div>
                    </div>
                  </div>

                  {/* Weather evidence */}
                  {selectedClaim.evidenceData.weatherData && (
                    <div className="p-4 rounded-xl bg-[var(--color-surface)]">
                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <CloudRain size={14} /> Weather Evidence
                      </h4>
                      <div className="grid grid-cols-4 gap-2 text-center">
                        {[
                          { label: "Temp", val: `${selectedClaim.evidenceData.weatherData.temperature}°C`, icon: <Thermometer size={14} /> },
                          { label: "Rain", val: `${selectedClaim.evidenceData.weatherData.rainfall}mm`, icon: <CloudRain size={14} /> },
                          { label: "Wind", val: `${selectedClaim.evidenceData.weatherData.windSpeed}km/h`, icon: <Wind size={14} /> },
                          { label: "Status", val: selectedClaim.evidenceData.weatherData.condition, icon: null },
                        ].map((d, i) => (
                          <div key={i} className="p-2 rounded-lg bg-[var(--color-surface-light)]">
                            <div className="text-[var(--color-primary-light)] flex justify-center mb-1">{d.icon}</div>
                            <div className="text-xs text-[var(--color-text-muted)]">{d.label}</div>
                            <div className="text-sm font-semibold">{d.val}</div>
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-[var(--color-text-muted)] mt-2">
                        Source: {selectedClaim.evidenceData.weatherData.source}
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  {selectedClaim.evidenceData.locationVerification && (
                    <div className="p-4 rounded-xl bg-[var(--color-surface)]">
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <MapPin size={14} /> GPS* Presence Verification
                      </h4>
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${selectedClaim.evidenceData.locationVerification.verified ? "bg-emerald-400" : "bg-red-400"}`} />
                        <span className="text-sm">
                          {selectedClaim.evidenceData.locationVerification.verified ? "✓ Multi-signal verified" : "✗ Location mismatch"} — Distance: {selectedClaim.evidenceData.locationVerification.distance}km
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Fraud */}
                  <div className={`p-4 rounded-xl ${selectedClaim.fraudScore > 50 ? "bg-red-500/10 border border-red-500/30" : "bg-[var(--color-surface)]"}`}>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Brain size={14} /> AI Fraud Analysis (4-Layer)
                    </h4>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-1 h-2 rounded-full bg-[var(--color-surface-lighter)] overflow-hidden">
                        <div
                          className={`h-full rounded-full ${selectedClaim.fraudScore > 70 ? "bg-red-500" : selectedClaim.fraudScore > 30 ? "bg-amber-500" : "bg-emerald-500"}`}
                          style={{ width: `${selectedClaim.fraudScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold">{selectedClaim.fraudScore}%</span>
                    </div>
                    {selectedClaim.fraudFlags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedClaim.fraudFlags.map((flag: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-red-500/20 text-red-400 border border-red-500/20">
                            ⚠ {flag.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="text-xs text-[var(--color-text-muted)] mt-2">
                      {detectFraud(selectedClaim).recommendation}
                    </div>
                  </div>

                  {/* Notification preview */}
                  <NotificationPreview claim={selectedClaim} />
                </>
              )}
            </div>
          ) : (
            <div className="glass rounded-2xl p-12 text-center">
              <Shield size={48} className="mx-auto text-[var(--color-text-muted)] mb-4 opacity-30" />
              <p className="text-[var(--color-text-secondary)]">Select a claim to view details</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Click any claim on the left to see its lifecycle</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
