"use client";
import { useState, useEffect, useRef } from "react";
import { PageType } from "../types";
import {
  Phone,
  Shield,
  CheckCircle2,
  ArrowRight,
  Fingerprint,
  Lock,
  Sparkles,
} from "lucide-react";

interface RegisterPageProps {
  onNavigate: (page: PageType) => void;
}

export default function RegisterPage({ onNavigate }: RegisterPageProps) {
  const [step, setStep] = useState<"phone" | "otp" | "verified">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for OTP
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSendOtp = () => {
    if (phone.length !== 10) return;
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(code);
    setStep("otp");
    setTimer(30);
    // Focus first OTP input
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 digits entered
    if (newOtp.every((d) => d !== "") && newOtp.join("").length === 6) {
      verifyOtp(newOtp.join(""));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = (enteredOtp: string) => {
    setIsVerifying(true);
    setTimeout(() => {
      // Accept any 6-digit OTP for demo
      if (enteredOtp.length === 6) {
        setStep("verified");
        setTimeout(() => onNavigate("onboarding"), 1500);
      }
      setIsVerifying(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background effects */}
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
          <p className="text-sm text-[var(--color-text-muted)]">
            Your earnings have a Floor now.
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8 animate-fade-in">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {["Phone", "Verify", "Done"].map((label, i) => {
              const isActive =
                (i === 0 && step === "phone") ||
                (i === 1 && step === "otp") ||
                (i === 2 && step === "verified");
              const isDone =
                (i === 0 && step !== "phone") ||
                (i === 1 && step === "verified");
              return (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isDone
                        ? "bg-[var(--color-success)] text-white"
                        : isActive
                        ? "gradient-bg text-white"
                        : "bg-[var(--color-surface-lighter)] text-[var(--color-text-muted)]"
                    }`}
                  >
                    {isDone ? <CheckCircle2 size={16} /> : i + 1}
                  </div>
                  <span
                    className={`text-xs hidden sm:inline ${
                      isActive || isDone
                        ? "text-[var(--color-text-primary)]"
                        : "text-[var(--color-text-muted)]"
                    }`}
                  >
                    {label}
                  </span>
                  {i < 2 && (
                    <div
                      className={`w-8 h-0.5 rounded-full ${
                        isDone
                          ? "bg-[var(--color-success)]"
                          : "bg-[var(--color-surface-lighter)]"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* STEP 1: Phone Number */}
          {step === "phone" && (
            <div className="animate-slide-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center">
                  <Phone size={20} className="text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Enter your mobile number</h2>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    We&apos;ll send a 6-digit OTP to verify your identity
                  </p>
                </div>
              </div>

              <div className="relative mb-6">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                  <span className="text-lg">🇮🇳</span>
                  <span className="font-medium">+91</span>
                  <div className="w-px h-5 bg-[var(--color-border)]" />
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full pl-24 pr-4 py-4 rounded-2xl bg-[var(--color-surface-lighter)] border border-[var(--color-border)] text-lg font-medium focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                />
              </div>

              <button
                onClick={handleSendOtp}
                disabled={phone.length !== 10}
                className={`w-full py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 transition-all ${
                  phone.length === 10
                    ? "btn-primary cursor-pointer"
                    : "bg-[var(--color-surface-lighter)] text-[var(--color-text-muted)] cursor-not-allowed"
                }`}
              >
                Send OTP <ArrowRight size={20} />
              </button>

              <div className="mt-6 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                <div className="flex items-start gap-3">
                  <Lock size={16} className="text-indigo-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Your number is encrypted and only used for authentication. We never share your data with third parties.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: OTP Verification */}
          {step === "otp" && (
            <div className="animate-slide-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center">
                  <Fingerprint size={20} className="text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Verify OTP</h2>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Sent to +91 {phone.slice(0, 3)}****{phone.slice(7)}
                  </p>
                </div>
              </div>

              {/* OTP Inputs */}
              <div className="flex gap-3 justify-center mb-6">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className={`w-12 h-14 text-center text-xl font-bold rounded-xl border transition-all focus:outline-none ${
                      digit
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10"
                        : "border-[var(--color-border)] bg-[var(--color-surface-lighter)]"
                    } focus:border-[var(--color-primary)]`}
                  />
                ))}
              </div>

              {isVerifying && (
                <div className="flex items-center justify-center gap-2 mb-4 text-sm text-[var(--color-primary-light)]">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </div>
              )}

              <div className="flex items-center justify-between text-sm mb-6">
                <span className="text-[var(--color-text-muted)]">
                  Didn&apos;t receive?
                </span>
                {timer > 0 ? (
                  <span className="text-[var(--color-text-muted)]">
                    Resend in {timer}s
                  </span>
                ) : (
                  <button
                    onClick={handleSendOtp}
                    className="text-[var(--color-primary-light)] font-medium cursor-pointer bg-transparent border-none hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              {/* Demo hint */}
              <div className="p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
                <p className="text-xs text-yellow-400/80 text-center">
                  💡 Demo Mode: Enter any 6 digits to proceed. Generated OTP: <span className="font-bold">{generatedOtp}</span>
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: Verified */}
          {step === "verified" && (
            <div className="animate-slide-up text-center py-8">
              <div className="w-20 h-20 rounded-full bg-[var(--color-success)]/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-[var(--color-success)]" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Verified!</h2>
              <p className="text-[var(--color-text-secondary)] mb-4">
                Welcome to Floor. Setting up your profile...
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-primary-light)]">
                <Sparkles size={16} />
                Redirecting to onboarding...
              </div>
            </div>
          )}
        </div>

        {/* Bottom text */}
        <p className="text-center text-xs text-[var(--color-text-muted)] mt-6">
          By continuing, you agree to Floor&apos;s Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
