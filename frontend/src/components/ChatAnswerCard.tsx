import React from "react";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  Volume2,
  FileText,
  Building2,
  BookOpen,
  Info,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  HelpCircle,
  UserCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Scheme } from "../types";

export type ChatAnswerResponse = {
  answer: string;
  schemes?: Scheme[];
  evidence?: Array<{
    scheme_name: string;
    evidence: string;
    source: string;
    chunk_type?: string;
    retrieval_score?: number;
  }>;
  verification_status?: string;
  confidence?: string;
  offline_ready?: boolean;
};

interface ChatAnswerCardProps {
  response: ChatAnswerResponse | null;
  language: string;
  loading?: boolean;
  error?: string | null;
  onSpeakAnswer?: () => void;
  onRetry?: () => void;
}

// Category Icon Mapper
function getCategoryIcon(category?: string) {
  const cat = (category || "").toLowerCase();
  if (cat.includes("educat") || cat.includes("scholar")) return "🎓";
  if (cat.includes("agri") || cat.includes("farm")) return "🚜";
  if (cat.includes("health") || cat.includes("medic")) return "🏥";
  if (cat.includes("hous") || cat.includes("awaas")) return "🏠";
  if (cat.includes("energy") || cat.includes("lpg")) return "⚡";
  if (cat.includes("labour") || cat.includes("worker")) return "👷";
  if (cat.includes("women") || cat.includes("child") || cat.includes("girl")) return "👩";
  if (cat.includes("sanitat") || cat.includes("toilet")) return "🧹";
  if (cat.includes("livelihood") || cat.includes("artisan") || cat.includes("craft")) return "🛠️";
  if (cat.includes("disabil") || cat.includes("pwd")) return "♿";
  return "🏛️";
}

// Format human-readable status labels
function formatVerificationStatus(status?: string, lang: string = "en") {
  if (status === "verified_from_source_data") {
    if (lang === "hi") return "सत्यापित स्रोत डेटा";
    if (lang === "kn") return "ಪರಿಶೀಲಿತ ಮೂಲ ಡೇಟಾ";
    return "Verified Source Data";
  }
  if (status === "requires_official_verification") {
    if (lang === "hi") return "आधिकारिक सत्यापन आवश्यक";
    if (lang === "kn") return "ಅಧಿಕೃತ ಪರಿಶೀಲನೆ ಅಗತ್ಯವಿದೆ";
    return "Official Verification Recommended";
  }
  if (lang === "hi") return "सीमित स्थानीय साक्ष्य";
  if (lang === "kn") return "ಸೀಮಿತ ಸ್ಥಳೀಯ ಮಾಹಿತಿ";
  return "Limited Local Evidence";
}

// Format human-readable confidence badges
function getConfidenceBadge(confidence?: string, lang: string = "en") {
  const conf = (confidence || "medium").toLowerCase();
  if (conf === "high") {
    return {
      label: lang === "hi" ? "उच्च विश्वसनीयता" : lang === "kn" ? "ಹೆಚ್ಚಿನ ನಂಬಿಕೆ" : "High Confidence",
      bgClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
      dotClass: "bg-emerald-500",
    };
  }
  if (conf === "low") {
    return {
      label: lang === "hi" ? "सीमित जानकारी" : lang === "kn" ? "ಸೀಮಿತ ಮಾಹಿತಿ" : "Limited Information",
      bgClass: "bg-amber-100 text-amber-800 border-amber-300",
      dotClass: "bg-amber-500",
    };
  }
  return {
    label: lang === "hi" ? "मध्यम विश्वसनीयता" : lang === "kn" ? "ಮಧ್ಯಮ ನಂಬಿಕೆ" : "Medium Confidence",
    bgClass: "bg-teal-100 text-teal-800 border-teal-300",
    dotClass: "bg-teal-500",
  };
}

// Helper to strip markdown asterisks cleanly for plain rendering
function cleanMarkdownText(text: string): string {
  return text.replace(/\*\*/g, "").replace(/\*/g, "").trim();
}

