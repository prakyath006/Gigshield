"use client";
import { useState } from "react";
import { AlertTriangle, CloudRain, Thermometer, Wind, Eye, Zap, Users, Clock, CheckCircle, IndianRupee } from "lucide-react";
import { useApp } from "../context/AppContext";
import { getRandomWeatherData } from "../data";

export default function AlertsPage() {
  const { alerts, triggerDisruption } = useApp();
  const [simulating, setSimulating] = useState(false);
  const [simWeather, setSimWeather] = useState(getRandomWeatherData());
  const [simTriggered, setSimTriggered] = useState(false);
  const [newClaims, setNewClaims] = useState<{ workerName: string; amount: number; lostHours: number }[]>([]);

  const severityColors: Record<string, string> = {
    low: "border-emerald-500/30 bg-emerald-500/5",
    moderate: "border-amber-500/30 bg-amber-500/5",
    high: "border-orange-500/30 bg-orange-500/5",
    extreme: "border-red-500/30 bg-red-500/5",
  };
  const severityBadge: Record<string, string> = {
    low: "bg-emerald-500/20 text-emerald-400",
    moderate: "bg-amber-500/20 text-amber-400",
    high: "bg-orange-500/20 text-orange-400",
    extreme: "bg-red-500/20 text-red-400",
  };
  const typeIcons: Record<string, React.ReactNode> = {
    rain: <CloudRain size={20} />,
    storm: <Wind size={20} />,
    heatwave: <Thermometer size={20} />,
    flood: <CloudRain size={20} />,
    cyclone: <Wind size={20} />,
    pollution: <Eye size={20} />,
  };

  const handleSimulate = () => {
    setSimulating(true);
    setSimTriggered(false);
    setNewClaims([]);
    const newWeather = getRandomWeatherData();
    setSimWeather(newWeather);
    setTimeout(() => {
      setSimulating(false);
      if (newWeather.rainfall > 64 || newWeather.temp > 45 || newWeather.aqi > 400) {
        setSimTriggered(true);
        // Actually create claims in the app state!
        const createdClaims = triggerDisruption(newWeather);
        setNewClaims(createdClaims.map((c) => ({ workerName: c.workerName, amount: c.amount, lostHours: c.lostHours })));
      }
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Real-Time <span className="gradient-text">Alerts</span></h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Live weather & disruption monitoring with auto-trigger detection</p>
      </div>

      {/* Simulation Panel */}
      <div className="glass rounded-2xl p-6 gradient-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold flex items-center gap-2"><Zap size={16} className="text-yellow-400" /> Disruption Simulator</h3>
            <p className="text-sm text-[var(--color-text-muted)]">Simulate weather events to see auto-claim triggers in action</p>
          </div>
          <button onClick={handleSimulate} className="btn-primary inline-flex items-center gap-2" disabled={simulating}>
            {simulating ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Fetching Data...</>
            ) : (
              <><CloudRain size={16} /> Simulate Event</>
            )}
          </button>
        </div>

        {/* Simulated Weather Data */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
          {[
            { label: "Condition", value: simWeather.condition, icon: <CloudRain size={16} /> },
            { label: "Temperature", value: `${simWeather.temp}°C`, icon: <Thermometer size={16} /> },
            { label: "Rainfall", value: `${simWeather.rainfall}mm/hr`, icon: <CloudRain size={16} /> },
            { label: "Wind", value: `${simWeather.wind}km/h`, icon: <Wind size={16} /> },
            { label: "AQI", value: simWeather.aqi.toString(), icon: <Eye size={16} /> },
          ].map((item, i) => (
            <div key={i} className={`p-3 rounded-xl bg-[var(--color-surface)] text-center ${simulating ? "shimmer" : ""}`}>
              <div className="text-[var(--color-primary-light)] flex justify-center mb-1">{item.icon}</div>
              <div className="text-xs text-[var(--color-text-muted)]">{item.label}</div>
              <div className="text-sm font-bold">{item.value}</div>
            </div>
          ))}
        </div>

        {/* Trigger Result - With Real Claims */}
        {simTriggered && !simulating && (
          <div className="space-y-3 animate-slide-up">
            <div className="p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-red-500/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-red-400" />
                </div>
                <div>
                  <div className="font-semibold text-red-400">⚡ Parametric Trigger Activated!</div>
                  <div className="text-sm text-[var(--color-text-secondary)]">
                    {simWeather.rainfall > 64 && "Heavy rainfall threshold exceeded (>64mm/hr). "}
                    {simWeather.temp > 45 && "Extreme heat threshold exceeded (>45°C). "}
                    {simWeather.aqi > 400 && "Hazardous AQI threshold exceeded (>400). "}
                    Auto-claims initiated for {newClaims.length} affected workers.
                  </div>
                </div>
              </div>
            </div>

            {/* Show created claims */}
            {newClaims.length > 0 && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30">
                <div className="font-semibold text-emerald-400 text-sm mb-3 flex items-center gap-2">
                  <CheckCircle size={16} /> Claims Auto-Created & Payouts Processing
                </div>
                <div className="space-y-2">
                  {newClaims.map((claim, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-surface)]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white text-xs font-bold">
                          {claim.workerName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{claim.workerName}</div>
                          <div className="text-xs text-[var(--color-text-muted)]">{claim.lostHours} hours lost</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <IndianRupee size={14} className="text-emerald-400" />
                        <span className="font-bold text-emerald-400">₹{claim.amount}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">UPI Sent</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs text-[var(--color-text-muted)]">
                  Total payout: ₹{newClaims.reduce((sum, c) => sum + c.amount, 0).toLocaleString()} • Processing time: 4.2 mins avg
                </div>
              </div>
            )}
          </div>
        )}
        {!simTriggered && !simulating && simWeather.rainfall <= 64 && simWeather.temp <= 45 && simWeather.aqi <= 400 && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 animate-slide-up">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
              ✓ No disruption triggers activated. Conditions within normal range.
            </div>
          </div>
        )}
      </div>

      {/* Active Alerts */}
      <div>
        <h3 className="font-semibold mb-4">Active & Recent Alerts ({alerts.length})</h3>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className={`rounded-2xl p-5 border ${severityColors[alert.severity]} transition-all`}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-light)] flex items-center justify-center text-[var(--color-primary-light)]">
                  {typeIcons[alert.type]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{alert.city} — {alert.zone}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityBadge[alert.severity]}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                    {alert.isActive && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400 animate-pulse">
                        LIVE
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-3">{alert.message}</p>
                  <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                    <span className="flex items-center gap-1"><Users size={12} /> {alert.affectedWorkers} workers affected</span>
                    <span className="flex items-center gap-1"><Zap size={12} /> {alert.autoClaimsTriggered} auto-claims</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {new Date(alert.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
