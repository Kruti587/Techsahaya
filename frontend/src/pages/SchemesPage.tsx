import { useMemo, useState } from "react";
import { SchemeCard } from "../components/SchemeCard";
import { useAppContext } from "../context/AppContext";
import { t } from "../utils/i18n";

const audienceFilters = [
  { label: "Farmers", terms: ["farmer", "agriculture", "land", "kisan"] },
  { label: "Women & girl child", terms: ["women", "girl", "child", "ujjwala", "sukanya"] },
  { label: "Students", terms: ["student", "scholarship", "education"] },
  { label: "Persons with disabilities", terms: ["disability", "health", "support"] },
  { label: "Workers", terms: ["worker", "labour", "shram", "occupation"] },
  { label: "Families", terms: ["family", "household", "health", "housing"] }
];

export function SchemesPage() {
  const { schemes, language } = useAppContext();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [state, setState] = useState("");
  const [audience, setAudience] = useState("");
  const categories = useMemo(() => Array.from(new Set(schemes.map((scheme) => scheme.category))).sort(), [schemes]);
  const states = useMemo(() => Array.from(new Set(schemes.flatMap((scheme) => scheme.state_scope))).sort(), [schemes]);
  const filtered = useMemo(
    () => {
      const audienceTerms = audienceFilters.find((item) => item.label === audience)?.terms || [];
      return schemes.filter((scheme) => {
        const searchable = [
          scheme.name,
          scheme.description,
          scheme.category,
          ...scheme.eligibility,
          ...scheme.benefits,
          ...scheme.required_documents
        ].join(" ").toLowerCase();
        return (
          (!q || searchable.includes(q.toLowerCase())) &&
          (!category || scheme.category === category) &&
          (!state || scheme.state_scope.includes("All") || scheme.state_scope.includes(state)) &&
          (!audienceTerms.length || audienceTerms.some((term) => searchable.includes(term)))
        );
      });
    },
    [schemes, q, category, state, audience]
  );
  return (
    <div className="space-y-5">
      <section className="rounded-3xl bg-white p-5 shadow-card">
        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-sahaya-saffron">{t(language, "schemeDiscovery")}</p>
            <h1 className="mt-1 text-2xl font-bold text-sahaya-ink md:text-3xl">{t(language, "schemeDiscoveryTitle")}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{t(language, "schemeDiscoverySubtitle")}</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-sahaya-green">
            {filtered.length} matching schemes
          </div>
        </div>
      </section>
      <div className="rounded-3xl bg-white p-4 shadow-card">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="grid gap-1 text-sm font-semibold">
            {t(language, "search")}
            <input className="min-h-12 rounded-xl border p-3 font-normal" placeholder="Farmer, scholarship, housing..." value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <label className="grid gap-1 text-sm font-semibold">
            {t(language, "category")}
            <select className="min-h-12 rounded-xl border p-3 font-normal" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All categories</option>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-sm font-semibold">
            {t(language, "state")}
            <select className="min-h-12 rounded-xl border p-3 font-normal" value={state} onChange={(e) => setState(e.target.value)}>
              <option value="">All India and selected states</option>
              {states.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-sm font-semibold">
            {t(language, "citizenGroup")}
            <select className="min-h-12 rounded-xl border p-3 font-normal" value={audience} onChange={(e) => setAudience(e.target.value)}>
              <option value="">{t(language, "everyone")}</option>
              {audienceFilters.map((item) => <option key={item.label} value={item.label}>{item.label}</option>)}
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {audienceFilters.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setAudience(audience === item.label ? "" : item.label)}
              className={`min-h-11 rounded-full border px-4 text-sm font-semibold ${audience === item.label ? "border-sahaya-green bg-sahaya-green text-white" : "border-slate-200 bg-white text-slate-700"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      {filtered.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((scheme) => <SchemeCard key={scheme.id} scheme={scheme} />)}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed bg-white p-8 text-center shadow-card">
          <h2 className="text-xl font-semibold">{t(language, "noSchemes")}</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">Try removing one filter or searching by a broader word such as farmer, student, housing, health, worker, women, or family.</p>
          <button onClick={() => { setQ(""); setCategory(""); setState(""); setAudience(""); }} className="mt-4 min-h-12 rounded-xl bg-sahaya-green px-5 font-semibold text-white">{t(language, "clearFilters")}</button>
        </div>
      )}
    </div>
  );
}
