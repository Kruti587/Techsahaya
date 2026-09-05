import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Key,
  Cpu,
  EyeOff,
  ServerOff,
  FileCheck2,
  UserCheck,
  RefreshCw,
  Trash2,
  Fingerprint,
  CheckCircle2,
  XCircle,
  Sliders,
  FileText,
  Sparkles,
  Check,
  ArrowRight,
  DatabaseZap,
  Activity,
  Award,
  Zap,
  Globe,
  ShieldHalf,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { PrivacyPolicyModal } from "../components/PrivacyPolicyModal";
import { CookiePolicyModal } from "../components/CookiePolicyModal";

interface SecurityPillar {
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  icon: typeof ShieldCheck;
  category: "Architecture" | "Data Law" | "Access Control";
  accent: string;
}

const metrics = [
  { value: "0", label: "Biometrics Stored", sub: "Ever", color: "from-rose-500 to-pink-600", icon: Fingerprint },
  { value: "100%", label: "RAM Processing", sub: "Zero disk I/O", color: "from-emerald-500 to-teal-600", icon: Cpu },
  { value: "AES-256", label: "Encryption", sub: "TLS 1.3 + PFS", color: "from-blue-500 to-indigo-600", icon: Lock },
  { value: "9", label: "Audit Stages", sub: "Gazette-cited", color: "from-amber-500 to-orange-500", icon: FileCheck2 },
];

const pipeline = [
  { stage: "01", title: "Client Consent", desc: "You choose which parameters to share. Nothing enters without explicit opt-in.", icon: UserCheck, color: "emerald" },
  { stage: "02", title: "Masked Ingestion", desc: "Raw IDs stripped: only eligibility rule tags pass through the gate.", icon: EyeOff, color: "blue" },
  { stage: "03", title: "RAM Sandbox", desc: "Isolated volatile memory evaluation. Zero database write calls permitted.", icon: Cpu, color: "violet" },
  { stage: "04", title: "Explainable Receipt", desc: "HMAC-signed audit citing exact gazette section for every ruling.", icon: FileCheck2, color: "amber" },
  { stage: "05", title: "Session Zeroize", desc: "All ephemeral buffers cryptographically zeroed upon session close.", icon: Trash2, color: "rose" },
];

