from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.llm.gemini import GeminiLLM
from app.schemas.chat import ChatRequest
from app.core.deps import get_current_user
from app.db.models.user import User
from app.db.models.message import MessageRole
from app.db.session import get_session
from app.repositories.user_profile_repository import UserProfileRepository
from app.repositories.session_repository import SessionRepository
from app.repositories.message_repository import MessageRepository
from app.interview.factory import InterviewFactory


router = APIRouter()

@router.post("/chat")
async def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db_session: AsyncSession = Depends(get_session)
):
    profile_repo = UserProfileRepository(db_session)
    profile = await profile_repo.get_profile_by_user_id(current_user.id)

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found. Please complete onboarding first."
        )

    session_repo = SessionRepository(db_session)
    session_id = UUID(request.session_id)
    session = await session_repo.get_session_by_id(session_id)

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )

    if session.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized"
        )

    message_repo = MessageRepository(db_session)
    message_history = await message_repo.get_messages_by_session_id(session_id)

    history_for_gemini = [
    {
        "role": "model" if msg.role == MessageRole.ASSISTANT else "user",
        "parts": [{"text": msg.content}]
    }
    for msg in message_history
]

    interview_type = request.interview_type or "tech"
    system_prompt = InterviewFactory.build_prompt(profile, interview_type)

    llm = GeminiLLM()
    response = llm.send_response(request.user_message, history_for_gemini, system_prompt)

    await message_repo.save_message(session_id, MessageRole.USER, request.user_message)
    await message_repo.save_message(session_id, MessageRole.ASSISTANT, response)

    return {"response": response, "done": "INTERVIEW_DONE" in response}