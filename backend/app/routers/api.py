from uuid import uuid4

# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session

from app.core.auth import get_current_user, get_user_role, require_document_access, require_role
from app.core.config import get_settings
from app.core.db import get_db
from app.models.db_models import AuditLog, AuthorizedSession, DocumentRecord, NotificationRecord, SavedScheme, User
from app.models.schemas import (
    ChatRequest,
    CheckEligibilityRequest,
    CitizenSessionRequest,
    ConsentRequest,
    FamilyAnalysisRequest,
    ForgotPasswordRequest,
    LoginRequest,
    ProfileUpdate,
    SaveSchemeRequest,
    SignUpRequest,
    VoiceChatRequest,
    WhatIfRequest,
)
from app.services.audit_service import audit_service
from app.services.auth_service import auth_service
from app.services.chat_service import chat_service
from app.services.data_loader import load_personas, load_rules, load_schemes
from app.services.document_service import document_service
from app.services.eligibility_engine import eligibility_engine
from app.services.journey_service import journey_service
from app.services.profile_service import profile_service
from app.services.recommendation_service import recommendation_service

router = APIRouter(prefix="/api", tags=["api"])
settings = get_settings()


def _profile_from_current(db: Session, user: User):
    profile = profile_service.get_or_create(db, user)
    from app.models.schemas import EligibilityProfile

    return EligibilityProfile(
        age=profile.age,
        gender=profile.gender,
        state=profile.state,
        occupation=profile.occupation,
        income=profile.income,
        landholding=profile.landholding,
        disability=profile.disability,
        family_members=profile.family_members or [],
        available_documents=profile.available_documents or [],
    )


@router.post("/auth/signup")
def signup(payload: SignUpRequest, request: Request, db: Session = Depends(get_db)):
    return auth_service.signup(db, payload, request)


@router.post("/auth/login")
def login(payload: LoginRequest, request: Request, db: Session = Depends(get_db)):
    return auth_service.login(db, payload, request)


