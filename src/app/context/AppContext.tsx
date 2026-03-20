"use client";
import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Worker, Policy, Claim, WeatherAlert, DashboardMetrics } from "../types";
import {
  mockWorkers,
  mockPolicies,
  mockClaims,
  mockAlerts,
  defaultTriggers,
  calculateDynamicPremium,
  generateRiskProfile,
} from "../data";

// ==========================================
// APP STATE INTERFACE
// ==========================================

interface AppState {
  // Data
  workers: Worker[];
  policies: Policy[];
  claims: Claim[];
  alerts: WeatherAlert[];
  currentWorker: Worker | null;

  // Actions
  addWorker: (worker: Worker, plan: "basic" | "standard" | "premium") => void;
  setCurrentWorker: (worker: Worker) => void;
  addClaim: (claim: Claim) => void;
  addAlert: (alert: WeatherAlert) => void;
  getDashboardMetrics: () => DashboardMetrics;
  triggerDisruption: (weatherData: {
    condition: string;
    temp: number;
    humidity: number;
    rainfall: number;
    wind: number;
    aqi: number;
  }) => Claim[];
}

const AppContext = createContext<AppState | undefined>(undefined);

// ==========================================
// APP PROVIDER
// ==========================================

export function AppProvider({ children }: { children: ReactNode }) {
  const [workers, setWorkers] = useState<Worker[]>(mockWorkers);
  const [policies, setPolicies] = useState<Policy[]>(mockPolicies);
  const [claims, setClaims] = useState<Claim[]>(mockClaims);
  const [alerts, setAlerts] = useState<WeatherAlert[]>(mockAlerts);
  const [currentWorker, setCurrentWorkerState] = useState<Worker | null>(mockWorkers[0]);

  // Set current logged-in worker
  const setCurrentWorker = useCallback((worker: Worker) => {
    setCurrentWorkerState(worker);
  }, []);

  // Add a new worker from onboarding and create their policy
  const addWorker = useCallback(
    (worker: Worker, plan: "basic" | "standard" | "premium") => {
      // Generate risk profile to set proper risk score
      const riskProfile = generateRiskProfile(worker);
      const enrichedWorker: Worker = {
        ...worker,
        riskScore: riskProfile.overallScore,
        riskLevel:
          riskProfile.overallScore > 60
            ? "high"
            : riskProfile.overallScore > 35
            ? "medium"
            : "low",
      };

      setWorkers((prev) => [enrichedWorker, ...prev]);
      setCurrentWorkerState(enrichedWorker);

      // Calculate premium and create policy
      const premium = calculateDynamicPremium(enrichedWorker, plan);
      const coverageMap = {
        basic: { amount: 2000, hours: 20, maxPayout: 800 },
        standard: { amount: 3500, hours: 30, maxPayout: 1200 },
        premium: { amount: 5000, hours: 42, maxPayout: 1800 },
      };
      const coverage = coverageMap[plan];

      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      const newPolicy: Policy = {
        id: `POL-2026-${String(policies.length + 1).padStart(3, "0")}`,
        workerId: enrichedWorker.id,
        workerName: enrichedWorker.name,
        platform: enrichedWorker.platform,
        plan,
        weeklyPremium: premium.finalPremium,
        coverageAmount: coverage.amount,
        coverageHoursPerWeek: coverage.hours,
        maxPayoutPerEvent: coverage.maxPayout,
        status: "active",
        startDate: today.toISOString().split("T")[0],
        endDate: nextWeek.toISOString().split("T")[0],
        autoRenew: true,
        triggers: defaultTriggers.filter((t) => {
          if (plan === "basic") return t.type === "weather";
          if (plan === "standard") return t.type === "weather" || t.type === "environmental";
          return true;
        }),
        riskScore: riskProfile.overallScore,
      };

      setPolicies((prev) => [newPolicy, ...prev]);
    },
    [policies.length]
  );

  // Add a single claim
  const addClaim = useCallback((claim: Claim) => {
    setClaims((prev) => [claim, ...prev]);
  }, []);

  // Add a new alert
  const addAlert = useCallback((alert: WeatherAlert) => {
    setAlerts((prev) => [alert, ...prev]);
  }, []);

  // Compute dashboard metrics from live state
  const getDashboardMetrics = useCallback((): DashboardMetrics => {
    const activePols = policies.filter((p) => p.status === "active");
    const weekClaims = claims; // all claims treated as "this week" for demo
    const totalPayouts = weekClaims
      .filter((c) => c.status === "paid" || c.status === "auto_approved" || c.status === "approved")
      .reduce((sum, c) => sum + c.amount, 0);
    const avgPremium =
      activePols.length > 0
        ? Math.round(activePols.reduce((sum, p) => sum + p.weeklyPremium, 0) / activePols.length)
        : 0;
    const fraudClaims = weekClaims.filter((c) => c.fraudScore > 40).length;
    const autoApproved = weekClaims.filter((c) => c.status === "auto_approved" || c.status === "paid").length;

    return {
      totalWorkers: workers.length,
      activePolicies: activePols.length,
      totalClaimsThisWeek: weekClaims.length,
      totalPayoutsThisWeek: totalPayouts,
      avgPremiumPerWeek: avgPremium,
      lossRatio: avgPremium > 0 ? Math.min(0.95, totalPayouts / (activePols.length * avgPremium * 4 || 1)) : 0.68,
      fraudDetectionRate: weekClaims.length > 0 ? Math.min(0.99, (weekClaims.length - fraudClaims + 1) / weekClaims.length) : 0.94,
      autoApprovalRate: weekClaims.length > 0 ? autoApproved / weekClaims.length : 0.72,
      activeAlerts: alerts.filter((a) => a.isActive).length,
      avgClaimProcessingTime: "4.2 mins",
    };
  }, [workers, policies, claims, alerts]);

  // Trigger a disruption and create claims for affected workers
  const triggerDisruption = useCallback(
    (weatherData: {
      condition: string;
      temp: number;
      humidity: number;
      rainfall: number;
      wind: number;
      aqi: number;
    }): Claim[] => {
      const newClaims: Claim[] = [];
      let triggerType: "weather" | "environmental" | "social" = "weather";
      let eventName = "";

      if (weatherData.rainfall > 64) {
        triggerType = "weather";
        eventName = `Heavy Rainfall — ${weatherData.rainfall}mm/hr`;
      } else if (weatherData.temp > 45) {
        triggerType = "weather";
        eventName = `Extreme Heat Wave — ${weatherData.temp}°C`;
      } else if (weatherData.aqi > 400) {
        triggerType = "environmental";
        eventName = `Severe Air Pollution — AQI ${weatherData.aqi}`;
      } else {
        return []; // No trigger
      }

      // Find workers with active policies that cover this type
      const activePolicies = policies.filter((p) => {
        if (p.status !== "active") return false;
        return p.triggers.some((t) => t.type === triggerType && t.isActive);
      });

      // Create claims for affected workers (pick up to 3 for demo visibility)
      const affectedPolicies = activePolicies.slice(0, 3);

      affectedPolicies.forEach((policy) => {
        const worker = workers.find((w) => w.id === policy.workerId);
        if (!worker) return;

        const lostHours = Math.floor(Math.random() * 5) + 3; // 3-7 hours
        const hourlyRate = worker.avgWeeklyEarnings / worker.avgWeeklyHours;
        const amount = Math.min(
          Math.round(lostHours * hourlyRate),
          policy.maxPayoutPerEvent
        );

        const cityCoords: Record<string, { lat: number; lng: number }> = {
          Mumbai: { lat: 19.076, lng: 72.8777 },
          Delhi: { lat: 28.6139, lng: 77.209 },
          Bangalore: { lat: 12.9716, lng: 77.5946 },
          Chennai: { lat: 13.0827, lng: 80.2707 },
          Hyderabad: { lat: 17.385, lng: 78.4867 },
          Pune: { lat: 18.5204, lng: 73.8567 },
        };
        const coords = cityCoords[worker.city] || { lat: 19.076, lng: 72.8777 };

        const newClaim: Claim = {
          id: `CLM-2026-${String(claims.length + newClaims.length + 1).padStart(3, "0")}`,
          policyId: policy.id,
          workerId: worker.id,
          workerName: worker.name,
          type: triggerType,
          disruptionEvent: eventName,
          description: `${eventName}. ${worker.zone}, ${worker.city} area affected. Deliveries halted for ${lostHours} hours.`,
          status: "auto_approved",
          amount,
          lostHours,
          eventDate: new Date().toISOString().split("T")[0],
          filedDate: new Date().toISOString().split("T")[0],
          processedDate: new Date().toISOString().split("T")[0],
          location: { ...coords, area: `${worker.zone}, ${worker.city}` },
          evidenceData: {
            weatherData: {
              temperature: weatherData.temp,
              humidity: weatherData.humidity,
              rainfall: weatherData.rainfall,
              windSpeed: weatherData.wind,
              condition: weatherData.condition,
              source: "OpenWeatherMap API",
            },
            locationVerification: {
              verified: true,
              workerLocation: { lat: coords.lat + 0.001, lng: coords.lng + 0.001 },
              claimLocation: coords,
              distance: 0.15,
            },
          },
          fraudScore: Math.floor(Math.random() * 15),
          fraudFlags: [],
          autoTriggered: true,
        };

        newClaims.push(newClaim);
      });

      if (newClaims.length > 0) {
        setClaims((prev) => [...newClaims, ...prev]);

        // Also create an alert for this event
        const newAlert: WeatherAlert = {
          id: `ALT-${String(alerts.length + 1).padStart(3, "0")}`,
          type: weatherData.rainfall > 64 ? "rain" : weatherData.temp > 45 ? "heatwave" : "pollution",
          severity: "high",
          city: affectedPolicies[0] ? workers.find((w) => w.id === affectedPolicies[0].workerId)?.city || "Mumbai" : "Mumbai",
          zone: "Multiple zones",
          message: `${eventName}. Auto-claims initiated for ${newClaims.length} affected delivery partners. Payouts processing via UPI.`,
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
          affectedWorkers: activePolicies.length * 42, // simulated multiplier
          autoClaimsTriggered: newClaims.length,
          isActive: true,
        };
        setAlerts((prev) => [newAlert, ...prev]);
      }

      return newClaims;
    },
    [policies, workers, claims.length, alerts.length]
  );

  return (
    <AppContext.Provider
      value={{
        workers,
        policies,
        claims,
        alerts,
        currentWorker,
        addWorker,
        setCurrentWorker,
        addClaim,
        addAlert,
        getDashboardMetrics,
        triggerDisruption,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ==========================================
// HOOK
// ==========================================

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
