export interface DpdpContent {
  actBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  problemBadge: string;
  problemTitle: string;
  traditionalProblemTitle: string;
  traditionalProblemBody: string;
  solutionTitle: string;
  solutionBody: string;
  cyberHeading: string;
  ciaTitle: string;
  ciaSubtitle: string;
  confidentialityTitle: string;
  confidentialitySubtitle: string;
  confidentialityP1: string;
  confidentialityP2: string;
  confidentialityP3: string;
  confidentialityFooter: string;
  integrityTitle: string;
  integritySubtitle: string;
  integrityP1: string;
  integrityP2: string;
  integrityP3: string;
  integrityFooter: string;
  availabilityTitle: string;
  availabilitySubtitle: string;
  availabilityP1: string;
  availabilityP2: string;
  availabilityP3: string;
  availabilityFooter: string;
  retentionTitle: string;
  retentionSubtitle: string;
  retentionDesc: string;
  retentionItem1: string;
  retentionItem2: string;
  retentionItem3: string;
  retentionItem4: string;
  sovereigntyTitle: string;
  sovereigntySubtitle: string;
  sovereigntyDesc: string;
  sovereigntyItem1: string;
  sovereigntyItem2: string;
  sovereigntyItem3: string;
  breachTitle: string;
  breachSubtitle: string;
  breachDesc: string;
  breachStep1Title: string;
  breachStep1Desc: string;
  breachStep2Title: string;
  breachStep2Desc: string;
  breachStep3Title: string;
  breachStep3Desc: string;
  breachFooterNotice: string;
  certInPortalBtn: string;
  actorsHeading: string;
  actorsTitle: string;
  actorsSubtitle: string;
  principalTitle: string;
  principalBadge: string;
  principalDesc: string;
  fiduciaryTitle: string;
  fiduciaryBadge: string;
  fiduciaryDesc: string;
  processorTitle: string;
  processorBadge: string;
  processorDesc: string;
  dpoTitle: string;
  dpoBadge: string;
  dpoDesc: string;
  bannerTitle: string;
  bannerDesc: string;
  consentBtn: string;
}

