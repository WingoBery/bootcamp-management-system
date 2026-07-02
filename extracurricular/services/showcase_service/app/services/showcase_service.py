from datetime import datetime, timezone

from models.showcase_model import Showcase


def submit_showcase(showcase, db):
    new_showcase = Showcase(**showcase.model_dump())
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
    return (
        db.query(Showcase)
        .filter(
            Showcase.supervisor_id == supervisor_id,
            Showcase.marks.is_(None),
        )
        .all()
    )


def get_showcase(showcase_id, db):
    return db.query(Showcase).filter(Showcase.id == showcase_id).first()
