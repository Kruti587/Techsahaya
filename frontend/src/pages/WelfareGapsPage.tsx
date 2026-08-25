import { useEffect, useState } from "react";
import { ArrowRight, FileQuestion, SearchCheck, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionCard } from "../components/SectionCard";
import { useAppContext } from "../context/AppContext";
import { api } from "../services/api";
import { t } from "../utils/i18n";

export function WelfareGapsPage() {
  const { profile, language } = useAppContext();
  const [gaps, setGaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    api.get("/api/welfare-gaps", { params: profile }).then((res) => setGaps(res.data)).catch(() => setGaps([])).finally(() => setLoading(false));
  }, [profile]);
  return (
    <div className="space-y-5">
      <section className="rounded-3xl bg-white p-6 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-wide text-sahaya-saffron">{t(language, "missingBenefits")}</p>
        <h1 className="mt-1 text-3xl font-bold text-sahaya-ink">{t(language, "missingBenefits")}</h1>
        <p className="mt-2 max-w-3xl text-slate-600">{t(language, "welfareGapsUse")}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/profile" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-sahaya-green px-4 font-semibold text-white">Complete profile <ArrowRight size={18} /></Link>
          <Link to="/documents" className="inline-flex min-h-12 items-center gap-2 rounded-xl border px-4 font-semibold text-sahaya-green">Add documents</Link>
        </div>
      </section>
      <SectionCard title={t(language, "missingBenefits")}>
        <div className="space-y-4">
          {loading && [1, 2, 3].map((item) => <div key={item} className="h-28 animate-pulse rounded-2xl bg-stone-100" />)}
          {!loading && gaps.length === 0 && (
            <div className="rounded-2xl border border-dashed p-6 text-center">
              <FileQuestion className="mx-auto text-sahaya-green" size={36} />
              <h2 className="mt-3 text-xl font-semibold">{t(language, "noWelfareGaps")}</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">{t(language, "improveGapDetection")}</p>
            </div>
          )}
          {!loading && gaps.map((gap) => (
            <article key={gap.scheme} className="rounded-2xl border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-lg font-semibold"><SearchCheck className="text-sahaya-green" size={20} /> {gap.scheme}</div>
                  <div className="mt-1 text-sm text-slate-600">Estimated relevance: {gap.estimated_relevance}%</div>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-sahaya-green">{gap.reason_category}</span>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl bg-stone-50 p-3 text-sm"><b>{t(language, "whyItMatches")}:</b><br />{gap.why_it_may_apply}</div>
                <div className="rounded-xl bg-stone-50 p-3 text-sm"><b>{t(language, "whyMissed")}:</b><br />{gap.why_missed}</div>
                <div className="rounded-xl bg-stone-50 p-3 text-sm"><b>{t(language, "missingInfo")}:</b><br />{gap.missing_document_or_information}</div>
                <div className="rounded-xl bg-emerald-50 p-3 text-sm"><b>{t(language, "nextAction")}:</b><br />{gap.recommended_next_action}</div>
              </div>
              <Link to="/eligibility" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-sahaya-green px-4 text-sm font-semibold text-white">{t(language, "reviewEligibility")} <ArrowRight size={16} /></Link>
            </article>
          ))}
        </div>
      </SectionCard>
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-sahaya-green">
        <ShieldCheck className="mr-2 inline" size={18} /> Gap detection uses your own profile only. It does not require Aadhaar or PAN for basic checks.
      </div>
    </div>
  );
}
