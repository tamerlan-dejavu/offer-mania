from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.llm.gemini import GeminiLLM
from app.schemas.chat import ChatRequest
from app.core.deps import get_current_user
from app.db.models.user import User
from app.db.session import get_session
from app.repositories.user_profile_repository import UserProfileRepository
from app.interview.factory import InterviewFactory


router = APIRouter()

@router.post("/chat")
async def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    repo = UserProfileRepository(session)
    profile = await repo.get_profile_by_user_id(current_user.id)

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found. Please complete onboarding first."
        )

    interview_type = request.interview_type or "tech"
    system_prompt = InterviewFactory.build_prompt(profile, interview_type)

    llm = GeminiLLM()
    response = llm.send_response(request.user_message, [], system_prompt)
    return {"response": response, "done": "INTERVIEW_DONE" in response}