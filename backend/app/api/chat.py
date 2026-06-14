from fastapi import APIRouter
from app.llm.gemini import GeminiLLM
from app.schemas.chat import ChatRequest


router = APIRouter()

@router.post("/chat")
async def chat(request: ChatRequest):
    llm = GeminiLLM()
    response = llm.send_response(request.user_message, [])
    return {"response": response}