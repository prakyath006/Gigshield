"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Shield, AlertTriangle, Wifi, Smartphone, Activity,
  MapPin, Users, Zap, CheckCircle, XCircle, Radio,
  Target, BarChart3, Eye,
} from "lucide-react";

// ─── Attack Scenarios ─────────────────────────────────────────
const ATTACK_SCENARIOS = [
  {
    id: "solo_spoof",
    name: "Solo GPS Spoofer",
    desc: "A single rider uses a GPS spoofing app to fake being in a flooded zone while sitting at home.",
    attackers: 1,
    difficulty: "Easy",
    color: "text-amber-400",
  },
  {
    id: "small_ring",
    name: "Small Fraud Ring",
    desc: "A group of 12 riders coordinate via WhatsApp to file simultaneous false claims from the same zone.",
    attackers: 12,
    difficulty: "Medium",
    color: "text-orange-400",
  },
  {
    id: "syndicate",
    name: "Syndicate Attack (500+)",
    desc: "A coordinated syndicate of 500 workers uses GPS spoofing apps to trigger mass false payouts, attempting to drain the liquidity pool.",
    attackers: 500,
    difficulty: "Critical",
    color: "text-red-400",
  },
];

// ─── GPS* Signal Layers ──────────────────────────────────────
const SIGNAL_LAYERS = [
  {
    id: "environment",
    name: "Environment Consensus",
    icon: <Radio size={18} />,
    weight: 30,
    checks: [
      { name: "Weather event verified at location (IMD/OWM)", genuinePass: true, spoofPass: true },
      { name: "IoT flood sensors confirm ground conditions", genuinePass: true, spoofPass: false },
      { name: "Satellite imagery corroborates cloud cover", genuinePass: true, spoofPass: true },
    ],
  },
  {
    id: "device",
    name: "Device Integrity",
    icon: <Smartphone size={18} />,
    weight: 25,
    checks: [
      { name: "Mock-location app detection (Android flag)", genuinePass: true, spoofPass: false },
      { name: "WiFi BSSID matches GPS coordinates", genuinePass: true, spoofPass: false },
      { name: "Barometer reading consistent with weather", genuinePass: true, spoofPass: false },
      { name: "Device rooted/jailbroken check", genuinePass: true, spoofPass: false },
    ],
  },
  {
    id: "behavioral",
    name: "Behavioral Biometrics",
    icon: <Activity size={18} />,
    weight: 25,
    checks: [
      { name: "Movement pattern: stranded vs stationary", genuinePass: true, spoofPass: false },
      { name: "Micro-movement jitter (human vs GPS pin)", genuinePass: true, spoofPass: false },
      { name: "Step counter / accelerometer activity", genuinePass: true, spoofPass: false },
      { name: "Battery drain: outdoor vs indoor pattern", genuinePass: true, spoofPass: true },
    ],
  },
  {
    id: "network",
    name: "Network & Platform",
    icon: <Wifi size={18} />,
    weight: 20,
    checks: [
      { name: "Delivery platform: rider was active before event", genuinePass: true, spoofPass: false },
      { name: "Last verified delivery GPS trail", genuinePass: true, spoofPass: false },
      { name: "Network latency: home WiFi vs mobile LTE", genuinePass: true, spoofPass: false },
      { name: "IP geolocation cross-reference", genuinePass: true, spoofPass: false },
    ],
  },
];