// Parse answer string into clean structured sections if available
interface ParsedAnswer {
  schemeName?: string;
  overview?: string;
  categoryScope?: string;
  benefits?: string[];
  eligibilityStatus?: "ELIGIBLE" | "NOT_ELIGIBLE" | "NEEDS_MORE_INFORMATION" | null;
  engineExplanation?: string;
  unmetConditions?: string[];
  missingFields?: string[];
  satisfiedConditions?: string[];
  requiredDocuments?: string[];
  applicationSteps?: string[];
  officialSource?: { name?: string; url?: string };
  verificationNote?: string;
  rawBlocks: string[];
}

function parseAnswerText(rawText: string, primaryScheme?: Scheme): ParsedAnswer {
  const parsed: ParsedAnswer = { rawBlocks: [] };
  if (!rawText) return parsed;

  // Split by bullet separator ' • ' or newlines
  const parts = rawText.split(/(?: • |\n\n|\r\n\r\n)/).map((p) => p.trim()).filter(Boolean);

  for (const part of parts) {
    const cleanPart = part.replace(/^•\s*/, "").trim();
    const match = cleanPart.match(/^\*?\*?([^*:]+)\*?\*?:\s*(.*)$/s);

    if (match) {
      const label = match[1].trim().toLowerCase();
      const val = match[2].trim();
      const cleanVal = cleanMarkdownText(val);

      if (label.includes("verified scheme information") || label.includes("योजना जानकारी") || label.includes("ಯೋಜನೆ ಮಾಹಿತಿ")) {
        parsed.schemeName = cleanVal;
      } else if (label.includes("overview") || label.includes("विवरण") || label.includes("ವಿವರಣೆ")) {
        parsed.overview = cleanVal;
      } else if (label.includes("category & scope") || label.includes("श्रेणी") || label.includes("ವರ್ಗ")) {
        parsed.categoryScope = cleanVal;
      } else if (label.includes("key benefits") || label.includes("benefits") || label.includes("मुख्य लाभ") || label.includes("ಪ್ರಯೋಜನಗಳು")) {
        parsed.benefits = cleanVal.split(/;|\.\s+/).map((b) => b.trim()).filter(Boolean);
      } else if (label.includes("deterministic eligibility evaluation") || label.includes("पात्रता मूल्यांकन") || label.includes("ಅರ್ಹತಾ")) {
        const uppercaseVal = val.toUpperCase();
        if (uppercaseVal.includes("NOT_ELIGIBLE") || uppercaseVal.includes("NOT ELIGIBLE")) {
          parsed.eligibilityStatus = "NOT_ELIGIBLE";
        } else if (uppercaseVal.includes("ELIGIBLE")) {
          parsed.eligibilityStatus = "ELIGIBLE";
        } else {
          parsed.eligibilityStatus = "NEEDS_MORE_INFORMATION";
        }
      } else if (label.includes("engine explanation") || label.includes("स्पष्टीकरण") || label.includes("ವಿವರಣೆ")) {
        parsed.engineExplanation = cleanVal;
      } else if (label.includes("unmet conditions") || label.includes("unmet")) {
        parsed.unmetConditions = cleanVal.split(/;|,/).map((u) => u.trim()).filter(Boolean);
      } else if (label.includes("missing profile fields") || label.includes(" missing ") || label.includes("लापता") || label.includes("ಅಗತ್ಯವಿರುವ")) {
        parsed.missingFields = cleanVal.split(/,/).map((m) => m.replace(/Missing/i, "").trim()).filter(Boolean);
      } else if (label.includes("satisfied conditions")) {
        parsed.satisfiedConditions = cleanVal.split(/,/).map((s) => s.trim()).filter(Boolean);
      } else if (label.includes("required documents") || label.includes("आवश्यक दस्तावेज़") || label.includes("ಅಗತ್ಯ ದಾಖಲೆಗಳು")) {
        parsed.requiredDocuments = cleanVal.split(/,/).map((d) => d.trim()).filter(Boolean);
      } else if (label.includes("application steps") || label.includes("आवेदन प्रक्रिया") || label.includes("ಅರ್ಜಿ ವಿಧಾನ")) {
        parsed.applicationSteps = cleanVal.split(/->|;|,\s*(?=\d)/).map((s) => s.replace(/^\d+\.\s*/, "").trim()).filter(Boolean);
      } else if (label.includes("official source") || label.includes("आधिकारिक स्रोत") || label.includes("ಅಧಿಕೃತ ಮೂಲ")) {
        const urlMatch = val.match(/\((https?:\/\/[^\)]+)\)/) || val.match(/(https?:\/\/[^\s]+)/);
        parsed.officialSource = {
          name: cleanVal.replace(/\(https?:\/\/[^\)]+\)/, "").trim(),
          url: urlMatch ? urlMatch[1] : primaryScheme ? String(primaryScheme.official_link) : undefined,
        };
      } else if (label.includes("verification note") || label.includes("सत्यापन टिप्पणी") || label.includes("ಟಿಪ್ಪಣಿ")) {
        parsed.verificationNote = cleanVal;
      } else {
        parsed.rawBlocks.push(cleanPart);
      }
    } else {
      parsed.rawBlocks.push(cleanPart);
    }
  }

  return parsed;
}

