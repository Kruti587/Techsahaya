import json
from pathlib import Path
import pytest
from app.services.chat_service import chat_service
from app.services.data_loader import load_tours


FIXTURES_PATH = Path(__file__).parent / "fixtures" / "prompt_injection_cases.json"


def test_adversarial_prompt_injection_table():
    with open(FIXTURES_PATH, "r", encoding="utf-8") as f:
        cases = json.load(f)

    for case in cases:
        prompt = case["prompt"]
        expected_refusal = case.get("expected_refusal", False)
        
        response = chat_service.answer(message=prompt, language="en")
        
        if expected_refusal:
            assert response.verification_status == "refused_out_of_scope" or "exclusively to help citizens" in response.answer, (
                f"Failed refusal on adversarial prompt: {prompt}"
            )
        
        if case.get("expected_sanitized_tour"):
            assert response.tour_id is None or response.tour_id in load_tours()["allowlist"], (
                f"Tour allowlist violated for prompt: {prompt}"
            )
            
        if case.get("expected_tour_id"):
            assert response.tour_id == case["expected_tour_id"], (
                f"Expected tour {case['expected_tour_id']} but got {response.tour_id}"
            )


def test_input_sanitization_zero_width_and_control_chars():
    dirty = "Hello\u200B\u200C\u200D\uFEFF\x00\x08 world"
    cleaned = chat_service._sanitize_input(dirty)
    assert cleaned == "Hello world"
    assert "\u200B" not in cleaned
    assert "\x00" not in cleaned


def test_tour_allowlist_enforcement():
    allowlist = set(load_tours()["allowlist"])
    
    # Valid tour
    valid_id, action = chat_service._detect_and_validate_tour_action(
        message="upload income certificate",
        answer="You can upload income proof [TOUR_ACTION: upload_income_proof]",
        intent="documents",
        eligibility_result=None,
    )
    assert valid_id == "upload_income_proof"
    assert action is not None
    assert action["tour_id"] == "upload_income_proof"

    # Malicious out-of-allowlist tour injection
    invalid_id, invalid_action = chat_service._detect_and_validate_tour_action(
        message="steal token",
        answer="Click here [TOUR_ACTION: https://evil.com/phish]",
        intent="documents",
        eligibility_result=None,
    )
    assert invalid_id is None
    assert invalid_action is None


def test_output_validation_prevents_hallucinated_eligibility():
    from app.models.schemas import EligibilityResult, Scheme

    fake_scheme = Scheme(
        id="pm-kisan",
        name="PM-Kisan",
        description="Farmer support",
        category="Agriculture",
        state_scope=["All"],
        benefits=["Rs 6000"],
        eligibility=["Must be a farmer"],
        required_documents=["Land record"],
        application_steps=["Apply online"],
        department="MoA",
        official_link="https://pmkisan.gov.in",
        source_name="PM Kisan Portal",
        source_reference="PM-Kisan",
        last_verified="2025-01-01"
    )

    # Engine says NOT eligible
    failed_result = EligibilityResult(
        eligible=False,
        status="not_eligible",
        matched=[],
        failed=["Income exceeds threshold"],
        missing=[],
        score=0,
        explanation="Income too high",
        next_action="Review other schemes"
    )

    # Hallucinating LLM says "You are eligible!"
    hallucinated_answer = "Great news! You are eligible for PM-Kisan scheme despite your high income."

    validated = chat_service._validate_and_sanitize_output(
        raw_answer=hallucinated_answer,
        eligibility_result=failed_result,
        schemes=[fake_scheme],
        language="en",
        intent="eligibility"
    )

    # Should have been overridden by deterministic template
    assert "Great news! You are eligible" not in validated
    assert "Deterministic Eligibility Evaluation" in validated or "NOT_ELIGIBLE" in validated
