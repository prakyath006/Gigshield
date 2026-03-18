"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line } from "recharts";
import { disruptionTypeData, cityDistributionData, riskScoreDistribution, hourlyDisruptionPattern, weeklyClaimsData } from "../data";

export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics <span className="gradient-text">Dashboard</span></h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Predictive insights and loss analytics for insurers</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Disruption Type Distribution */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold mb-1">Claims by Disruption Type</h3>
          <p className="text-sm text-[var(--color-text-muted)] mb-4">Current week breakdown</p>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={disruptionTypeData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" stroke="none">
                  {disruptionTypeData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-surface-light)", border: "1px solid var(--color-border)", borderRadius: "12px", color: "var(--color-text-primary)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {disruptionTypeData.map((entry, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color }} />
                <span className="text-[var(--color-text-secondary)]">{entry.name} ({entry.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* City Distribution */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold mb-1">Claims & Workers by City</h3>
          <p className="text-sm text-[var(--color-text-muted)] mb-4">Geographic distribution</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityDistributionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis type="number" stroke="var(--color-text-muted)" fontSize={12} />
                <YAxis type="category" dataKey="city" stroke="var(--color-text-muted)" fontSize={12} width={80} />
                <Tooltip contentStyle={{ background: "var(--color-surface-light)", border: "1px solid var(--color-border)", borderRadius: "12px", color: "var(--color-text-primary)" }} />
                <Bar dataKey="workers" name="Workers" fill="#6366f1" radius={[0, 6, 6, 0]} />
                <Bar dataKey="claims" name="Claims" fill="#06b6d4" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Score Distribution */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold mb-1">Worker Risk Score Distribution</h3>
          <p className="text-sm text-[var(--color-text-muted)] mb-4">AI-computed risk profiling</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskScoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="range" stroke="var(--color-text-muted)" fontSize={12} />
                <YAxis stroke="var(--color-text-muted)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-surface-light)", border: "1px solid var(--color-border)", borderRadius: "12px", color: "var(--color-text-primary)" }}
                  formatter={(value: number, name: string) => [value, "Workers"]} />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]}>
                  {riskScoreDistribution.map((entry, i) => (
                    <Cell key={i} fill={["#10b981", "#06b6d4", "#f59e0b", "#ef4444", "#dc2626"][i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Disruption Pattern */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold mb-1">Disruption Hotspot Hours</h3>
          <p className="text-sm text-[var(--color-text-muted)] mb-4">When do most disruptions occur?</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyDisruptionPattern}>
                <defs>
                  <linearGradient id="hourGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="hour" stroke="var(--color-text-muted)" fontSize={12} />
                <YAxis stroke="var(--color-text-muted)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-surface-light)", border: "1px solid var(--color-border)", borderRadius: "12px", color: "var(--color-text-primary)" }} />
                <Area type="monotone" dataKey="disruptions" stroke="#f59e0b" fill="url(#hourGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Loss Ratio Trend */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold mb-1">Premium vs Payout Trend (Loss Ratio)</h3>
        <p className="text-sm text-[var(--color-text-muted)] mb-4">Weekly premium income vs claim payouts — target loss ratio &lt;75%</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyClaimsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="week" stroke="var(--color-text-muted)" fontSize={12} />
              <YAxis stroke="var(--color-text-muted)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--color-surface-light)", border: "1px solid var(--color-border)", borderRadius: "12px", color: "var(--color-text-primary)" }} />
              <Line type="monotone" dataKey="premium" name="Premium (₹)" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="payouts" name="Payouts (₹)" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
