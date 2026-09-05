import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronDown,
  FileSearch2,
  HelpCircle,
  Languages,
  Mic,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { getHomeContent } from "../utils/homeTranslations";

export function HomePage() {
  const { language, personas, loadPersona, user } = useAppContext();
  const copy = getHomeContent(language);

  return (
    <div className="mx-auto max-w-7xl space-y-16 px-4 py-8 md:py-12">
      {/* Hero Section matching Screenshot 2 */}
      <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] xl:gap-14">
        {/* Left Column: Headlines, CTA & Stats */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-800/20 bg-emerald-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sahaya-green">
            <Sparkles size={14} className="text-sahaya-saffron" />
            <span>{copy.badge}</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem] font-serif leading-[1.15]">
            {copy.heroTitle}
          </h1>

          <p className="text-base sm:text-lg leading-relaxed text-slate-600 max-w-xl">
            {copy.heroSubtitle}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to={user ? "/eligibility" : "/signup"}
              className="inline-flex h-12 items-center justify-center gap-2.5 rounded-xl bg-[#0f3d2e] px-6 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-900 active:scale-95"
            >
              <span>{copy.ctaPrimary}</span>
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/schemes"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-stone-300 bg-white px-6 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-stone-50 active:scale-95"
            >
              {copy.ctaSecondary}
            </Link>
          </div>

          {/* 3 Metrics Stats Row */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-stone-200">
            <div>
              <div className="text-3xl font-extrabold text-slate-900 font-serif">9</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">{copy.statLanguages}</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900 font-serif">0</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">{copy.statDocuments}</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900 font-serif">9</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">{copy.statAudited}</div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Image with Floating Notification Card */}
        <div className="relative">
          <div className="overflow-hidden rounded-3xl shadow-2xl border border-stone-200 bg-stone-100 aspect-[4/3] sm:aspect-[4/3] relative">
            <img
              src="/hero-lakshmi.jpg"
              alt="Indian citizen checking welfare scheme eligibility on smartphone"
              className="h-full w-full object-cover object-center"
              loading="eager"
            />

            {/* Subtle gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

            {/* Floating Notification Badge Card (Lakshmi Unprompted) */}
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs rounded-2xl border border-white/30 bg-stone-900/85 p-3.5 text-white backdrop-blur-md shadow-2xl animate-fade-in">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                <Bell size={13} className="text-amber-400" />
                <span>{copy.notificationPushed}</span>
              </div>
              <p className="mt-1 text-xs font-medium leading-snug text-stone-100">
                {copy.notificationBody}
              </p>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-300 font-semibold">
                <CheckCircle2 size={12} className="text-emerald-400" />
                <span>{copy.notificationRule}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sub-Hero Section matching Screenshot 2 */}
      <section className="rounded-3xl border border-stone-200 bg-stone-100/70 p-8 md:p-12 space-y-6">
        <div className="max-w-3xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-slate-900 tracking-tight">
            {copy.subHeroTitle}
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            {copy.subHeroSubtitle}
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-sahaya-green">
              <Languages size={20} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">{copy.feature1Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {copy.feature1Desc}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-sahaya-green">
              <Mic size={20} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">{copy.feature2Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {copy.feature2Desc}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-sahaya-green">
              <FileSearch2 size={20} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">{copy.feature3Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {copy.feature3Desc}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-sahaya-green">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">{copy.feature4Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {copy.feature4Desc}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Start Persona Exploration */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold font-serif text-slate-900">{copy.sampleTitle}</h3>
            <p className="text-xs text-slate-600">{copy.sampleSubtitle}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {Object.entries(personas).map(([key, persona]) => (
            <button
              key={key}
              type="button"
              onClick={() => loadPersona(key)}
              className="min-h-12 rounded-2xl border border-stone-200 bg-white p-4 text-left shadow-sm transition hover:border-sahaya-green hover:shadow-md active:scale-95"
            >
              <div className="font-bold text-sm text-slate-900">{persona.label}</div>
              <div className="mt-1 text-xs text-slate-500">
                {copy.sampleAction}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) Section */}
      <section className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-10 shadow-sm space-y-6">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sahaya-saffron">
            <HelpCircle size={16} />
            <span>{copy.faqBadge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 mt-2">
            {copy.faqTitle}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {copy.faqSubtitle}
          </p>
        </div>

        <div className="divide-y divide-stone-200 rounded-2xl border border-stone-200 overflow-hidden bg-stone-50/50">
          {copy.faqs.map((faq, idx) => (
            <details
              key={idx}
              className="group p-5 transition-colors hover:bg-white open:bg-white"
            >
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-900 text-sm sm:text-base list-none">
                <span>{faq.q}</span>
                <span className="ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-100 group-open:rotate-180 transition-transform">
                  <ChevronDown size={16} className="text-slate-600" />
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed pr-8">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
