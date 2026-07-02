from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Integer, String, UniqueConstraint

from database.base import Base


class Registration(Base):
    __tablename__ = "registrations"
    __table_args__ = (UniqueConstraint("student_id", "bootcamp_id", name="uq_student_bootcamp"),)

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, nullable=False, index=True)
    bootcamp_id = Column(Integer, nullable=False, index=True)
    status = Column(String, default="confirmed")
    registered_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
