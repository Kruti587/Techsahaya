"""
Master Multi-User Email OTP Pipeline Verification Test Suite.
Verifies all 6 critical points from the Master Security Prompt:
1. Multi-user concurrency and isolation (no collision across emails).
2. Non-existent domain rejection via DNS MX lookup (400 Bad Request).
3. Disposable/temporary email rejection via denylist (400 Bad Request).
4. Server-enforced 60-second rate-limit cooldown (429 Too Many Requests).
5. Maximum 5 failed attempts lockout (403 Forbidden).
6. Zero OTP leakage in network response payload.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from main import app
from app.core.db import SessionLocal
from app.models.db_models import OTPRecord
from app.services.otp_service import hash_otp_code


client = TestClient(app)


@pytest.fixture(autouse=True)
def clean_test_otps():
    """Clean up any test OTP records before and after each test."""
    db: Session = SessionLocal()
    test_emails = [
        "user_alice@gmail.com",
        "user_bob@gmail.com",
        "charlie_test@gmail.com",
        "lockout_test@gmail.com",
        "zero_leak_test@gmail.com",
    ]
    db.query(OTPRecord).filter(OTPRecord.email.in_(test_emails)).delete(synchronize_session=False)
    db.commit()
    db.close()
    yield
    db = SessionLocal()
    db.query(OTPRecord).filter(OTPRecord.email.in_(test_emails)).delete(synchronize_session=False)
    db.commit()
    db.close()


def test_1_multi_user_isolation():
    """
    Checklist 1: Multi-user concurrent isolation.
    Request OTPs for two distinct users (user_alice@gmail.com and user_bob@gmail.com).
    Verify distinct hashed OTP records exist and neither user can use the other's code.
    """
    db: Session = SessionLocal()
    try:
        # Request for Alice
        resp_alice = client.post("/api/auth/send-otp", json={"email": "user_alice@gmail.com"})
        assert resp_alice.status_code == 200, resp_alice.text
        assert resp_alice.json()["status"] == "sent"

        # Request for Bob
        resp_bob = client.post("/api/auth/send-otp", json={"email": "user_bob@gmail.com"})
        assert resp_bob.status_code == 200, resp_bob.text
        assert resp_bob.json()["status"] == "sent"

        # Query database directly for both records
        rec_alice = db.query(OTPRecord).filter(OTPRecord.email == "user_alice@gmail.com").first()
        rec_bob = db.query(OTPRecord).filter(OTPRecord.email == "user_bob@gmail.com").first()

        assert rec_alice is not None
        assert rec_bob is not None
        assert rec_alice.email == "user_alice@gmail.com"
        assert rec_bob.email == "user_bob@gmail.com"
        assert rec_alice.id != rec_bob.id
        # Hashed OTPs must be non-empty and mathematically isolated
        assert rec_alice.hashed_otp != rec_bob.hashed_otp

        # Manually plant known OTP hashes to verify cross-user isolation
        known_alice_otp = "111111"
        known_bob_otp = "222222"
        rec_alice.hashed_otp = hash_otp_code(known_alice_otp)
        rec_bob.hashed_otp = hash_otp_code(known_bob_otp)
        db.commit()

        # Alice's OTP must NOT verify Bob's account
        cross_verify = client.post("/api/auth/verify-otp", json={"email": "user_bob@gmail.com", "otp": known_alice_otp})
        assert cross_verify.status_code == 400
        assert "Invalid verification code" in cross_verify.json()["detail"]

        # Bob's OTP must verify Bob's account
        valid_verify = client.post("/api/auth/verify-otp", json={"email": "user_bob@gmail.com", "otp": known_bob_otp})
        assert valid_verify.status_code == 200
        assert valid_verify.json()["verified"] is True
    finally:
        db.close()


def test_2_nonexistent_domain_rejection():
    """
    Checklist 2: Non-existent domain rejected via DNS MX lookup.
    """
    db: Session = SessionLocal()
    try:
        bogus_email = "user@thisdomaindoesnotexist99881234.com"
        resp = client.post("/api/auth/send-otp", json={"email": bogus_email})
        assert resp.status_code == 400
        detail = resp.json()["detail"]
        assert "domain" in detail.lower() or "cannot receive email" in detail.lower()

        # Verify no OTP record was generated in database
        rec = db.query(OTPRecord).filter(OTPRecord.email == bogus_email).first()
        assert rec is None
    finally:
        db.close()


def test_3_disposable_domain_rejection():
    """
    Checklist 3: Disposable/temporary email domain blocked via denylist.
    """
    db: Session = SessionLocal()
    try:
        disposable_emails = ["tempuser@mailinator.com", "fake@10minutemail.com", "bot@guerrillamail.com"]
        for email in disposable_emails:
            resp = client.post("/api/auth/send-otp", json={"email": email})
            assert resp.status_code == 400, f"Expected 400 for disposable email {email}"
            detail = resp.json()["detail"]
            assert "disposable" in detail.lower() or "temporary" in detail.lower()

            # Verify no record created
            rec = db.query(OTPRecord).filter(OTPRecord.email == email).first()
            assert rec is None
    finally:
        db.close()


def test_4_cooldown_rate_limiting():
    """
    Checklist 4: 60-second cooldown rate-limiting.
    Second OTP request within 60 seconds must be rejected with 429 Too Many Requests.
    """
    email = "charlie_test@gmail.com"

    # First send succeeds
    first_resp = client.post("/api/auth/send-otp", json={"email": email})
    assert first_resp.status_code == 200
    assert first_resp.json()["status"] == "sent"

    # Immediate second send must be blocked by cooldown (429)
    second_resp = client.post("/api/auth/send-otp", json={"email": email})
    assert second_resp.status_code == 429
    detail = second_resp.json()["detail"]
    assert "cooldown" in detail.lower() or "wait" in detail.lower()


def test_5_max_attempts_lockout():
    """
    Checklist 5: Max 5 failed attempts lockout.
    Consecutive wrong codes decrement remaining attempts, and 5th wrong code locks the user out with 403.
    """
    db: Session = SessionLocal()
    email = "lockout_test@gmail.com"
    try:
        # Request OTP
        send_resp = client.post("/api/auth/send-otp", json={"email": email})
        assert send_resp.status_code == 200

        # Set known OTP in DB
        rec = db.query(OTPRecord).filter(OTPRecord.email == email).first()
        assert rec is not None
        rec.hashed_otp = hash_otp_code("654321")
        db.commit()

        # Attempt 1 wrong
        r1 = client.post("/api/auth/verify-otp", json={"email": email, "otp": "000000"})
        assert r1.status_code == 400
        assert "4 attempts remaining" in r1.json()["detail"]

        # Attempt 2 wrong
        r2 = client.post("/api/auth/verify-otp", json={"email": email, "otp": "000001"})
        assert r2.status_code == 400
        assert "3 attempts remaining" in r2.json()["detail"]

        # Attempt 3 wrong
        r3 = client.post("/api/auth/verify-otp", json={"email": email, "otp": "000002"})
        assert r3.status_code == 400
        assert "2 attempts remaining" in r3.json()["detail"]

        # Attempt 4 wrong
        r4 = client.post("/api/auth/verify-otp", json={"email": email, "otp": "000003"})
        assert r4.status_code == 400
        assert "1 attempt remaining" in r4.json()["detail"]

        # Attempt 5 wrong -> LOCKOUT (403)
        r5 = client.post("/api/auth/verify-otp", json={"email": email, "otp": "000004"})
        assert r5.status_code == 403
        assert "locked" in r5.json()["detail"].lower()

        # Attempt 6 (even with correct code) must still be rejected due to lockout
        r6 = client.post("/api/auth/verify-otp", json={"email": email, "otp": "654321"})
        assert r6.status_code == 403
        assert "locked" in r6.json()["detail"].lower()
    finally:
        db.close()


def test_6_zero_otp_leakage_in_response():
    """
    Checklist 6: Zero code leakage in HTTP response payload.
    The response must NOT contain 'otp', 'otp_code', or any 6-digit plain text code.
    """
    email = "zero_leak_test@gmail.com"
    resp = client.post("/api/auth/send-otp", json={"email": email})
    assert resp.status_code == 200

    data = resp.json()

    # Explicit fields check
    assert "otp_code" not in data
    assert "otp" not in data
    assert "code" not in data
    assert data["status"] == "sent"
    assert data["cooldown_seconds"] == 60
    assert data["expires_in"] == 600

    # Payload raw text check
    raw_text = resp.text
    assert "otp_code" not in raw_text
    import re
    # Ensure no 6-digit number other than status or known ints appears
    # data values are: "cooldown_seconds": 60, "expires_in": 600
    six_digit_matches = re.findall(r'"\d{6}"', raw_text)
    assert len(six_digit_matches) == 0, f"Found leaked 6-digit code in response: {six_digit_matches}"
