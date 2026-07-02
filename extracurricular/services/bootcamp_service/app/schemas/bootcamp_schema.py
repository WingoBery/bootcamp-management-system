from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class BootcampCreate(BaseModel):
    title: str
    description: str
    location: str
    start_date: datetime
    end_date: datetime
    max_slots: int
    supervisor_id: Optional[int] = None


class BootcampUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    max_slots: Optional[int] = None
    supervisor_id: Optional[int] = None


class BootcampResponse(BaseModel):
    id: int
    title: str
    description: str
    location: str
    start_date: datetime
    end_date: datetime
    max_slots: int
    current_registrations: int
    supervisor_id: Optional[int] = None

    class Config:
        orm_mode = True


class SlotAvailabilityResponse(BaseModel):
    bootcamp_id: int
    max_slots: int
    current_registrations: int
    available_slots: int
    has_capacity: bool
