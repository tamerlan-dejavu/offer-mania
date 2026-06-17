from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_session
from app.core.deps import get_current_user
from app.db.models.user import User
from app.db.models.session import InterviewMode
from app.repositories.user_profile_repository import UserProfileRepository
from app.repositories.session_repository import SessionRepository
from app.schemas.session import CreateSessionRequest, SessionResponse


router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.post("/", response_model=SessionResponse)
async def create_session(
    request: CreateSessionRequest,
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

    try:
        interview_mode = InterviewMode[request.mode.upper()]
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid interview mode. Must be one of: hr, tech, algo, system_design"
        )

    session_repo = SessionRepository(db_session)
    new_session = await session_repo.create_session(
        user_id=current_user.id,
        user_profile_id=profile.id,
        mode=interview_mode
    )

    return {
        "session_id": str(new_session.id),
        "status": new_session.status.value
    }
