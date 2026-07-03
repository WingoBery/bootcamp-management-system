from contextlib import asynccontextmanager
from typing import TYPE_CHECKING, Callable, Optional

import httpx
from fastapi import APIRouter, HTTPException

if TYPE_CHECKING:
    from sqlalchemy.engine import Engine


def create_health_router(service_name: str, engine: Optional["Engine"] = None) -> APIRouter:
    router = APIRouter(tags=["health"])

    @router.get("/health")
    def health():
        return {"status": "ok", "service": service_name}

    @router.get("/live")
    def live():
        return {"status": "alive", "service": service_name}

    @router.get("/ready")
    def ready():
        if engine is None:
            return {"status": "ready", "service": service_name}

        from sqlalchemy import text

        try:
            with engine.connect() as connection:
                connection.execute(text("SELECT 1"))
        except Exception as exc:
            raise HTTPException(status_code=503, detail=f"Database unavailable: {exc}") from exc

        return {"status": "ready", "service": service_name}

    return router


def create_gateway_health_router(
    service_name: str,
    upstream_health_urls: list[str],
) -> APIRouter:
    router = APIRouter(tags=["health"])

    @router.get("/health")
    def health():
        return {"status": "ok", "service": service_name}

    @router.get("/live")
    def live():
        return {"status": "alive", "service": service_name}

    @router.get("/ready")
    async def ready():
        async with httpx.AsyncClient(timeout=5.0) as client:
            for url in upstream_health_urls:
                try:
                    response = await client.get(url)
                    if response.status_code >= 500:
                        raise HTTPException(
                            status_code=503,
                            detail=f"Upstream unavailable: {url}",
                        )
                except httpx.RequestError as exc:
                    raise HTTPException(
                        status_code=503,
                        detail=f"Upstream unreachable: {url} ({exc})",
                    ) from exc

        return {"status": "ready", "service": service_name}

    return router


def create_lifespan(service_name: str, logger, startup_check: Optional[Callable[[], None]] = None):
    @asynccontextmanager
    async def lifespan(app):
        logger.info("%s starting up", service_name)
        if startup_check:
            startup_check()
        logger.info("%s startup complete", service_name)
        yield
        logger.info("%s shutting down", service_name)

    return lifespan
