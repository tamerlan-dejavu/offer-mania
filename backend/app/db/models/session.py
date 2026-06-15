import enum
from uuid import uuid4
from sqlalchemy import Column, ForeignKey, func, DateTime, Enum, Text, Integer
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base


class SessionStatus(enum.Enum):
    PENDING = "pending"
    ACTIVE = "active"
    COMPLETED = "completed"
    REPORT_READY = "report_ready"


class InterviewMode(enum.Enum):
    HR = "hr"
    TECH = "tech"
    ALGO = "algo"
    SYSTEM_DESIGN = "system_design"


class Session(Base):
    __tablename__ = "sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    user_profile_id = Column(UUID(as_uuid=True), ForeignKey("user_profiles.id"), nullable=False, index=True)
    status = Column(Enum(SessionStatus), default=SessionStatus.PENDING, nullable=False)
    mode = Column(Enum(InterviewMode), nullable=False)
    question_count = Column(Integer, default=0, nullable=False)
    transcript = Column(Text, nullable=True)
    report = Column(Text, nullable=True)
    started_at = Column(DateTime, default=func.now(), nullable=False)
    ended_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)