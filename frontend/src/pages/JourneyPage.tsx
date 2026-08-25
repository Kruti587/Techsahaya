import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Circle, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionCard } from "../components/SectionCard";
import { useAppContext } from "../context/AppContext";
import { api } from "../services/api";
import { t } from "../utils/i18n";

const fallbackSteps = ["Discover", "Eligibility", "Documents", "Apply", "Verification", "Approval", "Benefit", "Renewal"];

export function JourneyPage() {
  const { language } = useAppContext();
  const [journey, setJourney] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    api.get("/api/journey").then((res) => setJourney(res.data)).catch(() => setJourney([])).finally(() => setLoading(false));
  }, []);
  return (
    <div className="space-y-5">
      <section className="rounded-3xl bg-white p-6 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-wide text-sahaya-saffron">{t(language, "welfareJourney")}</p>
        <h1 className="mt-1 text-3xl font-bold text-sahaya-ink">{t(language, "welfareJourney")}</h1>
        <p className="mt-2 max-w-3xl text-slate-600">{t(language, "journeyUse")}</p>
      </section>
      <SectionCard title={t(language, "welfareJourney")}>
        {loading && <div className="grid gap-3">{[1, 2, 3, 4].map((item) => <div key={item} className="h-24 animate-pulse rounded-2xl bg-stone-100" />)}</div>}
        {!loading && journey.length === 0 && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-dashed p-6 text-center">
              <Clock3 className="mx-auto text-sahaya-green" size={36} />
              <h2 className="mt-3 text-xl font-semibold">{t(language, "noJourney")}</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">{t(language, "startJourneyHelp")}</p>
              <Link to="/find-schemes" className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-xl bg-sahaya-green px-4 font-semibold text-white">{t(language, "startWithSchemes")} <ArrowRight size={18} /></Link>
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              {fallbackSteps.map((step, index) => (
                <div key={step} className="rounded-2xl border bg-white p-4 text-center">
                  <Circle className="mx-auto text-slate-300" />
                  <div className="mt-2 text-sm font-semibold">{index + 1}. {step}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {!loading && journey.length > 0 && (
          <div className="grid gap-3">
            {journey.map((item, index) => (
              <article key={`${item.scheme_id}-${item.step}-${index}`} className="rounded-2xl border p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 font-semibold">
                    {item.status === "completed" ? <CheckCircle2 className="text-sahaya-green" size={20} /> : <Circle className="text-slate-300" size={20} />}
                    {item.scheme_name}: {item.step}
                  </div>
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold">{item.status}</span>
                </div>
                <div className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-3">
                  <div><b>{t(language, "nextAction")}:</b><br />{item.action}</div>
                  <div><b>{t(language, "requiredDocument")}:</b><br />{item.required_document || "To be confirmed"}</div>
                  <div><b>{t(language, "deadline")}:</b><br />{item.deadline}</div>
                </div>
              </article>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
