import { useState } from "react";
import { GitCompareArrows } from "lucide-react";
import { SectionCard } from "../components/SectionCard";
import { useAppContext } from "../context/AppContext";
import { api } from "../services/api";
import { t } from "../utils/i18n";

export function WhatIfPage() {
  const { profile, language } = useAppContext();
  const [income, setIncome] = useState(profile.income || 0);
  const [result, setResult] = useState<any | null>(null);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
      <SectionCard title={t(language, "whatIf")}>
        <p className="mb-4 text-sm text-slate-600">{t(language, "whatIfHelp")}</p>
        <label className="block">
          <span className="mb-2 block font-semibold">
            {language === "hi" ? "आय में बदलाव करें" : language === "kn" ? "ಆದಾಯದಲ್ಲಿ ಬದಲಾವಣೆ ಮಾಡಿ" : "Change income"}
          </span>
          <input className="min-h-12 w-full rounded-xl border p-3" type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))} />
        </label>
        <button
          onClick={async () => setResult((await api.post("/api/what-if", { scheme_id: "pm-kisan", current_profile: profile, simulated_changes: { income } })).data)}
          className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-xl bg-sahaya-green px-4 font-semibold text-white"
        >
          <GitCompareArrows size={18} /> {t(language, "recalculate")}
        </button>
      </SectionCard>
      <SectionCard title={t(language, "beforeAfter")}>
        {!result && <p className="text-sm text-slate-600">{t(language, "whatIfHelp")}</p>}
        {result && (
          <>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border p-4">
                <div className="text-sm text-slate-500">{t(language, "before")}</div>
                <div className="text-xl font-bold">{result.before.status}</div>
              </div>
              <div className="rounded-2xl border p-4">
                <div className="text-sm text-slate-500">{t(language, "after")}</div>
                <div className="text-xl font-bold">{result.after.status}</div>
              </div>
            </div>
            <div className="mt-3 rounded-2xl bg-stone-50 p-3">
              {t(language, "changedRule")}: {result.changed_rules.join(", ") || t(language, "noRuleChange")}
            </div>
          </>
        )}
      </SectionCard>
    </div>
  );
}