// Inline Formatted Text Renderer (Safe, no html injection)
function FormattedText({ content }: { content: string }) {
  if (!content) return null;

  // Split into paragraphs by double newlines or single linebreaks
  const lines = content.split(/\n+/).map((line) => line.trim()).filter(Boolean);

  return (
    <div className="space-y-2 text-slate-800 leading-relaxed">
      {lines.map((line, idx) => {
        // Bullet list item
        if (line.startsWith("•") || line.startsWith("-") || line.startsWith("*")) {
          const itemText = line.replace(/^[•\-\*]\s*/, "");
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-1 my-1">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-600 flex-shrink-0" />
              <span>{renderBoldSpans(itemText)}</span>
            </div>
          );
        }

        return <p key={idx}>{renderBoldSpans(line)}</p>;
      })}
    </div>
  );
}

// Helper to render bold spans without displaying raw **
function renderBoldSpans(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

// Skeleton Component for Loading State
export function ChatAnswerSkeleton() {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-100" />
          <div className="space-y-2">
            <div className="h-5 w-48 rounded bg-slate-200" />
            <div className="h-3 w-32 rounded bg-slate-100" />
          </div>
        </div>
        <div className="h-6 w-24 rounded-full bg-emerald-100" />
      </div>

      <div className="space-y-2 pt-2">
        <div className="h-4 w-full rounded bg-slate-100" />
        <div className="h-4 w-5/6 rounded bg-slate-100" />
        <div className="h-4 w-4/6 rounded bg-slate-100" />
      </div>

      <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-2">
        <div className="h-4 w-1/3 rounded bg-slate-200" />
        <div className="h-3 w-2/3 rounded bg-slate-100" />
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="h-4 w-36 rounded bg-slate-100" />
        <div className="h-9 w-32 rounded-xl bg-emerald-100" />
      </div>
    </div>
  );
}

