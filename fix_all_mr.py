import json

mr_names = {
    "pm-kisan": "पीएम-किसान (PM-Kisan)",
    "ayushman-bharat-pmjay": "आयुष्मान भारत PM-JAY",
    "pmay-g": "प्रधानमंत्री आवास योजना (ग्रामीण)",
    "national-scholarship-portal": "राष्ट्रीय शिष्यवृत्ती पोर्टल",
    "pm-ujjwala-yojana": "प्रधानमंत्री उज्ज्वला योजना",
    "e-shram": "ई-श्रम",
    "sukanya-samriddhi": "सुकन्या समृद्धी योजना",
    "krishi-bhagya-karnataka": "कृषी भाग्य (कर्नाटक)",
    "swachh-bharat-mission-gramin": "स्वच्छ भारत मिशन (ग्रामीण)",
    "pm-vishwakarma": "पीएम विश्वकर्मा योजना",
    "pm-sym": "प्रधानमंत्री श्रम योगी मान-धन",
    "udid": "स्वावलंबन (UDID)"
}

mr_descriptions = {
    "pm-kisan": "पात्र शेतकरी कुटुंबांसाठी उत्पन्न समर्थन योजना. अर्ज करण्यापूर्वी अधिकृत नियम सत्यापित करा.",
    "ayushman-bharat-pmjay": "पात्र असुरक्षित कुटुंबांसाठी आरोग्य संरक्षण समर्थन. अर्ज करण्यापूर्वी अधिकृत नियम सत्यापित करा.",
    "pmay-g": "ग्रामीण भागात घरे बांधण्यासाठी आर्थिक मदत. अर्ज करण्यापूर्वी अधिकृत नियम सत्यापित करा.",
    "national-scholarship-portal": "पात्र विद्यार्थ्यांसाठी शैक्षणिक शिष्यवृत्ती. अर्ज करण्यापूर्वी अधिकृत नियम सत्यापित करा.",
    "pm-ujjwala-yojana": "दारिद्र्यरेषेखालील कुटुंबांसाठी मोफत एलपीजी कनेक्शन. अर्ज करण्यापूर्वी अधिकृत नियम सत्यापित करा.",
    "e-shram": "असंघटित कामगारांसाठी राष्ट्रीय डेटाबेस आणि लाभ. अर्ज करण्यापूर्वी अधिकृत नियम सत्यापित करा.",
    "sukanya-samriddhi": "मुलींसाठी विशेष बचत योजना. अर्ज करण्यापूर्वी अधिकृत नियम सत्यापित करा.",
    "krishi-bhagya-karnataka": "कर्नाटकातील कोरडवाहू शेतकऱ्यांसाठी सिंचन समर्थन. अर्ज करण्यापूर्वी अधिकृत नियम सत्यापित करा.",
    "swachh-bharat-mission-gramin": "ग्रामीण भागात स्वच्छता आणि शौचालये बांधण्यासाठी आर्थिक मदत.",
    "pm-vishwakarma": "पारंपारिक कारागीर आणि शिल्पकारांसाठी आर्थिक मदत.",
    "pm-sym": "असंघटित कामगारांसाठी पेन्शन योजना.",
    "udid": "दिव्यांग व्यक्तींसाठी युनिव्हर्सल आयडी आणि लाभ."
}

with open('data/config/scheme_translations.json', 'r', encoding='utf-8') as f:
    trans = json.load(f)

for scheme_id, lang_dict in trans.items():
    if 'mr' not in lang_dict:
        # Fallback empty structure
        lang_dict['mr'] = {
            "description": "",
            "benefits": [],
            "eligibility": [],
            "required_documents": [],
            "application_steps": [],
            "department": ""
        }
        
    lang_dict['mr']['name'] = mr_names.get(scheme_id, scheme_id)
    lang_dict['mr']['description'] = mr_descriptions.get(scheme_id, lang_dict['mr'].get('description', ''))

with open('data/config/scheme_translations.json', 'w', encoding='utf-8') as f:
    json.dump(trans, f, indent=4, ensure_ascii=False)

print("Injected titles and missing descriptions into scheme_translations.json")
