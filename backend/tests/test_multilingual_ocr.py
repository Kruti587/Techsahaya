import pytest
from app.services.document_service import document_service, _normalize_indic_digits


def test_indic_digits_normalization():
    # Kannada digits ೩೪ -> 34, ೮೫೦೦೦ -> 85000
    assert _normalize_indic_digits("ವಯಸ್ಸು: ೩೪ / ಆದಾಯ: ೮೫೦೦೦") == "ವಯಸ್ಸು: 34 / ಆದಾಯ: 85000"
    # Devanagari digits ३४ -> 34, ८५००० -> 85000
    assert _normalize_indic_digits("आयु: ३४ / आय: ८५०००") == "आयु: 34 / आय: 85000"
    # Telugu digits ౩౪ -> 34
    assert _normalize_indic_digits("వయస్సు: ౩౪") == "వయస్సు: 34"
    # Bengali digits ৩৪ -> 34
    assert _normalize_indic_digits("বয়স: ৩৪") == "বয়স: 34"
    # Gujarati digits ૩૪ -> 34
    assert _normalize_indic_digits("ઉંમર: ૩૪") == "ઉંમર: 34"


def test_multilingual_field_extraction_all_9_languages():
    test_cases = [
        ("en", "Age: 34 / Annual Income: Rs 85,000 / Landholding: 2.5 acres", 34, 85000.0, 2.5),
        ("hi", "आयु: 34 वर्ष / वार्षिक आय: रु 85,000 / भूमि: 2.5 एकड़", 34, 85000.0, 2.5),
        ("kn", "ವಯಸ್ಸು: 34 / ವಾರ್ಷಿಕ ಆದಾಯ: ರೂ 85,000 / ಜಮೀನು: 2.5 ಎಕರೆ", 34, 85000.0, 2.5),
        ("te", "వయస్సు: 34 / వార్షిక ఆదాయం: రూ 85,000 / భూమి: 2.5 ఎకరాలు", 34, 85000.0, 2.5),
        ("ta", "வயது: 34 / ஆண்டு வருமானம்: ரூ 85,000 / நிலம்: 2.5 ஏக்கர்", 34, 85000.0, 2.5),
        ("ml", "വയസ്സ്: 34 / വാർഷിക വരുമാനം: 85,000 / ഭൂമി: 2.5 ഏക്കർ", 34, 85000.0, 2.5),
        ("bn", "বয়স: 34 / বার্ষিক আয়: 85,000 / জমি: 2.5 একর", 34, 85000.0, 2.5),
        ("mr", "वय: 34 / वार्षिक उत्पन्न: रु 85,000 / जमीन: 2.5 एकरी", 34, 85000.0, 2.5),
        ("gu", "ઉંમર: 34 / વાર્ષિક આવક: રૂ 85,000 / જમીન: 2.5 એકર", 34, 85000.0, 2.5),
    ]

    for lang, sample_text, expected_age, expected_income, expected_land in test_cases:
        extracted = document_service._parse_structured_fields(sample_text)
        assert extracted.get("age") == expected_age, f"Failed age extraction for language {lang}: {extracted}"
        assert extracted.get("income") == expected_income, f"Failed income extraction for language {lang}: {extracted}"
        assert extracted.get("landholding") == expected_land, f"Failed land extraction for language {lang}: {extracted}"


def test_dob_based_age_calculation_multilingual():
    # English DOB
    eng_res = document_service._parse_structured_fields("Date of Birth: 15/08/1990")
    assert eng_res.get("dob") == "15/08/1990"
    assert eng_res.get("age") is not None
    assert eng_res.get("age") > 0

    # Hindi DOB
    hin_res = document_service._parse_structured_fields("जन्म तिथि: 10/05/1995")
    assert hin_res.get("dob") == "10/05/1995"
    assert hin_res.get("age") is not None

    # Kannada DOB
    kan_res = document_service._parse_structured_fields("ಜನ್ಮ ದಿನಾಂಕ: 01/01/2000")
    assert kan_res.get("dob") == "01/01/2000"
    assert kan_res.get("age") is not None


def test_noise_and_currency_tolerance():
    text_with_noise = "CERTIFICATE DETAILS\nName: Ramesh Kumar\nವಯಸ್ಸು :   34 yrs\nTotal Family Income: INR 1,20,000/-\nExtent of Land: 3.75 acres"
    extracted = document_service._parse_structured_fields(_normalize_indic_digits(text_with_noise))
    assert extracted.get("age") == 34
    assert extracted.get("income") == 120000.0
    assert extracted.get("landholding") == 3.75


def test_no_third_party_vision_apis():
    # Verify zero imports or mentions of third-party OCR / Vision APIs in document_service.py
    import inspect
    source = inspect.getsource(document_service.__class__)
    forbidden = ["googleapis", "azure", "openai", "vision.googleapis", "aws.amazon", "sarvam_service.vision"]
    for token in forbidden:
        assert token not in source.lower(), f"Found forbidden third-party OCR reference: {token}"
