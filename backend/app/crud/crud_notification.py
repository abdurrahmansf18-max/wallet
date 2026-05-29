from typing import List, Optional
import uuid
from sqlmodel import Session, select
from app.models import Notification, NotificationType
from app.schemas.notification import NotificationCreate, NotificationUpdate
from fastapi.encoders import jsonable_encoder

def create_notification(db: Session, *, user_id: uuid.UUID, obj_in: NotificationCreate) -> Notification:
    db_obj = Notification(
        title=obj_in.title,
        message=obj_in.message,
        type=obj_in.type,
        is_read=obj_in.is_read,
        user_id=user_id
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_multi_by_user(db: Session, *, user_id: uuid.UUID, skip: int = 0, limit: int = 100) -> List[Notification]:
    query = select(Notification).where(Notification.user_id == user_id).order_by(Notification.created_at.desc()).offset(skip).limit(limit)
    return db.exec(query).all()

def get_notification(db: Session, id: uuid.UUID, user_id: uuid.UUID) -> Optional[Notification]:
    query = select(Notification).where(Notification.id == id, Notification.user_id == user_id)
    return db.exec(query).first()

def mark_as_read(db: Session, *, db_obj: Notification) -> Notification:
    db_obj.is_read = True
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def mark_all_as_read(db: Session, *, user_id: uuid.UUID) -> int:
    query = select(Notification).where(Notification.user_id == user_id, Notification.is_read == False)
    notifications = db.exec(query).all()
    count = 0
    for n in notifications:
        n.is_read = True
        db.add(n)
        count += 1
    db.commit()
    return count

def delete_notification(db: Session, *, id: uuid.UUID, user_id: uuid.UUID) -> Notification:
    obj = get_notification(db, id=id, user_id=user_id)
    if obj:
        db.delete(obj)
        db.commit()
    return obj
