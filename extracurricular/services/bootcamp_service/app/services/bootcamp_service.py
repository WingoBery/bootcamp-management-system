from datetime import datetime, timezone

from models.bootcamp_model import Bootcamp


def create_bootcamp(bootcamp, db):
    new_bootcamp = Bootcamp(**bootcamp.model_dump())
    db.add(new_bootcamp)
    db.commit()
    db.refresh(new_bootcamp)
    return new_bootcamp


def update_bootcamp(bootcamp_id, bootcamp, db):
    record = db.query(Bootcamp).filter(Bootcamp.id == bootcamp_id).first()
    try:
        if not record:
            raise ValueError(f"Bootcamp with id {bootcamp_id} not found in the database")

        update_data = bootcamp.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            if hasattr(record, key):
                setattr(record, key, value)

        record.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(record)
        return record
    except Exception:
        db.rollback()
        return None


def list_bootcamps(db):
    return db.query(Bootcamp).all()


def get_bootcamp(bootcamp_id, db):
    return db.query(Bootcamp).filter(Bootcamp.id == bootcamp_id).first()


def assign_supervisor(bootcamp_id, supervisor_id, db):
    record = db.query(Bootcamp).filter(Bootcamp.id == bootcamp_id).first()
    if not record:
        raise ValueError(f"Bootcamp with id {bootcamp_id} not found in the database")

    record.supervisor_id = supervisor_id
    record.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(record)
    return record


def get_slot_availability(bootcamp_id, db):
    record = db.query(Bootcamp).filter(Bootcamp.id == bootcamp_id).first()
    if not record:
        raise ValueError(f"Bootcamp with id {bootcamp_id} not found in the database")

    available = record.max_slots - record.current_registrations
    return {
        "bootcamp_id": record.id,
        "max_slots": record.max_slots,
        "current_registrations": record.current_registrations,
        "available_slots": max(available, 0),
        "has_capacity": available > 0,
    }


def reserve_slot(bootcamp_id, db):
    record = db.query(Bootcamp).filter(Bootcamp.id == bootcamp_id).first()
    if not record:
        raise ValueError(f"Bootcamp with id {bootcamp_id} not found in the database")

    if record.current_registrations >= record.max_slots:
        raise ValueError("Bootcamp is at full capacity")

    record.current_registrations += 1
    record.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(record)
    return record


def delete_bootcamp(bootcamp_id, db):
    try:
        record = db.query(Bootcamp).filter(Bootcamp.id == bootcamp_id).first()
        if not record:
            raise ValueError(f"Bootcamp with id {bootcamp_id} not found in the database")
        db.delete(record)
        db.commit()
        return {"message": f"Bootcamp with id {bootcamp_id} deleted successfully!"}
    except Exception:
        db.rollback()
        return {"message": f"Bootcamp with id {bootcamp_id} not found!"}
