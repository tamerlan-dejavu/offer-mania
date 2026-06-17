from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_session
from app.core.deps import get_current_user
from app.db.models.user import User
from app.repositories.user_profile_repository import UserProfileRepository
from app.schemas.onboarding import OnboardingRequest


router = APIRouter(prefix="/onboarding", tags=["onboarding"])


@router.post("/setup")
async def setup_profile(
    request: OnboardingRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    repo = UserProfileRepository(session)
    profile = await repo.create_or_update_profile(
        user_id=current_user.id,
        data=request.model_dump()
    )
    return {
        "message": "Profile updated successfully",
        "profile": {
            "target_role": profile.target_role,
            "stack": profile.stack,
            "experience_level": profile.experience_level,
            "focus_areas": profile.focus_areas
        }
    }


@router.get("/profile")
async def get_profile(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    repo = UserProfileRepository(session)
    profile = await repo.get_profile_by_user_id(current_user.id)

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )

    return {
        "target_role": profile.target_role,
        "stack": profile.stack,
        "experience_level": profile.experience_level,
        "focus_areas": profile.focus_areas
    }
