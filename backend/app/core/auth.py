from datetime import datetime
from typing import Callable

import httpx
from fastapi import Depends, Header, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.db import get_db
from app.core.security import hash_token
from app.models.db_models import AuthorizedSession, SessionRecord, User, UserRole


def _extract_bearer_token(authorization: str | None) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
    return authorization.split(" ", 1)[1]


def get_current_user(
    request: Request,
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> User:
    token = _extract_bearer_token(authorization)
    session = db.query(SessionRecord).filter(SessionRecord.token_hash == hash_token(token)).first()
    if session is None or session.revoked_at is not None or session.expires_at <= datetime.utcnow():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired")
    user = db.query(User).filter(User.id == session.user_id, User.is_active.is_(True)).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session")
    _validate_supabase_session_if_needed(user, token)
    request.state.current_user = user
    request.state.current_role = get_user_role(db, user.id)
    request.state.session_id = session.id
    return user


def get_optional_user(
    request: Request,
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> User | None:
    if not authorization or not authorization.startswith("Bearer "):
        return None
    try:
        token = authorization.split(" ", 1)[1]
        session = db.query(SessionRecord).filter(SessionRecord.token_hash == hash_token(token)).first()
        if session is None or session.revoked_at is not None or session.expires_at <= datetime.utcnow():
            return None
        user = db.query(User).filter(User.id == session.user_id, User.is_active.is_(True)).first()
        if user is None:
            return None
        _validate_supabase_session_if_needed(user, token)
        request.state.current_user = user
        request.state.current_role = get_user_role(db, user.id)
        request.state.session_id = session.id
        return user
    except Exception:
        return None



def _validate_supabase_session_if_needed(user: User, token: str) -> None:
    settings = get_settings()
    if settings.auth_adapter != "supabase" or user.auth_provider != "supabase":
        return
    if not settings.supabase_url or not settings.supabase_anon_key:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Supabase Auth is not configured")
    try:
        response = httpx.get(
            f"{settings.supabase_url.rstrip('/')}/auth/v1/user",
            headers={"apikey": settings.supabase_anon_key, "Authorization": f"Bearer {token}"},
            timeout=5,
        )
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Supabase Auth is unavailable") from exc
    if response.status_code >= 400:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired")


def get_user_role(db: Session, user_id: str) -> str:
    role = db.query(UserRole).filter(UserRole.user_id == user_id).first()
    return role.role_name if role else "citizen"


def require_role(*roles: str) -> Callable:
    def dependency(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> User:
        role = get_user_role(db, user.id)
        if role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access restricted")
        return user

    return dependency


def require_document_access(target_user_id: str, current_user: User, db: Session) -> None:
    role = get_user_role(db, current_user.id)
    if role == "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Restricted document access")
    if role == "citizen" and current_user.id != target_user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access restricted")
    if role == "csc_operator":
        session = (
            db.query(AuthorizedSession)
            .filter(
                AuthorizedSession.operator_user_id == current_user.id,
                AuthorizedSession.citizen_user_id == target_user_id,
                AuthorizedSession.active.is_(True),
            )
            .first()
        )
        if session is None:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Citizen authorization required")
