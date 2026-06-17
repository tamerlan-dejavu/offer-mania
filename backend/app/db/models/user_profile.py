from uuid import uuid4
from sqlalchemy import Column, String, ForeignKey, func, DateTime
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from app.db.base import Base


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    target_role = Column(String, nullable=False)
    stack = Column(ARRAY(String), nullable=False, default=[])
    experience_level = Column(String, nullable=False)
    focus_areas = Column(ARRAY(String), nullable=False, default=[])
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
