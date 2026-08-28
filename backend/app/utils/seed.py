from pathlib import Path

from sqlalchemy import inspect, text

from app.core.db import Base, engine
from app.models import db_models  # noqa: F401
from app.core.db import SessionLocal
from app.services.auth_service import auth_service


def init_db() -> None:
    Path("data/faiss_index").mkdir(parents=True, exist_ok=True)
    Base.metadata.create_all(bind=engine)
    profile_columns = {column["name"] for column in inspect(engine).get_columns("profiles")}
    if "onboarding_completed" not in profile_columns:
        with engine.begin() as connection:
            connection.execute(text("ALTER TABLE profiles ADD COLUMN onboarding_completed BOOLEAN DEFAULT 0 NOT NULL"))
    db = SessionLocal()
    try:
        auth_service.ensure_seed_roles_and_users(db)
    finally:
        db.close()
