from db.session import SessionLocal
from db import models


def save_message(session_id: int, content: str, role: str = "user"):
    with SessionLocal() as db:
        msg = models.Message(session_id=session_id, content=content, role=role)
        db.add(msg)
        db.commit()
        db.refresh(msg)
        return msg


def save_summary(session_id: int, summary: str):
    with SessionLocal() as db:
        summ = models.Summary(session_id=session_id, summary=summary)
        db.add(summ)
        db.commit()
        db.refresh(summ)
        return summ


def get_messages(session_id: int):
    with SessionLocal() as db:
        return (
            db.query(models.Message)
            .filter(models.Message.session_id == session_id)
            .all()
        )


def get_summaries(session_id: int):
    with SessionLocal() as db:
        return (
            db.query(models.Summary)
            .filter(models.Summary.session_id == session_id)
            .all()
        )
