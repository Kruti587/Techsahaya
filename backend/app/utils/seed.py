from pathlib import Path

from sqlalchemy import inspect, text

from app.core.db import Base, engine
from app.models import db_models  # noqa: F401
from app.core.db import SessionLocal
from app.services.auth_service import auth_service


def init_db() -> None:
    Path("data/faiss_index").mkdir(parents=True, exist_ok=True)
    Base.metadata.create_all(bind=engine)
    
    inspector = inspect(engine)
    if inspector.has_table("profiles"):
        profile_columns = {column["name"] for column in inspector.get_columns("profiles")}
        if "onboarding_completed" not in profile_columns:
            with engine.begin() as connection:
                connection.execute(text("ALTER TABLE profiles ADD COLUMN onboarding_completed BOOLEAN DEFAULT 0 NOT NULL"))
    
    if inspector.has_table("otp_records"):
        otp_columns = {column["name"] for column in inspector.get_columns("otp_records")}
        with engine.begin() as connection:
            if "last_sent_at" not in otp_columns:
                connection.execute(text("ALTER TABLE otp_records ADD COLUMN last_sent_at DATETIME"))
            if "cooldown_until" not in otp_columns:
                connection.execute(text("ALTER TABLE otp_records ADD COLUMN cooldown_until DATETIME"))

    db = SessionLocal()
    try:
        auth_service.ensure_seed_roles_and_users(db)
    finally:
        db.close()
