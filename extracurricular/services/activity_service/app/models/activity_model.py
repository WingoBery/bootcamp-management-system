from sqlalchemy import Column, Integer, String, Text, DateTime 
from database.base import Base
from datetime import datetime, timezone

class Activity(Base):
    __tablename__ = "extra_curricular-activities"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    category = Column(String)
    organizer = Column(String)
    location = Column(String)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    registration_deadline = Column(DateTime, nullable=False)
    max_participants = Column(Integer)
    current_participants = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime)
