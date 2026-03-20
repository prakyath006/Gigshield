"use client";
import { Shield, Zap, Brain, CloudRain, ChevronRight, TrendingUp, Clock, Users } from "lucide-react";
import { PageType } from "../types";

interface LandingPageProps {
  onNavigate: (page: PageType) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-cyan-900/20" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />

        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light text-sm text-[var(--color-text-secondary)] mb-8 animate-fade-in">
            <Zap size={14} className="text-yellow-400" />
            AI-Powered Parametric Insurance for India&apos;s Gig Workers
          </div>

          <h1 className="text-5xl sm:text-7xl font-black mb-6 leading-tight animate-slide-up">
            Protect Your <span className="gradient-text">Earnings</span>
            <br />
            From What You <span className="gradient-text">Can&apos;t Control</span>
          </h1>

          <p className="text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Heavy rain? Extreme heat? Sudden strikes? GigShield automatically detects disruptions and pays you for lost income — no paperwork, no waiting.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <button onClick={() => onNavigate("onboarding")} className="btn-primary text-lg px-8 py-4 rounded-2xl inline-flex items-center gap-2">
              Get Protected Now <ChevronRight size={20} />
            </button>
            <button onClick={() => onNavigate("dashboard")} className="btn-secondary text-lg px-8 py-4 rounded-2xl">
              View Demo Dashboard
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto">
            {[
              { icon: <Users size={20} />, value: "2,847", label: "Active Workers" },
              { icon: <Shield size={20} />, value: "₹15.6L", label: "Paid This Week" },
              { icon: <Clock size={20} />, value: "4.2 min", label: "Avg Claim Time" },
              { icon: <TrendingUp size={20} />, value: "94%", label: "Auto-Approved" },
            ].map((stat, i) => (
              <div key={i} className="glass rounded-2xl p-4 card-hover">
                <div className="text-[var(--color-primary-light)] mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-[var(--color-text-muted)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            How <span className="gradient-text">GigShield</span> Works
          </h2>
          <p className="text-center text-[var(--color-text-secondary)] mb-12 max-w-xl mx-auto">
            Zero-touch income protection. Our AI monitors disruptions 24/7 and pays you automatically.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Users size={32} />,
                title: "1. Quick Onboarding",
                desc: "Sign up in 2 minutes. Enter your delivery platform, city, zone, and weekly earnings. Our AI builds your risk profile instantly.",
                color: "from-indigo-500 to-indigo-600",
              },
              {
                icon: <Brain size={32} />,
                title: "2. AI Risk Profiling",
                desc: "Our ML model analyzes 15+ factors — city weather patterns, zone flood history, your work hours — to calculate a personalized weekly premium.",
                color: "from-cyan-500 to-cyan-600",
              },
              {
                icon: <CloudRain size={32} />,
                title: "3. Auto Detection & Payout",
                desc: "When a disruption hits, our system detects it via weather & AQI APIs. Claims trigger automatically. Payout reaches you in minutes.",
                color: "from-emerald-500 to-emerald-600",
              },
            ].map((step, i) => (
              <div key={i} className="glass rounded-2xl p-8 card-hover group">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Anti-Spoofing Defense — UNIQUE DIFFERENTIATOR */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-red-950/10 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" /> THREAT DEFENSE ACTIVE
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              GPS is <span className="text-red-400 line-through">Trusted</span> → GPS is <span className="gradient-text">Verified</span>
            </h2>
            <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
              Our Genuine Presence Score (GPS*) engine replaces blind GPS trust with a multi-signal consensus model that catches spoofing syndicates while protecting honest workers.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "📡", title: "Environment Check", desc: "Verifies weather event exists at location via IMD/OpenWeatherMap + IoT sensors", signal: "30%" },
              { icon: "📱", title: "Device Integrity", desc: "Detects mock-location apps, checks WiFi BSSID vs GPS, barometer consistency", signal: "25%" },
              { icon: "🏃", title: "Behavioral Biometrics", desc: "Accelerometer, step counter, battery drain — is the rider physically present?", signal: "25%" },
              { icon: "🔗", title: "Platform Cross-Check", desc: "Delivery trail, network fingerprint, IP geolocation all must corroborate", signal: "20%" },
            ].map((item, i) => (
              <div key={i} className="glass rounded-2xl p-6 card-hover">
                <span className="text-3xl mb-3 block">{item.icon}</span>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-xs text-[var(--color-text-secondary)] mb-3">{item.desc}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-[var(--color-surface-lighter)] overflow-hidden">
                    <div className="h-full rounded-full gradient-bg" style={{ width: item.signal }} />
                  </div>
                  <span className="text-xs font-bold text-[var(--color-primary-light)]">{item.signal}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            What We <span className="gradient-text">Cover</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { emoji: "🌧️", title: "Heavy Rainfall", desc: "Rainfall > 64mm/hr halting deliveries" },
              { emoji: "🌡️", title: "Extreme Heat", desc: "Temperature > 45°C, outdoor work unsafe" },
              { emoji: "🌫️", title: "Severe Pollution", desc: "AQI > 400, hazardous air quality" },
              { emoji: "🌊", title: "Flooding", desc: "Waterlogging > 30cm on roads" },
              { emoji: "⛔", title: "Curfews & Strikes", desc: "Unplanned bandh or area shutdowns" },
              { emoji: "🌀", title: "Cyclone / Storm", desc: "Wind speed > 62 km/h restricting movement" },
            ].map((item, i) => (
              <div key={i} className="glass rounded-xl p-6 card-hover flex items-start gap-4">
                <span className="text-3xl">{item.emoji}</span>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Weekly <span className="gradient-text">Plans</span>
          </h2>
          <p className="text-center text-[var(--color-text-secondary)] mb-12">
            Pay weekly, stay protected. Cancel anytime. Prices personalized by AI.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                plan: "Basic",
                price: "₹39-79",
                coverage: "₹2,000",
                hours: "20 hrs/week",
                maxPayout: "₹800/event",
                triggers: "Weather only",
                popular: false,
              },
              {
                plan: "Standard",
                price: "₹69-119",
                coverage: "₹3,500",
                hours: "30 hrs/week",
                maxPayout: "₹1,200/event",
                triggers: "Weather + Environmental",
                popular: true,
              },
              {
                plan: "Premium",
                price: "₹99-169",
                coverage: "₹5,000",
                hours: "42 hrs/week",
                maxPayout: "₹1,800/event",
                triggers: "All disruptions",
                popular: false,
              },
            ].map((tier, i) => (
              <div key={i} className={`relative rounded-2xl p-8 card-hover ${tier.popular ? "gradient-border glass" : "glass"}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-bg text-xs font-semibold text-white">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-1">{tier.plan}</h3>
                <div className="text-3xl font-black gradient-text mb-1">{tier.price}</div>
                <div className="text-xs text-[var(--color-text-muted)] mb-6">per week (AI-adjusted)</div>

                <div className="space-y-3 text-sm">
                  {[
                    `Coverage: ${tier.coverage}/week`,
                    `Hours: ${tier.hours}`,
                    `Max payout: ${tier.maxPayout}`,
                    `Triggers: ${tier.triggers}`,
                    "Auto claim processing",
                    "Instant UPI payout",
                  ].map((feature, j) => (
                    <div key={j} className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
                      {feature}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onNavigate("onboarding")}
                  className={`w-full mt-8 py-3 rounded-xl font-semibold cursor-pointer transition-all ${
                    tier.popular ? "btn-primary" : "btn-secondary"
                  }`}
                >
                  Choose {tier.plan}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-[var(--color-primary)]" />
            <span className="font-bold gradient-text">GigShield</span>
            <span className="text-sm text-[var(--color-text-muted)]">© 2026</span>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">
            AI-Powered Parametric Insurance for India&apos;s Delivery Partners
          </p>
        </div>
      </footer>
    </div>
  );
}
