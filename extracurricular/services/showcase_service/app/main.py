from fastapi import FastAPI
from sqlalchemy import text

from database.base import Base
from database.connection import engine
from routers import showcase as showcase_router

app = FastAPI(
    title="Showcase Service API",
    description="Student project submissions and supervisor grading",
    version="1.0.0",
)

app.include_router(showcase_router.router)


@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))


@app.get("/")
def index():
    return "Showcase Service is running!"
