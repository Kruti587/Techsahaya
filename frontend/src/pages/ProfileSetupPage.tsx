import React from "react";
import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProfileForm } from "../components/ProfileForm";
import { WelcomeVoiceBanner } from "../components/WelcomeVoiceBanner";
import { useAppContext } from "../context/AppContext";
import { api } from "../services/api";
import { t } from "../utils/i18n";
import { SUPPORTED_LANGUAGES } from "../utils/languages";

export function ProfileSetupPage() {
  const { profile, setProfile, language, setLanguage, user } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* ─── Mandatory Onboarding Steps Header ─────────────────────── */}
      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sahaya-saffron">
              {t(language, "auth.onboardingStep1")}
            </span>
            <h1 className="text-2xl font-bold font-serif text-slate-900 mt-1">
              {t(language, "auth.welcomeCitizen")}, {user?.full_name || "Citizen"}!
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {t(language, "auth.onboardingSubtitle")}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-2 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <Shield size={16} /> {t(language, "auth.dpdpCompliantBadge")}
          </div>
        </div>

        {/* Visual Onboarding Progress Steps */}
        <div className="mt-6 grid grid-cols-3 gap-2 border-t border-stone-100 pt-5 text-xs font-medium">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-[11px]">
              1
            </div>
            <span>{t(language, "auth.stepLanguage")}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white text-[11px]">
              2
            </div>
            <span>{t(language, "auth.stepDemographics")}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-100 text-stone-500 text-[11px]">
              3
            </div>
            <span>{t(language, "auth.stepWelfare")}</span>
          </div>
        </div>
      </div>

      {/* ─── Audio Welcome Banner (Voice greeting) ────────────────── */}
      <WelcomeVoiceBanner autoPlay={true} />

      {/* ─── Language Selection Card ─────────────────────────────── */}
      <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700" htmlFor="onboarding-language">
              {t(language, "auth.choosePrefLanguage")}
            </label>
            <p className="text-xs text-slate-500 mt-0.5">
              {t(language, "auth.choosePrefLanguageDesc")}
            </p>
          </div>
          <select
            id="onboarding-language"
            className="min-h-11 rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.nativeLabel} ({lang.label})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ─── Profile Form Card ───────────────────────────────────── */}
      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-card">
        <div className="mb-6 border-b border-stone-100 pb-4">
          <h2 className="text-lg font-bold font-serif text-slate-900">
            {t(language, "auth.householdDetailsTitle")}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t(language, "auth.householdDetailsDesc")}
          </p>
        </div>

        <ProfileForm
          initialValue={profile}
          submitLabel={`${t(language, "common.continue") || "Continue"} →`}
          onSubmit={async (nextProfile) => {
            const response = await api.put("/api/profile", {
              ...nextProfile,
              preferred_language: language,
              consent_given: true,
              onboarding_completed: true,
            });
            setProfile({
              ...nextProfile,
              onboarding_completed: response.data?.onboarding_completed ?? true,
            });
            navigate("/dashboard");
          }}
        />
      </div>
    </div>
  );
}
