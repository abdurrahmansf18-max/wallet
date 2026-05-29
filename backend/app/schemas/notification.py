from typing import Optional, List
from datetime import datetime
import uuid
from pydantic import BaseModel

from app.models import NotificationType

# Shared properties
class NotificationBase(BaseModel):
    title: str
    message: str
    type: NotificationType = NotificationType.INFO
    is_read: bool = False

# Properties to receive on item creation
class NotificationCreate(NotificationBase):
    pass

# Properties to receive on item update
class NotificationUpdate(BaseModel):
    is_read: Optional[bool] = None

# Properties to return to client
class NotificationResponse(NotificationBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    user_id: uuid.UUID

    class Config:
        orm_mode = True
