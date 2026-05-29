from typing import Any, List
import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.api import deps
from app.database import get_session
from app.crud import crud_notification
from app.models import User
from app.schemas.notification import NotificationResponse, NotificationCreate, NotificationUpdate

router = APIRouter()

@router.get("/", response_model=List[NotificationResponse])
def read_notifications(
    db: Session = Depends(get_session),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve notifications for the current user.
    """
    notifications = crud_notification.get_multi_by_user(
        db, user_id=current_user.id, skip=skip, limit=limit
    )
    return notifications

@router.post("/", response_model=NotificationResponse)
def create_notification(
    *,
    db: Session = Depends(get_session),
    notification_in: NotificationCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Create new notification for current user. Mostly for testing.
    """
    notification = crud_notification.create_notification(
        db=db, user_id=current_user.id, obj_in=notification_in
    )
    return notification

@router.patch("/{id}/read", response_model=NotificationResponse)
def mark_notification_read(
    *,
    db: Session = Depends(get_session),
    id: uuid.UUID,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Mark a specific notification as read.
    """
    notification = crud_notification.get_notification(db=db, id=id, user_id=current_user.id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    notification = crud_notification.mark_as_read(db=db, db_obj=notification)
    return notification

@router.post("/read-all")
def mark_all_notifications_read(
    *,
    db: Session = Depends(get_session),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Mark all unread notifications as read.
    """
    count = crud_notification.mark_all_as_read(db=db, user_id=current_user.id)
    return {"message": f"{count} notifications marked as read", "count": count}

@router.delete("/{id}", response_model=NotificationResponse)
def delete_notification(
    *,
    db: Session = Depends(get_session),
    id: uuid.UUID,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Delete a notification.
    """
    notification = crud_notification.get_notification(db=db, id=id, user_id=current_user.id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    notification = crud_notification.delete_notification(db=db, id=id, user_id=current_user.id)
    return notification
