from fastapi import FastAPI
from sqlalchemy import text

from database.base import Base
from database.connection import engine
from routers import bootcamp as bootcamp_router

app = FastAPI(
    title="Bootcamp Service API",
    description="Bootcamp scheduling, capacity, and supervisor assignment",
    version="1.0.0",
)

app.include_router(bootcamp_router.router)


@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))


@app.get("/")
def index():
    return "Bootcamp Service is running!"
