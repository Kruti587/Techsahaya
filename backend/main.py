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
from app.utils.seed import init_db

logger = logging.getLogger("techsahaya.main")
settings = get_settings()
app = FastAPI(title="Tech Sahaya API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RateLimitMiddleware)



@app.on_event("startup")
def startup_event():
    init_db()
    
    # Validate scheme dataset
    from app.services.data_loader import validate_dataset_on_startup
    if not validate_dataset_on_startup():
        logger.error("CRITICAL: Scheme dataset validation failed. Scheme-related features may not work correctly.")
    
    if not settings.sarvam_api_key:
        logger.warning("SARVAM_API_KEY is not set — voice STT/TTS features will fail at runtime.")
    if not ensure_ffmpeg_on_path():
        logger.warning("ffmpeg/ffprobe is not found on PATH — audio transcoding (WebM -> WAV) requires ffmpeg.")


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
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred.", "request_id": getattr(request.state, "request_id", None)},
    )


@app.get("/health")
def health():
    return {"status": "ok", "service": "tech-sahaya-backend"}


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
