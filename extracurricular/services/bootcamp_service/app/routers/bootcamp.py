from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database.session import get_db
from schemas.bootcamp_schema import (
    BootcampCreate,
    BootcampResponse,
    BootcampUpdate,
    SlotAvailabilityResponse,
)
from services import bootcamp_service

router = APIRouter(prefix="/bootcamp")


@router.post("/", response_model=BootcampResponse)
def create_bootcamp(bootcamp: BootcampCreate, db: Session = Depends(get_db)):
    return bootcamp_service.create_bootcamp(bootcamp, db)


@router.put("/{bootcamp_id}", response_model=BootcampResponse)
def modify_bootcamp(
    bootcamp_id: int,
    bootcamp: BootcampUpdate,
    db: Session = Depends(get_db),
):
    record = bootcamp_service.update_bootcamp(bootcamp_id, bootcamp, db)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bootcamp with id {bootcamp_id} not found",
        )
    return record


@router.get("/", response_model=List[BootcampResponse])
def list_bootcamps(db: Session = Depends(get_db)):
    return bootcamp_service.list_bootcamps(db)


@router.get("/{bootcamp_id}", response_model=BootcampResponse)
def get_bootcamp(bootcamp_id: int, db: Session = Depends(get_db)):
    record = bootcamp_service.get_bootcamp(bootcamp_id, db)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bootcamp with id {bootcamp_id} not found",
        )
    return record


@router.put("/{bootcamp_id}/supervisor", response_model=BootcampResponse)
def assign_supervisor(
    bootcamp_id: int,
    supervisor_id: int,
    db: Session = Depends(get_db),
):
    try:
        return bootcamp_service.assign_supervisor(bootcamp_id, supervisor_id, db)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))


@router.get("/{bootcamp_id}/availability", response_model=SlotAvailabilityResponse)
def check_availability(bootcamp_id: int, db: Session = Depends(get_db)):
    try:
        return bootcamp_service.get_slot_availability(bootcamp_id, db)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))


@router.post("/{bootcamp_id}/reserve-slot", response_model=BootcampResponse)
def reserve_slot(bootcamp_id: int, db: Session = Depends(get_db)):
    try:
        return bootcamp_service.reserve_slot(bootcamp_id, db)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc))


@router.delete("/{bootcamp_id}")
def remove_bootcamp(bootcamp_id: int, db: Session = Depends(get_db)):
    return bootcamp_service.delete_bootcamp(bootcamp_id, db)
