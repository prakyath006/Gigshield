"use client";
import { useState } from "react";
import { Zap, CheckCircle, Clock, AlertTriangle, XCircle, Shield, Brain, MapPin, CloudRain, Thermometer, Wind } from "lucide-react";
import { useApp } from "../context/AppContext";
import { detectFraud } from "../data";
import { Claim } from "../types";

export default function ClaimsPage() {
  const { claims } = useApp();
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const filteredClaims = filter === "all" ? claims : claims.filter(c => c.status === filter);

  const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    paid: { color: "bg-emerald-500/20 text-emerald-400", icon: <CheckCircle size={14} />, label: "Paid" },
    auto_approved: { color: "bg-indigo-500/20 text-indigo-400", icon: <Zap size={14} />, label: "Auto Approved" },
    approved: { color: "bg-cyan-500/20 text-cyan-400", icon: <CheckCircle size={14} />, label: "Approved" },
    under_review: { color: "bg-amber-500/20 text-amber-400", icon: <Clock size={14} />, label: "Under Review" },
    flagged: { color: "bg-red-500/20 text-red-400", icon: <AlertTriangle size={14} />, label: "Flagged" },
    rejected: { color: "bg-red-500/20 text-red-400", icon: <XCircle size={14} />, label: "Rejected" },
  };

  const typeIcons: Record<string, React.ReactNode> = {
    weather: <CloudRain size={18} />,
    environmental: <Wind size={18} />,
    social: <AlertTriangle size={18} />,
    platform: <Zap size={18} />,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Claims <span className="gradient-text">Management</span></h1>
        <p className="text-[var(--color-text-secondary)] mt-1">AI-powered parametric claims with fraud detection</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["all", "auto_approved", "paid", "approved", "under_review", "flagged"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer border ${
              filter === f ? "gradient-bg border-transparent text-white" : "bg-transparent border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]"
            }`}
          >
            {f === "all" ? "All Claims" : f.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Claims List */}
        <div className="lg:col-span-2 space-y-3">
          {filteredClaims.map((claim) => (
            <button key={claim.id} onClick={() => setSelectedClaim(claim)}
              className={`w-full text-left p-4 rounded-2xl transition-all cursor-pointer border ${
                selectedClaim?.id === claim.id ? "glass border-[var(--color-primary)]" : "glass border-transparent hover:border-[var(--color-border-light)]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-primary-light)]">
                    {typeIcons[claim.type]}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{claim.workerName}</div>
                    <div className="text-xs text-[var(--color-text-muted)]">{claim.id}</div>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[claim.status]?.color}`}>
                  {statusConfig[claim.status]?.icon}
                  {statusConfig[claim.status]?.label}
                </span>
              </div>
              <div className="text-xs text-[var(--color-text-secondary)] truncate">{claim.disruptionEvent}</div>
              <div className="flex items-center justify-between mt-2 text-xs">
                <span className="text-[var(--color-text-muted)]">{claim.eventDate}</span>
                <span className="font-semibold">₹{claim.amount}</span>
              </div>
              {claim.autoTriggered && (
                <div className="flex items-center gap-1 mt-2 text-xs text-[var(--color-primary-light)]">
                  <Zap size={12} /> Auto-triggered by parametric event
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Claim Detail */}
        <div className="lg:col-span-3">
          {selectedClaim ? (
            <div className="glass rounded-2xl p-6 space-y-5 animate-fade-in sticky top-24">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{selectedClaim.disruptionEvent}</h3>
                  <div className="text-sm text-[var(--color-text-muted)]">{selectedClaim.id} • {selectedClaim.eventDate}</div>
                </div>
                <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig[selectedClaim.status]?.color}`}>
                  {statusConfig[selectedClaim.status]?.icon}
                  {statusConfig[selectedClaim.status]?.label}
                </span>
              </div>

              <p className="text-sm text-[var(--color-text-secondary)]">{selectedClaim.description}</p>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-[var(--color-surface)]">
                  <div className="text-xs text-[var(--color-text-muted)]">Payout</div>
                  <div className="text-lg font-bold">₹{selectedClaim.amount}</div>
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

              {/* Evidence Data */}
              {selectedClaim.evidenceData.weatherData && (
                <div className="p-4 rounded-xl bg-[var(--color-surface)]">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><CloudRain size={14} /> Weather Evidence</h4>
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
                  <div className="text-xs text-[var(--color-text-muted)] mt-2">Source: {selectedClaim.evidenceData.weatherData.source}</div>
                </div>
              )}

              {/* Location Verification */}
              {selectedClaim.evidenceData.locationVerification && (
                <div className="p-4 rounded-xl bg-[var(--color-surface)]">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><MapPin size={14} /> Location Verification</h4>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${selectedClaim.evidenceData.locationVerification.verified ? "bg-emerald-400" : "bg-red-400"}`} />
                    <span className="text-sm">
                      {selectedClaim.evidenceData.locationVerification.verified ? "✓ Location verified" : "✗ Location mismatch"} — Distance: {selectedClaim.evidenceData.locationVerification.distance}km
                    </span>
                  </div>
                </div>
              )}

              {/* Fraud Detection */}
              <div className={`p-4 rounded-xl ${selectedClaim.fraudScore > 50 ? "bg-red-500/10 border border-red-500/30" : "bg-[var(--color-surface)]"}`}>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Brain size={14} /> AI Fraud Analysis
                </h4>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-1 h-2 rounded-full bg-[var(--color-surface-lighter)] overflow-hidden">
                    <div className={`h-full rounded-full ${selectedClaim.fraudScore > 70 ? "bg-red-500" : selectedClaim.fraudScore > 30 ? "bg-amber-500" : "bg-emerald-500"}`}
                      style={{ width: `${selectedClaim.fraudScore}%` }} />
                  </div>
                  <span className="text-sm font-bold">{selectedClaim.fraudScore}%</span>
                </div>
                {selectedClaim.fraudFlags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedClaim.fraudFlags.map((flag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-red-500/20 text-red-400">
                        ⚠ {flag.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                )}
                <div className="text-xs text-[var(--color-text-muted)] mt-2">
                  {detectFraud(selectedClaim).recommendation}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass rounded-2xl p-12 text-center">
              <Shield size={48} className="mx-auto text-[var(--color-text-muted)] mb-4" />
              <p className="text-[var(--color-text-secondary)]">Select a claim to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