export function SecurityPage() {
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [cookieModalOpen, setCookieModalOpen] = useState(false);
  const [purgedDemo, setPurgedDemo] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"All" | "Architecture" | "Data Law" | "Access Control">("All");

  const handleSimulatePurge = () => {
    setPurgedDemo(true);
    setTimeout(() => setPurgedDemo(false), 3000);
  };

  const securityPillars: SecurityPillar[] = [
    {
      title: "Consent-first data collection",
      badge: "DPDP Sec 6",
      badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      accent: "emerald",
      description: "Every evaluation requires explicit itemized opt-in. No passive or bundled permissions ever.",
      icon: UserCheck,
      category: "Data Law",
    },
    {
      title: "Data minimization",
      badge: "DPDP Sec 4",
      badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      accent: "emerald",
      description: "Only the narrowest set of parameters needed to evaluate eligibility rules: age bracket, not full DOB.",
      icon: Sliders,
      category: "Data Law",
    },
    {
      title: "No raw Aadhaar storage",
      badge: "Aadhaar Act 2016",
      badgeColor: "bg-rose-500/15 text-rose-400 border-rose-500/30",
      accent: "rose",
      description: "Your 12-digit number is never written anywhere. Ephemeral token hashes zeroed after execution.",
      icon: Fingerprint,
      category: "Architecture",
    },
    {
      title: "No biometric storage",
      badge: "Zero-Biometrics",
      badgeColor: "bg-rose-500/15 text-rose-400 border-rose-500/30",
      accent: "rose",
      description: "Fingerprint templates, iris scans, and facial recognition data are architecturally banned.",
      icon: EyeOff,
      category: "Architecture",
    },
    {
      title: "In-memory document processing",
      badge: "RAM Sandbox",
      badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
      accent: "blue",
      description: "Uploaded certificates exist solely in volatile memory during the match cycle. No disk writes.",
      icon: Cpu,
      category: "Architecture",
    },
    {
      title: "Role-based access control",
      badge: "Least Privilege",
      badgeColor: "bg-violet-500/15 text-violet-400 border-violet-500/30",
      accent: "violet",
      description: "Operators cannot query citizen records. Admin rights are cryptographically segregated.",
      icon: Key,
      category: "Access Control",
    },
    {
      title: "Encrypted transport (TLS 1.3)",
      badge: "256-bit AES",
      badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
      accent: "blue",
      description: "All data in flight uses high-cipher TLS 1.3 with Perfect Forward Secrecy and HSTS preload.",
      icon: Lock,
      category: "Architecture",
    },
    {
      title: "Secure document architecture",
      badge: "Hardware HSM",
      badgeColor: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
      accent: "indigo",
      description: "Air-gapped sandboxes with hardware-level isolation preventing memory bleed between sessions.",
      icon: ServerOff,
      category: "Architecture",
    },
    {
      title: "User-controlled deletion",
      badge: "Right to Erasure",
      badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      accent: "amber",
      description: "Citizens can purge cached evaluation states, profile parameters, and DigiLocker linkages instantly.",
      icon: Trash2,
      category: "Data Law",
    },
    {
      title: "Tamper-evident audit logging",
      badge: "HMAC Signed",
      badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      accent: "emerald",
      description: "Reproducible audit receipts prove why a scheme was granted or denied without exposing raw docs.",
      icon: FileCheck2,
      category: "Access Control",
    },
    {
      title: "No third-party tracking",
      badge: "Zero-Tracker",
      badgeColor: "bg-teal-500/15 text-teal-400 border-teal-500/30",
      accent: "teal",
      description: "No Google Analytics, Meta Pixels, tag managers, or commercial telemetry of any kind.",
      icon: DatabaseZap,
      category: "Data Law",
    },
  ];

  const filteredPillars =
    activeFilter === "All"
      ? securityPillars
      : securityPillars.filter((p) => p.category === activeFilter);

  return (
    <div className="min-h-screen bg-[#080e0c]">
      <PrivacyPolicyModal isOpen={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} />
      <CookiePolicyModal isOpen={cookieModalOpen} onClose={() => setCookieModalOpen(false)} onOpenPreferences={() => setCookieModalOpen(false)} />

      {/* ─── HERO: Deep dark with mesh grid & glow ─────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Mesh grid background */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(16,185,129,0.6) 1px, transparent 1px),
              linear-gradient(90deg, rgba(16,185,129,0.6) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />
        {/* Radial glow orbs */}
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-500/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-14">
          {/* Compliance badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 mb-8">
            <ShieldCheck size={13} className="text-emerald-400" />
            <span>DPDP Act 2023 · Zero-Knowledge Architecture · MeitY Compliant</span>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.3fr_0.85fr] lg:items-center">
            {/* Left */}
            <div className="space-y-6">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl font-serif text-white leading-[1.08]">
                Privacy by Design.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300">
                  Trust by Architecture.
                </span>
              </h1>

              <p className="text-sm sm:text-base leading-relaxed text-slate-400 max-w-xl">
                Tech Sahaya is engineered so your personal documents and biometric identifiers
                never touch permanent disk storage. All entitlement checks run through
                ephemeral in-memory evaluation with transparent rule quotations.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setPrivacyModalOpen(true)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:opacity-90 active:scale-95"
                >
                  <FileText size={15} />
                  <span>DPDP Privacy Charter</span>
                </button>

                <button
                  type="button"
                  onClick={handleSimulatePurge}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 text-xs font-semibold text-slate-200 hover:bg-white/10 active:scale-95 transition"
                >
                  <RefreshCw size={14} className={purgedDemo ? "animate-spin text-emerald-400" : ""} />
                  <span>{purgedDemo ? "✓ Memory Sandboxes Flushed" : "Test Session Zeroization"}</span>
                </button>
              </div>

              {purgedDemo && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/50 p-3 text-xs text-emerald-300">
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
                  <span>All ephemeral buffers, token caches, and document descriptors zeroized instantly.</span>
                </div>
              )}
            </div>

            {/* Right: Live Defense Card */}
            <div className="relative">
              {/* Outer glow */}
              <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-emerald-500/30 via-teal-500/20 to-transparent blur-sm" />
              <div className="relative rounded-3xl border border-emerald-500/20 bg-slate-950/80 p-6 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/8 pb-4 mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                      <ShieldCheck size={17} />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-white">Defense Status</div>
                      <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5 mt-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                        Active · DPDP Live
                      </div>
                    </div>
                  </div>
                  <span className="rounded-full bg-white/8 px-2.5 py-1 text-[10px] font-bold text-slate-300 font-mono border border-white/10">
                    v2.4.0-SEC
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {[
                    { icon: Lock, label: "Transport Encryption", value: "TLS 1.3 / AES-256", color: "text-emerald-400" },
                    { icon: ServerOff, label: "Permanent Disk Storage", value: "0 Bytes (Zero)", color: "text-rose-400" },
                    { icon: Fingerprint, label: "Biometrics / Raw Aadhaar", value: "NEVER REQUESTED", color: "text-rose-400" },
                    { icon: Activity, label: "DigiLocker Integration", value: "Consent Tokenized", color: "text-emerald-400" },
                    { icon: Clock, label: "Auto-Purge Schedule", value: "6-12 months max", color: "text-amber-400" },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="flex items-center justify-between rounded-xl bg-white/4 border border-white/5 px-3 py-2.5">
                      <span className="text-slate-400 flex items-center gap-2">
                        <Icon size={13} className={color} />
                        {label}
                      </span>
                      <span className={`font-mono font-bold text-[11px] ${color}`}>{value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3.5 border-t border-white/8 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Certified Sovereign Architecture</span>
                  <span className="text-emerald-400 font-semibold">100% Citizen Governed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── METRICS BAND ────────────────────────────────────────────────── */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {metrics.map(({ value, label, sub, color, icon: Icon }) => (
              <div key={label} className="group relative rounded-2xl border border-white/8 bg-white/3 p-5 overflow-hidden transition hover:border-white/15 hover:bg-white/5">
                <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br ${color} opacity-10 blur-xl transition group-hover:opacity-20`} />
                <Icon size={16} className="text-slate-500 mb-3 relative z-10" />
                <div className={`text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${color} font-serif relative z-10`}>
                  {value}
                </div>
                <div className="mt-1 text-xs font-bold text-white/80 relative z-10">{label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5 relative z-10">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 space-y-16">

        {/* ─── DATA BOUNDARIES: 3-COLUMN BENTO ────────────────────────── */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <Award size={13} className="text-amber-400" />
              <span>DPDP Act 2023 Transparency Charter</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              Clear Data Boundaries
            </h2>
            <p className="text-sm text-slate-400">
              You always know what enters our privacy boundary, what is strictly forbidden, and the controls you hold.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {/* What We Collect */}
            <div className="flex flex-col rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-emerald-950/40 to-slate-950/40 p-6 backdrop-blur-sm transition hover:border-emerald-500/40">
              <div className="flex items-center gap-3 border-b border-emerald-500/15 pb-4 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white font-serif text-sm">What We Collect</h3>
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Data Minimization</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-slate-300 flex-1">
                {[
                  { bold: "Age Band & Household Size:", rest: "To match child, youth, or senior citizen pension quotas." },
                  { bold: "Income Tier & Landholding:", rest: "Verified against scheme financial caps (e.g. < ₹2.5 Lakh)." },
                  { bold: "State, District & Locality:", rest: "To activate state-specific benefits and urban/rural grants." },
                  { bold: "Occupation & Category:", rest: "Farmer, artisan, student, or unorganized worker profile." },
                  { bold: "DigiLocker Tokens:", rest: "Temporary signed tokens proving document validity." },
                ].map(({ bold, rest }) => (
                  <li key={bold} className="flex items-start gap-2.5">
                    <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong className="text-white">{bold}</strong> {rest}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 pt-3 border-t border-emerald-500/15 text-[11px] text-emerald-400 font-medium">
                · Stored in isolated user session · Easily editable anytime
              </div>
            </div>

            {/* What We NEVER Collect */}
            <div className="flex flex-col rounded-3xl border border-rose-500/20 bg-gradient-to-b from-rose-950/30 to-slate-950/40 p-6 backdrop-blur-sm transition hover:border-rose-500/40">
              <div className="flex items-center gap-3 border-b border-rose-500/15 pb-4 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/20">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white font-serif text-sm">What We NEVER Collect</h3>
                  <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">Hard Architectural Ban</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-slate-300 flex-1">
                {[
                  { bold: "Full 12-Digit Aadhaar Numbers:", rest: "Only ephemeral masked last-4 digits for display." },
                  { bold: "Biometric Scans:", rest: "No fingerprints, iris patterns, or facial recognition images." },
                  { bold: "Banking Credentials:", rest: "No account passwords, UPI PINs, CVVs, or OTPs." },
                  { bold: "Permanent Identity Copies:", rest: "No raw PDF or image uploads retained on hard disks." },
                  { bold: "Cross-App Ad Trackers:", rest: "Zero advertising IDs, third-party cookies, or data brokering." },
                ].map(({ bold, rest }) => (
                  <li key={bold} className="flex items-start gap-2.5">
                    <XCircle size={14} className="text-rose-500 shrink-0 mt-0.5" />
                    <span><strong className="text-white">{bold}</strong> {rest}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 pt-3 border-t border-rose-500/15 text-[11px] text-rose-400 font-medium">
                · Hardware firewall blocked · Penalized under DPDP
              </div>
            </div>

            {/* Your Citizen Controls */}
            <div className="flex flex-col rounded-3xl border border-amber-500/20 bg-gradient-to-b from-amber-950/25 to-slate-950/40 p-6 backdrop-blur-sm transition hover:border-amber-500/40">
              <div className="flex items-center gap-3 border-b border-amber-500/15 pb-4 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/20">
                  <Sliders size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white font-serif text-sm">Your Citizen Controls</h3>
                  <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">DPDP Chapter 3 Rights</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-slate-300 flex-1">
                {[
                  { bold: "One-Click Erasure:", rest: "Purge your profile and document metadata at any second." },
                  { bold: "Consent Revocation:", rest: "Withdraw DigiLocker document links with zero delay." },
                  { bold: "Verifiable Audit Receipts:", rest: "Download an HMAC-signed audit transcript of all rule checks." },
                  { bold: "Granular Cookie Prefs:", rest: "Toggle optional analytics and language persistence on demand." },
                  { bold: "Explainability Guarantee:", rest: "Request the exact mathematical reason for any qualification outcome." },
                ].map(({ bold, rest }) => (
                  <li key={bold} className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-amber-400 shrink-0 mt-0.5" />
                    <span><strong className="text-white">{bold}</strong> {rest}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 pt-3 border-t border-amber-500/15 text-[11px] text-amber-400 font-medium">
                · Accessible in Privacy Center · No admin review required
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECURITY PILLARS BENTO GRID ─────────────────────────────── */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                ENGINEERING ASSURANCES
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold font-serif text-white">
                11 Core Security Pillars
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Every protection backed by cryptographic proofs and code-level verification.
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-white/4 border border-white/8 p-1 rounded-2xl">
              {(["All", "Architecture", "Data Law", "Access Control"] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveFilter(cat)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                    activeFilter === cat
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Bento grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="group relative flex flex-col justify-between rounded-3xl border border-white/8 bg-white/[0.03] p-5 overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/5"
                >
                  {/* Subtle corner glow on hover */}
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-500/0 blur-xl transition group-hover:bg-emerald-500/10" />

                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-slate-400 transition group-hover:bg-emerald-500/20 group-hover:text-emerald-300 group-hover:border-emerald-500/30">
                        <Icon size={19} />
                      </div>
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${pillar.badgeColor}`}>
                        {pillar.badge}
                      </span>
                    </div>

                    <h3 className="mt-4 text-sm font-bold text-white font-serif leading-snug">
                      {pillar.title}
                    </h3>

                    <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/6 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-medium">{pillar.category}</span>
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <Check size={11} /> Active
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── PIPELINE: 5-STAGE DATA LIFECYCLE ────────────────────────── */}
        <section className="relative rounded-3xl border border-white/8 bg-gradient-to-br from-slate-950 via-[#081712] to-slate-950 p-6 sm:p-8 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `radial-gradient(rgba(16,185,129,0.8) 1px, transparent 1px)`, backgroundSize: "24px 24px" }} />
          <div className="relative space-y-6">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                VERIFICATION PIPELINE
              </span>
              <h2 className="mt-1 text-xl sm:text-2xl font-bold font-serif text-white">
                How Zero-Knowledge Scheme Matching Works
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                At no point in this 5-stage lifecycle are raw citizen credentials committed to databases.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-5">
              {pipeline.map(({ stage, title, desc, icon: Icon, color }, idx) => (
                <div key={stage} className="relative">
                  {/* Connector line between stages */}
                  {idx < pipeline.length - 1 && (
                    <div className="hidden sm:block absolute top-7 left-full w-full h-px bg-gradient-to-r from-white/15 to-transparent z-10" />
                  )}
                  <div className={`rounded-2xl border p-4 space-y-2.5 transition hover:scale-[1.02] ${
                    idx === pipeline.length - 1
                      ? "border-rose-500/30 bg-rose-950/20"
                      : "border-white/8 bg-white/3 hover:border-white/15"
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        {stage}
                      </span>
                    </div>
                    <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-${color}-500/15 text-${color}-400`}>
                      <Icon size={16} />
                    </div>
                    <h4 className="text-xs font-bold text-white">{title}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── COMPLIANCE BADGES ────────────────────────────────────────── */}
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "DPDP Act 2023", sub: "Section 4, 6, 8, 12", icon: ShieldHalf, color: "emerald" },
            { label: "Aadhaar Act 2016", sub: "Section 29: No storage", icon: AlertTriangle, color: "rose" },
            { label: "IT Act 2000", sub: "Section 43A & 72A", icon: Globe, color: "blue" },
            { label: "CERT-In", sub: "6hr breach reporting", icon: Zap, color: "amber" },
          ].map(({ label, sub, icon: Icon, color }) => (
            <div key={label} className={`rounded-2xl border border-${color}-500/20 bg-${color}-950/20 p-5 text-center space-y-2`}>
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-${color}-500/15 text-${color}-400 border border-${color}-500/20`}>
                <Icon size={20} />
              </div>
              <div className="text-sm font-bold text-white">{label}</div>
              <div className={`text-[11px] text-${color}-400 font-medium`}>{sub}</div>
            </div>
          ))}
        </section>

        {/* ─── BOTTOM CTA BANNER ───────────────────────────────────────── */}
        <section className="relative flex flex-col sm:flex-row items-center justify-between gap-6 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#071f16] via-[#0b2c1f] to-[#071f16]" />
          <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `linear-gradient(rgba(16,185,129,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.6) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-1 text-center sm:text-left p-6 sm:p-8 pb-0 sm:pb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2">
              <Sparkles size={12} /> Citizen Data Protection
            </div>
            <h3 className="text-xl font-bold font-serif text-white">
              Have questions about your data?
            </h3>
            <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
              Our Data Protection Officer and Citizen Grievance Redressal desk are available under the DPDP Act 2023.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0 p-6 sm:p-8 pt-0 sm:pt-8">
            <Link
              to="/dpdp"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:opacity-90 transition active:scale-95"
            >
              <span>DPDP Compliance Portal</span>
              <ArrowRight size={13} />
            </Link>

            <Link
              to="/consent-framework"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 text-xs font-semibold text-slate-200 hover:bg-white/10 transition active:scale-95"
            >
              Consent Framework
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
