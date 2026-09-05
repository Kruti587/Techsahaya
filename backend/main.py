import logging
import shutil
from uuid import uuid4

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response

from app.core.config import get_settings
from app.core.rate_limit import RateLimitMiddleware
from app.routers.api import router as api_router
from app.services.sarvam_service import ensure_ffmpeg_on_path
from app.services.discord_service import discord_service
from app.utils.seed import init_db

logger = logging.getLogger("techsahaya.main")
settings = get_settings()
app = FastAPI(title="Tech Sahaya API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins if isinstance(settings.cors_origins, list) else [s.strip() for s in settings.cors_origins.split(",") if s.strip()],
    allow_origin_regex=r"https://.*\.vercel\.app|https://.*\.onrender\.com|https://.*\.railway\.app|http://localhost:\d+|http://127\.0\.0\.1:\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RateLimitMiddleware)



@app.on_event("startup")
def startup_event():
    discord_service.start()
    init_db()
    
    # Validate scheme dataset
    from app.services.data_loader import validate_dataset_on_startup
    if not validate_dataset_on_startup():
        logger.error("CRITICAL: Scheme dataset validation failed. Scheme-related features may not work correctly.")
    
    if not settings.sarvam_api_key:
        logger.warning("SARVAM_API_KEY is not set - voice STT/TTS features will fail at runtime.")
    if not ensure_ffmpeg_on_path():
        logger.warning("ffmpeg/ffprobe is not found on PATH - audio transcoding (WebM -> WAV) requires ffmpeg.")

@app.on_event("shutdown")
async def shutdown_event():
    await discord_service.close()


@app.middleware("http")
async def add_request_context(request: Request, call_next):
    request.state.request_id = str(uuid4())
    response = await call_next(request)
    response.headers["X-Request-ID"] = request.state.request_id
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    import traceback
    error_summary = str(exc)
    logger.exception("Critical backend error: %s", error_summary)
    
    # Notify Discord asynchronously
    import asyncio
    asyncio.create_task(
        discord_service.send_admin_notification(
            title="🚨 CRITICAL BACKEND ERROR",
            message=f"**Endpoint:** {request.url.path}\n**Error:** {error_summary}",
            event_type="error",
            metadata={"request_id": getattr(request.state, "request_id", "Unknown")}
        )
    )
    
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred.", "request_id": getattr(request.state, "request_id", None)},
    )


@app.get("/health")
def health():
    return {"status": "ok", "service": "tech-sahaya-backend"}


@app.get("/test-error")
def test_error():
    raise ValueError("This is a simulated critical backend crash for Discord testing!")


@app.get("/")
def root():
    return {
        "status": "ok",
        "service": "Tech Sahaya API",
        "message": "Backend is running. Open /docs for Swagger API documentation.",
        "docs": "/docs",
        "health": "/health",
        "public_endpoints": ["/api/schemes", "/api/personas", "/api/sources/{scheme_id}"],
    }


@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return Response(status_code=204)


app.include_router(api_router)

# Direct aliases for /auth endpoints (in addition to /api/auth)
@app.post("/auth/send-otp")
def root_send_otp(payload: dict, request: Request):
    from app.core.db import get_db
    from app.models.schemas import SendOtpRequest
    from app.routers.api import send_otp
    db = next(get_db())
    try:
        return send_otp(SendOtpRequest(**payload), request, db)
    finally:
        db.close()


@app.post("/auth/verify-otp")
def root_verify_otp(payload: dict, request: Request):
    from app.core.db import get_db
    from app.models.schemas import VerifyOtpRequest
    from app.routers.api import verify_otp
    db = next(get_db())
    try:
        return verify_otp(VerifyOtpRequest(**payload), request, db)
    finally:
        db.close()


@app.post("/newsletter/subscribe")
def root_subscribe_newsletter(payload: dict, request: Request):
    from app.core.db import get_db
    from app.models.schemas import NewsletterSubscribeRequest
    from app.routers.api import subscribe_newsletter
    db = next(get_db())
    try:
        return subscribe_newsletter(NewsletterSubscribeRequest(**payload), request, db)
    finally:
        db.close()


@app.post("/schemes/apply")
def root_apply_scheme(payload: dict, request: Request):
    from app.core.db import get_db
    from app.models.schemas import SchemeApplyRequest
    from app.routers.api import apply_scheme
    db = next(get_db())
    try:
        return apply_scheme(SchemeApplyRequest(**payload), request, db)
    finally:
        db.close()

