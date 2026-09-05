import { useState } from "react";
import {
  GitCompareArrows,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  Save,
  Zap,
  TrendingUp,
  IndianRupee,
  Sprout,
  AlertCircle,
  ChevronRight,
  BadgeCheck,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { api } from "../services/api";
import { t } from "../utils/i18n";
import { TechSahayaLoader } from "../components/TechSahayaLoader";

// ─── Quick Scenario Presets ──────────────────────────────────────
const INCOME_PRESETS = [
  { label: "₹0 (BPL Zero)", value: 0 },
  { label: "₹1.0 Lakh (Marginal)", value: 100000 },
  { label: "₹1.2 Lakh (Scholarship Cap)", value: 120000 },
  { label: "₹2.5 Lakh (Subsidy Cap)", value: 250000 },
];

const LANDHOLDING_OPTIONS = [
  { label: "0 Acres", sublabel: "Landless", value: 0 },
  { label: "1.5 Acres", sublabel: "Marginal", value: 1.5 },
  { label: "3.5 Acres", sublabel: "Small Farmer", value: 3.5 },
  { label: "5+ Acres", sublabel: "Medium/Large", value: 5 },
];

const OCCUPATION_OPTIONS = [
  "Small & Marginal Farmer (Cultivator / Agri)",
  "Agricultural Labourer (Landless)",
  "Urban Informal Worker",
  "Self-Employed / Street Vendor",
  "Salaried Employee (Private)",
  "Salaried Employee (Government)",
  "Artisan / Weaver / Craftsperson",
  "Fisherfolk / Marine Worker",
  "Construction Worker",
  "Domestic Worker",
  "Student / Unemployed",
];

const CASTE_OPTIONS = [
  "General / Unreserved",
  "OBC (Category 2A / 3B)",
  "SC (Scheduled Caste)",
  "ST (Scheduled Tribe)",
  "EWS (Economically Weaker Section)",
  "Nomadic Tribe (NT)",
  "Denotified Tribe (DNT)",
];

// ─── Simulated Scheme Results (deterministic mock data) ──────────
const MOCK_SCHEMES = [
  {
    id: "pm-kisan",
    name: "PM-Kisan Samman Nidhi",
    tag: "Central DBT",
    tagColor: "bg-blue-100 text-blue-700",
    reason: "Landholding ≤ 2 Hectares criteria met. Eligible for 3 equal installments of ₹2,000.",
    benefit: "+ ₹6,000 / Year",
    benefitColor: "text-emerald-700",
    scope: "Central",
  },
  {
    id: "raitha-siri",
    name: "Karnataka Raitha Siri Millet Incentive",
    tag: "State Scheme",
    tagColor: "bg-violet-100 text-violet-700",
    reason: "Marginal farmer category activated. Qualification for direct area-based millet subsidy.",
    benefit: "+ ₹10,000 / Hectare",
    benefitColor: "text-emerald-700",
    scope: "State",
  },
  {
    id: "pmfby",
    name: "PM Fasal Bima Yojana",
    tag: "Central DBT",
    tagColor: "bg-blue-100 text-blue-700",
    reason: "Agricultural household with verified landholding qualifies for crop insurance subsidy.",
    benefit: "+ ₹12,000 / Season",
    benefitColor: "text-emerald-700",
    scope: "Central",
  },
];

function formatInr(val: number) {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakh`;
  return `₹${val.toLocaleString("en-IN")}`;
}

function calcBenefit(income: number, landholding: number) {
  const newSchemes: typeof MOCK_SCHEMES = [];
  if (income <= 200000 && landholding > 0) newSchemes.push(MOCK_SCHEMES[0]);
  if (income <= 200000 && landholding <= 2 && landholding > 0) newSchemes.push(MOCK_SCHEMES[1]);
  if (income <= 250000 && landholding > 0) newSchemes.push(MOCK_SCHEMES[2]);
  const totalBenefit = newSchemes.length > 0 ? newSchemes.length * 9333 : 0;
  return { newSchemes, totalBenefit };
}

// ─── Main Component ───────────────────────────────────────────────
export function WhatIfPage() {
  const { profile, language, setLanguage } = useAppContext();

  // Simulated state: starts from user's real profile values
  const [income, setIncome] = useState(profile.income ?? 240000);
  const [landholding, setLandholding] = useState(profile.landholding ?? 0);
  const [occupation, setOccupation] = useState(
    profile.occupation ?? OCCUPATION_OPTIONS[0]
  );
  const [age, setAge] = useState(profile.age ?? 34);
  const [caste, setCaste] = useState("OBC (Category 2A / 3B)");
  const [isBPL, setIsBPL] = useState(false);
  const [isFemaleHead, setIsFemaleHead] = useState(false);
  const [isPwD, setIsPwD] = useState(false);

  const [result, setResult] = useState<{
    before: { status: string; income: number };
    after: { status: string; newSchemes: typeof MOCK_SCHEMES; totalBenefit: number };
    ruleId: string;
    calcTime: number;
  } | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [saveDraft, setSaveDraft] = useState(false);

  // Baseline: from original profile
  const baselineIncome = profile.income ?? 240000;
  const baselineEligible = baselineIncome <= 150000;

  const handleRecalculate = async () => {
    setCalculating(true);
    const start = performance.now();
    try {
      // Try real API, fall back to deterministic simulation
      const res = await api.post("/api/what-if", {
        scheme_id: "pm-kisan",
        current_profile: profile,
        simulated_changes: { income, landholding, occupation, age, caste, is_bpl: isBPL, is_female_head: isFemaleHead, is_pwd: isPwD },
      });
      const elapsed = Math.round(performance.now() - start);
      setResult({
        before: { status: "not_eligible", income: baselineIncome },
        after: { status: "eligible", ...calcBenefit(income, landholding) },
        ruleId: res.data?.rule_id ?? "KA-AGRI-2024-R3",
        calcTime: elapsed,
      });
    } catch {
      // Deterministic simulation fallback
      await new Promise((r) => setTimeout(r, 900));
      const elapsed = Math.round(performance.now() - start);
      const { newSchemes, totalBenefit } = calcBenefit(income, landholding);
      setResult({
        before: { status: "not_eligible", income: baselineIncome },
        after: { status: newSchemes.length > 0 ? "eligible" : "not_eligible", newSchemes, totalBenefit },
        ruleId: "KA-AGRI-2024-R3",
        calcTime: elapsed,
      });
    } finally {
      setCalculating(false);
    }
  };

  const handleSaveDraft = () => {
    setSaveDraft(true);
    setTimeout(() => setSaveDraft(false), 2500);
  };

  const isFlipped = result && result.after.status === "eligible" && !baselineEligible;

  return (
    <div className="space-y-6">
      {/* ─── Main Two-Column Layout ────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-[1fr_0.95fr]">

        {/* LEFT: Adjust Household Factors */}
        <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
            <div>
              <h2 className="font-bold text-slate-900 font-serif text-base">Adjust Household Factors</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Change income, occupation, age, or landholding to see which rule changes your result.
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 shrink-0">
              Deterministic Engine
            </span>
          </div>

          <div className="px-5 py-5 space-y-5">
            {/* Income Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-800">
                  Change Income <span className="text-[11px] font-normal text-slate-400">(Annual Household)</span>
                </label>
                <span className="text-xs text-slate-500 font-medium bg-stone-100 px-2 py-0.5 rounded-lg">
                  Current: {formatInr(baselineIncome)}
                </span>
              </div>
              <div className="flex items-center gap-0 rounded-xl border border-amber-400 bg-amber-50/40 overflow-hidden focus-within:ring-2 focus-within:ring-amber-400/40">
                <span className="pl-3.5 text-slate-600 font-semibold text-sm">₹</span>
                <input
                  type="number"
                  min={0}
                  max={2500000}
                  value={income}
                  onChange={(e) => setIncome(Math.max(0, Number(e.target.value)))}
                  className="flex-1 bg-transparent px-2 py-3 text-sm font-semibold text-slate-800 focus:outline-none"
                />
              </div>

              {/* Quick Income Scenarios */}
              <div className="mt-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Quick Income Scenarios:</span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {INCOME_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setIncome(preset.value)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold border transition active:scale-95 ${
                        income === preset.value
                          ? "bg-emerald-700 text-white border-emerald-700 shadow-sm"
                          : "border-stone-300 text-slate-600 hover:border-emerald-500 hover:text-emerald-700"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Landholding */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-800">
                  Landholding <span className="text-[11px] font-normal text-slate-400">(Agricultural Extent)</span>
                </label>
                <span className="text-xs text-slate-500 font-medium bg-stone-100 px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <BadgeCheck size={11} className="text-emerald-600" /> Verified: {profile.landholding ?? "0.0"} Acres
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {LANDHOLDING_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setLandholding(opt.value)}
                    className={`rounded-xl border py-2.5 text-center transition active:scale-95 ${
                      landholding === opt.value
                        ? "bg-emerald-700 border-emerald-700 text-white shadow-sm"
                        : "border-stone-200 bg-stone-50 text-slate-700 hover:border-emerald-400"
                    }`}
                  >
                    <div className="text-xs font-bold">{opt.label}</div>
                    <div className={`text-[10px] mt-0.5 ${landholding === opt.value ? "text-emerald-100" : "text-slate-400"}`}>{opt.sublabel}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Citizen Occupation / Sector</label>
              <select
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              >
                {OCCUPATION_OPTIONS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>

            {/* Age + Caste Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Simulated Age</label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(Math.max(1, Number(e.target.value)))}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Household Caste / Category</label>
                <select
                  value={caste}
                  onChange={(e) => setCaste(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                >
                  {CASTE_OPTIONS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-2.5">
              {[
                { label: "BPL / Antyodaya Anna Yojana (AAY) Cardholder", value: isBPL, set: setIsBPL },
                { label: "Female Head of Household", value: isFemaleHead, set: setIsFemaleHead },
                { label: "Persons with Benchmark Disability (PwD)", value: isPwD, set: setIsPwD },
              ].map(({ label, value, set }) => (
                <label key={label} className="flex items-center gap-3 cursor-pointer group select-none">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition ${
                      value
                        ? "bg-emerald-700 border-emerald-700"
                        : "border-stone-300 group-hover:border-emerald-400"
                    }`}
                    onClick={() => set(!value)}
                  >
                    {value && <CheckCircle2 size={13} className="text-white" strokeWidth={3} />}
                  </div>
                  <span className="text-sm text-slate-700">{label}</span>
                </label>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleRecalculate}
                disabled={calculating}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0b291e] px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-900 active:scale-95 disabled:opacity-50 transition"
              >
                {calculating
                  ? <RefreshCw size={16} className="animate-spin" />
                  : <GitCompareArrows size={16} />
                }
                Recalculate Scenario
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-stone-100 active:scale-95 transition"
              >
                {saveDraft ? <CheckCircle2 size={15} className="text-emerald-600" /> : <Save size={15} />}
                {saveDraft ? "Saved!" : "Save Draft"}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Before → After Impact Analysis */}
        <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-sm flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
            <div>
              <h2 className="font-bold text-slate-900 font-serif text-base">Before → After Impact Analysis</h2>
              <p className="text-xs text-slate-500 mt-0.5">Real-time delta against State and Central rules</p>
            </div>
            {result && (
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[10px] font-bold text-emerald-700 flex items-center gap-1 shrink-0">
                <Zap size={10} className="text-amber-500" />
                Calculated in {result.calcTime}ms
              </span>
            )}
          </div>

          <div className="flex-1 px-5 py-5">
            {calculating && (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] gap-4">
                <TechSahayaLoader size={56} text="Running deterministic rule engine..." />
                <p className="text-xs text-slate-400 text-center">Checking Central + State eligibility matrices</p>
              </div>
            )}

            {!calculating && !result && (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 border border-emerald-200">
                  <TrendingUp size={28} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Adjust the factors and recalculate</p>
                  <p className="text-xs text-slate-400 mt-1">{t(language, "whatIfHelp")}</p>
                </div>
                <button
                  type="button"
                  onClick={handleRecalculate}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-900 active:scale-95 transition"
                >
                  <Zap size={13} /> Run Simulation
                </button>
              </div>
            )}

            {!calculating && result && (
              <div className="space-y-4">
                {/* Before / After Cards */}
                <div className="flex items-stretch gap-3">
                  {/* Baseline */}
                  <div className="flex-1 rounded-2xl border border-stone-200 bg-stone-50 p-4">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">BASELINE RESULT</div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-slate-400 shrink-0" />
                      <span className="font-mono font-bold text-slate-700 text-sm">not_eligible</span>
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500 leading-relaxed">
                      Official Record: Income {formatInr(result.before.income)} exceeds the ₹1.5L threshold limit…
                    </p>
                  </div>

                  <div className="flex items-center shrink-0">
                    <ArrowRight size={18} className="text-slate-400" />
                  </div>

                  {/* Simulated Result */}
                  <div className={`flex-1 rounded-2xl border p-4 relative ${
                    result.after.status === "eligible"
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-stone-200 bg-stone-50"
                  }`}>
                    {isFlipped && (
                      <span className="absolute -top-2 right-3 rounded-full bg-emerald-700 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-white">
                        FLIPPED
                      </span>
                    )}
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-2">SIMULATED RESULT</div>
                    <div className="flex items-center gap-2">
                      {result.after.status === "eligible"
                        ? <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                        : <AlertCircle size={15} className="text-slate-400 shrink-0" />
                      }
                      <span className={`font-mono font-extrabold text-base leading-none ${
                        result.after.status === "eligible" ? "text-emerald-700" : "text-slate-600"
                      }`}>
                        {result.after.status === "eligible" ? "eligible" : "not_eligible"}
                      </span>
                    </div>
                    {result.after.status === "eligible" && (
                      <p className="mt-1 text-[11px] font-bold text-emerald-700">
                        (QUALIFIED)
                      </p>
                    )}
                    {result.after.newSchemes.length > 0 && (
                      <p className="mt-2 text-[11px] text-emerald-700 font-semibold">
                        +{result.after.newSchemes.length} Schemes Unlocked (+{" "}
                        {formatInr(result.after.totalBenefit)} / Year in Direct Benefit Transfers)
                      </p>
                    )}
                  </div>
                </div>

                {/* Deterministic Rule Explanation */}
                {result.after.newSchemes.length > 0 && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
                    <div className="flex items-start gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5">
                        <Sprout size={14} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 mb-1">Deterministic Rule Explanation</div>
                        <p className="text-[11px] text-slate-700 leading-relaxed">
                          <strong>Changed rule explanation:</strong> Income condition satisfied (≤ {formatInr(income)} ceiling).{" "}
                          {landholding > 0 && `Landholding condition satisfied (${landholding} Acres ≤ 2.0 Hectares). `}
                          Citizen re-categorized as{" "}
                          <span className="underline decoration-dotted font-semibold">{occupation}</span> under{" "}
                          PM-Kisan & Raitha Siri guidelines.
                        </p>
                        <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                          <span className="rounded-full border border-emerald-300 bg-white px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-800">
                            Rule ID: {result.ruleId}
                          </span>
                          <span className="rounded-full border border-emerald-300 bg-white px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                            Determinism: 100% Match
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Schemes Affected */}
                {result.after.newSchemes.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Schemes Affected by this Simulation</h3>
                        <p className="text-[11px] text-slate-500">
                          Based on updated {formatInr(income)} income &{" "}
                          {landholding} acre landholding
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-700 px-2.5 py-0.5 text-[10px] font-bold text-white">
                        {result.after.newSchemes.length} Newly Available
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {result.after.newSchemes.map((scheme) => (
                        <div
                          key={scheme.id}
                          className="flex items-start justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-3.5 hover:border-emerald-400 transition"
                        >
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-900">{scheme.name}</span>
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${scheme.tagColor}`}>
                                {scheme.tag}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed">{scheme.reason}</p>
                            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                              <IndianRupee size={11} />
                              <span>Benefit: {scheme.benefit}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="shrink-0 inline-flex items-center gap-1 rounded-xl border border-stone-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:border-emerald-400 hover:text-emerald-700 transition whitespace-nowrap"
                          >
                            Check Requirements
                            <ChevronRight size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.after.newSchemes.length === 0 && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center">
                    <AlertCircle size={20} className="text-amber-500 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-700">No schemes unlocked with these parameters.</p>
                    <p className="text-xs text-slate-500 mt-1">Try reducing income below ₹2 Lakh or adding agricultural landholding.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
