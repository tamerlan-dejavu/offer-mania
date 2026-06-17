from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.models.user_profile import UserProfile


class UserProfileRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_profile_by_user_id(self, user_id: UUID) -> UserProfile | None:
        stmt = select(UserProfile).where(UserProfile.user_id == user_id)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def create_or_update_profile(self, user_id: UUID, data: dict) -> UserProfile:
        profile = await self.get_profile_by_user_id(user_id)

        if profile:
            profile.target_role = data.get("target_role", profile.target_role)
            profile.stack = data.get("stack", profile.stack)
            profile.experience_level = data.get("experience_level", profile.experience_level)
            profile.focus_areas = data.get("focus_areas", profile.focus_areas)
        else:
            profile = UserProfile(
                user_id=user_id,
                target_role=data["target_role"],
                stack=data["stack"],
                experience_level=data["experience_level"],
                focus_areas=data["focus_areas"]
            )
            self.session.add(profile)

        await self.session.commit()
        await self.session.refresh(profile)
        return profile
