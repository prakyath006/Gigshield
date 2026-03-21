"use client";
import { useState, useEffect, useCallback } from "react";
import { useApp } from "../context/AppContext";
import {
  CloudRain,
  Thermometer,
  Wind,
  AlertTriangle,
  Wifi,
  CheckCircle2,
  XCircle,
  Loader2,
  Radio,
  Zap,
  Activity,
  MapPin,
} from "lucide-react";

// Simulated API endpoint configs
const API_SOURCES = {
  weather: {
    name: "OpenWeatherMap API",
    endpoint: "api.openweathermap.org/data/2.5/weather",
    icon: <CloudRain size={18} />,
    statusColor: "text-emerald-400",
  },
  aqi: {
    name: "CPCB Air Quality API",
    endpoint: "api.cpcb.nic.in/aqi/v2/station",
    icon: <Wind size={18} />,
    statusColor: "text-emerald-400",
  },
  imd: {
    name: "IMD Weather Service",
    endpoint: "mausam.imd.gov.in/api/alerts",
    icon: <Thermometer size={18} />,
    statusColor: "text-emerald-400",
  },
  platform: {
    name: "Platform Status API",
    endpoint: "status.zomato.com/api/v1",
    icon: <Wifi size={18} />,
    statusColor: "text-emerald-400",
  },
  flood: {
    name: "City Flood Sensor Network",
    endpoint: "bmc.gov.in/api/flood-sensors",
    icon: <Activity size={18} />,
    statusColor: "text-emerald-400",
  },
};

interface TriggerConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  api: keyof typeof API_SOURCES;
  parameterName: string;
  threshold: string;
  unit: string;
  generateValue: () => { value: number; breached: boolean; rawData: Record<string, unknown> };
}

