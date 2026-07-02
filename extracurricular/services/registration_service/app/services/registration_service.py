import httpx
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from core.config import BOOTCAMP_SERVICE_URL
from models.registration_model import Registration
from schemas.registration_schema import RegistrationCreate


def _check_bootcamp_availability(bootcamp_id: int) -> dict:
    url = f"{BOOTCAMP_SERVICE_URL}/bootcamp/{bootcamp_id}/availability"
    try:
        response = httpx.get(url, timeout=10.0)
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Bootcamp service unavailable: {exc}",
        )

    if response.status_code == 404:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bootcamp with id {bootcamp_id} not found",
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unexpected response from bootcamp service",
        )

    return response.json()


def _reserve_bootcamp_slot(bootcamp_id: int):
    url = f"{BOOTCAMP_SERVICE_URL}/bootcamp/{bootcamp_id}/reserve-slot"
    try:
        response = httpx.post(url, timeout=10.0)
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Bootcamp service unavailable: {exc}",
        )

    if response.status_code == 409:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Bootcamp is at full capacity",
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Could not reserve bootcamp slot",
        )


def register_student(registration: RegistrationCreate, db: Session):
    existing = (
        db.query(Registration)
        .filter(
            Registration.student_id == registration.student_id,
            Registration.bootcamp_id == registration.bootcamp_id,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Student is already registered for this bootcamp",
        )

    availability = _check_bootcamp_availability(registration.bootcamp_id)
    if not availability.get("has_capacity"):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Bootcamp is at full capacity",
        )

    _reserve_bootcamp_slot(registration.bootcamp_id)

    new_registration = Registration(
        student_id=registration.student_id,
        bootcamp_id=registration.bootcamp_id,
    )
    db.add(new_registration)
    db.commit()
    db.refresh(new_registration)
    return new_registration


def list_registrations(db: Session):
    return db.query(Registration).all()


def list_student_registrations(student_id: int, db: Session):
    return db.query(Registration).filter(Registration.student_id == student_id).all()


def get_registration(registration_id: int, db: Session):
    return db.query(Registration).filter(Registration.id == registration_id).first()
