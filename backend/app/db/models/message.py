import enum
from uuid import uuid4
from sqlalchemy import Column, ForeignKey, func, DateTime, Enum, Text
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base


class MessageRole(enum.Enum):
    USER = "user"
    ASSISTANT = "assistant"


class Message(Base):
    __tablename__ = "messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, index=True)
    session_id = Column(UUID(as_uuid=True), ForeignKey("sessions.id"), nullable=False, index=True)
    role = Column(Enum(MessageRole), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
