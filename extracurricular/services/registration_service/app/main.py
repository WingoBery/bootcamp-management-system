import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlalchemy import text

from database.base import Base
from database.connection import engine
from routers import registration as registration_router
from shared.health import create_health_router
from shared.logging_setup import RequestLoggingMiddleware, register_exception_handlers, setup_logging

SERVICE_NAME = "registration_service"
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
logger = setup_logging(SERVICE_NAME, LOG_LEVEL)


def _startup_check():
    Base.metadata.create_all(bind=engine)
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("%s starting up", SERVICE_NAME)
    _startup_check()
    logger.info("%s startup complete", SERVICE_NAME)
    yield
    logger.info("%s shutting down", SERVICE_NAME)


app = FastAPI(
    title="Registration Service API",
    description="Student enrollment in bootcamps with capacity verification",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(RequestLoggingMiddleware, logger=logger)
register_exception_handlers(app, logger)
app.include_router(create_health_router(SERVICE_NAME, engine))
app.include_router(registration_router.router)


@app.get("/")
def index():
    return {"status": "ok", "service": SERVICE_NAME}
