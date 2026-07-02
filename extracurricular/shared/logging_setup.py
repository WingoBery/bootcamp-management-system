import logging
import sys
import time
import uuid
from typing import Callable

from fastapi import FastAPI, Request, Response
from starlette.middleware.base import BaseHTTPMiddleware


def setup_logging(service_name: str, log_level: str = "INFO") -> logging.Logger:
    level = getattr(logging, log_level.upper(), logging.INFO)
    logging.basicConfig(
        level=level,
        format=(
            '{"time":"%(asctime)s","service":"'
            + service_name
            + '","level":"%(levelname)s","logger":"%(name)s","message":"%(message)s"}'
        ),
        stream=sys.stdout,
        force=True,
    )
    logger = logging.getLogger(service_name)
    logger.info("Logging configured for %s at level %s", service_name, log_level)
    return logger


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, logger: logging.Logger):
        super().__init__(app)
        self.logger = logger

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        start = time.perf_counter()
        self.logger.info(
            "Request started method=%s path=%s request_id=%s",
            request.method,
            request.url.path,
            request_id,
        )
        try:
            response = await call_next(request)
        except Exception:
            duration_ms = (time.perf_counter() - start) * 1000
            self.logger.exception(
                "Request failed method=%s path=%s duration_ms=%.2f request_id=%s",
                request.method,
                request.url.path,
                duration_ms,
                request_id,
            )
            raise

        duration_ms = (time.perf_counter() - start) * 1000
        self.logger.info(
            "Request completed method=%s path=%s status=%s duration_ms=%.2f request_id=%s",
            request.method,
            request.url.path,
            response.status_code,
            duration_ms,
            request_id,
        )
        response.headers["X-Request-ID"] = request_id
        return response


def register_exception_handlers(app: FastAPI, logger: logging.Logger) -> None:
    from fastapi import HTTPException
    from fastapi.exceptions import RequestValidationError
    from fastapi.responses import JSONResponse

    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        logger.warning(
            "HTTP exception path=%s status=%s detail=%s",
            request.url.path,
            exc.status_code,
            exc.detail,
        )
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        logger.warning("Validation error path=%s errors=%s", request.url.path, exc.errors())
        return JSONResponse(status_code=422, content={"detail": exc.errors()})

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        logger.exception("Unhandled exception path=%s", request.url.path)
        return JSONResponse(status_code=500, content={"detail": "Internal server error"})
