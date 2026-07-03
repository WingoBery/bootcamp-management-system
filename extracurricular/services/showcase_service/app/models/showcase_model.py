from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Float, Integer, String, Text

from database.base import Base


class Showcase(Base):
    __tablename__ = "showcases"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, nullable=False, index=True)
    bootcamp_id = Column(Integer, nullable=False, index=True)
    supervisor_id = Column(Integer)
    project_title = Column(String, nullable=False)
    project_url = Column(String)
    project_image_url = Column(String)
    description = Column(Text)
    marks = Column(Float)
    evaluation = Column(String)
    feedback = Column(Text)
    submitted_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    graded_at = Column(DateTime)
