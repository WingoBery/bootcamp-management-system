from fastapi import FastAPI
from sqlalchemy import text

from database.base import Base
from database.connection import engine
from routers import auth as auth_router
from routers import user as user_router

app = FastAPI(
    title="User Service API",
    description="Authentication and user management for the Bootcamp Management System",
    version="1.0.0",
)

app.include_router(auth_router.router)
app.include_router(user_router.router)


@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))


@app.get("/")
def index():
    return "User Service is running!"
