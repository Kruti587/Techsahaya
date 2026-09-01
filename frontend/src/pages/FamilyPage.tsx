import { useState } from "react";
import { Plus, UsersRound } from "lucide-react";
import { SectionCard } from "../components/SectionCard";
import { useAppContext } from "../context/AppContext";
import { api } from "../services/api";
import { t } from "../utils/i18n";

export function FamilyPage() {
  const { language } = useAppContext();
  const [members, setMembers] = useState<any[]>([{ name: "Ravi", age: 45, gender: "male", occupation: "farmer", income: 150000, relationship: "self", state: "Karnataka", landholding: 1.2, available_documents: ["land record"] }]);
  const [result, setResult] = useState<any | null>(null);

  const addMember = () => setMembers((prev) => [...prev, { name: "", relationship: "", available_documents: [] }]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
      <SectionCard title={t(language, "familyBenefits")}>
        <p className="mb-4 text-sm text-slate-600">{t(language, "familyOptimizerHelp")}</p>
        <div className="space-y-3" data-tour="family-members-section">
          {members.map((member, index) => (
            <div key={index} className="grid gap-2 rounded-2xl border p-3 md:grid-cols-2">
              <input
                className="min-h-12 rounded-xl border p-3"
                placeholder={language === "hi" ? "नाम" : language === "kn" ? "ಹೆಸರು" : "Name"}
                value={member.name}
                onChange={(e) => setMembers((prev) => prev.map((item, i) => (i === index ? { ...item, name: e.target.value } : item)))}
              />
              <input
                className="min-h-12 rounded-xl border p-3"
                placeholder={language === "hi" ? "संबंध (उदा. स्वयं, पत्नी, पुत्र)" : language === "kn" ? "ಸಂಬಂಧ (ಉದಾ. ಸ್ವತಃ, ಪತ್ನಿ, ಮಗ)" : "Relationship (e.g. self, spouse)"}
                value={member.relationship}
                onChange={(e) => setMembers((prev) => prev.map((item, i) => (i === index ? { ...item, relationship: e.target.value } : item)))}
              />
            </div>
          ))}
          <div className="flex gap-3">
            <button onClick={addMember} className="inline-flex min-h-12 items-center gap-2 rounded-xl border px-4 font-semibold">
              <Plus size={18} /> {t(language, "addMember")}
            </button>
            <button data-tour="family-analyze-btn" onClick={async () => setResult((await api.post("/api/family/analyze", { members })).data)} className="min-h-12 rounded-xl bg-sahaya-green px-4 font-semibold text-white shadow-sm hover:opacity-90 transition">
              {t(language, "analyzeFamily")}
            </button>
          </div>
        </div>
      </SectionCard>


      <SectionCard title={t(language, "familyBenefitMap")}>
        {!result && (
          <div className="rounded-2xl border border-dashed p-6 text-center">
            <UsersRound className="mx-auto text-sahaya-green" />
            <p className="mt-2 text-sm text-slate-600">{t(language, "noFamilyResult")}</p>
          </div>
        )}
        {result &&
          result.members.map((member: any) => (
            <div key={member.member} className="mb-4 rounded-xl border p-3">
              <div className="font-semibold">{member.member}</div>
              <div className="mt-1 text-sm text-slate-600">{member.eligible_schemes.map((scheme: any) => scheme.scheme_name).join(", ") || t(language, "noMatchingSchemes")}</div>
            </div>
          ))}
      </SectionCard>
    </div>
  );
}
