import { useState, useEffect } from "react";
import { Plus, UsersRound, Trash2, Info, ShieldCheck, User } from "lucide-react";
import { SectionCard } from "../components/SectionCard";
import { useAppContext } from "../context/AppContext";
import { api } from "../services/api";
import { t } from "../utils/i18n";

interface FamilyMemberForm {
  name: string;
  relationship: string;
  age: number;
  gender: string;
  occupation?: string;
  income?: number;
  state?: string;
  available_documents?: string[];
}

export function FamilyPage() {
  const { language, user, profile } = useAppContext();

  const applicantName = user?.full_name || "";

  const [members, setMembers] = useState<FamilyMemberForm[]>([
    {
      name: applicantName || (language === "hi" ? "मुख्य आवेदक (स्वयं)" : language === "kn" ? "ಮುಖ್ಯ ಅರ್ಜಿದಾರ (ಸ್ವತಃ)" : "Primary Applicant (Self)"),
      relationship: "self",
      age: profile?.age || 35,
      gender: profile?.gender || "male",
      occupation: profile?.occupation || "citizen",
      income: profile?.income || 150000,
      state: profile?.state || "Karnataka",
      available_documents: profile?.available_documents || ["ration card", "aadhaar"],
    },
  ]);

  // If user profile loads or changes name, update the self entry if not manually customized
  useEffect(() => {
    if (applicantName && members[0]?.relationship === "self" && (members[0]?.name === "Primary Applicant (Self)" || members[0]?.name === "")) {
      setMembers((prev) => prev.map((m, i) => (i === 0 ? { ...m, name: applicantName } : m)));
    }
  }, [applicantName]);

  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const addMember = () => {
    setMembers((prev) => [
      ...prev,
      {
        name: "",
        relationship: "daughter",
        age: 12,
        gender: "female",
        state: profile?.state || "Karnataka",
        income: profile?.income || 150000,
        available_documents: profile?.available_documents || ["ration card"],
      },
    ]);
  };

  const removeMember = (indexToRemove: number) => {
    if (indexToRemove === 0) return; // Cannot delete self
    setMembers((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await api.post("/api/family/analyze", { members });
      setResult(response.data);
    } catch (err) {
      console.error("Failed to analyze family:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ─── Transparent Policy & Architecture Callout ────────────────────────── */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 md:p-5 text-emerald-950">
        <div className="flex items-start gap-3.5">
          <div className="rounded-xl bg-emerald-600 p-2 text-white shrink-0 mt-0.5">
            <ShieldCheck size={20} />
          </div>
          <div className="space-y-1 text-xs md:text-sm">
            <h3 className="font-bold text-slate-900 text-sm md:text-base">
              {language === "hi"
                ? "पारिवारिक योजना पात्रता कैसे निर्धारित होती है?"
                : language === "kn"
                ? "ಕುಟುಂಬ ಯೋಜನೆ ಅರ್ಹತೆಯನ್ನು ಹೇಗೆ ನಿರ್ಧರಿಸಲಾಗುತ್ತದೆ?"
                : "How Family Benefit Matching Works Without Separate Documents"}
            </h3>
            <p className="text-slate-700 leading-relaxed">
              {language === "hi"
                ? "मुख्य आवेदक के रूप में आपके द्वारा सत्यापित पारिवारिक राशन कार्ड, आय प्रमाण पत्र और अधिवास (State Domicile) सभी सदस्यों के साथ साझा किए जाते हैं। परिवार के प्रत्येक सदस्य (जैसे बेटी, पत्नी, या बुजुर्ग माता-पिता) की योजना पात्रता उनके रिश्ते, लिंग और आयु के आधार पर स्वतः जांची जाती है बिना उनसे अलग दस्तावेज़ मांगे।"
                : language === "kn"
                ? "ಮುಖ್ಯ ಅರ್ಜಿದಾರರಾಗಿ ನೀವು ಸಲ್ಲಿಸಿದ ಕುಟುಂಬ ರೇಷನ್ ಕಾರ್ಡ್, ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ ಮತ್ತು ರಾಜ್ಯ ನಿವಾಸ ಪ್ರಮಾಣಪತ್ರವನ್ನು ಇಡೀ ಕುಟುಂಬಕ್ಕೆ ಬಳಸಲಾಗುತ್ತದೆ. ಕುಟುಂಬದ ಇತರ ಸದಸ್ಯರ (ಉದಾ: ಹೆಣ್ಣು ಮಗು, ಪತ್ನಿ, ಅಥವಾ ಹಿರಿಯ ಪೋಷಕರು) ಯೋಜನೆ ಅರ್ಹತೆಯನ್ನು ಪ್ರತ್ಯೇಕ ದಾಖಲೆಗಳ ಅಗತ್ಯವಿಲ್ಲದೆ ಅವರ ಸಂಬಂಧ, ವಯಸ್ಸು ಮತ್ತು ಲಿಂಗದ ಆಧಾರದ ಮೇಲೆ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಮೌಲ್ಯಮಾಪನ ಮಾಡಲಾಗುತ್ತದೆ."
                : "As the primary applicant, your verified household documents (Family Ration Card, Income Certificate, and State Domicile) are automatically shared across your household. Individual welfare benefits (such as girl child education, maternity grants, or senior citizen pensions) are calculated using each member's relationship, age, and gender without requiring them to upload duplicate documents."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* ─── Left: Household Members Form ──────────────────────────────────── */}
        <SectionCard title={t(language, "familyBenefits")}>
          <p className="mb-4 text-sm text-slate-600">{t(language, "familyOptimizerHelp")}</p>
          
          <div className="space-y-3.5" data-tour="family-members-section">
            {members.map((member, index) => (
              <div key={index} className="rounded-2xl border border-stone-200 bg-stone-50/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <User size={14} className="text-emerald-700" />
                    {index === 0 ? "Applicant (Self)" : `Family Member #${index + 1}`}
                  </div>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeMember(index)}
                      className="text-stone-400 hover:text-rose-600 transition p-1"
                      title="Remove member"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      {language === "hi" ? "सदस्य का नाम" : language === "kn" ? "ಸದಸ್ಯರ ಹೆಸರು" : "Member Name"} *
                    </label>
                    <input
                      className="w-full min-h-11 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                      placeholder={index === 0 ? (applicantName || "Your Full Name") : "e.g. Priyadarshini"}
                      value={member.name}
                      onChange={(e) =>
                        setMembers((prev) =>
                          prev.map((item, i) => (i === index ? { ...item, name: e.target.value } : item))
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      {language === "hi" ? "संबंध" : language === "kn" ? "ಸಂಬಂಧ" : "Relationship"} *
                    </label>
                    {index === 0 ? (
                      <input
                        disabled
                        className="w-full min-h-11 rounded-xl border border-stone-200 bg-stone-100 px-3 py-2 text-sm text-stone-600 font-medium cursor-not-allowed"
                        value="Self (Primary Citizen)"
                      />
                    ) : (
                      <select
                        className="w-full min-h-11 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none font-medium"
                        value={member.relationship}
                        onChange={(e) => {
                          const rel = e.target.value;
                          let defaultGender = member.gender;
                          let defaultAge = member.age;
                          if (["daughter", "mother", "wife", "sister", "spouse"].includes(rel)) defaultGender = "female";
                          if (["son", "father", "husband", "brother"].includes(rel)) defaultGender = "male";
                          if (["daughter", "son"].includes(rel) && member.age > 25) defaultAge = 12;
                          if (["mother", "father"].includes(rel) && member.age < 50) defaultAge = 62;
                          
                          setMembers((prev) =>
                            prev.map((item, i) =>
                              i === index ? { ...item, relationship: rel, gender: defaultGender, age: defaultAge } : item
                            )
                          );
                        }}
                      >
                        <option value="daughter">Daughter / पुत्री</option>
                        <option value="son">Son / पुत्र</option>
                        <option value="spouse">Spouse / पति-पत्नी</option>
                        <option value="mother">Mother / माता</option>
                        <option value="father">Father / पिता</option>
                        <option value="sister">Sister / बहन</option>
                        <option value="brother">Brother / भाई</option>
                        <option value="dependent">Other Dependent / अन्य आश्रित</option>
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      {language === "hi" ? "आयु (वर्ष)" : language === "kn" ? "ವಯಸ್ಸು" : "Age (Years)"} *
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={120}
                      className="w-full min-h-11 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                      value={member.age || ""}
                      onChange={(e) =>
                        setMembers((prev) =>
                          prev.map((item, i) =>
                            i === index ? { ...item, age: parseInt(e.target.value, 10) || 0 } : item
                          )
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      {language === "hi" ? "लिंग" : language === "kn" ? "ಲಿಂಗ" : "Gender"} *
                    </label>
                    <select
                      className="w-full min-h-11 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none font-medium"
                      value={member.gender}
                      onChange={(e) =>
                        setMembers((prev) =>
                          prev.map((item, i) => (i === index ? { ...item, gender: e.target.value } : item))
                        )
                      }
                    >
                      <option value="female">Female / महिला</option>
                      <option value="male">Male / पुरुष</option>
                      <option value="other">Other / अन्य</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={addMember}
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 font-semibold text-slate-800 hover:bg-stone-50 transition"
              >
                <Plus size={18} /> {t(language, "addMember")}
              </button>
              <button
                data-tour="family-analyze-btn"
                onClick={handleAnalyze}
                disabled={loading}
                className="min-h-12 rounded-xl bg-sahaya-green px-5 font-semibold text-white shadow-sm hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? "Analyzing Household..." : t(language, "analyzeFamily")}
              </button>
            </div>
          </div>
        </SectionCard>

        {/* ─── Right: Family Benefit Map ────────────────────────────────────── */}
        <SectionCard title={t(language, "familyBenefitMap")}>
          {!result && (
            <div className="rounded-2xl border border-dashed border-stone-300 p-8 text-center bg-stone-50/50">
              <UsersRound className="mx-auto text-sahaya-green h-12 w-12 stroke-1" />
              <p className="mt-3 text-sm font-medium text-slate-700">{t(language, "noFamilyResult")}</p>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                Add household members above and click Analyze Family to identify targeted benefits like Sukanya Samriddhi, PMMVY, and Senior Pensions.
              </p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className="rounded-xl bg-emerald-50 p-3 border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center justify-between">
                <span>Total Potential Household Schemes:</span>
                <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-white font-bold">
                  {result.total_potential_benefits || 0}
                </span>
              </div>

              {result.members.map((item: any, idx: number) => (
                <div key={idx} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                    <div>
                      <div className="font-bold text-slate-900 text-base">{item.member || `Member #${idx + 1}`}</div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <span className="capitalize">{item.relationship}</span>
                        <span>•</span>
                        <span>{item.age ? `${item.age} yrs` : "Age N/A"}</span>
                        <span>•</span>
                        <span className="capitalize">{item.gender || "All"}</span>
                      </div>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      {item.eligible_schemes.length} Eligible
                    </span>
                  </div>

                  <div className="mt-3">
                    {item.eligible_schemes.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">{t(language, "noMatchingSchemes")}</p>
                    ) : (
                      <ul className="space-y-2">
                        {item.eligible_schemes.map((sch: any) => (
                          <li
                            key={sch.scheme_id}
                            className="flex items-center justify-between rounded-xl bg-stone-50 p-2.5 text-xs border border-stone-200/70"
                          >
                            <span className="font-medium text-slate-900">{sch.scheme_name}</span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                              Match Score: {Math.round(sch.score || 100)}%
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
