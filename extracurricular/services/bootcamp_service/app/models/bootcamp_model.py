from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Integer, String, Text

from database.base import Base


class Bootcamp(Base):
    __tablename__ = "bootcamps"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    location = Column(String)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    max_slots = Column(Integer, nullable=False)
    current_registrations = Column(Integer, default=0)
    supervisor_id = Column(Integer)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime)
