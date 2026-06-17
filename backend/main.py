from fastapi import FastAPI
from app.api.chat import router as chat_router
from app.api.auth import router as auth_router
from app.api.onboarding import router as onboarding_router
from app.api.sessions import router as sessions_router
from fastapi.staticfiles import StaticFiles

app = FastAPI(
    title="Offer-Mania API",
    description="""
    AI-Powered Interview Simulator for Technical Skill Assessment

    This API provides an intelligent interview system that evaluates candidates' technical expertise
    through conversation. It uses Gemini AI as the backbone to conduct realistic technical interviews
    with context-aware questioning and real-time feedback.

    ## Routes:
    - **POST /chat** - Send a message to the interview simulator and receive an AI-generated response

    ## Features:
    - Context-aware technical interviews
    - Python expertise evaluation
    - Real-time conversation with AI
    - Structured request/response handling
    """,
    version="0.1.0",
)

app.mount("/static", StaticFiles(directory="app/static"), name="static")

app.include_router(chat_router)
app.include_router(auth_router)
app.include_router(onboarding_router)
app.include_router(sessions_router)
