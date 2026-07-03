import httpx
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from core.config import BOOTCAMP_SERVICE_URL, USER_SERVICE_URL
from models.registration_model import Registration
from schemas.registration_schema import EnrollmentDetail, RegistrationCreate, StudentSummary


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


def _fetch_student(student_id: int) -> StudentSummary:
    url = f"{USER_SERVICE_URL}/users/{student_id}"
    try:
        response = httpx.get(url, timeout=10.0)
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"User service unavailable: {exc}",
        )

    if response.status_code == 404:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with id {student_id} not found",
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unexpected response from user service",
        )

    payload = response.json()
    return StudentSummary(id=payload["id"], full_name=payload["full_name"], email=payload["email"])


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


def list_bootcamp_registrations(bootcamp_id: int, db: Session):
    return (
        db.query(Registration)
        .filter(Registration.bootcamp_id == bootcamp_id)
        .order_by(Registration.registered_at.desc())
        .all()
    )


def list_enrollment_details(db: Session, bootcamp_id: int | None = None):
    query = db.query(Registration).order_by(Registration.registered_at.desc())
    if bootcamp_id is not None:
        query = query.filter(Registration.bootcamp_id == bootcamp_id)

    registrations = query.all()
    student_cache: dict[int, StudentSummary] = {}
    details: list[EnrollmentDetail] = []

    for registration in registrations:
        if registration.student_id not in student_cache:
            student_cache[registration.student_id] = _fetch_student(registration.student_id)

        details.append(
            EnrollmentDetail(
                id=registration.id,
                student_id=registration.student_id,
                bootcamp_id=registration.bootcamp_id,
                status=registration.status,
                registered_at=registration.registered_at,
                student=student_cache[registration.student_id],
            )
        )

    return details


def get_registration(registration_id: int, db: Session):
    return db.query(Registration).filter(Registration.id == registration_id).first()
