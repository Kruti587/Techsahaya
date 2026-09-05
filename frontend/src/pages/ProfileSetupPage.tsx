import React from "react";
import { CheckCircle2, Shield, Sparkles, UserCheck } from "lucide-react";
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
              Step 1 of 2: Mandatory Citizen Profile Setup
            </span>
            <h1 className="text-2xl font-bold font-serif text-slate-900 mt-1">
              Welcome to Tech Sahaya, {user?.full_name || "Citizen"}!
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Complete your profile to unlock verified scheme matching, welfare radar, and guided applications.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-2 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <Shield size={16} /> DPDP-Compliant & Secure
          </div>
        </div>

        {/* Visual Onboarding Progress Steps */}
        <div className="mt-6 grid grid-cols-3 gap-2 border-t border-stone-100 pt-5 text-xs font-medium">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-[11px]">
              1
            </div>
            <span>Language & Voice</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white text-[11px]">
              2
            </div>
            <span>Citizen Demographics</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-100 text-stone-500 text-[11px]">
              3
            </div>
            <span>Welfare Access</span>
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
              Choose Preferred Language / पसंदीदा भाषा
            </label>
            <p className="text-xs text-slate-500 mt-0.5">
              All schemes, eligibility guidelines, and voice assistance will adapt to this language.
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
            Household & Eligibility Details
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Your self-declared profile details are used strictly to calculate scheme eligibility rules. No Aadhaar or biometric persistence.
          </p>
        </div>

        <ProfileForm
          initialValue={profile}
          submitLabel="Complete Setup & Enter Dashboard →"
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
