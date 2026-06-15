from fastapi import FastAPI
from app.api.chat import router
from fastapi.staticfiles import StaticFiles

app = FastAPI(
    title="Offer-Mania API",
    description="AI-Powered Interview Simulator",
    version="0.1.0",
)

app.mount("/static", StaticFiles(directory="app/static"), name="static")

app.include_router(router)
