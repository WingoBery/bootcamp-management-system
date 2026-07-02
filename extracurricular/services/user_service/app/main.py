import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlalchemy import text

from database.base import Base
from database.connection import engine
from routers import auth as auth_router
from routers import user as user_router
from shared.config import validate_production_secrets
from shared.health import create_health_router
from shared.logging_setup import RequestLoggingMiddleware, register_exception_handlers, setup_logging

SERVICE_NAME = "user_service"
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
logger = setup_logging(SERVICE_NAME, LOG_LEVEL)


def _startup_check():
    validate_production_secrets()
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
    title="User Service API",
    description="Authentication and user management for the Bootcamp Management System",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(RequestLoggingMiddleware, logger=logger)
register_exception_handlers(app, logger)
app.include_router(create_health_router(SERVICE_NAME, engine))
app.include_router(auth_router.router)
app.include_router(user_router.router)


@app.get("/")
def index():
    return {"status": "ok", "service": SERVICE_NAME}
