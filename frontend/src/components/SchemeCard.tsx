import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import type { Scheme } from "../types";
import { t } from "../utils/i18n";
import { getLocalizedScheme } from "../utils/schemeLocalization";

export function SchemeCard({ scheme: rawScheme }: { scheme: Scheme }) {
  const { language } = useAppContext();
  const scheme = getLocalizedScheme(rawScheme, language);

  const coverageText = scheme.state_scope.some((s) => s.includes("All") || s.includes("सभी") || s.includes("ಎಲ್ಲಾ"))
    ? language === "hi" ? "अखिल भारतीय" : language === "kn" ? "ಸಂಪೂರ್ಣ ಭಾರತ" : "All India"
    : scheme.state_scope.join(", ");

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-sahaya-ink">{scheme.name}</h3>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">{scheme.category}</span>
      </div>
      <p className="mb-4 text-sm leading-6 text-slate-600">{scheme.description}</p>
      <div className="mb-4 grid gap-2 text-sm">
        <p><span className="font-semibold">{t(language, "coverage")}:</span> {coverageText}</p>
        <p><span className="font-semibold">{t(language, "officialSource")}:</span> {scheme.source_name}</p>
        <p><span className="font-semibold">{t(language, "requiredDocuments")}:</span> {scheme.required_documents.slice(0, 3).join(", ")}</p>
      </div>
      <div className="mt-auto flex flex-wrap gap-2">
        <Link to={`/schemes/${scheme.id}`} className="inline-flex min-h-12 items-center rounded-xl bg-sahaya-green px-4 font-semibold text-white">
          {t(language, "understandScheme")}
        </Link>
        <Link to="/eligibility" className="inline-flex min-h-12 items-center rounded-xl border px-4 font-semibold text-sahaya-green">
          {t(language, "checkEligibility")}
        </Link>
      </div>
    </article>
  );
}