// ─── The Component ───────────────────────────────────────────
export default function RedTeamPage() {
  const [selectedScenario, setSelectedScenario] = useState(ATTACK_SCENARIOS[0]);
  const [isAttacking, setIsAttacking] = useState(false);
  const [currentLayerIdx, setCurrentLayerIdx] = useState(-1);
  const [currentCheckIdx, setCurrentCheckIdx] = useState(-1);
  const [layerResults, setLayerResults] = useState<Record<string, { passed: number; failed: number; score: number }>>({});
  const [attackComplete, setAttackComplete] = useState(false);
  const [genuineScore, setGenuineScore] = useState(0);
  const [spoofScore, setSpoofScore] = useState(0);
  const [ringDetected, setRingDetected] = useState(false);
  const [claimsBlocked, setClaimsBlocked] = useState(0);
  const [moneyProtected, setMoneyProtected] = useState(0);

  const resetAttack = useCallback(() => {
    setIsAttacking(false);
    setCurrentLayerIdx(-1);
    setCurrentCheckIdx(-1);
    setLayerResults({});
    setAttackComplete(false);
    setGenuineScore(0);
    setSpoofScore(0);
    setRingDetected(false);
    setClaimsBlocked(0);
    setMoneyProtected(0);
  }, []);

  const launchAttack = useCallback(() => {
    resetAttack();
    setIsAttacking(true);

    let layerI = 0;
    let checkI = 0;
    const results: Record<string, { passed: number; failed: number; score: number }> = {};
    let gScore = 0;
    let sScore = 0;

    const tick = () => {
      if (layerI >= SIGNAL_LAYERS.length) {
        // Attack complete — calculate final scores
        setGenuineScore(Math.round(gScore));
        setSpoofScore(Math.round(sScore));
        setAttackComplete(true);
        setIsAttacking(false);

        if (selectedScenario.attackers > 5) {
          setRingDetected(true);
        }
        const blocked = Math.round(selectedScenario.attackers * 0.96);
        setClaimsBlocked(blocked);
        setMoneyProtected(blocked * 835);
        return;
      }

      const layer = SIGNAL_LAYERS[layerI];

      if (checkI === 0) {
        setCurrentLayerIdx(layerI);
        results[layer.id] = { passed: 0, failed: 0, score: 0 };
      }

      if (checkI < layer.checks.length) {
        setCurrentCheckIdx(checkI);
        const check = layer.checks[checkI];

        // Genuine worker always passes
        if (check.genuinePass) {
          gScore += layer.weight / layer.checks.length;
        }
        // Spoofer sometimes passes environment checks (weather is real) but fails device/behavioral
        if (check.spoofPass) {
          results[layer.id].passed++;
          sScore += layer.weight / layer.checks.length;
        } else {
          results[layer.id].failed++;
        }

        results[layer.id].score = Math.round(
          (results[layer.id].passed / (results[layer.id].passed + results[layer.id].failed)) * layer.weight
        );
        setLayerResults({ ...results });

        checkI++;
        setTimeout(tick, 400);
      } else {
        // Move to next layer
        layerI++;
        checkI = 0;
        setTimeout(tick, 600);
      }
    };

    setTimeout(tick, 500);
  }, [selectedScenario, resetAttack]);

  // Reset when scenario changes
  useEffect(() => {
    resetAttack();
  }, [selectedScenario, resetAttack]);

  const totalGenuine = genuineScore;
  const totalSpoof = spoofScore;
  const genuineVerdict = totalGenuine >= 80 ? "auto_approve" : totalGenuine >= 50 ? "soft_challenge" : "review";
  const spoofVerdict = totalSpoof >= 80 ? "auto_approve" : totalSpoof >= 50 ? "soft_challenge" : totalSpoof >= 20 ? "review" : "blocked";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium mb-4">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          RED TEAM MODE
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          Syndicate <span className="gradient-text">Attack Simulator</span>
        </h1>
        <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
          Play as a GPS-spoofing fraudster. Configure an attack and watch Floor&apos;s
          Genuine Presence Score (GPS*) engine detect and block it in real-time.
        </p>
      </div>

      {/* Scenario Selector */}
      <div className="grid md:grid-cols-3 gap-4">
        {ATTACK_SCENARIOS.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => setSelectedScenario(scenario)}
            className={`text-left p-5 rounded-2xl transition-all cursor-pointer border ${
              selectedScenario.id === scenario.id
                ? "glass border-red-500/40 ring-1 ring-red-500/20"
                : "glass border-transparent hover:border-[var(--color-border-light)]"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-red-400" />
                <span className="font-bold text-sm">{scenario.name}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                scenario.difficulty === "Critical"
                  ? "bg-red-500/20 text-red-400 border-red-500/30"
                  : scenario.difficulty === "Medium"
                  ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                  : "bg-amber-500/20 text-amber-400 border-amber-500/30"
              }`}>
                {scenario.difficulty}
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] mb-3">{scenario.desc}</p>
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
              <Users size={12} />
              {scenario.attackers} attacker{scenario.attackers > 1 ? "s" : ""}
            </div>
          </button>
        ))}
      </div>

      {/* Launch Button */}
      <div className="text-center">
        <button
          onClick={launchAttack}
          disabled={isAttacking}
          className={`px-8 py-4 rounded-2xl text-lg font-bold transition-all cursor-pointer inline-flex items-center gap-3 ${
            isAttacking
              ? "bg-red-900/30 text-red-300 border border-red-500/20 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 hover:shadow-red-500/50"
          }`}
        >
          {isAttacking ? (
            <>
              <span className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
              GPS* Engine Analyzing...
            </>
          ) : (
            <>
              <Zap size={20} />
              Launch Attack — {selectedScenario.attackers} Spoofer{selectedScenario.attackers > 1 ? "s" : ""}
            </>
          )}
        </button>
      </div>

      {/* Main Grid: Signal Analysis + Live Comparison */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Signal Layer Analysis — Left 3 cols */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider flex items-center gap-2">
            <Eye size={14} /> GPS* Signal Layer Analysis
          </h3>

          {SIGNAL_LAYERS.map((layer, layerIdx) => {
            const isActive = currentLayerIdx === layerIdx;
            const isDone = currentLayerIdx > layerIdx || attackComplete;
            const result = layerResults[layer.id];

            return (
              <div
                key={layer.id}
                className={`glass rounded-2xl overflow-hidden transition-all ${
                  isActive ? "ring-1 ring-indigo-500/50 border-indigo-500/30" : ""
                }`}
              >
                {/* Layer Header */}
                <div className={`px-5 py-4 flex items-center justify-between ${
                  isActive ? "bg-indigo-500/5" : ""
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isDone
                        ? result && result.failed > 0
                          ? "bg-red-500/20 text-red-400"
                          : "bg-emerald-500/20 text-emerald-400"
                        : isActive
                        ? "bg-indigo-500/20 text-indigo-400"
                        : "bg-[var(--color-surface)] text-[var(--color-text-muted)]"
                    }`}>
                      {layer.icon}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{layer.name}</div>
                      <div className="text-xs text-[var(--color-text-muted)]">Weight: {layer.weight}%</div>
                    </div>
                  </div>
                  {isDone && result && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-emerald-400 flex items-center gap-1">
                        <CheckCircle size={12} /> {result.passed} passed
                      </span>
                      <span className="text-xs text-red-400 flex items-center gap-1">
                        <XCircle size={12} /> {result.failed} caught
                      </span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                        result.failed > 0 ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"
                      }`}>
                        {result.score}/{layer.weight}
                      </span>
                    </div>
                  )}
                  {isActive && !isDone && (
                    <span className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  )}
                </div>

                {/* Individual Checks */}
                {(isActive || isDone) && (
                  <div className="px-5 pb-4 space-y-2">
                    {layer.checks.map((check, checkIdx) => {
                      const isCheckDone = isDone || (isActive && currentCheckIdx > checkIdx);
                      const isCheckActive = isActive && currentCheckIdx === checkIdx && !isDone;

                      return (
                        <div
                          key={checkIdx}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all ${
                            isCheckActive
                              ? "bg-indigo-500/10 border border-indigo-500/20"
                              : isCheckDone
                              ? check.spoofPass
                                ? "bg-amber-500/5"
                                : "bg-red-500/5"
                              : "opacity-40"
                          }`}
                        >
                          {isCheckDone ? (
                            check.spoofPass ? (
                              <AlertTriangle size={14} className="text-amber-400 shrink-0" />
                            ) : (
                              <XCircle size={14} className="text-red-400 shrink-0" />
                            )
                          ) : isCheckActive ? (
                            <span className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin shrink-0" />
                          ) : (
                            <span className="w-3.5 h-3.5 rounded-full bg-[var(--color-surface-lighter)] shrink-0" />
                          )}
                          <span className="text-[var(--color-text-secondary)]">{check.name}</span>
                          {isCheckDone && (
                            <span className={`ml-auto text-[10px] font-bold ${
                              check.spoofPass ? "text-amber-400" : "text-red-400"
                            }`}>
                              {check.spoofPass ? "EVADED" : "CAUGHT"}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Panel — Live Score Comparison */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider flex items-center gap-2">
            <BarChart3 size={14} /> Live Score Comparison
          </h3>

          {/* Genuine Worker Score */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle size={16} className="text-emerald-400" />
              </div>
              <div>
                <div className="font-bold text-sm">Genuine Worker</div>
                <div className="text-[10px] text-[var(--color-text-muted)]">Actually stranded in storm</div>
              </div>
            </div>
            <div className="relative h-4 rounded-full bg-[var(--color-surface)] overflow-hidden mb-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${attackComplete ? totalGenuine : 0}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-bold">{attackComplete ? totalGenuine : "—"}/100</span>
              {attackComplete && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  genuineVerdict === "auto_approve" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                }`}>
                  {genuineVerdict === "auto_approve" ? "✅ AUTO-APPROVED" : "📝 SOFT CHALLENGE"}
                </span>
              )}
            </div>
          </div>

          {/* Spoofer Score */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                <XCircle size={16} className="text-red-400" />
              </div>
              <div>
                <div className="font-bold text-sm">GPS Spoofer</div>
                <div className="text-[10px] text-[var(--color-text-muted)]">Faking location from home</div>
              </div>
            </div>
            <div className="relative h-4 rounded-full bg-[var(--color-surface)] overflow-hidden mb-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500"
                style={{ width: `${attackComplete ? totalSpoof : 0}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-red-400 font-bold">{attackComplete ? totalSpoof : "—"}/100</span>
              {attackComplete && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  spoofVerdict === "blocked" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"
                }`}>
                  {spoofVerdict === "blocked" ? "🚫 BLOCKED" : spoofVerdict === "review" ? "🔍 MANUAL REVIEW" : "⚠️ FLAGGED"}
                </span>
              )}
            </div>
          </div>

          {/* Ring Detection Alert */}
          {ringDetected && (
            <div className="glass rounded-2xl p-5 border-red-500/30 bg-red-500/5 animate-slide-up">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={18} className="text-red-400" />
                <span className="font-bold text-sm text-red-400">🚨 RING DETECTED</span>
              </div>
              <div className="space-y-2 text-xs text-[var(--color-text-secondary)]">
                <div className="flex justify-between">
                  <span>Claim timing clustering</span>
                  <span className="text-red-400 font-bold">&gt;3σ anomaly</span>
                </div>
                <div className="flex justify-between">
                  <span>Device fingerprint similarity</span>
                  <span className="text-red-400 font-bold">{selectedScenario.attackers > 100 ? "89" : "72"}% match</span>
                </div>
                <div className="flex justify-between">
                  <span>Social graph connected component</span>
                  <span className="text-red-400 font-bold">Cluster found</span>
                </div>
                <div className="flex justify-between">
                  <span>Zone density vs baseline</span>
                  <span className="text-red-400 font-bold">{selectedScenario.attackers > 100 ? "11" : "4"}x deviation</span>
                </div>
              </div>
            </div>
          )}

          {/* Attack Outcome */}
          {attackComplete && (
            <div className="glass rounded-2xl p-5 border-emerald-500/30 bg-emerald-500/5 animate-slide-up">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={18} className="text-emerald-400" />
                <span className="font-bold text-sm text-emerald-400">DEFENSE OUTCOME</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-xl bg-[var(--color-surface)]">
                  <div className="text-2xl font-bold text-red-400">{claimsBlocked}</div>
                  <div className="text-[10px] text-[var(--color-text-muted)]">Claims Blocked</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-[var(--color-surface)]">
                  <div className="text-2xl font-bold text-emerald-400">₹{(moneyProtected / 1000).toFixed(1)}K</div>
                  <div className="text-[10px] text-[var(--color-text-muted)]">Money Protected</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-[var(--color-surface)]">
                  <div className="text-2xl font-bold text-amber-400">
                    {selectedScenario.attackers - claimsBlocked}
                  </div>
                  <div className="text-[10px] text-[var(--color-text-muted)]">Need Manual Review</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-[var(--color-surface)]">
                  <div className="text-2xl font-bold text-indigo-400">96%</div>
                  <div className="text-[10px] text-[var(--color-text-muted)]">Auto-Block Rate</div>
                </div>
              </div>
              <p className="text-[10px] text-[var(--color-text-muted)] mt-3 text-center">
                Cost of attack exceeds reward. GPS is untrusted. Consensus wins.
              </p>
            </div>
          )}

          {/* Why This Works callout */}
          {!attackComplete && !isAttacking && (
            <div className="glass rounded-2xl p-5">
              <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                <Shield size={14} className="text-indigo-400" />
                Why Spoofing Fails
              </h4>
              <div className="space-y-2 text-xs text-[var(--color-text-secondary)]">
                <p>A spoofer at home would need to simultaneously fake:</p>
                <div className="space-y-1.5 mt-2">
                  {[
                    "WiFi BSSID (shows home router, not storm zone)",
                    "Barometric pressure (no storm overhead)",
                    "Accelerometer (sedentary, not stranded rider)",
                    "Network fingerprint (stable broadband, not degraded LTE)",
                    "Platform trail (no deliveries in that zone)",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <XCircle size={11} className="text-red-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
