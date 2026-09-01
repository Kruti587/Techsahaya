import type { Scheme } from "../types";
import rawSchemeTranslations from "../../../data/config/scheme_translations.json";

export const categoryTranslations: any = {
  Agriculture: { hi: "कृषि", kn: "ಕೃಷಿ", mr: "कृषी" },
  Education: { hi: "शिक्षा", kn: "ಶಿಕ್ಷಣ", mr: "शिक्षण" },
  Health: { hi: "स्वास्थ्य", kn: "ಆರೋಗ್ಯ", mr: "आरोग्य" },
  Housing: { hi: "आवास", kn: "ವಸತಿ", mr: "आवास" },
  Energy: { hi: "ऊर्जा", kn: "ಇಂಧನ", mr: "ऊर्जा" },
  Labour: { hi: "श्रम", kn: "ಕಾರ್ಮಿಕ", mr: "कामगार" },
  "Women and Child": { hi: "महिला एवं बाल विकास", kn: "ಮಹಿಳೆ ಮತ್ತು ಮಗು", mr: "महिला आणि बाल" },
  Sanitation: { hi: "स्वच्छता", kn: "ನೈರ್ಮಲ್ಯ", mr: "स्वच्छता" },
  Livelihood: { hi: "आजीविका एवं कौशल", kn: "ಬದುಕು ಮತ್ತು ಕೌಶಲ್ಯ", mr: "उपजीविका" },
  Disability: { hi: "दिव्यांगता सहायता", kn: "ಅಂಗವಿಕಲರ ಕಲ್ಯಾಣ", mr: "अपंगत्व समर्थन" },
};

export const documentTranslations: any = {
  "land record": { hi: "भूमि रिकॉर्ड (RTC)", kn: "ಭೂ ದಾಖಲೆ (ಪಹಣಿ/RTC)", mr: "जमिनीची नोंद (RTC)" },
  "bank account proof": { hi: "बैंक खाता प्रमाण", kn: "ಬ್ಯಾಂಕ್ ಖಾತೆ ಪುರಾವೆ", mr: "बँक खाते पुरावा" },
  "ration card": { hi: "राशन कार्ड", kn: "ರೇಷನ್ ಕಾರ್ಡ್", mr: "शिधापत्रिका" },
  "family id": { hi: "परिवार पहचान पत्र", kn: "ಕುಟುಂಬ ಐಡಿ", mr: "कुटुंब आयडी" },
  "residence proof": { hi: "निवास प्रमाण पत्र", kn: "ವಾಸಸ್ಥಳ ಪುರಾವೆ", mr: "रहिवासी पुरावा" },
  "income certificate": { hi: "आय प्रमाण पत्र", kn: "ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ", mr: "उत्पन्न प्रमाणपत्र" },
  "student id": { hi: "छात्र पहचान पत्र", kn: "ವಿದ್ಯಾರ್ಥಿ ಐಡಿ ಕಾರ್ಡ್", mr: "विद्यार्थी आयडी" },
  "mobile number": { hi: "मोबाइल नंबर", kn: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ", mr: "मोबाईल नंबर" },
  "occupation proof": { hi: "व्यवसाय प्रमाण", kn: "ವೃತ್ತಿ ಪುರಾವೆ", mr: "व्यवसाय पुरावा" },
  "birth certificate": { hi: "जन्म प्रमाण पत्र", kn: "ಜನನ ಪ್ರಮಾಣಪತ್ರ", mr: "जन्म प्रमाणपत्र" },
  "guardian id proof": { hi: "अभिभावक पहचान पत्र", kn: "ಪೋಷಕರ ಗುರುತಿನ ಚೀಟಿ", mr: "पालकांचा ओळखपत्र" },
  "disability certificate": { hi: "दिव्यांगता प्रमाण पत्र", kn: "ಅಂಗವಿಕಲತೆಯ ಪ್ರಮಾಣಪತ್ರ", mr: "अपंगत्व प्रमाणपत्र" },
  "state residence proof": { hi: "राज्य निवास प्रमाण पत्र", kn: "ಕರ್ನಾಟಕ ವಾಸಸ್ಥಳ ಪುರಾವೆ", mr: "राज्य रहिवासी पुरावा" },
};

interface SchemeTranslation {
  hi: {
    name?: string;
    description: string;
    benefits: string[];
    eligibility: string[];
    required_documents: string[];
    application_steps: string[];
    department: string;
  };
  kn: {
    name?: string;
    description: string;
    benefits: string[];
    eligibility: string[];
    required_documents: string[];
    application_steps: string[];
    department: string;
  };
  mr?: {
    name?: string;
    description: string;
    benefits: string[];
    eligibility: string[];
    required_documents: string[];
    application_steps: string[];
    department: string;
  };
}

export const schemeTranslations: Record<string, SchemeTranslation> = rawSchemeTranslations as Record<string, SchemeTranslation>;

/**
 * Returns a fully localized version of a Scheme object based on the current language ("en", "hi", "kn").
 * Preserves the official scheme ID and official name while translating descriptions, benefits, documents, steps, and categories.
 */
export function getLocalizedScheme(scheme: Scheme, language: string): Scheme {
  if (!scheme || !language || language === "en") {
    return scheme;
  }

  const lang = language === "hi" ? "hi" : language === "kn" ? "kn" : language === "mr" ? "mr" : "en";
  if (lang === "en") return scheme;

  const translation = schemeTranslations[scheme.id]?.[lang];
  const catTrans = categoryTranslations[scheme.category]?.[lang] || scheme.category;

  const localizedStateScope = scheme.state_scope.map((s) => {
    if (lang === 'mr') {
      if (s === 'All') return 'संपूर्ण भारत';
      if (s === 'Karnataka') return 'कर्नाटक';
      return s;
    }
    if (s === "All") return lang === "hi" ? "सभी राज्य" : "ಎಲ್ಲಾ ರಾಜ್ಯಗಳು";
    if (s === "Karnataka") return lang === "hi" ? "कर्नाटक" : "ಕರ್ನಾಟಕ";
    return s;
  });

  if (!translation) {
    return {
      ...scheme,
      category: catTrans,
      state_scope: localizedStateScope,
    };
  }

  return {
    ...scheme,
    name: translation.name || scheme.name,
    description: translation.description || scheme.description,
    category: catTrans,
    state_scope: localizedStateScope,
    benefits: translation.benefits && translation.benefits.length ? translation.benefits : scheme.benefits,
    eligibility: translation.eligibility && translation.eligibility.length ? translation.eligibility : scheme.eligibility,
    required_documents: translation.required_documents && translation.required_documents.length ? translation.required_documents : scheme.required_documents,
    application_steps: translation.application_steps && translation.application_steps.length ? translation.application_steps : scheme.application_steps,
    department: translation.department || scheme.department,
  };
}

/**
 * Returns localized string for document names
 */
export function getLocalizedDocumentName(docName: string, language: string): string {
  if (!docName || language === "en") return docName;
  const lang = language === "hi" ? "hi" : language === "kn" ? "kn" : "en";
  if (lang === "en") return docName;
  const key = docName.toLowerCase().trim();
  return documentTranslations[key]?.[lang] || docName;
}
