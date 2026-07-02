from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ShowcaseSubmit(BaseModel):
    student_id: int
    bootcamp_id: int
    project_title: str
    project_url: Optional[str] = None
    description: Optional[str] = None


class ShowcaseGrade(BaseModel):
    supervisor_id: int
    marks: float
    evaluation: str
    feedback: str


class ShowcaseResponse(BaseModel):
    id: int
    student_id: int
    bootcamp_id: int
    supervisor_id: Optional[int] = None
    project_title: str
    project_url: Optional[str] = None
    description: Optional[str] = None
    marks: Optional[float] = None
    evaluation: Optional[str] = None
    feedback: Optional[str] = None
    submitted_at: datetime
    graded_at: Optional[datetime] = None

    class Config:
        orm_mode = True
