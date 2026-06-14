from fastapi import FastAPI
from app.api.chat import router

app = FastAPI(
    title="Offer-Mania API",
    description="AI-Powered Interview Simulator",
    version="0.1.0",
)

app.include_router(router)
