from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional

from database.session import get_db
from schemas.registration_schema import EnrollmentDetail, RegistrationCreate, RegistrationResponse
from services import registration_service

router = APIRouter(prefix="/registration")


@router.post("/", response_model=RegistrationResponse)
def register_for_bootcamp(
    registration: RegistrationCreate,
    db: Session = Depends(get_db),
):
    return registration_service.register_student(registration, db)


@router.get("/", response_model=List[RegistrationResponse])
def list_all_registrations(db: Session = Depends(get_db)):
    return registration_service.list_registrations(db)


@router.get("/enrollments", response_model=List[EnrollmentDetail])
def list_enrollments(
    bootcamp_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    return registration_service.list_enrollment_details(db, bootcamp_id=bootcamp_id)


@router.get("/bootcamp/{bootcamp_id}", response_model=List[RegistrationResponse])
def list_by_bootcamp(bootcamp_id: int, db: Session = Depends(get_db)):
    return registration_service.list_bootcamp_registrations(bootcamp_id, db)


@router.get("/student/{student_id}", response_model=List[RegistrationResponse])
def list_by_student(student_id: int, db: Session = Depends(get_db)):
    return registration_service.list_student_registrations(student_id, db)


@router.get("/{registration_id}", response_model=RegistrationResponse)
def get_registration(registration_id: int, db: Session = Depends(get_db)):
    record = registration_service.get_registration(registration_id, db)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Registration with id {registration_id} not found",
        )
    return record
