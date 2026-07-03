from datetime import datetime, timezone

from models.showcase_model import Showcase
from schemas.showcase_schema import ShowcaseSubmit
from services.image_storage import save_project_image


def submit_showcase(showcase: ShowcaseSubmit, db):
    new_showcase = Showcase(**showcase.model_dump())
    db.add(new_showcase)
    db.commit()
    db.refresh(new_showcase)
    return new_showcase


def submit_showcase_with_image(showcase: ShowcaseSubmit, image, db):
    filename = save_project_image(image)
    payload = showcase.model_dump()
    payload["project_image_url"] = filename
    new_showcase = Showcase(**payload)
    db.add(new_showcase)
    db.commit()
    db.refresh(new_showcase)
    return new_showcase


def grade_showcase(showcase_id, grade, db):
    record = db.query(Showcase).filter(Showcase.id == showcase_id).first()
    if not record:
        raise ValueError(f"Showcase with id {showcase_id} not found in the database")

    record.supervisor_id = grade.supervisor_id
    record.marks = grade.marks
    record.evaluation = grade.evaluation
    record.feedback = grade.feedback
    record.graded_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(record)
    return record


def list_showcases(db):
    return db.query(Showcase).all()


def list_student_showcases(student_id, db):
    return db.query(Showcase).filter(Showcase.student_id == student_id).all()


def list_pending_for_supervisor(supervisor_id, db):
    _ = supervisor_id
    return db.query(Showcase).filter(Showcase.marks.is_(None)).order_by(Showcase.submitted_at.desc()).all()


def get_showcase(showcase_id, db):
    return db.query(Showcase).filter(Showcase.id == showcase_id).first()
