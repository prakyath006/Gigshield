"use client";
import { useState, useEffect } from "react";
import {
  Shield, CheckCircle, Clock, XCircle, RefreshCw,
  Pause, Play, TrendingUp, ArrowUpCircle, ChevronDown,
  ChevronUp, Zap, AlertTriangle, Info,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Policy } from "../types";

const PLAN_COLORS: Record<string, string> = {
  premium: "from-violet-500 to-violet-600",
  standard: "from-indigo-500 to-indigo-600",
  basic: "from-cyan-500 to-cyan-600",
};

const STATUS_CONFIG: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
  active: { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", label: "Active", icon: <CheckCircle size={13} /> },
  expired: { color: "bg-red-500/20 text-red-400 border-red-500/30", label: "Expired", icon: <XCircle size={13} /> },
  pending: { color: "bg-amber-500/20 text-amber-400 border-amber-500/30", label: "Pending", icon: <Clock size={13} /> },
  cancelled: { color: "bg-gray-500/20 text-gray-400 border-gray-500/30", label: "Cancelled", icon: <XCircle size={13} /> },
};

function PolicyCard({ policy }: { policy: Policy }) {
  const [expanded, setExpanded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [confirmUpgrade, setConfirmUpgrade] = useState(false);
  const statusCfg = STATUS_CONFIG[policy.status] ?? STATUS_CONFIG.active;
  const planColor = PLAN_COLORS[policy.plan] ?? PLAN_COLORS.basic;

  const coverageUsed = Math.floor(Math.random() * 60) + 20; // demo: 20-80%
  const weeksActive = Math.floor(
    (new Date().getTime() - new Date(policy.startDate).getTime()) / (7 * 24 * 3600 * 1000)
  ) + 1;

  const nextPlans: Record<string, string | null> = { basic: "standard", standard: "premium", premium: null };
  const nextPlan = nextPlans[policy.plan];

  return (
    <div className={`glass rounded-2xl overflow-hidden card-hover transition-all ${paused ? "opacity-60" : ""}`}>
      {/* Top bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${planColor}`} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${planColor} flex items-center justify-center text-white shrink-0`}>
              <Shield size={20} />
            </div>
            <div>
              <div className="font-bold text-base">{policy.workerName}</div>
              <div className="text-xs text-[var(--color-text-muted)] font-mono">{policy.id}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {paused && (
              <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                Paused
              </span>
            )}
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${statusCfg.color}`}>
              {statusCfg.icon} {statusCfg.label}
            </span>
          </div>
        </div>

        {/* Plan badge + platform */}
        <div className="flex items-center gap-2 mb-5">
          <span className={`capitalize text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${planColor} text-white`}>
            {policy.plan} Plan
          </span>
          <span className="capitalize text-xs text-[var(--color-text-muted)] px-2 py-1 rounded-full bg-[var(--color-surface)]">
            {policy.platform}
          </span>
          <span className="text-xs text-[var(--color-text-muted)] px-2 py-1 rounded-full bg-[var(--color-surface)]">
            {weeksActive}w active
          </span>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Weekly Fee", value: `₹${policy.weeklyPremium}`, sub: "AI-adjusted" },
            { label: "Guarantee", value: `₹${policy.coverageAmount.toLocaleString()}`, sub: "per week" },
            { label: "Max Payout", value: `₹${policy.maxPayoutPerEvent.toLocaleString()}`, sub: "per event" },
          ].map((m) => (
            <div key={m.label} className="p-3 rounded-xl bg-[var(--color-surface)] text-center">
              <div className="text-[10px] text-[var(--color-text-muted)] mb-1">{m.label}</div>
              <div className="font-bold text-sm">{m.value}</div>
              <div className="text-[10px] text-[var(--color-text-muted)]">{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Coverage used progress */}
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[var(--color-text-muted)]">Coverage used this week</span>
            <span className="font-semibold">{coverageUsed}%</span>
          </div>
          <div className="h-2 rounded-full bg-[var(--color-surface)] overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${planColor} transition-all`}
              style={{ width: `${coverageUsed}%` }}
            />
          </div>
        </div>

        {/* Active triggers */}
        <div className="mb-5">
          <div className="text-xs text-[var(--color-text-muted)] mb-2 flex items-center gap-1">
            <Zap size={11} /> Active Triggers ({policy.triggers.filter((t) => t.isActive).length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {policy.triggers.filter((t) => t.isActive).slice(0, 5).map((trigger: any) => (
              <span
                key={trigger._id || trigger.id || trigger.name}
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                  trigger.type === "weather" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                  trigger.type === "environmental" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                  trigger.type === "social" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                  "bg-violet-500/10 text-violet-400 border-violet-500/20"
                }`}
              >
                {trigger.name}
              </span>
            ))}
          </div>
        </div>

        {/* Dates + auto-renew */}
        <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] mb-5">
          <span>Starts: <span className="text-[var(--color-text-primary)]">{new Date(policy.startDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span></span>
          <span>Ends: <span className="text-[var(--color-text-primary)]">{policy.endDate ? new Date(policy.endDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "Auto-renew"}</span></span>
          <span className="inline-flex items-center gap-1">
            <RefreshCw size={11} className={policy.autoRenew ? "text-emerald-400" : "text-gray-500"} />
            {policy.autoRenew ? "Auto-renew" : "Manual"}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPaused(!paused)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border ${
              paused
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-lighter)]"
            }`}
          >
            {paused ? <Play size={14} /> : <Pause size={14} />}
            {paused ? "Resume" : "Pause"}
          </button>

          {nextPlan && (
            <button
              onClick={() => setConfirmUpgrade(!confirmUpgrade)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer btn-primary"
            >
              <ArrowUpCircle size={14} />
              Upgrade to {nextPlan}
            </button>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all cursor-pointer"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {/* Upgrade confirmation */}
        {confirmUpgrade && nextPlan && (
          <div className="mt-4 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 animate-slide-up">
            <div className="flex items-start gap-2 mb-3">
              <Info size={14} className="text-indigo-400 mt-0.5 shrink-0" />
              <p className="text-xs text-indigo-300">
                Upgrading to <strong className="capitalize">{nextPlan}</strong> will take effect from next week.
                Your premium will be recalculated by AI based on your updated risk profile.
              </p>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 rounded-lg text-xs font-semibold btn-primary cursor-pointer">
                Confirm Upgrade
              </button>
              <button
                onClick={() => setConfirmUpgrade(false)}
                className="flex-1 py-2 rounded-lg text-xs font-semibold border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Expanded: full terms & exclusions */}
        {expanded && (
          <div className="mt-5 pt-5 border-t border-[var(--color-border)] animate-slide-up space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <TrendingUp size={14} className="text-[var(--color-primary-light)]" />
                Policy Terms
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  ["Hours covered", `${policy.coverageHoursPerWeek} hrs/week`],
                  ["Disruption window", "Min. 2 hrs"],
                  ["Payout method", "UPI (instant)"],
                  ["Claim processing", "~4.2 minutes"],
                  ["Fraud check", "Auto (4-layer AI)"],
                  ["Policy type", "Parametric"],
                ].map(([label, val]) => (
                  <div key={label} className="flex items-center justify-between p-2 rounded-lg bg-[var(--color-surface)]">
                    <span className="text-[var(--color-text-muted)]">{label}</span>
                    <span className="font-medium text-[var(--color-text-primary)]">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle size={14} className="text-yellow-400" />
                Standard Exclusions
              </h4>
              <div className="space-y-1.5">
                {[
                  "Acts of war, terrorism, or military action",
                  "Global pandemics or national lockdowns",
                  "Nuclear, chemical, or radiological events",
                  "Intentional fraud or GPS spoofing (permanent ban)",
                  "Platform insolvency or permanent shutdown",
                  "Pre-existing conditions known at sign-up",
                ].map((exc) => (
                  <div key={exc} className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                    <XCircle size={11} className="text-red-400 shrink-0" />
                    {exc}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<any[]>([]);

  useEffect(() => {
    import("../services/api").then(({ fetchPolicies }) => {
      fetchPolicies().then((data: any) => {
        if (data) setPolicies(data);
      });
    });
  }, []);

  const active = policies.filter((p) => p.status === "active").length;
  const totalPayout = policies.reduce((s, p) => s + p.coverageAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Income <span className="gradient-text">Buffers</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Manage your weekly parametric income protection policies
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Active Policies", value: active, color: "text-emerald-400" },
          { label: "Total Policies", value: policies.length, color: "text-indigo-400" },
          { label: "Weekly Guarantee", value: `₹${totalPayout.toLocaleString()}`, color: "text-cyan-400" },
          { label: "Avg Weekly Fee", value: `₹${policies.length ? Math.round(policies.reduce((s, p) => s + p.weeklyPremium, 0) / policies.length) : 0}`, color: "text-violet-400" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-4">
            <div className="text-xs text-[var(--color-text-muted)] mb-1">{s.label}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Policy cards */}
      {policies.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <Shield size={40} className="mx-auto mb-4 text-[var(--color-text-muted)] opacity-40" />
          <p className="text-[var(--color-text-muted)]">No policies yet. Complete onboarding to get protected.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {policies.map((policy) => (
            <PolicyCard key={policy._id || policy.id} policy={policy} />
          ))}
        </div>
      )}
    </div>
  );
}
