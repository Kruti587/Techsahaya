import { useState } from "react";
import { AlertTriangle, CheckCircle2, FileUp, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { ProfileForm } from "../components/ProfileForm";
import { SectionCard } from "../components/SectionCard";
import { useAppContext } from "../context/AppContext";
import { api } from "../services/api";
import { t } from "../utils/i18n";

export function EligibilityPage() {
  const { profile, setProfile, schemes, language } = useAppContext();
  const [schemeId, setSchemeId] = useState("pm-kisan");
  const [result, setResult] = useState<any | null>(null);
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
      <SectionCard title={t(language, "eligibilityProfile")}>
        <div className="mb-4">
          <select className="min-h-12 w-full rounded-xl border p-3" value={schemeId} onChange={(e) => setSchemeId(e.target.value)}>
            {schemes.map((scheme) => <option key={scheme.id} value={scheme.id}>{scheme.name}</option>)}
          </select>
        </div>
        <ProfileForm
          initialValue={profile}
          submitLabel={t(language, "runEligibility")}
          onSubmit={async (nextProfile) => {
            setProfile(nextProfile);
            const res = await api.post("/api/check-eligibility", { scheme_id: schemeId, profile: nextProfile });
            setResult(res.data);
          }}
        />
      </SectionCard>
      <SectionCard title={t(language, "result")}>
        {!result && <p className="text-sm text-slate-600">{t(language, "fillProfileRunCheck")}</p>}
        {result && (
          <div className="space-y-3">
            <div className={`rounded-xl p-4 text-white ${result.status === "eligible" ? "bg-emerald-700" : result.status === "not_eligible" ? "bg-red-700" : "bg-amber-600"}`}>{result.status.toUpperCase().replaceAll("_", " ")}</div>
            <p>{result.explanation}</p>
            <p><span className="font-medium">{t(language, "nextAction")}:</span> {result.next_action}</p>
            <div className="grid gap-3">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3">
                <div className="mb-2 flex items-center gap-2 font-semibold text-emerald-900"><CheckCircle2 size={18} /> {t(language, "matched")}</div>
                {result.matched.length ? result.matched.map((item: string) => <div key={item} className="text-sm text-emerald-900">✓ {item}</div>) : <div className="text-sm">{t(language, "none")}</div>}
              </div>
              <div className="rounded-2xl border border-red-100 bg-red-50 p-3">
                <div className="mb-2 flex items-center gap-2 font-semibold text-red-900"><XCircle size={18} /> {t(language, "failed")}</div>
                {result.failed.length ? result.failed.map((item: string) => <div key={item} className="text-sm text-red-900">✕ {item}</div>) : <div className="text-sm">{t(language, "none")}</div>}
              </div>
              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-3">
                <div className="mb-2 flex items-center gap-2 font-semibold text-amber-900"><AlertTriangle size={18} /> {t(language, "missing")}</div>
                {result.missing.length ? result.missing.map((item: string) => <div key={item} className="text-sm text-amber-900">! {item}</div>) : <div className="text-sm">{t(language, "none")}</div>}
                {(result.failed.some((item: string) => item.toLowerCase().includes("document")) || result.missing.length > 0) && (
                  <Link to="/documents" className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-xl bg-white px-3 text-sm font-semibold text-sahaya-green"><FileUp size={16} /> {t(language, "uploadThisDocument")}</Link>
                )}
              </div>
            </div>
            <div><span className="font-medium">{t(language, "alternativeSchemes")}:</span> {result.alternative_schemes.join(", ") || t(language, "none")}</div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
