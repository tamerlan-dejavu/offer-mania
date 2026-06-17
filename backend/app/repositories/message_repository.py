from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.models.message import Message, MessageRole


class MessageRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def save_message(
        self,
        session_id: UUID,
        role: MessageRole,
        content: str
    ) -> Message:
        message = Message(
            session_id=session_id,
            role=role,
            content=content
        )
        self.session.add(message)
        return message

    async def get_messages_by_session_id(self, session_id: UUID) -> list[Message]:
        stmt = select(Message).where(Message.session_id == session_id).order_by(Message.created_at)
        result = await self.session.execute(stmt)
        return result.scalars().all()
