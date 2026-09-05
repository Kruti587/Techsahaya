import asyncio
import logging
from fastapi import Request
from sqlalchemy.orm import Session

from app.models.db_models import AuditLog
from app.services.discord_service import discord_service

logger = logging.getLogger("techsahaya.audit_service")

# Map of admin event types to Discord embed title and severity
ADMIN_NOTIFICATION_EVENTS: dict[str, tuple[str, str]] = {
    "signup": ("👤 NEW CITIZEN REGISTRATION", "info"),
    "failed_login": ("⚠️ FAILED AUTHENTICATION ATTEMPT", "warning"),
    "consent_withdrawn": ("🛡️ CONSENT WITHDRAWN (DPDP)", "warning"),
    "rate_limit_exceeded": ("🚫 RATE LIMIT EXCEEDED", "warning"),
    "suspicious_document": ("🚨 SUSPICIOUS DOCUMENT REJECTED", "warning"),
    "document_uploaded": ("📄 DOCUMENT PROCESSED (IN-MEMORY)", "info"),
    "document_deleted": ("🗑️ CITIZEN DOCUMENT PURGED", "info"),
    "data_deletion_requested": ("🗑️ CITIZEN DATA DELETED (DPDP)", "warning"),
    "csc_session_started": ("🏢 CSC OPERATOR SESSION STARTED", "info"),
}


class AuditService:
    def log(
        self,
        db: Session,
        event_type: str,
        detail: str = "",
        user_id: str | None = None,
        actor_role: str = "anonymous",
        target_resource: str = "",
        request: Request | None = None,
    ) -> None:
        request_id = getattr(request.state, "request_id", None) if request else None
        db.add(
            AuditLog(
                user_id=user_id,
                actor_role=actor_role,
                event_type=event_type,
                target_resource=target_resource,
                detail=detail[:255],
                request_id=request_id,
            )
        )
        db.commit()

        # Route through Discord notification service if event is an important admin event
        if event_type in ADMIN_NOTIFICATION_EVENTS:
            title, severity = ADMIN_NOTIFICATION_EVENTS[event_type]
            safe_metadata: dict[str, str] = {
                "actor_role": actor_role,
                "target": target_resource or "N/A",
            }
            if request_id:
                safe_metadata["request_id"] = str(request_id)[:16]
            if user_id:
                safe_metadata["user_id"] = str(user_id)[:8] + "..."

            try:
                loop = asyncio.get_running_loop()
                loop.create_task(
                    discord_service.send_admin_notification(
                        title=title,
                        message=detail[:200] if detail else f"Admin Event: {event_type}",
                        event_type=severity,
                        metadata=safe_metadata,
                    )
                )
            except RuntimeError:
                pass
            except Exception as e:
                logger.debug("Failed to dispatch Discord notification from audit service: %s", e)


audit_service = AuditService()

