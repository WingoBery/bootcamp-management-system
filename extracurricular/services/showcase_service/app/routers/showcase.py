from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database.session import get_db
from schemas.showcase_schema import ShowcaseGrade, ShowcaseResponse, ShowcaseSubmit
from services import showcase_service

router = APIRouter(prefix="/showcase")


@router.post("/", response_model=ShowcaseResponse)
def submit_project(showcase: ShowcaseSubmit, db: Session = Depends(get_db)):
    return showcase_service.submit_showcase(showcase, db)


@router.put("/{showcase_id}/grade", response_model=ShowcaseResponse)
def grade_project(
    showcase_id: int,
    grade: ShowcaseGrade,
    db: Session = Depends(get_db),
):
    try:
        return showcase_service.grade_showcase(showcase_id, grade, db)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))


@router.get("/", response_model=List[ShowcaseResponse])
def list_showcases(db: Session = Depends(get_db)):
    return showcase_service.list_showcases(db)


@router.get("/student/{student_id}", response_model=List[ShowcaseResponse])
def list_by_student(student_id: int, db: Session = Depends(get_db)):
    return showcase_service.list_student_showcases(student_id, db)


@router.get("/supervisor/{supervisor_id}/pending", response_model=List[ShowcaseResponse])
def list_pending_for_supervisor(supervisor_id: int, db: Session = Depends(get_db)):
    return showcase_service.list_pending_for_supervisor(supervisor_id, db)


@router.get("/{showcase_id}", response_model=ShowcaseResponse)
def get_showcase(showcase_id: int, db: Session = Depends(get_db)):
    record = showcase_service.get_showcase(showcase_id, db)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Showcase with id {showcase_id} not found",
        )
    return record
