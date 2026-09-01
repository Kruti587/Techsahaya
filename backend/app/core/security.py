import hashlib
import hmac
import os
import secrets
from datetime import datetime, timedelta


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000)
    return f"{salt}${digest.hex()}"


def verify_password(password: str, password_hash: str) -> bool:
    try:
        salt, digest = password_hash.split("$", 1)
    except ValueError:
        return False
    candidate = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000).hex()
    return hmac.compare_digest(candidate, digest)


def generate_token() -> str:
    return secrets.token_urlsafe(32)


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def future_timestamp(hours: int) -> datetime:
    return datetime.utcnow() + timedelta(hours=hours)


def password_strength(password: str) -> str:
    checks = [
        len(password) >= 8,
        any(char.islower() for char in password),
        any(char.isupper() for char in password),
        any(char.isdigit() for char in password),
        any(not char.isalnum() for char in password),
    ]
    score = sum(checks)
    if score <= 2:
        return "weak"
    if score <= 4:
        return "medium"
    return "strong"
