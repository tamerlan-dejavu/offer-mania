from fastapi import APIRouter, Depends
from app.llm.gemini import GeminiLLM
from app.schemas.chat import ChatRequest
from app.core.deps import get_current_user
from app.db.models.user import User


router = APIRouter()

@router.post("/chat")
async def chat(request: ChatRequest, current_user: User = Depends(get_current_user)):
    llm = GeminiLLM()
    response = llm.send_response(request.user_message, [])
    return {"response": response , "done": "INTERVIEW_DONE" in response}