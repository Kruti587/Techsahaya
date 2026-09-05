import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock3,
  ExternalLink,
  FileCheck2,
  FileText,
  AlertCircle,
  Download,
  ListChecks,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SectionCard } from "../components/SectionCard";
import { TechSahayaLoader } from "../components/TechSahayaLoader";
import { useAppContext } from "../context/AppContext";
import { api } from "../services/api";
import { t } from "../utils/i18n";

export function JourneyPage() {
  const { language } = useAppContext();
  const [journey, setJourney] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // User interactive toggle state for steps
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setLoading(true);
    api
      .get("/api/journey")
      .then((res) => setJourney(res.data))
      .catch(() => setJourney([]))
      .finally(() => setLoading(false));
  }, []);

  const toggleStep = (key: string) => {
    setCheckedSteps((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-6">
      {/* ─── Hero Banner ─────────────────────────────────────────────── */}
      <section className="rounded-3xl bg-white p-6 shadow-card border border-stone-200">
        <p className="text-xs font-bold uppercase tracking-wider text-sahaya-saffron">
          {t(language, "welfareJourney")}
        </p>
        <h1 className="mt-1 text-3xl font-bold font-serif text-slate-900">
          {t(language, "welfareJourney")}
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600 leading-relaxed">
          {t(language, "journeyUse")}
        </p>
      </section>

      {/* ─── Loading State with TechSahayaLoader ──────────────────────── */}
      {loading && (
        <div className="rounded-3xl border border-stone-200 bg-white p-12 text-center shadow-card flex flex-col items-center justify-center min-h-[300px]">
          <TechSahayaLoader
            size={72}
            text={
              language === "hi"
                ? "आपकी व्यक्तिगत कल्याण यात्रा तैयार हो रही है..."
                : language === "kn"
                ? "ನಿಮ್ಮ ಕಲ್ಯಾಣ ಮಾರ್ಗಸೂಚಿಯನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ..."
                : "Loading your personalized welfare roadmap and document checklists..."
            }
          />
        </div>
      )}

      {/* ─── Empty State ──────────────────────────────────────────────── */}
      {!loading && journey.length === 0 && (
        <SectionCard title={t(language, "welfareJourney")}>
          <div className="rounded-2xl border border-dashed border-stone-300 p-8 text-center bg-stone-50/50">
            <Clock3 className="mx-auto text-sahaya-green h-12 w-12 stroke-1" />
            <h2 className="mt-3 text-xl font-semibold text-slate-900">
              {t(language, "noJourney")}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
              {t(language, "startJourneyHelp")}
            </p>
            <Link
              to="/find-schemes"
              className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-xl bg-sahaya-green px-5 font-semibold text-white shadow-sm hover:opacity-90 transition"
            >
              {t(language, "startWithSchemes")} <ArrowRight size={18} />
            </Link>
          </div>
        </SectionCard>
      )}

      {/* ─── Scheme-Grouped Journey Roadmaps ─────────────────────────── */}
      {!loading && journey.length > 0 && (
        <div className="space-y-6">
          {journey.map((item, schemeIdx) => {
            const schemeName = item.scheme_name || `Scheme #${schemeIdx + 1}`;
            const docs = item.documents || (item.required_document ? [{ document_name: item.required_document, verified: false }] : []);
            const stages = item.stages || [
              { stage: "Discovery", completed: true, action: "Scheme matched" },
              { stage: "Eligibility", completed: true, action: "Criteria checked" },
              { stage: "Documents", completed: false, action: "Upload required documents" },
              { stage: "Apply", completed: false, action: "Submit application" },
            ];

            return (
              <article
                key={item.scheme_id || schemeIdx}
                className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Scheme Header */}
                <div className="border-b border-stone-100 bg-gradient-to-r from-emerald-50/70 via-stone-50/50 to-white p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                        <span>{item.category || "Welfare Scheme"}</span>
                        {item.state && (
                          <>
                            <span>•</span>
                            <span>{item.state}</span>
                          </>
                        )}
                      </div>
                      <h2 className="text-xl font-bold font-serif text-slate-900 mt-1">
                        {schemeName}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                        <Sparkles size={13} /> {Math.round((item.score || 1) * 100)}% Match
                      </span>
                      {item.portal_url && (
                        <a
                          href={item.portal_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-stone-50 transition"
                        >
                          Official Portal <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Required Documents Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                        <FileCheck2 size={16} className="text-emerald-600" />
                        {language === "hi"
                          ? "आवश्यक दस्तावेज़ और सत्यापन स्थिति"
                          : language === "kn"
                          ? "ಅಗತ್ಯ ದಾಖಲೆಗಳು ಮತ್ತು ಪರಿಶೀಲನೆ ಸ್ಥಿತಿ"
                          : "Required Documents & Verification Status"}
                      </h3>
                      <Link
                        to="/documents"
                        className="text-xs font-semibold text-emerald-700 hover:underline"
                      >
                        {language === "hi" ? "दस्तावेज़ प्रबंधित करें →" : language === "kn" ? "ದಾಖಲೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ →" : "Manage Documents →"}
                      </Link>
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                      {docs.map((doc: any, docIdx: number) => {
                        const isVerified = doc.verified || doc.status === "verified";
                        return (
                          <div
                            key={docIdx}
                            className={`flex items-center justify-between rounded-xl border p-3 text-xs transition ${
                              isVerified
                                ? "border-emerald-200 bg-emerald-50/50 text-emerald-950"
                                : "border-amber-200 bg-amber-50/50 text-amber-950"
                            }`}
                          >
                            <div className="flex items-center gap-2 font-medium">
                              <FileText size={15} className={isVerified ? "text-emerald-700" : "text-amber-700"} />
                              <span className="capitalize">{doc.document_name}</span>
                            </div>
                            <span
                              className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                isVerified
                                  ? "bg-emerald-600 text-white"
                                  : "bg-amber-200 text-amber-900"
                              }`}
                            >
                              {isVerified ? "Verified" : "Pending Upload"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step-by-Step Progress Roadmap & Checklist */}
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3">
                      <ListChecks size={16} className="text-sahaya-saffron" />
                      {language === "hi"
                        ? "आवेदन प्रगति चेकलिस्ट"
                        : language === "kn"
                        ? "ಅರ್ಜಿ ಪ್ರಗತಿ ಪರಿಶೀಲನಾಪಟ್ಟಿ"
                        : "Application Progress Checklist"}
                    </h3>

                    <div className="space-y-2.5">
                      {stages.map((stage: any, stageIdx: number) => {
                        const stageKey = `${item.scheme_id}-${stageIdx}`;
                        const isChecked = checkedSteps[stageKey] !== undefined ? checkedSteps[stageKey] : stage.completed;

                        return (
                          <div
                            key={stageIdx}
                            onClick={() => toggleStep(stageKey)}
                            className={`flex items-start gap-3 rounded-2xl border p-3.5 text-xs md:text-sm cursor-pointer transition select-none ${
                              isChecked
                                ? "border-emerald-200 bg-emerald-50/30 text-slate-900"
                                : "border-stone-200 bg-white text-slate-700 hover:bg-stone-50"
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {isChecked ? (
                                <CheckCircle2 size={18} className="text-emerald-600" />
                              ) : (
                                <Circle size={18} className="text-stone-300" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className={`font-semibold ${isChecked ? "text-emerald-900 line-through decoration-emerald-500/60" : "text-slate-900"}`}>
                                  {stageIdx + 1}. {stage.stage}
                                </span>
                                <span className="text-[10px] uppercase font-bold text-slate-500">
                                  {isChecked ? "Completed" : "Action Required"}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {stage.action}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
                    <span className="text-xs text-slate-500">
                      Target deadline: {item.deadline || "Open throughout financial year"}
                    </span>
                    <div className="flex items-center gap-2">
                      <Link
                        to="/find-schemes"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-sahaya-green px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-90 transition"
                      >
                        Apply / View Scheme Details <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