export const dpdpDictionary: Record<string, DpdpContent> = {
  en: {
    actBadge: "Digital Personal Data Protection Act, 2023 • Section 4–12",
    heroTitle: "DPDP Act Compliance & Privacy By Design",
    heroSubtitle: "How Tech Sahaya upholds Indian citizen data protection rights, statutory data fiduciary obligations, CIA security integration, 6-month to 1-year auto-vanishing retention, and direct CERT-In / MeitY incident reporting.",
    problemBadge: "Alignment with Problem Statement & Citizen UX Flow",
    problemTitle: "Why Citizen Data Protection Is Crucial For Welfare Access",
    traditionalProblemTitle: "The Traditional Welfare Problem",
    traditionalProblemBody: "Millions of vulnerable citizens fail to claim government pensions, subsidies, and grants because official portals demand permanent uploads of sensitive physical documents, unmasked Aadhaar numbers, and biometric scans. Citizens fear surveillance, identity theft, commercial data brokering, and permanent leakage.",
    solutionTitle: "The Tech Sahaya Architectural Solution",
    solutionBody: "Tech Sahaya flips the model entirely: zero raw Aadhaar or biometrics are ever stored. Documents exist purely in volatile RAM during rule evaluation. We enforce mathematical auditability, a 6-month to 1-year hard auto-purge lifecycle, and explicit statutory protections under India’s DPDP Act 2023.",
    cyberHeading: "CYBERSECURITY FOUNDATION",
    ciaTitle: "CIA Triad Integration for Indian Citizens",
    ciaSubtitle: "Comprehensive tripartite security architecture enforcing Confidentiality, Integrity, and Availability across every citizen touchpoint.",
    confidentialityTitle: "Confidentiality",
    confidentialitySubtitle: "Zero-Knowledge Privacy",
    confidentialityP1: "In-Memory RAM Sandbox: Document verification runs without writing raw files to disk.",
    confidentialityP2: "TLS 1.3 Transport Cipher: 256-bit AES cryptographic encapsulation in transit.",
    confidentialityP3: "Zero Third-Party Trackers: No external ad pixels, Google Analytics, or commercial brokers.",
    confidentialityFooter: "Passes DPDP Section 8(5) Security Mandate",
    integrityTitle: "Integrity",
    integritySubtitle: "Deterministic Correctness",
    integrityP1: "Deterministic Rule Engine: Qualification is evaluated mathematically with zero hallucination.",
    integrityP2: "Official Gazette Quotes: Every match cites the exact government notification clause.",
    integrityP3: "HMAC Audit Receipts: Cryptographically signed evaluation receipts prove why benefits were matched.",
    integrityFooter: "Zero Synthetic Alteration of Rules",
    availabilityTitle: "Availability",
    availabilitySubtitle: "Universal Public Welfare Access",
    availabilityP1: "Offline PWA Support: Cached scheme rules are accessible even in rural areas without 4G.",
    availabilityP2: "9+ Local Dialects & Voice: Illiterate or visually impaired citizens can check rights via speech.",
    availabilityP3: "High-Availability Cloud: Redundant sovereign data nodes guarantee 99.9% uptime.",
    availabilityFooter: "High Accessibility Digital Public Good",
    retentionTitle: "Data Retention: 6 Months to 1 Year Auto-Vanishing",
    retentionSubtitle: "Hardcoded Expiry Lifecycles",
    retentionDesc: "In accordance with Section 8(7) of the DPDP Act 2023, data must not be retained beyond the period necessary for its specified purpose. Tech Sahaya enforces strict auto-purge limits:",
    retentionItem1: "Active Session Cache: Flushed from volatile RAM immediately upon logout or tab closure.",
    retentionItem2: "Simulated Eligibility Profiles: Automatically purged and vanished after 6 months of citizen inactivity.",
    retentionItem3: "Annual Subsidy Renewal Tokens: Hard-capped at 1 year maximum before compulsory re-consent.",
    retentionItem4: "Instant Right to Erasure: Citizens can trigger zeroization at any moment from settings.",
    sovereigntyTitle: "All Data Strictly for Indian People",
    sovereigntySubtitle: "100% National Sovereignty",
    sovereigntyDesc: "All infrastructure, deterministic rule execution clusters, and DigiLocker bridge connectors reside strictly within the territorial jurisdiction of India:",
    sovereigntyItem1: "Zero Cross-Border Transfers: No citizen welfare parameters are transmitted or routed outside India.",
    sovereigntyItem2: "National Informatics Center (NIC) Alignment: Hosted across certified Indian sovereign tier-4 data centers.",
    sovereigntyItem3: "Section 16 DPDP Compliance: Strict adherence to Central Government restrictions on data transfers.",
    breachTitle: "Breach Reporting Protocol: Direct to Indian MeitY & CERT-In",
    breachSubtitle: "Statutory Incident Response under IT Act Sec 70B & DPDP Sec 8(6)",
    breachDesc: "If any security anomaly, unauthorized access, or data breach is detected affecting Indian citizens, Tech Sahaya is legally and architecturally bound to initiate the following immediate response protocol:",
    breachStep1Title: "01 • 6-Hour CERT-In Notice",
    breachStep1Desc: "Mandatory incident reporting to CERT-In (Computer Emergency Response Team - India) within the 6-hour legal window.",
    breachStep2Title: "02 • Data Protection Board & MeitY",
    breachStep2Desc: "Formal statutory intimation submitted to the Data Protection Board of India and the Ministry of Electronics & IT.",
    breachStep3Title: "03 • Citizen Right to Redressal",
    breachStep3Desc: "Immediate direct notification to affected citizens with remediation guidance and full transparency logs.",
    breachFooterNotice: "Citizens may independently lodge data security grievances directly with MeitY and our DPO.",
    certInPortalBtn: "Visit Official CERT-In Portal",
    actorsHeading: "STATUTORY ACTORS & RESPONSIBILITIES",
    actorsTitle: "DPDP Roles Mapped to Tech Sahaya",
    actorsSubtitle: "Clear segregation of legal identities ensuring citizens always know who is accountable.",
    principalTitle: "Data Principal",
    principalBadge: "You (The Citizen)",
    principalDesc: "The individual to whom personal data relates. You retain sovereign rights of consent, verification receipts, and total erasure.",
    fiduciaryTitle: "Data Fiduciary",
    fiduciaryBadge: "Tech Sahaya Platform",
    fiduciaryDesc: "The legal entity determining purpose and means of evaluation. Held strictly liable under DPDP Act penalties for any breach.",
    processorTitle: "Data Processor",
    processorBadge: "RAM-Only Rule Engine",
    processorDesc: "Isolated compute containers processing parameters strictly during match cycles, mathematically prevented from data persistence.",
    dpoTitle: "Data Privacy Officer (DPO)",
    dpoBadge: "Statutory Redressal Desk",
    dpoDesc: "Designated citizen grievance officer answering directly to Indian citizens for rights enforcement, audits, and inquiries.",
    bannerTitle: "Have questions about your citizen data rights?",
    bannerDesc: "Our Data Protection Officer (DPO) is available under Section 10 of the DPDP Act 2023 for inquiries, consent withdrawal, and grievance escalation.",
    consentBtn: "Consent Framework"
  },
  hi: {
    actBadge: "डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम, 2023 • धारा 4–12",
    heroTitle: "डीपीडीपी अधिनियम अनुपालन और डिज़ाइन द्वारा गोपनीयता",
    heroSubtitle: "टेक सहाय भारतीय नागरिकों के डेटा संरक्षण अधिकारों, वैधानिक डेटा फिड्यूशरी दायित्वों, सीआईए (CIA) सुरक्षा एकीकरण, 6 महीने से 1 वर्ष की स्वतः-समाप्त प्रतिधारण नीति और सीईआरटी-इन / MeitY को सीधी घटना रिपोर्टिंग का पूरी निष्ठा से पालन करता है।",
    problemBadge: "समस्या विवरण एवं नागरिक अनुभव (UX) संरेखण",
    problemTitle: "कल्याणकारी योजनाओं के लाभ के लिए नागरिक डेटा सुरक्षा क्यों महत्वपूर्ण है",
    traditionalProblemTitle: "पारंपरिक कल्याणकारी पोर्टल की समस्या",
    traditionalProblemBody: "लाखों जरूरतमंद नागरिक सरकारी पेंशन, सब्सिडी और अनुदान प्राप्त करने से वंचित रह जाते हैं क्योंकि आधिकारिक पोर्टल संवेदनशील भौतिक दस्तावेज़, पूर्ण आधार संख्या और बायोमेट्रिक स्कैन अपलोड करने की मांग करते हैं। नागरिकों में निगरानी, पहचान चोरी, वाणिज्यिक डेटा दलाली और स्थायी डेटा लीक का भय बना रहता है।",
    solutionTitle: "टेक सहाय का वास्तुशिल्प समाधान",
    solutionBody: "टेक सहाय इस प्रक्रिया को पूरी तरह बदल देता है: कोई भी मूल आधार या बायोमेट्रिक कभी भी सर्वर पर स्टोर नहीं किया जाता। दस्तावेज़ केवल पात्रता मूल्यांकन के दौरान अस्थायी रैम (RAM) में सुरक्षित रहते हैं। हम गणितीय लेखापरीक्षा, 6 महीने से 1 वर्ष की स्वतः-समाप्ति नीति और डीपीडीपी अधिनियम 2023 के तहत पूर्ण वैधानिक सुरक्षा प्रदान करते हैं।",
    cyberHeading: "साइबर सुरक्षा की आधारशिला",
    ciaTitle: "भारतीय नागरिकों के लिए सीआईए (CIA) सुरक्षा एकीकरण",
    ciaSubtitle: "प्रत्येक नागरिक स्तर पर गोपनीयता (Confidentiality), अखंडता (Integrity) और उपलब्धता (Availability) लागू करने वाली व्यापक त्रिपक्षीय सुरक्षा संरचना।",
    confidentialityTitle: "गोपनीयता (Confidentiality)",
    confidentialitySubtitle: "शून्य-ज्ञान गोपनीयता (Zero-Knowledge Privacy)",
    confidentialityP1: "इन-मेमोरी रैम सैंडबॉक्स: दस्तावेज़ सत्यापन डिस्क पर कोई भी फ़ाइल लिखे बिना सीधे सुरक्षित रैम (RAM) में संचालित होता है।",
    confidentialityP2: "टीएलएस 1.3 सिफ़र: ट्रांसमिशन के दौरान 256-बिट एईएस (AES) क्रिप्टोग्राफ़िक सुरक्षा।",
    confidentialityP3: "शून्य तृतीय-पक्ष ट्रैकर: कोई बाहरी विज्ञापन पिक्सेल, ट्रैकिंग कोड या वाणिज्यिक डेटा ब्रोकर नहीं।",
    confidentialityFooter: "डीपीडीपी धारा 8(5) सुरक्षा नियमों का पूर्ण अनुपालन",
    integrityTitle: "अखंडता (Integrity)",
    integritySubtitle: "नियम-सत्यापित पूर्ण सत्यता (Deterministic Correctness)",
    integrityP1: "नियम इंजन: पात्रता का मूल्यांकन गणितीय आधार पर बिना किसी त्रुटि या कृत्रिम अनुमान के होता है।",
    integrityP2: "आधिकारिक राजपत्र उद्धरण: हर योजना मिलान के साथ सटीक सरकारी अधिसूचना और नियम धारा उद्धृत की जाती है।",
    integrityP3: "HMAC ऑडिट रसीदें: क्रिप्टोग्राफ़िक रूप से डिजिटल हस्ताक्षरित रसीदें सिद्ध करती हैं कि लाभ क्यों और कैसे मिला।",
    integrityFooter: "नियमों में कृत्रिम फेरबदल की शून्य संभावना",
    availabilityTitle: "उपलब्धता (Availability)",
    availabilitySubtitle: "सार्वभौमिक सार्वजनिक कल्याण पहुंच",
    availabilityP1: "ऑफ़लाइन PWA सुविधा: 4G नेटवर्क न होने पर भी ग्रामीण क्षेत्रों में कैश की गई योजनाएं तुरंत उपलब्ध रहती हैं।",
    availabilityP2: "9+ स्थानीय भाषाएं व आवाज़: कम साक्षर या दृष्टिबाधित नागरिक बोलकर और सुनकर अपने अधिकार जान सकते हैं।",
    availabilityP3: "उच्च-उपलब्धता क्लाउड: भारत में स्थित संप्रभु डेटा नोड्स 99.9% निरंतर उपलब्धता की गारंटी देते हैं।",
    availabilityFooter: "सुलभ एवं समावेशी डिजिटल सार्वजनिक कल्याण सेवा",
    retentionTitle: "डेटा प्रतिधारण: 6 महीने से 1 वर्ष में स्वतः-समाप्त (Auto-Vanishing)",
    retentionSubtitle: "हार्डकोडेड समाप्ति जीवनचक्र",
    retentionDesc: "डीपीडीपी अधिनियम 2023 की धारा 8(7) के अनुसार, निर्दिष्ट उद्देश्य से अधिक समय तक किसी भी नागरिक का डेटा नहीं रखा जा सकता। टेक सहाय सख्त स्वतः-समाप्ति सीमाएं लागू करता है:",
    retentionItem1: "सक्रिय सत्र कैश: लॉगआउट करने या ब्राउज़र टैब बंद करते ही अस्थायी रैम (RAM) से तुरंत नष्ट कर दिया जाता है।",
    retentionItem2: "सिम्युलेटेड पात्रता प्रोफ़ाइल: 6 महीने तक नागरिक की निष्क्रियता के बाद स्वतः ही हमेशा के लिए हटा दी जाती है।",
    retentionItem3: "वार्षिक सब्सिडी टोकन: अनिवार्य पुनः-सहमति प्राप्त करने से पहले अधिकतम 1 वर्ष की कठोर समय-सीमा।",
    retentionItem4: "तत्काल डेटा मिटाने का अधिकार: नागरिक सेटिंग्स से किसी भी क्षण अपना सारा डेटा पूरी तरह शून्य कर सकते हैं।",
    sovereigntyTitle: "संपूर्ण डेटा केवल भारतीय नागरिकों के लिए",
    sovereigntySubtitle: "100% राष्ट्रीय संप्रभुता",
    sovereigntyDesc: "सभी बुनियादी ढांचे, नियम निष्पादन क्लस्टर और डिजिलॉकर कनेक्टर पूर्ण रूप से भारत की क्षेत्रीय सीमा के भीतर स्थित हैं:",
    sovereigntyItem1: "शून्य सीमा-पार स्थानांतरण: कोई भी नागरिक कल्याण डेटा कभी भी भारत की सीमा से बाहर नहीं भेजा जाता।",
    sovereigntyItem2: "राष्ट्रीय सूचना विज्ञान केंद्र (NIC) संरेखण: प्रमाणित भारतीय संप्रभु टियर-4 डेटा केंद्रों पर सुरक्षित होस्टेड।",
    sovereigntyItem3: "डीपीडीपी धारा 16 का अनुपालन: केंद्र सरकार के डेटा स्थानांतरण प्रतिबंधों और दिशानिर्देशों का अक्षरशः पालन।",
    breachTitle: "सुरक्षा उल्लंघन रिपोर्टिंग प्रोटोकॉल: MeitY और CERT-In को सीधी सूचना",
    breachSubtitle: "आईटी अधिनियम धारा 70B और डीपीडीपी धारा 8(6) के तहत वैधानिक घटना प्रतिक्रिया",
    breachDesc: "यदि भारतीय नागरिकों को प्रभावित करने वाली कोई भी सुरक्षा विसंगति, अनधिकृत पहुंच या डेटा उल्लंघन का संदेह होता है, तो टेक सहाय तुरंत निम्नलिखित वैधानिक प्रोटोकॉल शुरू करने के लिए बाध्य है:",
    breachStep1Title: "01 • 6 घंटे के भीतर CERT-In को सूचना",
    breachStep1Desc: "कानूनी 6 घंटे की अनिवार्य समय-सीमा के भीतर CERT-In (कंप्यूटर इमरजेंसी रिस्पांस टीम - भारत) को तत्काल घटना रिपोर्ट।",
    breachStep2Title: "02 • डेटा संरक्षण बोर्ड और MeitY",
    breachStep2Desc: "भारतीय डेटा संरक्षण बोर्ड और इलेक्ट्रॉनिक्स एवं सूचना प्रौद्योगिकी मंत्रालय (MeitY) को औपचारिक वैधानिक सूचना।",
    breachStep3Title: "03 • नागरिक निवारण का अधिकार",
    breachStep3Desc: "प्रभावित नागरिकों को उपचारात्मक मार्गदर्शन और पूर्ण पारदर्शिता लॉग के साथ तत्काल सीधी सूचना।",
    breachFooterNotice: "नागरिक MeitY और हमारे DPO के पास सीधे डेटा सुरक्षा शिकायत दर्ज कर सकते हैं।",
    certInPortalBtn: "आधिकारिक CERT-In पोर्टल देखें",
    actorsHeading: "वैधानिक पक्ष और उत्तरदायित्व",
    actorsTitle: "टेक सहाय के तहत डीपीडीपी भूमिकाएं",
    actorsSubtitle: "कानूनी पहचानों का स्पष्ट विभाजन ताकि नागरिक हमेशा जान सकें कि कौन जवाबदेह है।",
    principalTitle: "डेटा प्रिंसिपल (Data Principal)",
    principalBadge: "आप (नागरिक)",
    principalDesc: "वह व्यक्ति जिससे व्यक्तिगत डेटा संबंधित है। आपके पास सहमति, ऑडिट रसीदें और संपूर्ण डेटा मिटाने का संप्रभु अधिकार है।",
    fiduciaryTitle: "डेटा फिड्यूशरी (Data Fiduciary)",
    fiduciaryBadge: "टेक सहाय मंच",
    fiduciaryDesc: "पात्रता मूल्यांकन के उद्देश्य और साधनों को निर्धारित करने वाली कानूनी संस्था। किसी भी उल्लंघन पर डीपीडीपी दंड के तहत जवाबदेह।",
    processorTitle: "डेटा प्रोसेसर (Data Processor)",
    processorBadge: "केवल-रैम नियम इंजन",
    processorDesc: "सुरक्षित कंप्यूट कंटेनर जो केवल मिलान के दौरान डेटा प्रोसेस करते हैं, डेटा संचय से गणितीय रूप से सुरक्षित।",
    dpoTitle: "डेटा संरक्षण अधिकारी (DPO)",
    dpoBadge: "वैधानिक शिकायत निवारण डेस्क",
    dpoDesc: "अधिकार प्रवर्तन, ऑडिट और नागरिक पूछताछ के लिए भारतीय नागरिकों के प्रति सीधे जवाबदेह नामित अधिकारी।",
    bannerTitle: "क्या आपके नागरिक डेटा अधिकारों के बारे में कोई प्रश्न हैं?",
    bannerDesc: "हमारे डेटा संरक्षण अधिकारी (DPO) डीपीडीपी अधिनियम 2023 की धारा 10 के तहत पूछताछ, सहमति वापसी और शिकायत निवारण के लिए तत्पर हैं।",
    consentBtn: "सहमति ढांचा (Consent Framework)"
  }
};

export function getDpdpContent(language: string): DpdpContent {
  return dpdpDictionary[language] || dpdpDictionary.en;
}