const TRIGGERS: TriggerConfig[] = [
  {
    id: "heavy_rain",
    name: "Heavy Rainfall",
    description: "Monitors hourly precipitation levels via OpenWeatherMap",
    icon: <CloudRain size={24} />,
    color: "text-blue-400",
    bgColor: "bg-blue-500/15",
    api: "weather",
    parameterName: "Rainfall Intensity",
    threshold: "> 64 mm/hr",
    unit: "mm/hr",
    generateValue: () => {
      const breached = Math.random() > 0.3;
      const value = breached ? Math.floor(65 + Math.random() * 80) : Math.floor(10 + Math.random() * 50);
      return {
        value,
        breached,
        rawData: {
          coord: { lon: 72.88, lat: 19.08 },
          weather: [{ main: breached ? "Rain" : "Clouds", description: breached ? "heavy intensity rain" : "scattered clouds" }],
          main: { temp: 28.5, humidity: breached ? 95 : 65 },
          rain: { "1h": value },
          wind: { speed: breached ? 12.4 : 5.2 },
          name: "Mumbai",
          dt: Math.floor(Date.now() / 1000),
        },
      };
    },
  },
  {
    id: "extreme_heat",
    name: "Extreme Heat Wave",
    description: "Tracks temperature extremes from IMD weather stations",
    icon: <Thermometer size={24} />,
    color: "text-orange-400",
    bgColor: "bg-orange-500/15",
    api: "imd",
    parameterName: "Temperature",
    threshold: "> 45°C",
    unit: "°C",
    generateValue: () => {
      const breached = Math.random() > 0.4;
      const value = breached ? Math.floor(46 + Math.random() * 6) : Math.floor(30 + Math.random() * 12);
      return {
        value,
        breached,
        rawData: {
          station: "Palam, Delhi",
          observation_time: new Date().toISOString(),
          temperature: { current: value, feels_like: value + 3, max: value + 2, min: value - 5 },
          humidity: breached ? 25 : 55,
          wind_speed: breached ? 3.2 : 8.1,
          uv_index: breached ? 12 : 6,
          alert: breached ? "RED - Extreme Heat Warning" : "NONE",
        },
      };
    },
  },
  {
    id: "severe_aqi",
    name: "Hazardous Air Quality",
    description: "Real-time AQI data from CPCB monitoring stations",
    icon: <Wind size={24} />,
    color: "text-purple-400",
    bgColor: "bg-purple-500/15",
    api: "aqi",
    parameterName: "Air Quality Index",
    threshold: "> 400 AQI",
    unit: "AQI",
    generateValue: () => {
      const breached = Math.random() > 0.4;
      const value = breached ? Math.floor(410 + Math.random() * 150) : Math.floor(100 + Math.random() * 250);
      return {
        value,
        breached,
        rawData: {
          station: "Anand Vihar, Delhi",
          city: "Delhi",
          aqi: value,
          category: breached ? "Severe" : value > 300 ? "Very Poor" : "Poor",
          pollutants: {
            pm25: breached ? Math.floor(250 + Math.random() * 100) : Math.floor(60 + Math.random() * 80),
            pm10: breached ? Math.floor(350 + Math.random() * 150) : Math.floor(100 + Math.random() * 100),
            no2: Math.floor(40 + Math.random() * 60),
            so2: Math.floor(10 + Math.random() * 30),
            co: Math.floor(1 + Math.random() * 4),
            o3: Math.floor(20 + Math.random() * 40),
          },
          last_updated: new Date().toISOString(),
        },
      };
    },
  },
  {
    id: "platform_outage",
    name: "Platform Outage",
    description: "Monitors Zomato/Swiggy app server health & order flow",
    icon: <Wifi size={24} />,
    color: "text-red-400",
    bgColor: "bg-red-500/15",
    api: "platform",
    parameterName: "Downtime Duration",
    threshold: "> 2 hours",
    unit: "hours",
    generateValue: () => {
      const breached = Math.random() > 0.5;
      const value = breached ? +(2 + Math.random() * 4).toFixed(1) : +(0.1 + Math.random() * 1.5).toFixed(1);
      return {
        value,
        breached,
        rawData: {
          platform: "Zomato",
          status: breached ? "major_outage" : "operational",
          downtime_hours: value,
          affected_cities: breached ? ["Mumbai", "Delhi", "Bangalore", "Chennai"] : [],
          affected_services: breached ? ["order_placement", "rider_app", "payment_gateway"] : [],
          estimated_recovery: breached ? new Date(Date.now() + 2 * 3600000).toISOString() : null,
          incident_id: `INC-${Math.floor(10000 + Math.random() * 90000)}`,
        },
      };
    },
  },
  {
    id: "flooding",
    name: "Urban Flooding",
    description: "IoT flood sensor data from municipal corporation networks",
    icon: <Activity size={24} />,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/15",
    api: "flood",
    parameterName: "Water Level",
    threshold: "> 30 cm",
    unit: "cm",
    generateValue: () => {
      const breached = Math.random() > 0.35;
      const value = breached ? Math.floor(35 + Math.random() * 60) : Math.floor(5 + Math.random() * 20);
      return {
        value,
        breached,
        rawData: {
          sensor_id: "BMC-FL-ANW-042",
          location: "Andheri West Subway",
          city: "Mumbai",
          water_level_cm: value,
          status: breached ? "DANGER" : "NORMAL",
          road_passable: !breached,
          nearby_roads_affected: breached ? ["SV Road", "Link Road", "Andheri Subway"] : [],
          timestamp: new Date().toISOString(),
          sensor_battery: "87%",
        },
      };
    },
  },
];

interface TriggerResult {
  triggerId: string;
  timestamp: string;
  value: number;
  breached: boolean;
  rawData: Record<string, unknown>;
  claimsCreated: number;
  totalPayout: number;
}

