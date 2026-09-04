# pyrefly: ignore [missing-import]
import pytest
from app.models.schemas import EligibilityProfile
from app.services.chat_service import chat_service
from app.services.search_service import search_service


def test_1_farmer_scheme_discovery():
    res = chat_service.answer("What schemes are available for farmers?", "en")
    assert res.confidence in {"high", "medium"}
    assert any(s.id == "pm-kisan" for s in res.schemes)
    assert any("farmer" in e["evidence"].lower() or "agriculture" in e["evidence"].lower() for e in res.evidence)


def test_2_student_scheme_discovery():
    res = chat_service.answer("What schemes are available for students?", "en")
    assert res.confidence in {"high", "medium"}
    assert any(s.category == "Education" for s in res.schemes)
    assert any("scholarship" in e["evidence"].lower() or "student" in e["evidence"].lower() for e in res.evidence)


def test_3_pm_kisan_documents():
    res = chat_service.answer("What documents are needed for PM-Kisan?", "en")
    assert res.schemes[0].id == "pm-kisan"
    assert "land record" in res.answer.lower() or "land record" in str(res.evidence).lower()
    # Ensure scheme isolation: NSP should not be top scheme
    assert res.schemes[0].id != "national-scholarship-portal"


def test_4_pm_vishwakarma_benefits():
    res = chat_service.answer("What are the benefits of PM Vishwakarma?", "en")
    assert res.schemes[0].id == "pm-vishwakarma"
    assert "artisan" in res.answer.lower() or "skill" in res.answer.lower() or "benefit" in res.answer.lower()


def test_5_worker_schemes():
    res = chat_service.answer("Which schemes are available for workers?", "en")
    assert any(s.id in {"e-shram", "pm-sym"} for s in res.schemes)


def test_6_women_schemes():
    res = chat_service.answer("What schemes are available for women?", "en")
    assert any(s.category in {"Women and Child"} for s in res.schemes)


def test_7_karnataka_student():
    res = chat_service.answer("I am a student in Karnataka. What benefits can I look for?", "en")
    assert any(s.id == "vidyasiri-karnataka" for s in res.schemes) or any(s.id == "national-scholarship-portal" for s in res.schemes)


def test_8_karnataka_farmer():
    res = chat_service.answer("Can a farmer in Karnataka get PM-Kisan?", "en")
    assert any(s.id == "pm-kisan" for s in res.schemes)


def test_9_pm_kisan_application():
    res = chat_service.answer("How do I apply for PM-Kisan?", "en")
    assert res.schemes[0].id == "pm-kisan"
    assert "portal" in res.answer.lower() or "apply" in res.answer.lower() or "step" in res.answer.lower()


def test_10_pm_kisan_website():
    res = chat_service.answer("What is the official website for PM-Kisan?", "en")
    assert "pmkisan.gov.in" in res.answer or any("pmkisan.gov.in" in str(s.official_link) for s in res.schemes)


def test_11_no_hallucination_exact_income():
    res = chat_service.answer("What is the exact income limit for National Scholarship Portal?", "en")
    # Must NOT fabricate an arbitrary exact number in answer
    assert "does not specify" in res.answer.lower() or "verify" in res.answer.lower() or res.confidence != "high"


def test_12_out_of_database_scheme():
    res = chat_service.answer("Tell me something about scheme x fake crypto scheme that is not in database.", "en")
    assert res.verification_status == "insufficient_evidence"
    assert res.confidence == "low"
    assert len(res.schemes) == 0


def test_scheme_isolation():
    # PM-Kisan query should isolate PM-Kisan and not return NSP or Sukanya Samriddhi as top scheme
    res = chat_service.answer("What are the features of PM-Kisan scheme?", "en")
    assert len(res.schemes) > 0
    assert res.schemes[0].id == "pm-kisan"
    assert not any(s.id == "national-scholarship-portal" for s in res.schemes)


def test_multilingual_hindi():
    res = chat_service.answer("किसानों के लिए कौन सी योजनाएं हैं?", "hi")
    assert res.confidence in {"high", "medium"}
    assert any(s.id == "pm-kisan" for s in res.schemes)
    assert "योजना" in res.answer or "पीएम-किसान" in res.answer or "किसानों" in res.answer


def test_multilingual_kannada():
    res = chat_service.answer("ರೈತರಿಗೆ ಯಾವ ಯೋಜನೆಗಳು ಲಭ್ಯವಿವೆ?", "kn")
    assert res.confidence in {"high", "medium"}
    assert any(s.id in {"pm-kisan", "krishi-bhagya-karnataka"} for s in res.schemes)
    assert "ಯೋಜನೆ" in res.answer or "ರೈತರಿಗೆ" in res.answer


def test_eligibility_engine_integration():
    profile = EligibilityProfile(
        age=45,
        gender="male",
        state="Karnataka",
        occupation="farmer",
        income=150000,
        landholding=1.5,
        disability=False,
        available_documents=["land record"],
    )
    res = chat_service.answer("Am I eligible for PM-Kisan?", "en", profile=profile)
    assert res.schemes[0].id == "pm-kisan"
    assert "ELIGIBLE" in res.answer or "satisfied" in res.answer.lower()