// Main Reusable ChatAnswerCard Component
export function ChatAnswerCard({
  response,
  language = "en",
  loading = false,
  error = null,
  onSpeakAnswer,
  onRetry,
}: ChatAnswerCardProps) {
  if (loading) {
    return <ChatAnswerSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/70 p-6 text-slate-800 shadow-sm">
        <div className="flex items-center gap-3 text-red-700 font-semibold text-lg">
          <XCircle className="h-6 w-6 flex-shrink-0" />
          <span>{language === "hi" ? "उत्तर प्राप्त करने में असमर्थ" : language === "kn" ? "ಉತ್ತರ ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ" : "Unable to Answer Right Now"}</span>
        </div>
        <p className="mt-2 text-sm text-slate-700">
          {error || (language === "hi" ? "सत्यापित डेटा प्राप्त नहीं हो सका। कृपया पुन: प्रयास करें।" : language === "kn" ? "ಪರಿಶೀಲಿತ ಮಾಹಿತಿ ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ." : "Couldn't retrieve verified information for this question. Please try again.")}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            {language === "hi" ? "पुन: प्रयास करें" : language === "kn" ? "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ" : "Try Again"}
          </button>
        )}
      </div>
    );
  }

  if (!response || !response.answer) {
    return null;
  }

  const primaryScheme = response.schemes && response.schemes.length > 0 ? response.schemes[0] : undefined;
  const parsed = parseAnswerText(response.answer, primaryScheme);
  const confidenceInfo = getConfidenceBadge(response.confidence, language);

  const isInsufficient = response.verification_status === "insufficient_evidence" || response.confidence === "low";

  // Scheme Display Name & Category
  const schemeTitle = primaryScheme?.name || parsed.schemeName || (isInsufficient ? "Verification Notice" : "Scheme Assistant");
  const categoryName = primaryScheme?.category || parsed.categoryScope?.split("(")[0]?.trim() || "Government Welfare";
  const categoryIcon = getCategoryIcon(categoryName);
  const stateScopeText = primaryScheme?.state_scope?.join(", ") || (parsed.categoryScope?.includes("State:") ? parsed.categoryScope.split("State:")[1].replace(")", "").trim() : "All India");
  const officialLink = primaryScheme ? String(primaryScheme.official_link) : parsed.officialSource?.url;

  // Documents list merge
  const docsList = primaryScheme?.required_documents?.length ? primaryScheme.required_documents : parsed.requiredDocuments || [];
  const benefitsList = primaryScheme?.benefits?.length ? primaryScheme.benefits : parsed.benefits || [];
  const stepsList = primaryScheme?.application_steps?.length ? primaryScheme.application_steps : parsed.applicationSteps || [];

  return (
    <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-b from-white to-emerald-50/30 p-5 sm:p-6 shadow-sm space-y-6 text-slate-800">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 pb-4">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100/80 text-2xl shadow-inner flex-shrink-0">
            {categoryIcon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">{schemeTitle}</h3>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600">
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100/60 px-2 py-0.5 text-emerald-900">
                <BookOpen className="h-3.5 w-3.5 text-emerald-700" /> {categoryName}
              </span>
              <span>•</span>
              <span className="text-slate-600">{stateScopeText}</span>
              {primaryScheme?.department && (
                <>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-slate-500">
                    <Building2 className="h-3.5 w-3.5" /> {primaryScheme.department}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Confidence Badge Header */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${confidenceInfo.bgClass}`}>
            <span className={`h-2 w-2 rounded-full ${confidenceInfo.dotClass}`} />
            {confidenceInfo.label}
          </span>
        </div>
      </div>

      {/* 2. Direct Answer / Overview */}
      {(parsed.overview || parsed.rawBlocks.length > 0) && (
        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            {language === "hi" ? "मुख्य उत्तर" : language === "kn" ? "ಮುಖ್ಯ ಉತ್ತರ" : "Overview & Answer"}
          </h4>
          <div className="rounded-xl border border-emerald-100/80 bg-white p-4 text-slate-800 text-sm sm:text-base leading-relaxed shadow-2xs">
            {parsed.overview ? <p>{renderBoldSpans(parsed.overview)}</p> : null}
            {parsed.rawBlocks.length > 0 && (
              <div className="mt-2 space-y-2">
                {parsed.rawBlocks.map((block, i) => (
                  <FormattedText key={i} content={block} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Deterministic Eligibility Status Box */}
      {parsed.eligibilityStatus && (
        <div className="space-y-3">
          <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
            <UserCheck className="h-4 w-4 text-emerald-600" />
            {language === "hi" ? "पात्रता स्थिति" : language === "kn" ? "ಅರ್ಹತಾ ಸ್ಥಿತಿ" : "Eligibility Assessment"}
          </h4>

          {parsed.eligibilityStatus === "ELIGIBLE" && (
            <div className="rounded-xl border border-emerald-300 bg-emerald-50/80 p-4 text-emerald-900 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-700 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-bold text-emerald-950">
                  {language === "hi" ? "✓ आप योग्य हैं" : language === "kn" ? "✓ ನೀವು ಅರ್ಹರಾಗಿದ್ದೀರಿ" : "✓ Eligible"}
                </div>
                <p className="mt-1 text-xs sm:text-sm text-emerald-800">
                  {parsed.engineExplanation || (language === "hi" ? "सभी आवश्यक शर्तें पूरी की गई हैं।" : language === "kn" ? "ಎಲ್ಲಾ ಅಗತ್ಯ ನಿಯಮಗಳನ್ನು ಪೂರೈಸಲಾಗಿದೆ." : "All deterministic conditions are satisfied.")}
                </p>
              </div>
            </div>
          )}

          {parsed.eligibilityStatus === "NOT_ELIGIBLE" && (
            <div className="rounded-xl border border-red-200 bg-red-50/80 p-4 text-red-950 flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-bold text-red-900">
                  {language === "hi" ? "✕ आप योग्य नहीं हैं" : language === "kn" ? "✕ ನೀವು ಅರ್ಹರಾಗಿಲ್ಲ" : "✕ Not Eligible"}
                </div>
                <p className="mt-1 text-xs sm:text-sm text-red-800">
                  {parsed.engineExplanation || (language === "hi" ? "कम से कम 1 शर्त पूरी नहीं हुई है।" : language === "kn" ? "ಕನಿಷ್ಠ 1 ನಿಯಮವನ್ನು ಪೂರೈಸಲಾಗಿಲ್ಲ." : "Condition requirements were not fully satisfied.")}
                </p>
              </div>
            </div>
          )}

          {parsed.eligibilityStatus === "NEEDS_MORE_INFORMATION" && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-amber-950 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-bold text-amber-900">
                  {language === "hi" ? "ⓘ अधिक जानकारी की आवश्यकता है" : language === "kn" ? "ⓘ ಹೆಚ್ಚಿನ ಮಾಹಿತಿ ಅಗತ್ಯವಿದೆ" : "ⓘ Profile Information Needed"}
                </div>
                <p className="mt-1 text-xs sm:text-sm text-amber-800">
                  {parsed.engineExplanation || (language === "hi" ? "पात्रता की पुष्टि के लिए अतिरिक्त प्रोफ़ाइल जानकारी की आवश्यकता है।" : language === "kn" ? "ಅರ್ಹತೆಯನ್ನು ದೃಢೀಕರಿಸಲು ಹೆಚ್ಚಿನ ಮಾಹಿತಿ ಪ್ರೊಫೈಲ್‌ನಲ್ಲಿ ಬೇಕಾಗಿದೆ." : "Complete required profile fields to check full eligibility.")}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Unmet Conditions & Missing Profile Fields */}
      {((parsed.unmetConditions && parsed.unmetConditions.length > 0) || (parsed.missingFields && parsed.missingFields.length > 0)) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {parsed.unmetConditions && parsed.unmetConditions.length > 0 && (
            <div className="rounded-xl border border-red-200 bg-red-50/40 p-4 space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-red-800 flex items-center gap-1">
                <XCircle className="h-4 w-4 text-red-600" />
                {language === "hi" ? "अयोग्य कारण" : language === "kn" ? "ಅರ್ಹತೆ ಇಲ್ಲದಿರಲು ಕಾರಣ" : "Why Not Eligible"}
              </h5>
              <ul className="space-y-1.5 text-xs sm:text-sm text-red-900">
                {parsed.unmetConditions.map((cond, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>{cond}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {parsed.missingFields && parsed.missingFields.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                <HelpCircle className="h-4 w-4 text-amber-600" />
                {language === "hi" ? "आवश्यक जानकारी जो गायब है" : language === "kn" ? "ಅಗತ್ಯವಿರುವ ಮಾಹಿತಿ" : "Information Still Needed"}
              </h5>
              <ul className="space-y-1.5 text-xs sm:text-sm text-amber-900">
                {parsed.missingFields.map((field, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{field}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 5. Key Benefits Section */}
      {benefitsList.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            {language === "hi" ? "प्रमुख लाभ" : language === "kn" ? "ಮುಖ್ಯ ಪ್ರಯೋಜನಗಳು" : "Key Benefits"}
          </h4>
          <ul className="grid gap-2 sm:grid-cols-2">
            {benefitsList.map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-2 rounded-xl border border-emerald-100 bg-white p-3 text-xs sm:text-sm text-slate-800 shadow-2xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 6. Required Documents Section */}
      {docsList.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-emerald-600" />
            {language === "hi" ? "आवश्यक दस्तावेज़" : language === "kn" ? "ಅಗತ್ಯ ದಾಖಲೆಗಳು" : "Documents You May Need"}
          </h4>
          <div className="flex flex-wrap gap-2">
            {docsList.map((doc, idx) => (
              <span key={idx} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs">
                <FileText className="h-3.5 w-3.5 text-emerald-600" />
                {doc}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 7. Application Steps Section */}
      {stepsList.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-emerald-600" />
            {language === "hi" ? "आवेदन प्रक्रिया" : language === "kn" ? "ಅರ್ಜಿ ವಿಧಾನ" : "Application Steps"}
          </h4>
          <div className="space-y-2">
            {stepsList.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-3 text-xs sm:text-sm text-slate-800 shadow-2xs">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-900 flex-shrink-0">
                  {idx + 1}
                </span>
                <span className="mt-0.5">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. Official Source Card & Link */}
      {officialLink && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
          <div className="flex items-center gap-2.5">
            <Building2 className="h-5 w-5 text-emerald-800 flex-shrink-0" />
            <div>
              <div className="text-xs font-semibold uppercase text-emerald-900">
                {language === "hi" ? "आधिकारिक पोर्टल" : language === "kn" ? "ಅಧಿಕೃತ ಪೋರ್ಟಲ್" : "Official Government Portal"}
              </div>
              <div className="text-sm font-medium text-slate-900">{primaryScheme?.source_name || parsed.officialSource?.name || "Official Government Portal"}</div>
            </div>
          </div>
          <a
            href={officialLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition-colors"
          >
            <span>{language === "hi" ? "आधिकारिक पोर्टल पर जाएँ" : language === "kn" ? "ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ಗೆ ಭೇಟಿ ನೀಡಿ" : "Visit Official Source"}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      )}

      {/* 9. Verification Note Box */}
      {(parsed.verificationNote || isInsufficient) && (
        <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-xs text-blue-900 flex items-start gap-2.5">
          <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <span>
            {parsed.verificationNote || (language === "hi" ? "सूचना समय के साथ बदलती रहती है। अंतिम आवेदन से पहले आधिकारिक सरकारी पोर्टल पर नियमों की पुष्टि करें।" : language === "kn" ? "ಮಾಹಿತಿ ಬದಲಾಗಬಹುದು. ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಮೊದಲು ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಪರಿಶೀಲಿಸಿ." : "Information changes over time. Verify latest guidelines on official government portal before applying.")}
          </span>
        </div>
      )}

      {/* 10. Footer Section: Source Citation & Speak Answer Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-emerald-100 pt-4 text-xs text-slate-600">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1 font-medium text-slate-700">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            {formatVerificationStatus(response.verification_status, language)}
          </span>
          {primaryScheme && (
            <Link to={`/schemes/${primaryScheme.id}`} className="text-emerald-700 underline font-medium hover:text-emerald-900">
              {language === "hi" ? "योजना विवरण देखें →" : language === "kn" ? "ಯೋಜನೆಯ ವಿವರ →" : "View Scheme Details →"}
            </Link>
          )}
        </div>

        {onSpeakAnswer && (
          <button
            onClick={onSpeakAnswer}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold text-emerald-800 shadow-2xs hover:bg-emerald-50 transition-colors"
          >
            <Volume2 className="h-4 w-4 text-emerald-700" />
            <span>{language === "hi" ? "उत्तर सुनें" : language === "kn" ? "ಉತ್ತರ ಕೇಳಿ" : "Speak Answer"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