@router.post("/auth/logout")
def logout(request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    auth_header = request.headers.get("authorization", "")
    token = auth_header.split(" ", 1)[1] if " " in auth_header else ""
    auth_service.logout(db, user, token, request)
    return {"status": "logged_out"}


@router.get("/auth/me")
def me(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "preferred_language": user.preferred_language,
        "role": get_user_role(db, user.id),
        "auth_adapter": settings.auth_adapter,
    }


@router.post("/auth/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, request: Request, db: Session = Depends(get_db)):
    audit_service.log(db, "forgot_password", f"Password reset requested for {payload.email}", None, "anonymous", "auth", request)
    return {"status": "reset_requested", "message": "If your account exists, password reset instructions will be sent through the configured secure channel."}


@router.post("/consent")
def consent(payload: ConsentRequest, request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    auth_service.grant_consent(db, user, payload, request)
    return {"status": "recorded"}


@router.post("/chat")
def chat(payload: ChatRequest, user: User = Depends(get_current_user)):
    return chat_service.answer(payload.message, payload.language, payload.profile)



@router.post("/voice-chat")
def voice_chat(payload: VoiceChatRequest, user: User = Depends(get_current_user)):
    return {
        "transcript": payload.transcript,
        "response": chat_service.answer(payload.transcript, payload.language),
        "mode": "browser_voice_fallback",
    }


@router.post("/documents/upload")
async def upload_document(request: Request, file: UploadFile = File(...), user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    content = await file.read()
    if len(content) > settings.max_upload_size:
        raise HTTPException(status_code=413, detail="File too large")
    document = document_service.process_upload(db, user, file, content)
    profile = profile_service.get_or_create(db, user)
    existing_documents = profile.available_documents or []
    if document.document_type not in existing_documents:
        profile.available_documents = [*existing_documents, document.document_type]
        db.add(profile)
        db.commit()
    audit_service.log(db, "document_uploaded", f"{document.document_type} uploaded", user.id, get_user_role(db, user.id), f"document:{document.id}", request)
    return {
        "status": "processed",
        "document": document.id,
        "document_type": document.document_type,
        "available_documents": profile.available_documents,
        "message": "Processed in memory and discarded. Only masked metadata is retained.",
    }


@router.get("/documents")
def list_documents(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    docs = db.query(DocumentRecord).filter(DocumentRecord.user_id == user.id).all()
    return [
        {
            "id": doc.id,
            "document_type": doc.document_type,
            "status": doc.status,
            "verification_state": doc.verification_state,
            "masked_fields": doc.masked_fields,
            "file_name": doc.file_name,
            "mime_type": doc.mime_type,
            "file_size": doc.file_size,
            "retained_in_storage": doc.retained_in_storage,
            "created_at": doc.created_at.isoformat(),
        }
        for doc in docs
    ]


@router.get("/documents/{document_id}")
def get_document(document_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    document = db.query(DocumentRecord).filter(DocumentRecord.id == document_id).first()
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    require_document_access(document.user_id, user, db)
    return {
        "id": document.id,
        "document_type": document.document_type,
        "status": document.status,
        "verification_state": document.verification_state,
        "masked_fields": document.masked_fields,
        "file_name": document.file_name,
        "mime_type": document.mime_type,
        "file_size": document.file_size,
        "retained_in_storage": document.retained_in_storage,
        "created_at": document.created_at.isoformat(),
    }


@router.delete("/documents/{document_id}")
def delete_document(document_id: str, request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    document = db.query(DocumentRecord).filter(DocumentRecord.id == document_id).first()
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    require_document_access(document.user_id, user, db)
    db.delete(document)
    db.commit()
    audit_service.log(db, "document_deleted", document_id, user.id, get_user_role(db, user.id), f"document:{document_id}", request)
    return {"status": "deleted"}


@router.post("/check-eligibility")
def check_eligibility(payload: CheckEligibilityRequest, user: User = Depends(get_current_user)):
    scheme = next((item for item in load_schemes() if item.id == payload.scheme_id), None)
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    rule = load_rules().get(payload.scheme_id)
    return eligibility_engine.evaluate(payload.scheme_id, payload.profile, rule, scheme.alternative_scheme_ids)


@router.get("/schemes")
def list_schemes(q: str | None = None, category: str | None = None, state: str | None = None):
    schemes = load_schemes()
    if q:
        schemes = [scheme for scheme in schemes if q.lower() in scheme.name.lower() or q.lower() in scheme.description.lower()]
    if category:
        schemes = [scheme for scheme in schemes if scheme.category.lower() == category.lower()]
    if state:
        schemes = [scheme for scheme in schemes if "All" in scheme.state_scope or state.lower() in [item.lower() for item in scheme.state_scope]]
    return schemes


@router.get("/schemes/{scheme_id}")
def scheme_details(scheme_id: str):
    scheme = next((item for item in load_schemes() if item.id == scheme_id), None)
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    conflicts = []
    if scheme.id == "pm-kisan":
        conflicts.append("Information Conflict Detected: benefit amount should be verified against the current official notification.")
    return {"scheme": scheme, "conflicts": conflicts}


@router.post("/schemes/save")
def save_scheme(payload: SaveSchemeRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if db.query(SavedScheme).filter(SavedScheme.user_id == user.id, SavedScheme.scheme_id == payload.scheme_id).first() is None:
        db.add(SavedScheme(user_id=user.id, scheme_id=payload.scheme_id))
        db.commit()
    return {"status": "saved"}


@router.get("/recommendations")
def recommendations(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return recommendation_service.recommendations(_profile_from_current(db, user))


@router.get("/welfare-gaps")
def welfare_gaps(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return recommendation_service.welfare_gaps(_profile_from_current(db, user))


@router.post("/family/analyze")
def family_analyze(payload: FamilyAnalysisRequest, user: User = Depends(get_current_user)):
    rules = load_rules()
    schemes = load_schemes()
    members = []
    for member in payload.members:
        from app.models.schemas import EligibilityProfile

        profile = EligibilityProfile(**member.model_dump())
        eligible_for = []
        for scheme in schemes:
            result = eligibility_engine.evaluate(scheme.id, profile, rules[scheme.id], scheme.alternative_scheme_ids)
            if result.status == "eligible":
                eligible_for.append({"scheme_id": scheme.id, "scheme_name": scheme.name, "score": result.score})
        members.append({"member": member.name, "relationship": member.relationship, "eligible_schemes": eligible_for})
    return {
        "members": members,
        "family_benefit_map": members,
        "overlaps": [],
        "possible_conflicts": [],
        "total_potential_benefits": sum(len(item["eligible_schemes"]) for item in members),
    }


@router.post("/what-if")
def what_if(payload: WhatIfRequest, user: User = Depends(get_current_user)):
    scheme = next((item for item in load_schemes() if item.id == payload.scheme_id), None)
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    rule = load_rules()[payload.scheme_id]
    before = eligibility_engine.evaluate(payload.scheme_id, payload.current_profile, rule, scheme.alternative_scheme_ids)
    updated = payload.current_profile.model_copy(update=payload.simulated_changes)
    after = eligibility_engine.evaluate(payload.scheme_id, updated, rule, scheme.alternative_scheme_ids)
    changed = list(set(after.failed + after.matched + after.missing) - set(before.failed + before.matched + before.missing))
    return {"before": before, "after": after, "changed_rules": changed}


@router.get("/journey")
def journey(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return journey_service.build_journey(_profile_from_current(db, user))


@router.get("/profile")
def get_profile(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return profile_service.to_response(db, user, profile_service.get_or_create(db, user))


@router.put("/profile")
def update_profile(payload: ProfileUpdate, request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    result = profile_service.update(db, user, payload)
    audit_service.log(db, "profile_updated", "Profile updated", user.id, get_user_role(db, user.id), "profile", request)
    return result


@router.delete("/profile")
def delete_profile(request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(DocumentRecord).filter(DocumentRecord.user_id == user.id).delete()
    db.query(NotificationRecord).filter(NotificationRecord.user_id == user.id).delete()
    db.query(AuditLog).filter(AuditLog.user_id == user.id).delete()
    profile_service.delete(db, user)
    audit_service.log(db, "data_deletion_requested", "User deleted personal data", user.id, get_user_role(db, user.id), "profile", request)
    return {"status": "deleted"}


@router.get("/sources/{scheme_id}")
def sources(scheme_id: str):
    scheme = next((item for item in load_schemes() if item.id == scheme_id), None)
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return {
        "scheme_id": scheme.id,
        "source_name": scheme.source_name,
        "source_reference": scheme.source_reference,
        "official_link": scheme.official_link,
        "last_verified": scheme.last_verified,
        "evidence_policy": "Answers are generated only from verified evidence chunks and cited source metadata.",
    }


@router.get("/personas")
def personas():
    return load_personas()


@router.get("/notifications")
def notifications(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return [
        {
            "id": item.id,
            "title": item.title,
            "message": item.message,
            "level": item.level,
            "read": item.read,
            "created_at": item.created_at.isoformat(),
        }
        for item in db.query(NotificationRecord).filter(NotificationRecord.user_id == user.id).order_by(NotificationRecord.created_at.desc()).all()
    ]


@router.get("/audit")
def audit(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    role = get_user_role(db, user.id)
    query = db.query(AuditLog)
    if role == "admin":
        logs = query.order_by(AuditLog.created_at.desc()).limit(100).all()
    elif role == "csc_operator":
        logs = query.filter(AuditLog.user_id == user.id).order_by(AuditLog.created_at.desc()).limit(50).all()
    else:
        logs = query.filter(AuditLog.user_id == user.id).order_by(AuditLog.created_at.desc()).limit(50).all()
    return [
        {
            "id": item.id,
            "event_type": item.event_type,
            "target_resource": item.target_resource,
            "detail": item.detail,
            "actor_role": item.actor_role,
            "created_at": item.created_at.isoformat(),
        }
        for item in logs
    ]


@router.post("/csc/citizen-session")
def start_citizen_session(payload: CitizenSessionRequest, request: Request, user: User = Depends(require_role("csc_operator")), db: Session = Depends(get_db)):
    citizen = db.query(User).filter(User.email == payload.citizen_email).first()
    if citizen is None:
        raise HTTPException(status_code=404, detail="Citizen not found")
    session = AuthorizedSession(citizen_user_id=citizen.id, operator_user_id=user.id, language=payload.language, active=True)
    db.add(session)
    db.commit()
    db.refresh(session)
    audit_service.log(db, "csc_session_started", citizen.email, user.id, "csc_operator", "csc_session", request)
    return {
        "session_id": session.id,
        "citizen_user_id": citizen.id,
        "operator_user_id": user.id,
        "language": session.language,
        "active": session.active,
    }


@router.post("/csc/citizen-session/{session_id}/end")
def end_citizen_session(session_id: str, request: Request, user: User = Depends(require_role("csc_operator")), db: Session = Depends(get_db)):
    session = db.query(AuthorizedSession).filter(AuthorizedSession.id == session_id, AuthorizedSession.operator_user_id == user.id).first()
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    session.active = False
    db.add(session)
    db.commit()
    audit_service.log(db, "csc_session_ended", session_id, user.id, "csc_operator", "csc_session", request)
    return {"status": "ended"}


@router.get("/admin/dashboard")
def admin_dashboard(user: User = Depends(require_role("admin")), db: Session = Depends(get_db)):
    schemes = load_schemes()
    return {
        "total_users": db.query(User).count(),
        "scheme_count": len(schemes),
        "scheme_verification_status": "seed_data_needs_official_verification",
        "system_health": "ok",
        "ai_service_status": "local_fallback_ready",
        "document_processing_status": "in_memory_processing",
        "security_events": db.query(AuditLog).count(),
        "policy_conflicts": 1,
        "most_requested_schemes": [scheme.name for scheme in schemes[:3]],
    }


@router.get("/admin/users")
def admin_users(user: User = Depends(require_role("admin")), db: Session = Depends(get_db)):
    return [
        {
            "id": item.id,
            "full_name": item.full_name,
            "email": item.email,
            "role": get_user_role(db, item.id),
            "preferred_language": item.preferred_language,
        }
        for item in db.query(User).all()
    ]


@router.get("/admin/schemes")
def admin_schemes(user: User = Depends(require_role("admin"))):
    return load_schemes()


@router.get("/admin/rules")
def admin_rules(user: User = Depends(require_role("admin"))):
    return load_rules()


@router.get("/admin/sources")
def admin_sources(user: User = Depends(require_role("admin"))):
    return [{"scheme_id": scheme.id, "source_name": scheme.source_name, "last_verified": scheme.last_verified} for scheme in load_schemes()]


@router.get("/admin/audit")
def admin_audit(user: User = Depends(require_role("admin")), db: Session = Depends(get_db)):
    return [
        {
            "id": item.id,
            "event_type": item.event_type,
            "detail": item.detail,
            "actor_role": item.actor_role,
            "created_at": item.created_at.isoformat(),
        }
        for item in db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(100).all()
    ]
