"""
OTP Record - SQLAlchemy model for email OTP storage.
Stored in the existing SQLite DB. Added to db_models.py via import at startup.
"""
from datetime import datetime
from uuid import uuid4

from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base


def _uuid() -> str:
    return str(uuid4())


class OTPRecord(Base):
    """
    Stores one active OTP challenge per email.
    - hashed_otp   : SHA-256 hex of the raw 6-digit code (never stored plaintext)
    - expires_at   : UTC timestamp; reject after this
    - attempts     : incremented on every failed verify; locked at MAX_ATTEMPTS
    - send_count   : total sends this hour (enforces hourly rate-limit per email)
    - window_start : start of the current hourly send window
    """

    __tablename__ = "otp_records"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_otp: Mapped[str] = mapped_column(String(64), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    attempts: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    send_count: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    window_start: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
