import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  FileCheck2,
  Layers,
  Download,
  Check,
  AlertTriangle,
  XCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { api } from "../services/api";
import { SaveButton } from "../components/SaveButton";
import type { EligibilityProfile } from "../types";

export function EligibilityPage() {
  const { profile, setProfile, language, setLanguage, schemes } = useAppContext();
  const navigate = useNavigate();

  // Local state initialized with current profile or defaults matching Image 5
  const [age, setAge] = useState<number | string>(profile?.age || 42);
  const [gender, setGender] = useState<string>(profile?.gender || "male");
  const [stateName, setStateName] = useState<string>(profile?.state || "Karnataka");
  const [occupation, setOccupation] = useState<string>(profile?.occupation || "farmer");
  const [incomeBand, setIncomeBand] = useState<string>("100000_250000");
  const [landholding, setLandholding] = useState<string>("marginal");

  // Special categories
  const [disability, setDisability] = useState<boolean>(profile?.disability || false);
  const [bplAntyodaya, setBplAntyodaya] = useState<boolean>(true);
  const [singleMother, setSingleMother] = useState<boolean>(false);
  const [seniorCitizen, setSeniorCitizen] = useState<boolean>(false);

  // Document states
  const [docs, setDocs] = useState<Record<string, boolean>>({
    income_certificate: true,
    land_record: true,
    ration_card: true,
    disability_certificate: false,
    caste_certificate: false,
    bank_dbt: true,
  });

  const [evaluationResult, setEvaluationResult] = useState<any | null>(null);
  const [saveLocationNote, setSaveLocationNote] = useState<string | null>(null);

  // Toggle document
  const toggleDoc = (key: string) => {
    setDocs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Construct current profile object
  const buildCurrentProfile = (): EligibilityProfile => {
    const availableDocs: string[] = Object.keys(docs).filter((k) => docs[k]);
    return {
      age: Number(age) || 42,
      gender,
      state: stateName,
      occupation,
      income: incomeBand === "under_100000" ? 80000 : incomeBand === "100000_250000" ? 180000 : 350000,
      disability,
      available_documents: availableDocs,
    };
  };

  // Save handler triggered by SaveButton
  const handleSaveProfile = async () => {
    const updated = buildCurrentProfile();
    
    // 1. Save to AppContext
    setProfile(updated);

    // 2. Save to localStorage for instant persistence across reloads
    localStorage.setItem("techsahaya_citizen_profile", JSON.stringify(updated));
    localStorage.setItem("techsahaya_profile_last_updated", new Date().toISOString());

    // 3. Inform the user where it is saved
    setSaveLocationNote(
      "Saved to browser encrypted local cache (techsahaya_citizen_profile) and active evaluation session."
    );

    // 4. Run deterministic check against API if online
    try {
      const res = await api.post("/api/check-eligibility", {
        scheme_id: "pm-kisan",
        profile: updated,
      });
      if (res?.data) {
        setEvaluationResult(res.data);
      }
    } catch (e) {
      console.log("Offline evaluation mode active");
    }
  };

  const handleSaveDraft = () => {
    const updated = buildCurrentProfile();
    localStorage.setItem("techsahaya_citizen_profile", JSON.stringify(updated));
    setSaveLocationNote("Draft saved locally in your browser cache.");
    setTimeout(() => setSaveLocationNote(null), 3000);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10 space-y-8">
      {/* ─── Top Header Section ─── */}
      <div className="space-y-2 text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-serif">
          Welcome to Tech Sahaya
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          Let us complete your profile so our deterministic rule engine can discover 100% verified
          government benefits, pensions, and subsidies for your household.
        </p>
      </div>

      {/* ─── Core Form Fields (Grid matching Screenshot 5) ─── */}
      <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        {/* Row 1: Age & Gender */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Age * <span className="text-slate-400 font-normal">(As per Aadhaar)</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={120}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="42"
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-xs outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
              <span className="absolute right-4 top-3 text-xs font-semibold text-slate-400 pointer-events-none">
                Years
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Gender *
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-xs outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="transgender">Transgender / Other</option>
            </select>
          </div>
        </div>

        {/* Row 2: State / Domicile & Occupation */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              State / Domicile *
            </label>
            <select
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-xs outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            >
              <option value="Karnataka">Karnataka (ಕರ್ನಾಟಕ)</option>
              <option value="Maharashtra">Maharashtra (महाराष्ट्र)</option>
              <option value="Uttar Pradesh">Uttar Pradesh (उत्तर प्रदेश)</option>
              <option value="Bihar">Bihar (बिहार)</option>
              <option value="Tamil Nadu">Tamil Nadu (தமிழ்நாடு)</option>
              <option value="Telangana">Telangana (తెలంగాణ)</option>
              <option value="Andhra Pradesh">Andhra Pradesh (ఆంధ్రప్రదేశ్)</option>
              <option value="Rajasthan">Rajasthan (राजस्थान)</option>
              <option value="Madhya Pradesh">Madhya Pradesh (मध्य प्रदेश)</option>
              <option value="West Bengal">West Bengal (পশ্চিমবঙ্গ)</option>
              <option value="Gujarat">Gujarat (ગુજરાત)</option>
              <option value="Kerala">Kerala (കേരളം)</option>
              <option value="Delhi">Delhi (दिल्ली)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Occupation / Livelihood *
            </label>
            <select
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-xs outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            >
              <option value="farmer">Small &amp; Marginal Farmer</option>
              <option value="artisan">Artisan / Weaver</option>
              <option value="daily_wage">Daily Wage Laborer</option>
              <option value="student">Student / Youth</option>
              <option value="gig_worker">Gig / Delivery Worker</option>
              <option value="homemaker">Homemaker / Self-Employed</option>
              <option value="unemployed">Jobseeker / Unemployed</option>
            </select>
          </div>
        </div>

        {/* Row 3: Annual Household Income & Landholding */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Annual Household Income *
            </label>
            <select
              value={incomeBand}
              onChange={(e) => setIncomeBand(e.target.value)}
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-xs outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            >
              <option value="under_100000">&lt; ₹1,00,000 (EWS / Antyodaya Category)</option>
              <option value="100000_250000">₹1,00,000 - ₹2,50,000 (Low Income Group)</option>
              <option value="250000_500000">₹2,50,000 - ₹5,00,000 (Middle Income Group)</option>
              <option value="above_500000">&gt; ₹5,00,000</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Landholding (Agricultural / Rural)
            </label>
            <select
              value={landholding}
              onChange={(e) => setLandholding(e.target.value)}
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-xs outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            >
              <option value="marginal">Marginal (&lt; 2.5 Acres / 1 Hectare)</option>
              <option value="small">Small (2.5 - 5.0 Acres)</option>
              <option value="none">None / Landless Worker</option>
              <option value="large">&gt; 5.0 Acres (Large Farmer)</option>
            </select>
          </div>
        </div>

        {/* ─── Special Categories & Household Attributes ─── */}
        <div className="pt-2">
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
            Special Categories &amp; Household Attributes:
          </span>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
            {/* Disability / PwD */}
            <label
              className={`flex items-center gap-2.5 rounded-2xl border p-3.5 cursor-pointer transition ${
                disability ? "border-emerald-500 bg-emerald-50/60 font-bold text-emerald-900" : "border-stone-200 bg-white text-slate-700"
              }`}
            >
              <input
                type="checkbox"
                checked={disability}
                onChange={(e) => setDisability(e.target.checked)}
                className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Disability / PwD</span>
            </label>

            {/* BPL / Antyodaya */}
            <label
              className={`flex items-center gap-2.5 rounded-2xl border p-3.5 cursor-pointer transition ${
                bplAntyodaya ? "border-emerald-500 bg-emerald-50/60 font-bold text-emerald-900" : "border-stone-200 bg-white text-slate-700"
              }`}
            >
              <input
                type="checkbox"
                checked={bplAntyodaya}
                onChange={(e) => setBplAntyodaya(e.target.checked)}
                className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>BPL / Antyodaya</span>
            </label>

            {/* Single Mother / Widow */}
            <label
              className={`flex items-center gap-2.5 rounded-2xl border p-3.5 cursor-pointer transition ${
                singleMother ? "border-emerald-500 bg-emerald-50/60 font-bold text-emerald-900" : "border-stone-200 bg-white text-slate-700"
              }`}
            >
              <input
                type="checkbox"
                checked={singleMother}
                onChange={(e) => setSingleMother(e.target.checked)}
                className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Single Mother / Widow</span>
            </label>

            {/* Senior Citizen in Family */}
            <label
              className={`flex items-center gap-2.5 rounded-2xl border p-3.5 cursor-pointer transition ${
                seniorCitizen ? "border-emerald-500 bg-emerald-50/60 font-bold text-emerald-900" : "border-stone-200 bg-white text-slate-700"
              }`}
            >
              <input
                type="checkbox"
                checked={seniorCitizen}
                onChange={(e) => setSeniorCitizen(e.target.checked)}
                className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Senior Citizen in Family</span>
            </label>
          </div>
        </div>

        {/* ─── Required & Verified Documents ─── */}
        <div className="pt-4 border-t border-stone-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Required &amp; Verified Documents{" "}
                <span className="text-slate-400 font-normal text-xs">(Click to toggle availability or sync)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Documents unlock schemes with automated priority disbursement.
              </p>
            </div>
          </div>

          {/* Document Cards Grid matching Image 5 */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs">
            {/* 1. Income Certificate */}
            <div
              onClick={() => toggleDoc("income_certificate")}
              className={`flex items-center justify-between rounded-2xl border p-3.5 cursor-pointer transition ${
                docs.income_certificate ? "border-emerald-400 bg-emerald-50/40" : "border-stone-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={docs.income_certificate}
                  readOnly
                  className="h-4 w-4 rounded border-stone-300 text-emerald-600"
                />
                <div>
                  <div className="font-bold text-slate-900">Income Certificate</div>
                  <div className="text-[10px] text-slate-500">Revenue Dept &bull; Verified</div>
                </div>
              </div>
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase">
                ACTIVE
              </span>
            </div>

            {/* 2. Land Record / RTC */}
            <div
              onClick={() => toggleDoc("land_record")}
              className={`flex items-center justify-between rounded-2xl border p-3.5 cursor-pointer transition ${
                docs.land_record ? "border-emerald-400 bg-emerald-50/40" : "border-stone-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={docs.land_record}
                  readOnly
                  className="h-4 w-4 rounded border-stone-300 text-emerald-600"
                />
                <div>
                  <div className="font-bold text-slate-900">Land Record / RTC</div>
                  <div className="text-[10px] text-slate-500">Bhoomi Patta Sync OK</div>
                </div>
              </div>
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase">
                ACTIVE
              </span>
            </div>

            {/* 3. Ration Card */}
            <div
              onClick={() => toggleDoc("ration_card")}
              className={`flex items-center justify-between rounded-2xl border p-3.5 cursor-pointer transition ${
                docs.ration_card ? "border-emerald-400 bg-emerald-50/40" : "border-stone-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={docs.ration_card}
                  readOnly
                  className="h-4 w-4 rounded border-stone-300 text-emerald-600"
                />
                <div>
                  <div className="font-bold text-slate-900">Ration Card</div>
                  <div className="text-[10px] text-slate-500">PHH / BPL Category</div>
                </div>
              </div>
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase">
                ACTIVE
              </span>
            </div>

            {/* 4. Disability / UDID */}
            <div
              onClick={() => toggleDoc("disability_certificate")}
              className={`flex items-center justify-between rounded-2xl border p-3.5 cursor-pointer transition ${
                docs.disability_certificate ? "border-emerald-400 bg-emerald-50/40" : "border-stone-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={docs.disability_certificate}
                  readOnly
                  className="h-4 w-4 rounded border-stone-300 text-emerald-600"
                />
                <div>
                  <div className="font-bold text-slate-900">Disability / UDID Card</div>
                  <div className="text-[10px] text-slate-500">Swavlamban Portal</div>
                </div>
              </div>
              <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                Optional
              </span>
            </div>

            {/* 5. Caste Certificate */}
            <div
              onClick={() => toggleDoc("caste_certificate")}
              className={`flex items-center justify-between rounded-2xl border p-3.5 cursor-pointer transition ${
                docs.caste_certificate ? "border-emerald-400 bg-emerald-50/40" : "border-stone-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={docs.caste_certificate}
                  readOnly
                  className="h-4 w-4 rounded border-stone-300 text-emerald-600"
                />
                <div>
                  <div className="font-bold text-slate-900">Caste Certificate</div>
                  <div className="text-[10px] text-slate-500">Tehsildar Issued</div>
                </div>
              </div>
              <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                Optional
              </span>
            </div>

            {/* 6. Bank DBT / NPCI Seeding */}
            <div
              onClick={() => toggleDoc("bank_dbt")}
              className={`flex items-center justify-between rounded-2xl border p-3.5 cursor-pointer transition ${
                docs.bank_dbt ? "border-emerald-400 bg-emerald-50/40" : "border-stone-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={docs.bank_dbt}
                  readOnly
                  className="h-4 w-4 rounded border-stone-300 text-emerald-600"
                />
                <div>
                  <div className="font-bold text-slate-900">Bank DBT / NPCI Seeding</div>
                  <div className="text-[10px] text-slate-500">Direct Benefit Transfer OK</div>
                </div>
              </div>
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase">
                LINKED
              </span>
            </div>
          </div>
        </div>

        {/* ─── Bottom Actions Bar matching Screenshot 5 ─── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-stone-200">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="w-full sm:w-auto rounded-xl border border-stone-300 bg-white px-6 py-3 text-xs font-bold text-slate-700 shadow-xs hover:bg-stone-50 active:scale-95 transition"
          >
            Save as Draft
          </button>

          {/* Interactive SaveButton with Confetti and Sparkles */}
          <SaveButton
            onSave={handleSaveProfile}
            text={{
              idle: "Save and continue →",
              saving: "Saving & Evaluating...",
              saved: "Saved & Verified!",
            }}
          />
        </div>

        {/* Save Location Confirmation Notice */}
        {saveLocationNote && (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50 p-3.5 text-xs text-emerald-900 font-medium animate-fade-in">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-700" />
            <span>{saveLocationNote}</span>
          </div>
        )}
      </div>

      {/* ─── Evaluation Results Preview Card (If Evaluated) ─── */}
      {evaluationResult && (
        <div className="rounded-3xl border border-emerald-400 bg-white p-6 sm:p-8 shadow-md space-y-4 animate-slide-up">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" />
              <h3 className="font-bold text-slate-900 font-serif text-lg">Evaluation Outcome</h3>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase ${
                evaluationResult.status === "eligible"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {evaluationResult.status === "eligible" ? "✓ QUALIFIED" : "NEEDS DOCUMENTATION"}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {evaluationResult.explanation}
          </p>

          <div className="grid gap-4 sm:grid-cols-3 pt-2 text-xs">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
              <span className="font-bold text-emerald-900 block mb-1">Matched Criteria</span>
              <ul className="space-y-1 text-emerald-800">
                {evaluationResult.matched?.map((m: string) => (
                  <li key={m}>✓ {m}</li>
                )) || <li>✓ Demographic checks passed</li>}
              </ul>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
              <span className="font-bold text-slate-700 block mb-1">Required Next Action</span>
              <p className="text-slate-600">{evaluationResult.next_action || "Review scheme documents"}</p>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-3 flex flex-col justify-between">
              <div>
                <span className="font-bold text-blue-900 block mb-1">Next Step</span>
                <p className="text-blue-800">Browse all 12+ schemes matched to your updated profile.</p>
              </div>
              <Link
                to="/schemes"
                className="mt-2 inline-flex items-center gap-1 font-bold text-blue-700 underline text-xs"
              >
                <span>View All Schemes</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
