import os
from contextlib import asynccontextmanager
from typing import Dict

import httpx
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from jose import JWTError, jwt

from shared.config import validate_production_secrets
from shared.health import create_gateway_health_router
from shared.logging_setup import RequestLoggingMiddleware, register_exception_handlers, setup_logging

SERVICE_NAME = "gateway"
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
logger = setup_logging(SERVICE_NAME, LOG_LEVEL)

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change-me-in-production")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

SERVICE_URLS: Dict[str, str] = {
    "/api/v1/auth": os.getenv("USER_SERVICE_URL", "http://user_service:8000"),
    "/api/v1/users": os.getenv("USER_SERVICE_URL", "http://user_service:8000"),
    "/api/v1/bootcamps": os.getenv("BOOTCAMP_SERVICE_URL", "http://bootcamp_service:8000"),
    "/api/v1/registrations": os.getenv("REGISTRATION_SERVICE_URL", "http://registration_service:8000"),
    "/api/v1/showcases": os.getenv("SHOWCASE_SERVICE_URL", "http://showcase_service:8000"),
}

SERVICE_ROUTE_MAP: Dict[str, str] = {
    "/api/v1/auth": "/auth",
    "/api/v1/users": "/users",
    "/api/v1/bootcamps": "/bootcamp",
    "/api/v1/registrations": "/registration",
    "/api/v1/showcases": "/showcase",
}

PROTECTED_PREFIXES = ["/api/v1/users", "/api/v1/bootcamps", "/api/v1/registrations", "/api/v1/showcases"]

UPSTREAM_HEALTH_URLS = list({f"{url}/health" for url in SERVICE_URLS.values()})


@asynccontextmanager
async def lifespan(app: FastAPI):
    validate_production_secrets()
    logger.info("%s starting up", SERVICE_NAME)
    yield
    logger.info("%s shutting down", SERVICE_NAME)


app = FastAPI(
    title="Bootcamp Management Gateway",
    description="Single entry point for the microservices ecosystem",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in CORS_ORIGINS if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RequestLoggingMiddleware, logger=logger)
register_exception_handlers(app, logger)
app.include_router(create_gateway_health_router(SERVICE_NAME, UPSTREAM_HEALTH_URLS))


@app.get("/")
def index():
    return {"status": "ok", "service": SERVICE_NAME}


def _validate_token(authorization: str | None):
    if not authorization or not authorization.startswith("Bearer "):
        raise ValueError("Missing bearer token")

    token = authorization.removeprefix("Bearer ").strip()
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
    except JWTError as exc:
        raise ValueError(f"Invalid token: {exc}") from exc

    return payload


@app.api_route("/api/v1/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_request(request: Request, path: str):
    request_path = request.url.path
    target_base_url = None
    route_prefix = None

    for prefix, base_url in SERVICE_URLS.items():
        if request_path.startswith(prefix):
            target_base_url = base_url
            route_prefix = prefix
            break

    if not target_base_url or not route_prefix:
        return JSONResponse(status_code=404, content={"detail": "Route not found"})

    if any(request_path.startswith(prefix) for prefix in PROTECTED_PREFIXES):
        try:
            _validate_token(request.headers.get("authorization"))
        except ValueError as exc:
            return JSONResponse(status_code=401, content={"detail": str(exc)})

    service_path = SERVICE_ROUTE_MAP[route_prefix]
    forwarded_path = request_path.replace(route_prefix, service_path, 1)
    target_url = f"{target_base_url}{forwarded_path}"

    body = await request.body()
    headers = dict(request.headers)
    headers.pop("host", None)

    async with httpx.AsyncClient(timeout=20.0) as client:
        try:
            response = await client.request(
                method=request.method,
                url=target_url,
                headers=headers,
                content=body,
            )
        except httpx.RequestError as exc:
            logger.error("Upstream request failed url=%s error=%s", target_url, exc)
            return JSONResponse(
                status_code=503,
                content={"detail": f"Upstream service unavailable: {exc}"},
            )

    response_content = response.content
    response_headers = {
        key: value
        for key, value in response.headers.items()
        if key.lower() not in {"content-length", "transfer-encoding"}
    }
    return Response(
        content=response_content,
        status_code=response.status_code,
        headers=response_headers,
        media_type=response.headers.get("content-type"),
    )
