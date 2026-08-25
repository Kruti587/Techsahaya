from pathlib import Path

from app.core.db import Base, engine
from app.models import db_models  # noqa: F401
from app.core.db import SessionLocal
from app.services.auth_service import auth_service


def init_db() -> None:
    Path("data/faiss_index").mkdir(parents=True, exist_ok=True)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        auth_service.ensure_seed_roles_and_users(db)
    finally:
        db.close()
