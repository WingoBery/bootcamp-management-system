from fastapi import FastAPI
from routers import activity as activity_router

app = FastAPI(
    title= "Extracuricular Activities API",
    description="Activity Management API's",
    version="1.0.0"
)

# Register routers 
app.include_router(activity_router.router)

@app.get("/")
def index():
    return "Let's Gooooo!"
