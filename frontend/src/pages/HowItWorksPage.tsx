import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mic,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  FileCheck2,
  Lock,
  Cpu,
  FileText,
  Activity,
  Layers,
  ChevronRight,
  Volume2,
  Database,
  ExternalLink,
} from "lucide-react";

export function HowItWorksPage() {
  const [activeVoiceDemo, setActiveVoiceDemo] = useState(false);

  return (
    <div className="relative min-h-screen pb-20 selection:bg-emerald-500 selection:text-white">
      {/* ─── Hero Section with Ambient Glow ─── */}
      <section className="relative px-4 pt-8 sm:pt-12 pb-6 max-w-6xl mx-auto text-left" data-purpose="hero-intro">
        {/* Ambient Backlight Blur Effect */}
        <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl -z-10 animate-pulse-glow" />
        <div className="pointer-events-none absolute top-24 right-0 w-64 h-64 bg-amber-400/15 rounded-full blur-2xl -z-10" />

        {/* Platform Pill Tag */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-emerald-300/80 shadow-xs backdrop-blur-md mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[11px] font-bold tracking-wider text-emerald-950 uppercase">
            Civic Intelligence Protocol
          </span>
          <span className="text-[10px] text-slate-400">&bull;</span>
          <span className="text-[11px] font-semibold text-amber-700">Zero Hallucination</span>
        </div>

        {/* Main Headline with Visual Hierarchy */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.18] font-serif">
          How{" "}
          <span className="bg-gradient-to-r from-emerald-800 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Tech Sahaya
          </span>{" "}
          Works
        </h1>

        {/* Elevated Sub-copy */}
        <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-700 max-w-3xl">
          Empowering every citizen with deterministic welfare access. We combine natural multilingual dialogue with rigid,
          verifiable eligibility code to bridge government welfare directly to you.
        </p>

        {/* Key Platform Metrics Bar */}
        <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-6 pt-2 max-w-2xl">
          <div className="bg-white/90 backdrop-blur rounded-2xl p-3.5 border border-stone-200/80 text-center shadow-xs">
            <p className="text-lg sm:text-2xl font-extrabold text-emerald-800 font-serif">100%</p>
            <p className="text-xs text-slate-600 font-semibold leading-tight mt-0.5">Deterministic Rules</p>
          </div>
          <div className="bg-white/90 backdrop-blur rounded-2xl p-3.5 border border-stone-200/80 text-center shadow-xs">
            <p className="text-lg sm:text-2xl font-extrabold text-slate-800 font-serif">12+</p>
            <p className="text-xs text-slate-600 font-semibold leading-tight mt-0.5">Indian Dialects</p>
          </div>
          <div className="bg-white/90 backdrop-blur rounded-2xl p-3.5 border border-stone-200/80 text-center shadow-xs">
            <p className="text-lg sm:text-2xl font-extrabold text-teal-700 font-serif">0 ms</p>
            <p className="text-xs text-slate-600 font-semibold leading-tight mt-0.5">Data Retention</p>
          </div>
        </div>
      </section>

      {/* ─── The 6-Step Citizen Journey ─── */}
      <section className="mt-8 px-4 max-w-6xl mx-auto space-y-4" data-purpose="citizen-journey">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2 font-serif">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black">
                6
              </span>
              The 6-Step Citizen Journey
            </h2>
            <p className="text-xs text-slate-500">Deterministic path from discovery to disbursement</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Live Flow
          </span>
        </div>

        {/* Connected Vertical / Grid Stepper for UX */}
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Step 1: Discover */}
          <div className="bg-white rounded-3xl p-5 border border-emerald-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-[#0f3d2e] text-white flex items-center justify-center font-extrabold text-xs shadow-md shadow-emerald-900/30">
                  1
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Voice &amp; Search
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-3 font-serif">Discover</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Speak or type your current household circumstances. Discover central and state schemes mapped to your real needs.
              </p>
            </div>
            <div className="mt-3.5 flex flex-wrap gap-1.5 text-[11px]">
              <span className="bg-stone-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium">🌾 Farmer Subsidy</span>
              <span className="bg-stone-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium">🎓 Girl Child Education</span>
            </div>
          </div>

          {/* Step 2: Understand */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-extrabold text-xs">
                  2
                </div>
                <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  No Legal Jargon
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-3 font-serif">Understand</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Schemes broken down into plain audio &amp; localized language summaries. Know your exact entitlements with zero confusion.
              </p>
            </div>
            <div className="mt-3.5 flex items-center gap-2 text-xs text-emerald-700 font-medium">
              <Sparkles size={14} />
              <span>Available in 9+ Indian Languages</span>
            </div>
          </div>

          {/* Step 3: Verify (Active/Highlighted State) */}
          <div className="bg-gradient-to-br from-emerald-50/90 to-teal-50/60 rounded-3xl p-5 border-2 border-emerald-500 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-extrabold text-xs ring-4 ring-emerald-100">
                  3
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-200/70 px-2.5 py-0.5 rounded-full">
                  Rule Engine
                </span>
              </div>
              <h3 className="text-base font-black text-emerald-950 mt-3 font-serif flex items-center gap-2">
                <span>Verify</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              </h3>
              <p className="text-xs text-emerald-950 font-medium mt-1.5 leading-relaxed">
                Rule trees test income, age, landholding, and caste conditions with 100% mathematical auditability.
              </p>
            </div>
            <div className="mt-3 p-2.5 bg-white/90 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Land: &lt; 2.0 Hectares</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 size={14} /> MATCHED
              </span>
            </div>
          </div>

          {/* Step 4: Prepare */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-extrabold text-xs">
                  4
                </div>
                <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  Doc Checklist
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-3 font-serif">Prepare</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Auto-generated checklist of verified documents needed (Aadhaar, Bank passbook, Khatiyan) with instant camera scanner.
              </p>
            </div>
            <div className="mt-3.5 flex items-center gap-2 text-xs text-slate-500">
              <FileCheck2 size={14} className="text-emerald-600" />
              <span>DigiLocker direct integration</span>
            </div>
          </div>

          {/* Step 5: Apply */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-extrabold text-xs">
                  5
                </div>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full">
                  Direct Link
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-3 font-serif">Apply</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Guided pre-filled submission to official government portals or nearest Common Service Center (CSC) kiosk.
              </p>
            </div>
            <div className="mt-3.5 flex items-center gap-2 text-xs text-amber-700 font-medium">
              <ExternalLink size={14} />
              <span>Official State &amp; National Portals</span>
            </div>
          </div>

          {/* Step 6: Track */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-extrabold text-xs">
                  6
                </div>
                <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  DBT Status
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-3 font-serif">Track</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Real-time DBT (Direct Benefit Transfer) tracking and proactive SMS/WhatsApp alerts for annual subsidy release dates.
              </p>
            </div>
            <div className="mt-3.5 flex items-center gap-2 text-xs text-emerald-700 font-semibold">
              <Activity size={14} />
              <span>Live Installment Notifications</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Core Engine Pillars: Scheme DNA, Eligibility Graph, Voice Interface ─── */}
      <section className="mt-12 px-4 max-w-6xl mx-auto space-y-6" data-purpose="deep-dive-pillars">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900 font-serif">Core Engine Pillars</h2>
            <p className="text-xs sm:text-sm text-slate-500">How the underlying intelligence operates</p>
          </div>
          <span className="text-xs text-slate-400 font-mono tracking-wider">v2.4_STABLE</span>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Pillar 1: Scheme DNA Decomposition */}
          <article className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Cpu size={22} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug font-serif">Scheme DNA Decomposition</h3>
                    <p className="text-[11px] text-slate-500">Atomic parsing of gazette orders</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Explained
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Schemes are split into structured source, benefit, document, and eligibility-rule atoms so every recommendation is mathematically verifiable.
              </p>
            </div>

            {/* Interactive DNA Decomposition Inspector Card */}
            <div className="mt-4 bg-slate-950 rounded-2xl p-4 text-white font-mono text-xs border border-slate-800 shadow-inner">
              <div className="flex items-center justify-between text-[11px] border-b border-slate-800 pb-2 text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  PM-KISAN_DNA.v3
                </span>
                <span className="text-[10px] text-slate-400">SCHEME_ID: 10842</span>
              </div>
              <div className="mt-2.5 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Benefit Quantum:</span>
                  <span className="text-emerald-300 font-sans font-bold">₹6,000 / Year</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rule Logic:</span>
                  <span className="text-amber-400 font-mono">SmallFarmer &amp; LandHolding</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Required Docs:</span>
                  <span className="text-slate-200">Aadhaar, ROR, NPCI-Bank</span>
                </div>
              </div>
              {/* Matching Bar */}
              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-sans">Citizen Fit Score:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full w-[94%] rounded-full" />
                  </div>
                  <span className="text-[11px] text-emerald-300 font-bold">94%</span>
                </div>
              </div>
            </div>
          </article>

          {/* Pillar 2: Conversational Eligibility Graph */}
          <article className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Layers size={22} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug font-serif">Eligibility Graph</h3>
                    <p className="text-[11px] text-slate-500">Transparent match reasoning</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Rule Logic
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Citizens can see exactly what matched, what criteria failed, and what pieces of information are missing before making any formal submission.
              </p>
            </div>

            {/* Visual Logic Graph Simulation Card */}
            <div className="mt-4 bg-stone-50 rounded-2xl p-3.5 border border-stone-200 text-xs space-y-2">
              <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-700" />
                Evaluation Breakdown
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-emerald-100">
                <span className="text-slate-600 text-[11px]">Household Income &le; ₹2.5L</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">PASSED</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-emerald-100">
                <span className="text-slate-600 text-[11px]">Domicile: State Resident</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">PASSED</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50/70 border border-amber-200">
                <span className="text-amber-900 text-[11px] font-medium">Electricity Bill &lt; 100 Units</span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">NEEDS BILL</span>
              </div>
            </div>
          </article>

          {/* Pillar 3: Zero-Literacy Voice Interface */}
          <article className="bg-gradient-to-br from-[#061a13] via-[#0b291e] to-slate-950 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="pointer-events-none absolute -right-10 -bottom-10 w-44 h-44 bg-emerald-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400/30">
                    <Mic size={22} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-snug font-serif">Voice Interface</h3>
                    <p className="text-[11px] text-emerald-300/80">Speak naturally in local dialects</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  Audio First
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-3 leading-relaxed">
                Citizens can speak questions, read synchronized transcripts, and hear warm spoken answers in their mother tongue without typing.
              </p>
            </div>

            {/* Dynamic Audio Visualizer Component */}
            <div className="mt-4 p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] tracking-wider uppercase font-semibold text-emerald-200">
                  Listening (Hindi / Bhojpuri)
                </span>
                <span className="text-[9px] font-mono text-emerald-400 animate-pulse">&bull; STREAMING</span>
              </div>
              {/* Soundwave Bars */}
              <div className="h-8 flex items-center justify-center space-x-1.5 py-1">
                <span className="wave-bar w-1.5 bg-emerald-400 rounded-full" />
                <span className="wave-bar w-1.5 bg-emerald-300 rounded-full" />
                <span className="wave-bar w-1.5 bg-teal-300 rounded-full" />
                <span className="wave-bar w-1.5 bg-emerald-400 rounded-full" />
                <span className="wave-bar w-1.5 bg-emerald-300 rounded-full" />
                <span className="wave-bar w-1.5 bg-teal-300 rounded-full" />
              </div>
              {/* Speech Transcription */}
              <div className="mt-2 bg-black/40 rounded-xl p-2.5 border border-white/10 text-xs">
                <p className="text-emerald-200 italic text-[11px]">
                  &ldquo;Mujhe beti ki padhai ke liye sarkari scholarship chahiye, 10th pass kiya hai...&rdquo;
                </p>
                <p className="text-slate-300 text-[10px] mt-1 font-sans">
                  <span className="text-emerald-400 font-semibold">Matched:</span> NMMS &amp; Sukanya Samriddhi.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ─── Sovereign Citizen Data Security Banner ─── */}
      <section className="mt-10 px-4 max-w-6xl mx-auto" data-purpose="security-guarantee">
        <div className="bg-gradient-to-r from-slate-900 to-[#071f16] rounded-3xl p-6 text-white border border-slate-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <ShieldCheck size={16} />
              <span>Sovereign Citizen Data Security</span>
            </div>
            <h3 className="text-lg font-bold font-serif text-white">
              Zero Data Mining &bull; Compliant with DPDP Act 2023
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Your personal information is never stored or commercialized. All rule evaluation executes in volatile memory with 6-month to 1-year auto-purge.
            </p>
          </div>

          <Link
            to="/dpdp"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-sahaya-saffron px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-amber-600 transition active:scale-95 shrink-0"
          >
            <span>View DPDP Architecture</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ─── Call To Action ─── */}
      <section className="mt-10 px-4 max-w-6xl mx-auto" data-purpose="cta-section">
        <div className="rounded-3xl p-8 border-2 border-emerald-500/40 text-center shadow-lg relative overflow-hidden bg-white">
          <div className="pointer-events-none absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl" />
          <h3 className="text-2xl font-black text-slate-900 tracking-tight font-serif">
            Ready to Check Your Entitlements?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-md mx-auto">
            It takes less than 90 seconds. No paperwork needed for preliminary eligibility checks.
          </p>
          <div className="mt-5 flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
            <Link
              to="/eligibility"
              className="inline-flex items-center justify-center gap-2 bg-[#0f3d2e] hover:bg-emerald-900 active:scale-[0.98] text-white font-bold py-3 px-6 rounded-xl text-sm shadow-md transition"
            >
              <span>Check My Scheme Eligibility</span>
              <ArrowRight size={15} />
            </Link>
            <Link
              to="/schemes"
              className="inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 active:scale-[0.98] text-slate-700 font-semibold py-3 px-6 rounded-xl text-xs transition"
            >
              <span>Explore Verified Schemes</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
