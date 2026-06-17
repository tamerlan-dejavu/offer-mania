from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.models.session import Session, SessionStatus, InterviewMode


class SessionRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_session(
        self,
        user_id: UUID,
        user_profile_id: UUID,
        mode: InterviewMode,
        question_count: int = 0
    ) -> Session:
        new_session = Session(
            user_id=user_id,
            user_profile_id=user_profile_id,
            status=SessionStatus.PENDING,
            mode=mode,
            question_count=question_count
        )
        self.session.add(new_session)
        await self.session.commit()
        await self.session.refresh(new_session)
        return new_session

    async def get_session_by_id(self, session_id: UUID) -> Session | None:
        stmt = select(Session).where(Session.id == session_id)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def update_session_status(self, session_id: UUID, status: SessionStatus) -> Session:
        session = await self.get_session_by_id(session_id)
        if session:
            session.status = status
            await self.session.commit()
            await self.session.refresh(session)
        return session
