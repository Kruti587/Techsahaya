import json

mr_translations = {
    "pm-kisan": {
        "name": "पीएम-किसान (PM-Kisan)",
        "description": "पात्र शेतकरी कुटुंबांसाठी उत्पन्न समर्थन योजना. अर्ज करण्यापूर्वी अधिकृत नियम सत्यापित करा."
    },
    "ayushman-bharat-pmjay": {
        "name": "आयुष्मान भारत PM-JAY",
        "description": "पात्र असुरक्षित कुटुंबांसाठी आरोग्य संरक्षण समर्थन. अर्ज करण्यापूर्वी अधिकृत नियम सत्यापित करा."
    },
    "pmay-g": {
        "name": "प्रधानमंत्री आवास योजना (ग्रामीण)",
        "description": "ग्रामीण भागात घरे बांधण्यासाठी आर्थिक मदत. अर्ज करण्यापूर्वी अधिकृत नियम सत्यापित करा."
    },
    "national-scholarship-portal": {
        "name": "राष्ट्रीय शिष्यवृत्ती पोर्टल",
        "description": "पात्र विद्यार्थ्यांसाठी शैक्षणिक शिष्यवृत्ती. अर्ज करण्यापूर्वी अधिकृत नियम सत्यापित करा."
    },
    "pm-ujjwala-yojana": {
        "name": "प्रधानमंत्री उज्ज्वला योजना",
        "description": "दारिद्र्यरेषेखालील कुटुंबांसाठी मोफत एलपीजी कनेक्शन. अर्ज करण्यापूर्वी अधिकृत नियम सत्यापित करा."
    },
    "e-shram": {
        "name": "ई-श्रम",
        "description": "असंघटित कामगारांसाठी राष्ट्रीय डेटाबेस आणि लाभ. अर्ज करण्यापूर्वी अधिकृत नियम सत्यापित करा."
    },
    "sukanya-samriddhi": {
        "name": "सुकन्या समृद्धी योजना",
        "description": "मुलींसाठी विशेष बचत योजना. अर्ज करण्यापूर्वी अधिकृत नियम सत्यापित करा."
    },
    "krishi-bhagya-karnataka": {
        "name": "कृषी भाग्य (कर्नाटक)",
        "description": "कर्नाटकातील कोरडवाहू शेतकऱ्यांसाठी सिंचन समर्थन. अर्ज करण्यापूर्वी अधिकृत नियम सत्यापित करा."
    },
    "swachh-bharat-mission-gramin": {
        "name": "स्वच्छ भारत मिशन (ग्रामीण)",
        "description": "ग्रामीण भागात स्वच्छता आणि शौचालये बांधण्यासाठी आर्थिक मदत."
    },
    "pm-vishwakarma": {
        "name": "पीएम विश्वकर्मा योजना",
        "description": "पारंपारिक कारागीर आणि शिल्पकारांसाठी आर्थिक मदत."
    },
    "pm-sym": {
        "name": "प्रधानमंत्री श्रम योगी मान-धन",
        "description": "असंघटित कामगारांसाठी पेन्शन योजना."
    },
    "udid": {
        "name": "स्वावलंबन (UDID)",
        "description": "दिव्यांग व्यक्तींसाठी युनिव्हर्सल आयडी आणि लाभ."
    }
}

try:
    with open('data/schemes/schemes.json', 'r', encoding='utf-8') as f:
        schemes = json.load(f)
        
    for scheme in schemes:
        sid = scheme['id']
        if sid in mr_translations:
            scheme['mr'] = mr_translations[sid]
            
    with open('data/schemes/schemes.json', 'w', encoding='utf-8') as f:
        json.dump(schemes, f, indent=4, ensure_ascii=False)
    print("Injected manual Marathi translations into schemes.json")
except Exception as e:
    print(e)