export default function TriggerCenterPage() {
  const { triggerDisruption } = useApp();
  const [results, setResults] = useState<TriggerResult[]>([]);
  const [activeTrigger, setActiveTrigger] = useState<string | null>(null);
  const [expandedResult, setExpandedResult] = useState<string | null>(null);
  const [apiStatuses, setApiStatuses] = useState<Record<string, "online" | "checking">>(
    Object.fromEntries(Object.keys(API_SOURCES).map((k) => [k, "checking"]))
  );

  // Simulate API health check on mount
  useEffect(() => {
    const keys = Object.keys(API_SOURCES);
    keys.forEach((key, i) => {
      setTimeout(() => {
        setApiStatuses((prev) => ({ ...prev, [key]: "online" }));
      }, 500 + i * 300);
    });
  }, []);

  const handleTrigger = useCallback(
    (trigger: TriggerConfig) => {
      if (activeTrigger) return;
      setActiveTrigger(trigger.id);

      // Simulate API call delay
      setTimeout(() => {
        const { value, breached, rawData } = trigger.generateValue();

        let claimsCreated = 0;
        let totalPayout = 0;

        if (breached) {
          // Map trigger to disruption data
          const weatherData = {
            condition: trigger.id === "heavy_rain" ? "Heavy Rain" : trigger.id === "extreme_heat" ? "Extreme Heat" : trigger.id === "severe_aqi" ? "Severe Pollution" : trigger.id === "flooding" ? "Flooding" : "Platform Outage",
            temp: trigger.id === "extreme_heat" ? value : 30,
            humidity: 80,
            rainfall: trigger.id === "heavy_rain" || trigger.id === "flooding" ? value : 0,
            wind: 15,
            aqi: trigger.id === "severe_aqi" ? value : 50,
          };
          const newClaims = triggerDisruption(weatherData);
          claimsCreated = newClaims.length;
          totalPayout = newClaims.reduce((sum, c) => sum + c.amount, 0);
        }

        const result: TriggerResult = {
          triggerId: trigger.id,
          timestamp: new Date().toISOString(),
          value,
          breached,
          rawData,
          claimsCreated,
          totalPayout,
        };

        setResults((prev) => [result, ...prev]);
        setActiveTrigger(null);
      }, 1500 + Math.random() * 1000);
    },
    [activeTrigger, triggerDisruption]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
            <Radio size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">API Trigger Center</h1>
            <p className="text-sm text-[var(--color-text-muted)]">
              5 automated parametric triggers connected to live mock APIs
            </p>
          </div>
        </div>
      </div>

      {/* API Status Bar */}
      <div className="glass rounded-2xl p-4 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={14} className="text-yellow-400" />
          <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            Connected Data Sources
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Object.entries(API_SOURCES).map(([key, src]) => (
            <div
              key={key}
              className="flex items-center gap-2 p-2 rounded-lg bg-[var(--color-surface-lighter)]"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  apiStatuses[key] === "online"
                    ? "bg-emerald-400"
                    : "bg-yellow-400 animate-pulse"
                }`}
              />
              <div className="min-w-0">
                <div className="text-xs font-medium truncate">{src.name}</div>
                <div className="text-[10px] text-[var(--color-text-muted)] truncate font-mono">
                  {src.endpoint}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Trigger Cards */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <AlertTriangle size={18} className="text-yellow-400" />
            Parametric Triggers
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {TRIGGERS.map((trigger) => {
              const latestResult = results.find((r) => r.triggerId === trigger.id);
              const isActive = activeTrigger === trigger.id;

              return (
                <div
                  key={trigger.id}
                  className="glass rounded-2xl p-6 card-hover group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${trigger.bgColor} flex items-center justify-center ${trigger.color}`}
                    >
                      {trigger.icon}
                    </div>
                    {latestResult && (
                      <div
                        className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                          latestResult.breached
                            ? "bg-red-500/20 text-red-400"
                            : "bg-emerald-500/20 text-emerald-400"
                        }`}
                      >
                        {latestResult.breached ? "BREACHED" : "NORMAL"}
                      </div>
                    )}
                  </div>

                  <h3 className="font-bold text-base mb-1">{trigger.name}</h3>
                  <p className="text-xs text-[var(--color-text-muted)] mb-3">
                    {trigger.description}
                  </p>

                  <div className="flex items-center gap-4 mb-4 text-xs">
                    <div>
                      <span className="text-[var(--color-text-muted)]">Threshold: </span>
                      <span className="font-bold text-[var(--color-text-primary)]">
                        {trigger.threshold}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[var(--color-text-muted)]">
                      <MapPin size={10} />
                      {API_SOURCES[trigger.api].name}
                    </div>
                  </div>

                  {latestResult && (
                    <div className="p-3 rounded-xl bg-[var(--color-surface-lighter)] mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[var(--color-text-muted)]">Last reading:</span>
                        <span
                          className={`font-bold text-lg ${
                            latestResult.breached ? "text-red-400" : "text-emerald-400"
                          }`}
                        >
                          {latestResult.value} {trigger.unit}
                        </span>
                      </div>
                      {latestResult.breached && latestResult.claimsCreated > 0 && (
                        <div className="mt-2 pt-2 border-t border-[var(--color-border)] flex items-center gap-3 text-xs">
                          <span className="text-yellow-400">
                            ⚡ {latestResult.claimsCreated} claims auto-created
                          </span>
                          <span className="text-emerald-400">
                            ₹{latestResult.totalPayout.toLocaleString()} paid
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => handleTrigger(trigger)}
                    disabled={isActive || activeTrigger !== null}
                    className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                      isActive
                        ? "bg-[var(--color-primary)]/20 text-[var(--color-primary-light)] cursor-wait"
                        : activeTrigger
                        ? "bg-[var(--color-surface-lighter)] text-[var(--color-text-muted)] cursor-not-allowed"
                        : "btn-primary cursor-pointer"
                    }`}
                  >
                    {isActive ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Fetching API data...
                      </>
                    ) : (
                      <>
                        <Radio size={16} />
                        Check {trigger.parameterName}
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Event Log */}
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <Activity size={18} className="text-cyan-400" />
            Live Event Log
          </h2>
          <div className="glass rounded-2xl p-4 max-h-[700px] overflow-y-auto">
            {results.length === 0 ? (
              <div className="text-center py-12 text-[var(--color-text-muted)]">
                <Radio size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No triggers fired yet.</p>
                <p className="text-xs mt-1">Click any trigger to fetch live API data.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((result, i) => {
                  const trigger = TRIGGERS.find((t) => t.id === result.triggerId)!;
                  const isExpanded = expandedResult === `${result.triggerId}-${i}`;
                  return (
                    <div
                      key={`${result.triggerId}-${i}`}
                      className={`rounded-xl border transition-all cursor-pointer ${
                        result.breached
                          ? "border-red-500/30 bg-red-500/5"
                          : "border-[var(--color-border)] bg-[var(--color-surface-lighter)]"
                      }`}
                      onClick={() =>
                        setExpandedResult(isExpanded ? null : `${result.triggerId}-${i}`)
                      }
                    >
                      <div className="p-3">
                        <div className="flex items-center gap-2 mb-1">
                          {result.breached ? (
                            <XCircle size={14} className="text-red-400" />
                          ) : (
                            <CheckCircle2 size={14} className="text-emerald-400" />
                          )}
                          <span className="text-sm font-semibold">{trigger.name}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                          <span>
                            {result.value} {trigger.unit}
                          </span>
                          <span>
                            {new Date(result.timestamp).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </span>
                        </div>
                        {result.breached && result.claimsCreated > 0 && (
                          <div className="mt-2 text-xs text-yellow-400">
                            ⚡ {result.claimsCreated} auto-claims → ₹{result.totalPayout.toLocaleString()}
                          </div>
                        )}
                      </div>

                      {/* Expanded: Raw API response */}
                      {isExpanded && (
                        <div className="border-t border-[var(--color-border)] p-3">
                          <div className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                            Raw API Response — {API_SOURCES[trigger.api].name}
                          </div>
                          <pre className="text-[11px] text-[var(--color-text-secondary)] bg-[var(--color-surface)] rounded-lg p-3 overflow-x-auto max-h-48 font-mono">
                            {JSON.stringify(result.rawData, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
