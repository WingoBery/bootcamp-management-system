from fastapi import FastAPI
from sqlalchemy import text

from database.base import Base
from database.connection import engine
from routers import registration as registration_router

app = FastAPI(
    title="Registration Service API",
    description="Student enrollment in bootcamps with capacity verification",
    version="1.0.0",
)

app.include_router(registration_router.router)


@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))


@app.get("/")
def index():
    return "Registration Service is running!"
