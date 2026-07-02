from pydantic import BaseModel 
from datetime import datetime

class ActivityCreate(BaseModel):
    title: str
    description: str
    category: str 
    organizer: str
    location: str
    start_time: datetime
    end_time: datetime
    registration_deadline: datetime
    max_participants: int 
    
class ActivityResponse(BaseModel):
    id: int 
    title: str
    description: str
    category: str 
    organizer: str
    location: str
    start_time: datetime
    end_time: datetime
    registration_deadline: datetime
    max_participants: int

    class Config:
        orm_mode = True
