import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  FileCheck2,
  Server,
  Clock,
  AlertTriangle,
  FileWarning,
  UserCheck,
  Building2,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Activity,
  Sparkles,
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { getDpdpContent } from "@/utils/dpdpTranslations";

export function DpdpPage() {
  const { language } = useAppContext();
  const content = getDpdpContent(language);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12 space-y-10 sm:space-y-12">
      {/* ─── Hero Header ─── */}
      <div className="rounded-3xl bg-gradient-to-br from-[#061a13] via-[#0f3d2e] to-[#071811] p-6 sm:p-10 text-white shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-emerald-300">
          <ShieldCheck size={14} className="text-sahaya-saffron shrink-0" />
          <span>{content.actBadge}</span>
        </div>
        <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold font-serif md:text-4xl text-white leading-tight">
          {content.heroTitle}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-emerald-100 max-w-3xl leading-relaxed">
          {content.heroSubtitle}
        </p>
      </div>

      {/* ─── Problem Statement & Why This Matters In The UX Flow ─── */}
      <section className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
          <Sparkles size={14} className="text-sahaya-saffron shrink-0" />
          <span>{content.problemBadge}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 leading-snug">
          {content.problemTitle}
        </h2>
        <div className="grid gap-6 md:grid-cols-2 pt-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="space-y-2.5 rounded-2xl bg-amber-50/50 p-4 border border-amber-200/60">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-600 shrink-0" />
              <span>{content.traditionalProblemTitle}</span>
            </h3>
            <p className="text-slate-700 leading-relaxed">
              {content.traditionalProblemBody}
            </p>
          </div>
          <div className="space-y-2.5 rounded-2xl bg-emerald-50/50 p-4 border border-emerald-200/60">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
              <span>{content.solutionTitle}</span>
            </h3>
            <p className="text-slate-700 leading-relaxed">
              {content.solutionBody}
            </p>
          </div>
        </div>
      </section>

      {/* ─── CIA Triad Integration: Confidentiality, Integrity, Availability ─── */}
      <section className="space-y-4">
        <div className="text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-sahaya-saffron">
            {content.cyberHeading}
          </span>
          <h2 className="mt-1 text-xl sm:text-2xl font-bold font-serif text-slate-900 leading-snug">
            {content.ciaTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            {content.ciaSubtitle}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Confidentiality */}
          <div className="rounded-3xl border border-emerald-200 bg-gradient-to-b from-emerald-50/60 to-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 mb-4">
                <Lock size={22} />
              </div>
              <h3 className="font-bold text-slate-900 text-base font-serif">{content.confidentialityTitle}</h3>
              <p className="text-[11px] text-emerald-700 font-semibold uppercase tracking-wider mt-0.5">
                {content.confidentialitySubtitle}
              </p>
              <ul className="mt-4 space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>{content.confidentialityP1}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>{content.confidentialityP2}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>{content.confidentialityP3}</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-3 border-t border-emerald-100 text-[11px] font-bold text-emerald-800">
              {content.confidentialityFooter}
            </div>
          </div>

          {/* Integrity */}
          <div className="rounded-3xl border border-blue-200 bg-gradient-to-b from-blue-50/60 to-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-800 mb-4">
                <FileCheck2 size={22} />
              </div>
              <h3 className="font-bold text-slate-900 text-base font-serif">{content.integrityTitle}</h3>
              <p className="text-[11px] text-blue-700 font-semibold uppercase tracking-wider mt-0.5">
                {content.integritySubtitle}
              </p>
              <ul className="mt-4 space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-blue-600 shrink-0 mt-0.5" />
                  <span>{content.integrityP1}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-blue-600 shrink-0 mt-0.5" />
                  <span>{content.integrityP2}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-blue-600 shrink-0 mt-0.5" />
                  <span>{content.integrityP3}</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-3 border-t border-blue-100 text-[11px] font-bold text-blue-800">
              {content.integrityFooter}
            </div>
          </div>

          {/* Availability */}
          <div className="rounded-3xl border border-amber-200 bg-gradient-to-b from-amber-50/60 to-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 mb-4">
                <Activity size={22} />
              </div>
              <h3 className="font-bold text-slate-900 text-base font-serif">{content.availabilityTitle}</h3>
              <p className="text-[11px] text-amber-800 font-semibold uppercase tracking-wider mt-0.5">
                {content.availabilitySubtitle}
              </p>
              <ul className="mt-4 space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-amber-700 shrink-0 mt-0.5" />
                  <span>{content.availabilityP1}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-amber-700 shrink-0 mt-0.5" />
                  <span>{content.availabilityP2}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-amber-700 shrink-0 mt-0.5" />
                  <span>{content.availabilityP3}</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-3 border-t border-amber-100 text-[11px] font-bold text-amber-900">
              {content.availabilityFooter}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Data Retention: 6 Months to 1 Year Auto-Purge & National Sovereignty ─── */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* Retention Card */}
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 shrink-0">
                <Clock size={22} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base font-serif">
                  {content.retentionTitle}
                </h3>
                <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
                  {content.retentionSubtitle}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {content.retentionDesc}
            </p>
            <ul className="mt-3 space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="font-mono font-bold text-amber-800">&bull;</span>
                <span>{content.retentionItem1}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono font-bold text-amber-800">&bull;</span>
                <span>{content.retentionItem2}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono font-bold text-amber-800">&bull;</span>
                <span>{content.retentionItem3}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono font-bold text-amber-800">&bull;</span>
                <span>{content.retentionItem4}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* National Sovereignty Card */}
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 shrink-0">
                <Server size={22} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base font-serif">
                  {content.sovereigntyTitle}
                </h3>
                <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
                  {content.sovereigntySubtitle}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {content.sovereigntyDesc}
            </p>
            <ul className="mt-3 space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="font-mono font-bold text-emerald-700">&bull;</span>
                <span>{content.sovereigntyItem1}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono font-bold text-emerald-700">&bull;</span>
                <span>{content.sovereigntyItem2}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono font-bold text-emerald-700">&bull;</span>
                <span>{content.sovereigntyItem3}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ─── Mandatory Breach Reporting: Direct to Indian MeitY & CERT-In ─── */}
      <section className="rounded-3xl border-2 border-rose-200 bg-gradient-to-br from-rose-50/70 via-white to-rose-50/30 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-700 shrink-0">
            <FileWarning size={24} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-serif text-slate-900 leading-snug">
              {content.breachTitle}
            </h2>
            <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
              {content.breachSubtitle}
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-4xl">
          {content.breachDesc}
        </p>

        <div className="grid gap-4 sm:grid-cols-3 pt-2 text-xs">
          <div className="rounded-2xl border border-rose-200 bg-white p-4 space-y-1.5 shadow-sm">
            <span className="font-bold text-rose-800 block text-xs">{content.breachStep1Title}</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {content.breachStep1Desc}
            </p>
          </div>

          <div className="rounded-2xl border border-rose-200 bg-white p-4 space-y-1.5 shadow-sm">
            <span className="font-bold text-rose-800 block text-xs">{content.breachStep2Title}</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {content.breachStep2Desc}
            </p>
          </div>

          <div className="rounded-2xl border border-rose-200 bg-white p-4 space-y-1.5 shadow-sm">
            <span className="font-bold text-rose-800 block text-xs">{content.breachStep3Title}</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {content.breachStep3Desc}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between pt-3 border-t border-rose-200 text-xs gap-3">
          <span className="text-rose-900 font-medium">
            {content.breachFooterNotice}
          </span>
          <a
            href="https://cert-in.org.in"
            target="_blank"
            rel="noreferrer"
            className="text-rose-800 font-bold underline hover:text-rose-950 inline-flex items-center gap-1.5"
          >
            <span>{content.certInPortalBtn}</span>
            <ArrowRight size={13} />
          </a>
        </div>
      </section>

      {/* ─── DPDP Roles & Architecture Defined for Tech Sahaya ─── */}
      <section className="space-y-4">
        <div className="text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
            {content.actorsHeading}
          </span>
          <h2 className="mt-1 text-xl sm:text-2xl font-bold font-serif text-slate-900 leading-snug">
            {content.actorsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            {content.actorsSubtitle}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Data Principal */}
          <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm space-y-2 hover:border-emerald-500/40 transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
              <UserCheck size={20} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm font-serif">{content.principalTitle}</h3>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
              {content.principalBadge}
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              {content.principalDesc}
            </p>
          </div>

          {/* Data Fiduciary */}
          <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm space-y-2 hover:border-emerald-500/40 transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-800">
              <Building2 size={20} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm font-serif">{content.fiduciaryTitle}</h3>
            <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full inline-block">
              {content.fiduciaryBadge}
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              {content.fiduciaryDesc}
            </p>
          </div>

          {/* Data Processor */}
          <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm space-y-2 hover:border-emerald-500/40 transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-100 text-purple-800">
              <Cpu size={20} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm font-serif">{content.processorTitle}</h3>
            <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full inline-block">
              {content.processorBadge}
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              {content.processorDesc}
            </p>
          </div>

          {/* Data Protection Officer (DPO) */}
          <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm space-y-2 hover:border-emerald-500/40 transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm font-serif">{content.dpoTitle}</h3>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full inline-block">
              {content.dpoBadge}
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              {content.dpoDesc}
            </p>
          </div>
        </div>
      </section>

      {/* ─── Consent Framework Banner (No external email dependency) ─── */}
      <div className="rounded-3xl border border-emerald-900/20 bg-stone-100 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base sm:text-lg font-bold font-serif text-slate-900">
            {content.bannerTitle}
          </h3>
          <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
            {content.bannerDesc}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            to="/consent-framework"
            className="inline-flex items-center justify-center rounded-xl bg-[#0f3d2e] px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-900 transition"
          >
            {content.consentBtn}
          </Link>
        </div>
      </div>
    </div>
  );
}
