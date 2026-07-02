from datetime import datetime

from pydantic import BaseModel


class RegistrationCreate(BaseModel):
    student_id: int
    bootcamp_id: int


class RegistrationResponse(BaseModel):
    id: int
    student_id: int
    bootcamp_id: int
    status: str
    registered_at: datetime

    class Config:
        orm_mode = True
