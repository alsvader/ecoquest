"""EcoQuest inference API. Contrato: ver ../../PLAN.md."""
from __future__ import annotations

import io
import logging
import os
import threading
import time
from collections import defaultdict, deque
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, Form, Request, UploadFile
from starlette.concurrency import run_in_threadpool
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image, UnidentifiedImageError
from starlette import formparsers
from starlette.exceptions import HTTPException as StarletteHTTPException

from .classifier import (MISSIONS, MODEL_LICENSE, MODEL_NAME, Classifier,
                         SiglipClassifier, decide_status, load_thresholds)

MAX_BYTES = 5 * 1024 * 1024
MAX_PIXELS = 50_000_000
# Evita que Starlette vuelque archivos grandes a disco (SpooledTemporaryFile).
formparsers.MultiPartParser.spool_max_size = MAX_BYTES + 1024 * 1024
Image.MAX_IMAGE_PIXELS = MAX_PIXELS

log = logging.getLogger("ecoquest")


class ApiError(Exception):
    def __init__(self, status: int, message: str):
        self.status, self.message = status, message


def _sniff(data: bytes) -> str | None:
    if data[:3] == b"\xff\xd8\xff":
        return "jpeg"
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return "png"
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "webp"
    return None


class RateLimiter:
    def __init__(self, limit: int, window: float = 60.0):
        self.limit, self.window = limit, window
        self.hits: dict[str, deque] = defaultdict(deque)
        self.lock = threading.Lock()

    def allow(self, key: str) -> bool:
        now = time.monotonic()
        with self.lock:
            q = self.hits[key]
            while q and now - q[0] > self.window:
                q.popleft()
            if len(q) >= self.limit:
                return False
            q.append(now)
            if len(self.hits) > 10_000:  # evita crecimiento sin limite
                for k in [k for k, v in self.hits.items() if not v or now - v[-1] > self.window]:
                    del self.hits[k]
            return True


def create_app(classifier: Classifier | None = None) -> FastAPI:
    thresholds = load_thresholds()
    limiter = RateLimiter(int(os.getenv("RATE_LIMIT_PER_MINUTE", "30")))
    trust_proxy = os.getenv("TRUST_PROXY", "false").lower() == "true"

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        if app.state.classifier is None:
            app.state.classifier = SiglipClassifier()
        yield

    app = FastAPI(title="EcoQuest inference", lifespan=lifespan,
                  docs_url=None, redoc_url=None, openapi_url=None)
    app.state.classifier = classifier

    origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "").split(",") if o.strip()]
    if origins:
        app.add_middleware(CORSMiddleware, allow_origins=origins,
                           allow_methods=["GET", "POST", "OPTIONS"], allow_headers=["*"])

    @app.middleware("http")
    async def _limit_body(request: Request, call_next):
        # Rechaza cuerpos enormes antes de parsear el multipart (que vive en memoria).
        if request.method == "POST" and request.url.path == "/classify":
            cl = request.headers.get("content-length")
            if cl is None or not cl.isdigit():
                return JSONResponse({"error": "Content-Length requerido."}, status_code=400)
            if int(cl) > MAX_BYTES + 64 * 1024:
                return JSONResponse({"error": "La imagen excede 5 MB."}, status_code=400)
        return await call_next(request)

    @app.exception_handler(ApiError)
    async def _api_error(_: Request, exc: ApiError):
        return JSONResponse({"error": exc.message}, status_code=exc.status)

    @app.exception_handler(RequestValidationError)
    async def _validation(_: Request, exc: RequestValidationError):
        return JSONResponse({"error": "Solicitud invalida: se requieren 'image' y 'mission_id'."},
                            status_code=400)

    @app.exception_handler(StarletteHTTPException)
    async def _http(_: Request, exc: StarletteHTTPException):
        return JSONResponse({"error": str(exc.detail)}, status_code=exc.status_code)

    @app.exception_handler(Exception)
    async def _unhandled(_: Request, exc: Exception):
        log.error("unhandled error: %s", type(exc).__name__)  # sin datos de la peticion
        return JSONResponse({"error": "Error interno del servidor."}, status_code=500)

    @app.get("/health")
    def health():
        return {"status": "ok", "model": MODEL_NAME}

    @app.post("/classify")
    async def classify_endpoint(request: Request, image: UploadFile = File(...),
                                mission_id: str = Form(...)):
        t0 = time.perf_counter()
        key = request.client.host if request.client else "unknown"
        if trust_proxy and request.headers.get("x-forwarded-for"):
            key = request.headers["x-forwarded-for"].split(",")[0].strip()
        if not limiter.allow(key):
            raise ApiError(429, "Demasiadas solicitudes. Intenta de nuevo en un minuto.")
        if mission_id not in MISSIONS:
            raise ApiError(400, "mission_id invalido: use leaf, flower o roots.")
        data = await image.read(MAX_BYTES + 1)
        if len(data) > MAX_BYTES:
            raise ApiError(400, "La imagen excede 5 MB.")
        if _sniff(data) is None:
            raise ApiError(400, "Tipo de imagen no permitido: use JPEG, PNG o WebP.")
        try:
            img = Image.open(io.BytesIO(data))
            img.load()
        except (UnidentifiedImageError, OSError, Image.DecompressionBombError, ValueError):
            raise ApiError(400, "La imagen no se pudo leer.")
        del data
        scores = await run_in_threadpool(request.app.state.classifier.score, img)
        target = scores[mission_id]
        return {
            "mission_id": mission_id,
            "status": decide_status(mission_id, target, thresholds),
            "scores": {k: round(v, 4) for k, v in scores.items()},
            "target_score": round(target, 4),
            "model": {"name": MODEL_NAME, "license": MODEL_LICENSE},
            "latency_ms": int((time.perf_counter() - t0) * 1000),
        }

    return app


app = create_app()
