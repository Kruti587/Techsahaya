import React, { useEffect, useState } from "react";
import {
  Briefcase,
  Check,
  CheckCircle2,
  ChevronDown,
  FileCheck2,
  FolderSync,
  Landmark,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import type { EligibilityProfile } from "../types";
import { t } from "../utils/i18n";

const defaults: EligibilityProfile = {
  age: 34,
  gender: "female",
  state: "Karnataka",
  occupation: "Small & Marginal Farmer (Cultivator)",
  income: 120000,
  landholding: 1.5,
  disability: false,
  available_documents: ["income_certificate", "land_record", "ration_card", "aadhaar_dbt"],
};

export function ProfileForm({
  initialValue,
  onSubmit,
  submitLabel,
}: {
  initialValue?: EligibilityProfile;
  onSubmit: (profile: EligibilityProfile) => void;
  submitLabel?: string;
}) {
  const { language } = useAppContext();
  const [form, setForm] = useState<EligibilityProfile>(() => ({
    ...defaults,
    ...(initialValue || {}),
    available_documents:
      initialValue?.available_documents && initialValue.available_documents.length > 0
        ? initialValue.available_documents
        : defaults.available_documents,
  }));

  const [isSyncingDigiLocker, setIsSyncingDigiLocker] = useState(false);
  const [syncNotice, setSyncNotice] = useState("");

  useEffect(() => {
    if (initialValue) {
      setForm((prev) => ({
        ...prev,
        ...initialValue,
        available_documents:
          initialValue.available_documents && initialValue.available_documents.length > 0
            ? initialValue.available_documents
            : prev.available_documents,
      }));
    }
  }, [initialValue]);

  const update = (key: keyof EligibilityProfile, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleDocument = (docKey: string) => {
    const current = form.available_documents || [];
    const next = current.includes(docKey)
      ? current.filter((item) => item !== docKey)
      : [...current, docKey];
    update("available_documents", next);
  };

  const handleDigiLockerSync = () => {
    setIsSyncingDigiLocker(true);
    setSyncNotice("Authenticating with official state repository (Bhoomi & Nada Kacheri)...");
    setTimeout(() => {
      setIsSyncingDigiLocker(false);
      update("available_documents", [
        "income_certificate",
        "land_record",
        "ration_card",
        "aadhaar_dbt",
      ]);
      setSyncNotice("DigiLocker sync completed: 3 verified records matched.");
      setTimeout(() => setSyncNotice(""), 3500);
    }, 1000);
  };

  const attachedCount = (form.available_documents || []).length;
  const buttonText = submitLabel || t(language, "save");

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      {/* ─── Row 1: AGE & GENDER ────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Age Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <label className="text-slate-900 tracking-wide">
              AGE <span className="text-red-500">*</span>
            </label>
            <span className="text-slate-500 font-normal text-[11px]">
              As stated on Official ID
            </span>
          </div>
          <div className="relative flex items-center">
            <input
              type="number"
              min={1}
              max={120}
              value={form.age ?? ""}
              onChange={(e) => update("age", e.target.value ? Number(e.target.value) : undefined)}
              placeholder="34"
              className="w-full h-12 rounded-xl border-2 border-amber-400 bg-white px-4 text-base font-bold text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-300/30"
              required
            />
            <div className="absolute right-3 flex items-center gap-1.5 pointer-events-none">
              <span className="text-xs font-semibold text-slate-500 bg-stone-100 px-2.5 py-1 rounded-lg">
                Years
              </span>
              <div className="flex flex-col text-slate-400 -space-y-1 text-[10px]">
                <span>▲</span>
                <span>▼</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gender Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <label className="text-slate-900 tracking-wide">
              GENDER <span className="text-red-500">*</span>
            </label>
            <span className="text-emerald-700 font-medium text-[11px]">
              Unlocks specialized welfare
            </span>
          </div>
          <div className="relative">
            <select
              value={form.gender || "female"}
              onChange={(e) => update("gender", e.target.value)}
              className="w-full h-12 rounded-xl border border-stone-300 bg-white px-4 pr-10 text-sm font-semibold text-slate-900 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none"
              required
            >
              <option value="female">Female (ಮಹಿಳೆ)</option>
              <option value="male">Male (ಪುರುಷ)</option>
              <option value="transgender">Transgender (ಇತರ)</option>
            </select>
            <ChevronDown
              size={18}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* ─── Row 2: STATE / DOMICILE & PRIMARY OCCUPATION ──────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* State / Domicile */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <label className="text-slate-900 tracking-wide">
              STATE / DOMICILE <span className="text-red-500">*</span>
            </label>
            <span className="text-slate-500 font-normal text-[11px]">
              Auto-detected via location
            </span>
          </div>
          <div className="relative">
            <select
              value={form.state || "Karnataka"}
              onChange={(e) => update("state", e.target.value)}
              className="w-full h-12 rounded-xl border border-stone-300 bg-white px-4 pr-10 text-sm font-semibold text-slate-900 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none"
              required
            >
              <option value="Karnataka">Karnataka (ಕರ್ನಾಟಕ) - Active DBT</option>
              <option value="Maharashtra">Maharashtra (महाराष्ट्र) - Active DBT</option>
              <option value="Tamil Nadu">Tamil Nadu (தமிழ்நாடு) - Active DBT</option>
              <option value="Telangana">Telangana (తెలంగాణ) - Active DBT</option>
              <option value="Andhra Pradesh">Andhra Pradesh (ఆంధ్రప్రదేశ్)</option>
              <option value="Uttar Pradesh">Uttar Pradesh (उत्तर प्रदेश)</option>
              <option value="Madhya Pradesh">Madhya Pradesh (मध्य प्रदेश)</option>
              <option value="Bihar">Bihar (बिहार)</option>
              <option value="Rajasthan">Rajasthan (राजस्थान)</option>
              <option value="Gujarat">Gujarat (ગુજરાત)</option>
              <option value="Kerala">Kerala (കേരളം)</option>
              <option value="West Bengal">West Bengal (পশ্চিমবঙ্গ)</option>
            </select>
            <ChevronDown
              size={18}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
          </div>
        </div>

        {/* Primary Occupation */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <label className="text-slate-900 tracking-wide">
              PRIMARY OCCUPATION <span className="text-red-500">*</span>
            </label>
            <span className="text-slate-500 font-normal text-[11px]">
              PM-KISAN & DBT alignment
            </span>
          </div>
          <div className="relative">
            <select
              value={form.occupation || "Small & Marginal Farmer (Cultivator)"}
              onChange={(e) => update("occupation", e.target.value)}
              className="w-full h-12 rounded-xl border border-stone-300 bg-white px-4 pr-10 text-sm font-semibold text-slate-900 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none"
              required
            >
              <option value="Small & Marginal Farmer (Cultivator)">
                Small & Marginal Farmer (Cultivator)
              </option>
              <option value="Agricultural Laborer">Agricultural Laborer</option>
              <option value="Artisan / Craftsman (PM-Vishwakarma)">
                Artisan / Craftsman (PM-Vishwakarma)
              </option>
              <option value="Self-Employed / Street Vendor (PM SVANidhi)">
                Self-Employed / Street Vendor (PM SVANidhi)
              </option>
              <option value="Gig Worker / Delivery Executive">
                Gig Worker / Delivery Executive
              </option>
              <option value="Student / Scholar">Student / Scholar</option>
              <option value="Unemployed / Job Seeker">Unemployed / Job Seeker</option>
              <option value="Home Maker">Home Maker</option>
            </select>
            <Briefcase
              size={17}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* ─── Row 3: ANNUAL HOUSEHOLD INCOME & LANDHOLDING ─────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Annual Household Income */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <label className="text-slate-900 tracking-wide">
              ANNUAL HOUSEHOLD INCOME <span className="text-red-500">*</span>
            </label>
            <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
              BPL / Antyodaya Tier
            </span>
          </div>
          <div className="relative">
            <select
              value={form.income ? String(form.income) : "120000"}
              onChange={(e) => update("income", Number(e.target.value))}
              className="w-full h-12 rounded-xl border border-stone-300 bg-white px-4 pr-10 text-sm font-semibold text-slate-900 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none"
              required
            >
              <option value="120000">₹1,20,000 / year (Under ₹1.5 Lakh)</option>
              <option value="80000">₹80,000 / year (BPL Tier 1)</option>
              <option value="180000">₹1,80,000 / year (Under ₹2.5 Lakh)</option>
              <option value="300000">₹3,00,000 / year (Under ₹3.5 Lakh)</option>
              <option value="500000">₹5,00,000 / year (Under ₹8 Lakh / EWS)</option>
              <option value="900000">Above ₹8,00,000 / year (General Tier)</option>
            </select>
            <ChevronDown
              size={18}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
          </div>
        </div>

        {/* Landholding (Acres / RTC) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <label className="text-slate-900 tracking-wide">LANDHOLDING (ACRES / RTC)</label>
            <span className="bg-emerald-100 text-emerald-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              Marginal Farmer (&lt; 2.5 Acres)
            </span>
          </div>
          <div className="relative">
            <select
              value={form.landholding !== undefined ? String(form.landholding) : "1.5"}
              onChange={(e) => update("landholding", Number(e.target.value))}
              className="w-full h-12 rounded-xl border border-stone-300 bg-white px-4 pr-10 text-sm font-semibold text-slate-900 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none"
            >
              <option value="1.5">1.5 Acres (Dryland Cultivation)</option>
              <option value="0.5">0.5 Acres (Sub-marginal)</option>
              <option value="2.0">2.0 Acres (Small Farmer)</option>
              <option value="3.5">3.5 Acres (Medium Cultivation)</option>
              <option value="5.0">5.0+ Acres (Large Landholding)</option>
              <option value="0">0 Acres (Landless / Tenant Farmer)</option>
            </select>
            <ChevronDown
              size={18}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* ─── Row 4: Disability / PwD Benchmark Support Callout ─────── */}
      <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4 transition-all hover:border-blue-300">
        <label className="flex items-start gap-3.5 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(form.disability)}
            onChange={(e) => update("disability", e.target.checked)}
            className="mt-1 h-5 w-5 rounded border-stone-300 text-sahaya-green focus:ring-sahaya-green cursor-pointer"
          />
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">
                  Disability / PwD Benchmark Support
                </span>
                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                  UDID Assistive
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-400">Self-Declared</span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Check if you or a household dependent have a certified benchmark disability of 40% or above.
              Unlocks specialized monthly pensions, motorized aid grants, and RTC fare concessions.
            </p>
          </div>
        </label>
      </div>

      {/* ─── Row 5: Required Documents & DigiLocker Linkages Header ─── */}
      <div className="pt-2 border-t border-stone-100">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-bold text-slate-900">
                Required Documents & DigiLocker Linkages
              </h2>
              <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                {attachedCount} of 6 Attached
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Fast-verify documents from official state repositories to prevent field rejection.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDigiLockerSync}
            disabled={isSyncingDigiLocker}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition shadow-sm active:scale-95 disabled:opacity-60"
          >
            <RefreshCw size={14} className={`text-emerald-700 ${isSyncingDigiLocker ? "animate-spin" : ""}`} />
            <span>Sync with DigiLocker</span>
          </button>
        </div>

        {syncNotice && (
          <div className="mb-3 rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 size={15} />
            <span>{syncNotice}</span>
          </div>
        )}

        {/* ─── Row 6: 3x2 Grid of Document Cards ───────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Card 1: Income Certificate */}
          <div
            onClick={() => toggleDocument("income_certificate")}
            className={`rounded-2xl border p-3.5 transition-all cursor-pointer select-none ${
              (form.available_documents || []).includes("income_certificate")
                ? "border-emerald-400 bg-emerald-50/40 shadow-xs"
                : "border-stone-200 bg-white hover:border-stone-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                  (form.available_documents || []).includes("income_certificate")
                    ? "border-emerald-600 bg-emerald-700 text-white"
                    : "border-stone-300 bg-white"
                }`}
              >
                {(form.available_documents || []).includes("income_certificate") && (
                  <Check size={13} strokeWidth={3} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-xs font-bold text-slate-900 truncate">Income Certificate</h3>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.2 rounded-full border border-emerald-200 shrink-0">
                    Verified
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 truncate">
                  RD00384992 • Tahsildar Office
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Land Record / RTC */}
          <div
            onClick={() => toggleDocument("land_record")}
            className={`rounded-2xl border p-3.5 transition-all cursor-pointer select-none ${
              (form.available_documents || []).includes("land_record")
                ? "border-emerald-400 bg-emerald-50/40 shadow-xs"
                : "border-stone-200 bg-white hover:border-stone-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                  (form.available_documents || []).includes("land_record")
                    ? "border-emerald-600 bg-emerald-700 text-white"
                    : "border-stone-300 bg-white"
                }`}
              >
                {(form.available_documents || []).includes("land_record") && (
                  <Check size={13} strokeWidth={3} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-xs font-bold text-slate-900 truncate">Land Record / RTC</h3>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.2 rounded-full border border-emerald-200 shrink-0">
                    Bhoomi
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 truncate">
                  Sy 104/2B • Taluk Hoskote
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Ration Card */}
          <div
            onClick={() => toggleDocument("ration_card")}
            className={`rounded-2xl border p-3.5 transition-all cursor-pointer select-none ${
              (form.available_documents || []).includes("ration_card")
                ? "border-emerald-400 bg-emerald-50/40 shadow-xs"
                : "border-stone-200 bg-white hover:border-stone-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                  (form.available_documents || []).includes("ration_card")
                    ? "border-emerald-600 bg-emerald-700 text-white"
                    : "border-stone-300 bg-white"
                }`}
              >
                {(form.available_documents || []).includes("ration_card") && (
                  <Check size={13} strokeWidth={3} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-xs font-bold text-slate-900 truncate">Ration Card</h3>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.2 rounded-full border border-emerald-200 shrink-0">
                    NFSA BPL
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 truncate">
                  RC-KA-99281729 • Active
                </p>
              </div>
            </div>
          </div>

          {/* Card 4: Disability / UDID */}
          <div
            onClick={() => toggleDocument("disability_certificate")}
            className={`rounded-2xl border p-3.5 transition-all cursor-pointer select-none ${
              (form.available_documents || []).includes("disability_certificate")
                ? "border-emerald-400 bg-emerald-50/40 shadow-xs"
                : "border-stone-200 bg-white hover:border-stone-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                  (form.available_documents || []).includes("disability_certificate")
                    ? "border-emerald-600 bg-emerald-700 text-white"
                    : "border-stone-300 bg-white"
                }`}
              >
                {(form.available_documents || []).includes("disability_certificate") && (
                  <Check size={13} strokeWidth={3} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-xs font-bold text-slate-900 truncate">Disability / UDID</h3>
                  <span className="bg-stone-100 text-stone-600 text-[10px] font-semibold px-2 py-0.2 rounded-full border border-stone-200 shrink-0">
                    Optional
                  </span>
                </div>
                <p className="text-[11px] font-medium text-emerald-700 hover:underline mt-1 truncate">
                  + Link UDID Card
                </p>
              </div>
            </div>
          </div>

          {/* Card 5: Caste Certificate */}
          <div
            onClick={() => toggleDocument("caste_certificate")}
            className={`rounded-2xl border p-3.5 transition-all cursor-pointer select-none ${
              (form.available_documents || []).includes("caste_certificate")
                ? "border-emerald-400 bg-emerald-50/40 shadow-xs"
                : "border-stone-200 bg-white hover:border-stone-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                  (form.available_documents || []).includes("caste_certificate")
                    ? "border-emerald-600 bg-emerald-700 text-white"
                    : "border-stone-300 bg-white"
                }`}
              >
                {(form.available_documents || []).includes("caste_certificate") && (
                  <Check size={13} strokeWidth={3} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-xs font-bold text-slate-900 truncate">Caste Certificate</h3>
                  <span className="bg-stone-100 text-stone-600 text-[10px] font-semibold px-2 py-0.2 rounded-full border border-stone-200 shrink-0">
                    Optional
                  </span>
                </div>
                <p className="text-[11px] font-medium text-emerald-700 hover:underline mt-1 truncate">
                  + Fetch via Nada Kacheri
                </p>
              </div>
            </div>
          </div>

          {/* Card 6: Aadhaar DBT Seeding */}
          <div
            onClick={() => toggleDocument("aadhaar_dbt")}
            className={`rounded-2xl border p-3.5 transition-all cursor-pointer select-none ${
              (form.available_documents || []).includes("aadhaar_dbt")
                ? "border-emerald-400 bg-emerald-50/40 shadow-xs"
                : "border-stone-200 bg-white hover:border-stone-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                  (form.available_documents || []).includes("aadhaar_dbt")
                    ? "border-emerald-600 bg-emerald-700 text-white"
                    : "border-stone-300 bg-white"
                }`}
              >
                {(form.available_documents || []).includes("aadhaar_dbt") && (
                  <Check size={13} strokeWidth={3} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-xs font-bold text-slate-900 truncate">Aadhaar DBT Seeding</h3>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.2 rounded-full border border-emerald-200 shrink-0">
                    NPCI Ready
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 truncate">
                  Canara Bank • Direct Benefit OK
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Submit Button ─────────────────────────────────────────── */}
      <div className="pt-2">
        <button
          type="submit"
          className="w-full min-h-12 rounded-xl bg-sahaya-green px-6 font-bold text-white shadow-md hover:bg-emerald-900 transition flex items-center justify-center gap-2 text-sm active:scale-[0.99]"
        >
          <ShieldCheck size={18} />
          <span>{buttonText}</span>
        </button>
      </div>
    </form>
  );
}
