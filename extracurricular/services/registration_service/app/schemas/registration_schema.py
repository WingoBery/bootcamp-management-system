from datetime import datetime

from pydantic import BaseModel, EmailStr


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
        from_attributes = True


class StudentSummary(BaseModel):
    id: int
    full_name: str
    email: EmailStr


class EnrollmentDetail(BaseModel):
    id: int
    student_id: int
    bootcamp_id: int
    status: str
    registered_at: datetime
    student: StudentSummary
