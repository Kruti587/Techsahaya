import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mic,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Cpu,
  Layers,
  Activity,
  ExternalLink,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { getNamespacedLocale, t } from "../utils/i18n";

export function HowItWorksPage() {
  const { language } = useAppContext();
  const l = getNamespacedLocale(language, "howItWorks");

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
            {l.civicProtocol}
          </span>
          <span className="text-[10px] text-slate-400">&bull;</span>
          <span className="text-[11px] font-semibold text-amber-700">{l.zeroHallucination}</span>
        </div>

        {/* Main Headline with Visual Hierarchy */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.18] font-serif">
          {l.heroTitlePre || "How"}{" "}
          <span className="bg-gradient-to-r from-emerald-800 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Tech Sahaya
          </span>{" "}
          {l.heroTitlePost || "Works"}
        </h1>

        {/* Elevated Sub-copy */}
        <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-700 max-w-3xl">
          {l.heroDesc}
        </p>

        {/* Key Platform Metrics Bar */}
        <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-6 pt-2 max-w-2xl">
          <div className="bg-white/90 backdrop-blur rounded-2xl p-3.5 border border-stone-200/80 text-center shadow-xs">
            <p className="text-lg sm:text-2xl font-extrabold text-emerald-800 font-serif">{l.metric1Val}</p>
            <p className="text-xs text-slate-600 font-semibold leading-tight mt-0.5">{l.metric1Label}</p>
          </div>
          <div className="bg-white/90 backdrop-blur rounded-2xl p-3.5 border border-stone-200/80 text-center shadow-xs">
            <p className="text-lg sm:text-2xl font-extrabold text-slate-800 font-serif">{l.metric2Val}</p>
            <p className="text-xs text-slate-600 font-semibold leading-tight mt-0.5">{l.metric2Label}</p>
          </div>
          <div className="bg-white/90 backdrop-blur rounded-2xl p-3.5 border border-stone-200/80 text-center shadow-xs">
            <p className="text-lg sm:text-2xl font-extrabold text-teal-700 font-serif">{l.metric3Val}</p>
            <p className="text-xs text-slate-600 font-semibold leading-tight mt-0.5">{l.metric3Label}</p>
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
              {l.journeyTitle}
            </h2>
            <p className="text-xs text-slate-500">{l.journeySubtitle}</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            {l.liveFlow}
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
                  {l.step1Tag}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-3 font-serif">{l.step1Title}</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {l.step1Desc}
              </p>
            </div>
            <div className="mt-3.5 flex flex-wrap gap-1.5 text-[11px]">
              <span className="bg-stone-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium">{l.step1Chip1}</span>
              <span className="bg-stone-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium">{l.step1Chip2}</span>
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
                  {l.step2Tag}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-3 font-serif">{l.step2Title}</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {l.step2Desc}
              </p>
            </div>
            <div className="mt-3.5 flex items-center gap-2 text-xs text-emerald-700 font-medium">
              <Sparkles size={14} />
              <span>{l.step2Chip}</span>
            </div>
          </div>

          {/* Step 3: Verify (Active/Highlighted State) */}
          <div className="bg-gradient-to-br from-emerald-50/90 to-teal-50/60 rounded-3xl p-5 border-2 border-emerald-500 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-extrabold text-xs shadow-md">
                  3
                </div>
                <span className="text-[11px] font-bold text-emerald-900 bg-emerald-200/80 px-2.5 py-0.5 rounded-full">
                  {l.step3Tag}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-3 font-serif">{l.step3Title}</h3>
              <p className="text-xs text-slate-700 mt-1.5 leading-relaxed font-medium">
                {l.step3Desc}
              </p>
            </div>
            <div className="mt-3.5 flex items-center gap-1.5 text-xs text-emerald-800 font-bold bg-white/80 backdrop-blur rounded-xl p-2 border border-emerald-200">
              <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />
              <span>{l.step3Chip}</span>
            </div>
          </div>

          {/* Step 4: Prepare */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-extrabold text-xs">
                  4
                </div>
                <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {l.step4Tag}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-3 font-serif">{l.step4Title}</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {l.step4Desc}
              </p>
            </div>
            <div className="mt-3.5 flex items-center gap-2 text-xs text-slate-600 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>{l.step4Chip}</span>
            </div>
          </div>

          {/* Step 5: Apply */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-extrabold text-xs">
                  5
                </div>
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  {l.step5Tag}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-3 font-serif">{l.step5Title}</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {l.step5Desc}
              </p>
            </div>
            <div className="mt-3.5 flex items-center gap-2 text-xs text-amber-700 font-medium">
              <ExternalLink size={14} />
              <span>{l.step5Chip}</span>
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
                  {l.step6Tag}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-3 font-serif">{l.step6Title}</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {l.step6Desc}
              </p>
            </div>
            <div className="mt-3.5 flex items-center gap-2 text-xs text-emerald-700 font-semibold">
              <Activity size={14} />
              <span>{l.step6Chip}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4-Stage Architectural Security Stack ─── */}
      <section className="mt-12 px-4 max-w-6xl mx-auto space-y-6" data-purpose="deep-dive-pillars">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-sahaya-saffron">
              {l.archHeading}
            </span>
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900 font-serif mt-1">
              {l.archTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">{l.archDesc}</p>
          </div>
          <span className="text-xs text-slate-400 font-mono tracking-wider">v2.4_STABLE</span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Stage 1 */}
          <article className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                <Mic size={20} />
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-serif">{l.stage1Title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{l.stage1Desc}</p>
            </div>
          </article>

          {/* Stage 2 */}
          <article className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center mb-3">
                <Cpu size={20} />
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-serif">{l.stage2Title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{l.stage2Desc}</p>
            </div>
          </article>

          {/* Stage 3 */}
          <article className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
                <Layers size={20} />
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-serif">{l.stage3Title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{l.stage3Desc}</p>
            </div>
          </article>

          {/* Stage 4 */}
          <article className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mb-3">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-serif">{l.stage4Title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{l.stage4Desc}</p>
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
              <span>{t(language, "securityPrivacy")}</span>
            </div>
            <h3 className="text-lg font-bold font-serif text-white">
              {l.zeroHallucination} &bull; {t(language, "dpdpAct")} 2023
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              {l.archDesc}
            </p>
          </div>

          <Link
            to="/dpdp"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-sahaya-saffron px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-amber-600 transition active:scale-95 shrink-0"
          >
            <span>{l.viewDpdpArch}</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ─── Call To Action ─── */}
      <section className="mt-10 px-4 max-w-6xl mx-auto" data-purpose="cta-section">
        <div className="rounded-3xl p-8 border-2 border-emerald-500/40 text-center shadow-lg relative overflow-hidden bg-white">
          <div className="pointer-events-none absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl" />
          <h3 className="text-2xl font-black text-slate-900 tracking-tight font-serif">
            {t(language, "common.checkEligibility") || l.interactiveTitle}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-md mx-auto">
            {l.interactiveDesc}
          </p>
          <div className="mt-5 flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
            <Link
              to="/eligibility"
              className="inline-flex items-center justify-center gap-2 bg-[#0f3d2e] hover:bg-emerald-900 active:scale-[0.98] text-white font-bold py-3 px-6 rounded-xl text-sm shadow-md transition"
            >
              <span>{t(language, "common.eligibilityChecker")}</span>
              <ArrowRight size={15} />
            </Link>
            <Link
              to="/schemes"
              className="inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 active:scale-[0.98] text-slate-700 font-semibold py-3 px-6 rounded-xl text-xs transition"
            >
              <span>{t(language, "common.schemes")}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
