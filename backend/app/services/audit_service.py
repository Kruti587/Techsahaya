from fastapi import Request
from sqlalchemy.orm import Session

from app.models.db_models import AuditLog


class AuditService:
    def log(self, db: Session, event_type: str, detail: str = "", user_id: str | None = None, actor_role: str = "anonymous", target_resource: str = "", request: Request | None = None) -> None:
        db.add(
            AuditLog(
                user_id=user_id,
                actor_role=actor_role,
                event_type=event_type,
                target_resource=target_resource,
                detail=detail[:255],
                request_id=getattr(request.state, "request_id", None) if request else None,
            )
        )
        db.commit()


audit_service = AuditService()
