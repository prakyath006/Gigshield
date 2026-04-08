"use client";
import { useState } from "react";
import { PageType } from "../types";
import {
  Mail, Lock, Shield, CheckCircle2, ArrowRight,
  Loader2, AlertCircle, Eye, EyeOff, User, Sparkles,
} from "lucide-react";
import { useApp } from "../context/AppContext";

const API = "http://localhost:5000/api";

interface RegisterPageProps {
  onNavigate: (page: PageType) => void;
}

export default function RegisterPage({ onNavigate }: RegisterPageProps) {
  const { setCurrentWorker } = useApp();
  const [mode, setMode]         = useState<"login" | "signup">("login");
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  function reset() {
    setError(""); setSuccess(""); setPassword(""); setConfirmPw("");
  }

  // ── SUBMIT ──────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSuccess("");

    // Validation
    if (!isValidEmail(email)) { setError("Enter a valid email address"); return; }
    if (password.length < 6)  { setError("Password must be at least 6 characters"); return; }
    if (mode === "signup") {
      if (!name.trim())         { setError("Please enter your full name"); return; }
      if (password !== confirmPw) { setError("Passwords do not match"); return; }
    }

    setLoading(true);
    try {
      const endpoint = mode === "signup" ? "/auth/signup" : "/auth/login";
      const body = mode === "signup"
        ? { name: name.trim(), email, password }
        : { email, password };

      const res  = await fetch(`${API}${endpoint}`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      // Store JWT token
      if (data.token) localStorage.setItem("floor_token", data.token);

      if (data.worker) {
        setCurrentWorker(data.worker);
        setSuccess(data.message || "Welcome!");
        setTimeout(() => onNavigate("dashboard"), 1000);
      } else {
        // New user with no worker profile yet → onboarding
        setSuccess("Account created! Setting up your profile…");
        setTimeout(() => onNavigate("onboarding"), 1000);
      }
    } catch {
      setError("Network error — is the backend running?");
      setLoading(false);
    }
  }

  // ── SANDBOX QUICK FILL ───────────────────────────────────────
  const sandboxAccounts = [
    { name: "Rajesh Kumar", email: "rajesh.k@email.com", platform: "Zomato · Mumbai" },
    { name: "Priya Sharma",  email: "priya.s@email.com",  platform: "Swiggy · Mumbai" },
    { name: "Amit Patel",    email: "amit.p@email.com",   platform: "Zepto · Delhi"   },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-cyan-900/20 pointer-events-none" />
      <div className="fixed top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: "3s" }} />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center">
              <Shield size={24} className="text-white" />
            </div>
            <span className="text-3xl font-black gradient-text">Floor</span>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">Your earnings have a Floor now.</p>
        </div>

        <div className="glass rounded-3xl p-8 animate-fade-in">
          {/* Login / Signup toggle */}
          <div className="flex rounded-2xl bg-[var(--color-surface-light)] p-1 mb-8">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); reset(); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer border-none ${
                  mode === m
                    ? "gradient-bg text-white shadow-lg"
                    : "bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                {m === "login" ? "Log In" : "Sign Up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name — only on signup */}
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-medium mb-1.5 text-[var(--color-text-secondary)]">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <input
                    type="text"
                    placeholder="Rajesh Kumar"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(""); }}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--color-surface-light)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition-all text-sm"
                    autoFocus
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-medium mb-1.5 text-[var(--color-text-secondary)]">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--color-surface-light)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition-all text-sm"
                  autoFocus={mode === "login"}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium mb-1.5 text-[var(--color-text-secondary)]">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  type={showPw ? "text" : "password"}
                  placeholder={mode === "signup" ? "Min 6 characters" : "Your password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[var(--color-surface-light)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] border-none bg-transparent cursor-pointer hover:text-[var(--color-text-primary)] transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password — signup only */}
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-medium mb-1.5 text-[var(--color-text-secondary)]">Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="Repeat password"
                    value={confirmPw}
                    onChange={(e) => { setConfirmPw(e.target.value); setError(""); }}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--color-surface-light)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition-all text-sm"
                  />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 px-4 py-2.5 rounded-xl">
                <AlertCircle size={14} className="shrink-0" /> {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 px-4 py-2.5 rounded-xl">
                <CheckCircle2 size={14} className="shrink-0" /> {success}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || !!success}
              className="w-full py-3.5 rounded-xl font-bold btn-primary flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> {mode === "signup" ? "Creating Account…" : "Logging In…"}</>
              ) : success ? (
                <><CheckCircle2 size={18} /> Done!</>
              ) : mode === "signup" ? (
                <><Sparkles size={18} /> Create Account <ArrowRight size={16} /></>
              ) : (
                <><ArrowRight size={18} /> Log In <ArrowRight size={16} /></>
              )}
            </button>

            {/* Toggle hint */}
            <p className="text-center text-xs text-[var(--color-text-muted)] pt-1">
              {mode === "login" ? (
                <>Don't have an account?{" "}
                  <button type="button" onClick={() => { setMode("signup"); reset(); }} className="text-[var(--color-primary-light)] font-semibold hover:underline bg-transparent border-none cursor-pointer">
                    Sign Up
                  </button>
                </>
              ) : (
                <>Already have an account?{" "}
                  <button type="button" onClick={() => { setMode("login"); reset(); }} className="text-[var(--color-primary-light)] font-semibold hover:underline bg-transparent border-none cursor-pointer">
                    Log In
                  </button>
                </>
              )}
            </p>
          </form>

          {/* Sandbox quick fill */}
          <div className="mt-6 pt-5 border-t border-[var(--color-border)]">
            <p className="text-xs text-[var(--color-text-muted)] text-center mb-3">⚡ Demo Sandbox — click to auto-fill</p>
            <div className="space-y-1.5">
              {sandboxAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => {
                    setEmail(acc.email);
                    setPassword("floor123");
                    setName(acc.name);
                    setError("");
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-[var(--color-surface-light)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all cursor-pointer text-left"
                >
                  <div>
                    <div className="text-sm font-semibold">{acc.name}</div>
                    <div className="text-xs text-[var(--color-text-muted)]">{acc.platform}</div>
                  </div>
                  <span className="text-xs text-[var(--color-text-muted)] font-mono">floor123</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
