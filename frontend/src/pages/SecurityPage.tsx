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
import { useAppContext } from "../context/AppContext";
import { getSecurityContent } from "../utils/securityTranslations";

interface SecurityPillar {
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  icon: typeof ShieldCheck;
  category: "Architecture" | "Data Law" | "Access Control";
  accent: string;
}

export function SecurityPage() {
  const { language } = useAppContext();
  const tSec = getSecurityContent(language);

  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [cookieModalOpen, setCookieModalOpen] = useState(false);
  const [purgedDemo, setPurgedDemo] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"All" | "Architecture" | "Data Law" | "Access Control">("All");

  const handleSimulatePurge = () => {
    setPurgedDemo(true);
    setTimeout(() => setPurgedDemo(false), 3000);
  };

  const metrics = [
    { value: tSec.m1Val, label: tSec.m1Label, sub: tSec.m1Sub, color: "from-rose-600 to-pink-600", icon: Fingerprint },
    { value: tSec.m2Val, label: tSec.m2Label, sub: tSec.m2Sub, color: "from-emerald-700 to-teal-700", icon: Cpu },
    { value: tSec.m3Val, label: tSec.m3Label, sub: tSec.m3Sub, color: "from-blue-700 to-indigo-700", icon: Lock },
    { value: tSec.m4Val, label: tSec.m4Label, sub: tSec.m4Sub, color: "from-amber-600 to-orange-600", icon: FileCheck2 },
  ];

  const pipeline = [
    { stage: "01", title: "Client Consent", desc: "You choose which parameters to share. Nothing enters without explicit opt-in.", icon: UserCheck, color: "emerald" },
    { stage: "02", title: "Masked Ingestion", desc: "Raw IDs stripped: only eligibility rule tags pass through the gate.", icon: EyeOff, color: "blue" },
    { stage: "03", title: "RAM Sandbox", desc: "Isolated volatile memory evaluation. Zero database write calls permitted.", icon: Cpu, color: "violet" },
    { stage: "04", title: "Explainable Receipt", desc: "HMAC-signed audit citing exact gazette section for every ruling.", icon: FileCheck2, color: "amber" },
    { stage: "05", title: "Session Zeroize", desc: "All ephemeral buffers cryptographically zeroed upon session close.", icon: Trash2, color: "rose" },
  ];

  const securityPillars: SecurityPillar[] = [
    {
      title: "Consent-first data collection",
      badge: "DPDP Sec 6",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      accent: "emerald",
      description: "Every evaluation requires explicit itemized opt-in. No passive or bundled permissions ever.",
      icon: UserCheck,
      category: "Data Law",
    },
    {
      title: "Data minimization",
      badge: "DPDP Sec 4",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      accent: "emerald",
      description: "Only the narrowest set of parameters needed to evaluate eligibility rules: age bracket, not full DOB.",
      icon: Sliders,
      category: "Data Law",
    },
    {
      title: "No raw Aadhaar storage",
      badge: "Aadhaar Act 2016",
      badgeColor: "bg-rose-50 text-rose-800 border-rose-200",
      accent: "rose",
      description: "Your 12-digit number is never written anywhere. Ephemeral token hashes zeroed after execution.",
      icon: Fingerprint,
      category: "Architecture",
    },
    {
      title: "No biometric storage",
      badge: "Zero-Biometrics",
      badgeColor: "bg-rose-50 text-rose-800 border-rose-200",
      accent: "rose",
      description: "Fingerprint templates, iris scans, and facial recognition data are architecturally banned.",
      icon: EyeOff,
      category: "Architecture",
    },
    {
      title: "In-memory document processing",
      badge: "RAM Sandbox",
      badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
      accent: "blue",
      description: "Uploaded certificates exist solely in volatile memory during the match cycle. No disk writes.",
      icon: Cpu,
      category: "Architecture",
    },
    {
      title: "Role-based access control",
      badge: "Least Privilege",
      badgeColor: "bg-violet-50 text-violet-800 border-violet-200",
      accent: "violet",
      description: "Operators cannot query citizen records. Admin rights are cryptographically segregated.",
      icon: Key,
      category: "Access Control",
    },
    {
      title: "Encrypted transport (TLS 1.3)",
      badge: "256-bit AES",
      badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
      accent: "blue",
      description: "All data in flight uses high-cipher TLS 1.3 with Perfect Forward Secrecy and HSTS preload.",
      icon: Lock,
      category: "Architecture",
    },
    {
      title: "Secure document architecture",
      badge: "Hardware HSM",
      badgeColor: "bg-indigo-50 text-indigo-800 border-indigo-200",
      accent: "indigo",
      description: "Air-gapped sandboxes with hardware-level isolation preventing memory bleed between sessions.",
      icon: ServerOff,
      category: "Architecture",
    },
    {
      title: "User-controlled deletion",
      badge: "Right to Erasure",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      accent: "amber",
      description: "Citizens can purge cached evaluation states, profile parameters, and DigiLocker linkages instantly.",
      icon: Trash2,
      category: "Data Law",
    },
    {
      title: "Tamper-evident audit logging",
      badge: "HMAC Signed",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      accent: "emerald",
      description: "Reproducible audit receipts prove why a scheme was granted or denied without exposing raw docs.",
      icon: FileCheck2,
      category: "Access Control",
    },
    {
      title: "No third-party tracking",
      badge: "Zero-Tracker",
      badgeColor: "bg-teal-50 text-teal-800 border-teal-200",
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
    <div className="min-h-screen bg-[#fcfbf9] text-sahaya-ink">
      <PrivacyPolicyModal isOpen={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} />
      <CookiePolicyModal isOpen={cookieModalOpen} onClose={() => setCookieModalOpen(false)} onOpenPreferences={() => setCookieModalOpen(false)} />

      {/* ─── HERO: Clean Light Mode matching tech sahaya ─── */}
      <section className="relative overflow-hidden border-b border-stone-200 bg-white">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-12 sm:pb-14">
          {/* Compliance badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-800/20 bg-emerald-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-6">
            <ShieldCheck size={14} className="text-emerald-700 shrink-0" />
            <span>{tSec.heroBadge}</span>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.25fr_0.85fr] lg:items-center">
            {/* Left Column */}
            <div className="space-y-5">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl font-serif text-slate-900 leading-[1.12]">
                {tSec.heroTitle1}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900">
                  {tSec.heroTitle2}
                </span>
              </h1>

              <p className="text-sm sm:text-base leading-relaxed text-slate-600 max-w-xl">
                {tSec.heroDesc}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPrivacyModalOpen(true)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0f3d2e] px-5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-900 active:scale-95"
                >
                  <FileText size={15} />
                  <span>{tSec.dpdpCharterBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSimulatePurge}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-stone-50 active:scale-95 transition"
                >
                  <RefreshCw size={14} className={purgedDemo ? "animate-spin text-emerald-600" : ""} />
                  <span>{purgedDemo ? tSec.zeroizeSuccess : tSec.testZeroizeBtn}</span>
                </button>
              </div>

              {purgedDemo && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 animate-fade-in">
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-700" />
                  <span>{tSec.zeroizeDetail}</span>
                </div>
              )}
            </div>

            {/* Right: Live Defense Card in Clean Light Mode */}
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-900">{tSec.defenseStatus}</div>
                    <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1.5 mt-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse inline-block" />
                      {tSec.defenseActive}
                    </div>
                  </div>
                </div>
                <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-bold text-slate-700 font-mono border border-stone-200">
                  v2.4.0-SEC
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  { icon: Lock, label: tSec.defenseTransport, value: "TLS 1.3 / AES-256", color: "text-emerald-700" },
                  { icon: ServerOff, label: tSec.defenseDisk, value: tSec.defenseDiskVal, color: "text-rose-600" },
                  { icon: Fingerprint, label: tSec.defenseBiometrics, value: tSec.defenseBiometricsVal, color: "text-rose-600" },
                  { icon: Activity, label: tSec.defenseDigilocker, value: tSec.defenseDigilockerVal, color: "text-emerald-700" },
                  { icon: Clock, label: tSec.defensePurge, value: tSec.defensePurgeVal, color: "text-amber-700" },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="flex items-center justify-between rounded-xl bg-stone-50 border border-stone-200/70 px-3 py-2.5">
                    <span className="text-slate-600 flex items-center gap-2 text-xs">
                      <Icon size={14} className={color} />
                      {label}
                    </span>
                    <span className={`font-mono font-bold text-[11px] ${color}`}>{value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>{tSec.defenseCert}</span>
                <span className="text-emerald-800 font-bold">{tSec.defenseCitizen}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── METRICS BAND ─── */}
      <section className="border-b border-stone-200 bg-stone-100/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {metrics.map(({ value, label, sub, color, icon: Icon }) => (
              <div key={label} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-emerald-300">
                <Icon size={18} className="text-slate-500 mb-3" />
                <div className={`text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${color} font-serif`}>
                  {value}
                </div>
                <div className="mt-1 text-xs font-bold text-slate-900">{label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">

        {/* ─── DATA BOUNDARIES: 3-COLUMN BENTO ─── */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <Award size={13} className="text-sahaya-saffron" />
              <span>{tSec.boundariesBadge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
              {tSec.boundariesTitle}
            </h2>
            <p className="text-sm text-slate-600">
              {tSec.boundariesDesc}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {/* What We Collect */}
            <div className="flex flex-col rounded-3xl border border-emerald-200 bg-emerald-50/40 p-6 shadow-sm transition hover:border-emerald-400">
              <div className="flex items-center gap-3 border-b border-emerald-200/80 pb-4 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 font-serif text-sm">{tSec.collectTitle}</h3>
                  <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">{tSec.collectSub}</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-slate-700 flex-1">
                {[
                  { bold: "Age Band & Household Size:", rest: "To match child, youth, or senior citizen pension quotas." },
                  { bold: "Income Tier & Landholding:", rest: "Verified against scheme financial caps (e.g. < ₹2.5 Lakh)." },
                  { bold: "State, District & Locality:", rest: "To activate state-specific benefits and urban/rural grants." },
                  { bold: "Occupation & Category:", rest: "Farmer, artisan, student, or unorganized worker profile." },
                  { bold: "DigiLocker Tokens:", rest: "Temporary signed tokens proving document validity." },
                ].map(({ bold, rest }) => (
                  <li key={bold} className="flex items-start gap-2.5">
                    <Check size={14} className="text-emerald-700 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">{bold}</strong> {rest}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 pt-3 border-t border-emerald-200 text-[11px] text-emerald-800 font-medium">
                {tSec.collectFoot}
              </div>
            </div>

            {/* What We NEVER Collect */}
            <div className="flex flex-col rounded-3xl border border-rose-200 bg-rose-50/40 p-6 shadow-sm transition hover:border-rose-400">
              <div className="flex items-center gap-3 border-b border-rose-200/80 pb-4 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-700 border border-rose-200">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 font-serif text-sm">{tSec.neverTitle}</h3>
                  <span className="text-[11px] font-semibold text-rose-800 uppercase tracking-wider">{tSec.neverSub}</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-slate-700 flex-1">
                {[
                  { bold: "Full 12-Digit Aadhaar Numbers:", rest: "Only ephemeral masked last-4 digits for display." },
                  { bold: "Biometric Scans:", rest: "No fingerprints, iris patterns, or facial recognition images." },
                  { bold: "Banking Credentials:", rest: "No account passwords, UPI PINs, CVVs, or OTPs." },
                  { bold: "Permanent Identity Copies:", rest: "No raw PDF or image uploads retained on hard disks." },
                  { bold: "Cross-App Ad Trackers:", rest: "Zero advertising IDs, third-party cookies, or data brokering." },
                ].map(({ bold, rest }) => (
                  <li key={bold} className="flex items-start gap-2.5">
                    <XCircle size={14} className="text-rose-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">{bold}</strong> {rest}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 pt-3 border-t border-rose-200 text-[11px] text-rose-800 font-medium">
                {tSec.neverFoot}
              </div>
            </div>

            {/* Your Citizen Controls */}
            <div className="flex flex-col rounded-3xl border border-amber-200 bg-amber-50/40 p-6 shadow-sm transition hover:border-amber-400">
              <div className="flex items-center gap-3 border-b border-amber-200/80 pb-4 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 border border-amber-200">
                  <Sliders size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 font-serif text-sm">{tSec.controlTitle}</h3>
                  <span className="text-[11px] font-semibold text-amber-900 uppercase tracking-wider">{tSec.controlSub}</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-slate-700 flex-1">
                {[
                  { bold: "One-Click Erasure:", rest: "Purge your profile and document metadata at any second." },
                  { bold: "Consent Revocation:", rest: "Withdraw DigiLocker document links with zero delay." },
                  { bold: "Verifiable Audit Receipts:", rest: "Download an HMAC-signed audit transcript of all rule checks." },
                  { bold: "Granular Cookie Prefs:", rest: "Toggle optional analytics and language persistence on demand." },
                  { bold: "Explainability Guarantee:", rest: "Request the exact mathematical reason for any qualification outcome." },
                ].map(({ bold, rest }) => (
                  <li key={bold} className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-amber-700 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">{bold}</strong> {rest}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 pt-3 border-t border-amber-200 text-[11px] text-amber-900 font-medium">
                {tSec.controlFoot}
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECURITY PILLARS BENTO GRID ─── */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-sahaya-saffron">
                {tSec.pillarsTag}
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold font-serif text-slate-900">
                {tSec.pillarsTitle}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {tSec.pillarsDesc}
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-stone-100 border border-stone-200 p-1 rounded-2xl">
              {(["All", "Architecture", "Data Law", "Access Control"] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveFilter(cat)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                    activeFilter === cat
                      ? "bg-[#0f3d2e] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {cat === "All" ? tSec.catAll : cat === "Architecture" ? tSec.catArch : cat === "Data Law" ? tSec.catLaw : tSec.catAccess}
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
                  className="flex flex-col justify-between rounded-3xl border border-stone-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100">
                        <Icon size={19} />
                      </div>
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${pillar.badgeColor}`}>
                        {pillar.badge}
                      </span>
                    </div>

                    <h3 className="mt-4 text-sm font-bold text-slate-900 font-serif leading-snug">
                      {pillar.title}
                    </h3>

                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-medium">{pillar.category}</span>
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <Check size={11} /> Active
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── PIPELINE: 5-STAGE DATA LIFECYCLE ─── */}
        <section className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
              {tSec.pipelineTag}
            </span>
            <h2 className="mt-1 text-xl sm:text-2xl font-bold font-serif text-slate-900">
              {tSec.pipelineTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {tSec.pipelineDesc}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-5">
            {pipeline.map(({ stage, title, desc, icon: Icon, color }, idx) => (
              <div key={stage} className="relative">
                {idx < pipeline.length - 1 && (
                  <div className="hidden sm:block absolute top-7 left-full w-full h-px bg-stone-200 z-10" />
                )}
                <div className={`rounded-2xl border p-4 space-y-2.5 transition hover:shadow-sm ${
                  idx === pipeline.length - 1
                    ? "border-rose-200 bg-rose-50/30"
                    : "border-stone-200 bg-stone-50 hover:border-emerald-200"
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {stage}
                    </span>
                  </div>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-stone-200 text-${color}-700`}>
                    <Icon size={16} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{title}</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── COMPLIANCE BADGES ─── */}
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "DPDP Act 2023", sub: "Section 4, 6, 8, 12", icon: ShieldHalf, color: "emerald" },
            { label: "Aadhaar Act 2016", sub: "Section 29: No storage", icon: AlertTriangle, color: "rose" },
            { label: "IT Act 2000", sub: "Section 43A & 72A", icon: Globe, color: "blue" },
            { label: "CERT-In", sub: "6hr breach reporting", icon: Zap, color: "amber" },
          ].map(({ label, sub, icon: Icon, color }) => (
            <div key={label} className="rounded-2xl border border-stone-200 bg-white p-5 text-center space-y-2 shadow-sm">
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-${color}-50 text-${color}-700 border border-${color}-200`}>
                <Icon size={20} />
              </div>
              <div className="text-sm font-bold text-slate-900">{label}</div>
              <div className="text-[11px] text-slate-500 font-medium">{sub}</div>
            </div>
          ))}
        </section>

        {/* ─── BOTTOM CTA BANNER ─── */}
        <section className="relative flex flex-col sm:flex-row items-center justify-between gap-6 rounded-3xl overflow-hidden bg-gradient-to-r from-[#071f16] via-[#0f3d2e] to-[#071f16] p-6 sm:p-8 text-white shadow-xl">
          <div className="relative z-10 space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2">
              <ShieldCheck size={14} /> {tSec.ctaTag}
            </div>
            <h3 className="text-xl font-bold font-serif text-white">
              {tSec.ctaTitle}
            </h3>
            <p className="text-xs text-emerald-100 max-w-lg leading-relaxed">
              {tSec.ctaDesc}
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/dpdp"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white text-emerald-950 px-5 text-xs font-bold shadow hover:bg-stone-100 transition active:scale-95"
            >
              <span>{tSec.ctaPortalBtn}</span>
              <ArrowRight size={13} />
            </Link>

            <Link
              to="/consent-framework"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-emerald-600 bg-emerald-900/60 px-4 text-xs font-semibold text-emerald-100 hover:bg-emerald-900 transition active:scale-95"
            >
              {tSec.ctaConsentBtn}
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
