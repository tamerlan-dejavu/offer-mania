from uuid import uuid4
from sqlalchemy import Column, ForeignKey, func, DateTime, Integer, Text
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from app.db.base import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, index=True)
    session_id = Column(UUID(as_uuid=True), ForeignKey("sessions.id"), nullable=False, unique=True, index=True)
    score = Column(Integer, nullable=False)
    strengths = Column(ARRAY(Text), nullable=False, default=[])
    weaknesses = Column(ARRAY(Text), nullable=False, default=[])
    recommendations = Column(ARRAY(Text), nullable=False, default=[])
    summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
