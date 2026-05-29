from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from app.database import get_session
from app.models import Goal, User
from app.schemas.goal import GoalCreate, GoalRead, GoalUpdate
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/", response_model=GoalRead)
def create_goal(
    goal: GoalCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    valid_goal_data = goal.model_dump()
    valid_goal_data["user_id"] = current_user.id
    db_goal = Goal.model_validate(valid_goal_data)
    session.add(db_goal)
    session.commit()
    session.refresh(db_goal)
    return db_goal

@router.get("/", response_model=List[GoalRead])
def read_goals(
    offset: int = 0,
    limit: int = 100,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    goals = session.exec(
        select(Goal).where(Goal.user_id == current_user.id).offset(offset).limit(limit)
    ).all()
    return goals

@router.get("/{goal_id}", response_model=GoalRead)
def read_goal(
    goal_id: UUID,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    goal = session.get(Goal, goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    if goal.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this goal")
    return goal

@router.patch("/{goal_id}", response_model=GoalRead)
def update_goal(
    goal_id: UUID,
    goal: GoalUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    db_goal = session.get(Goal, goal_id)
    if not db_goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    if db_goal.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this goal")

    goal_data = goal.model_dump(exclude_unset=True)
    for key, value in goal_data.items():
        setattr(db_goal, key, value)
    
    session.add(db_goal)
    session.commit()
    session.refresh(db_goal)
    return db_goal

@router.delete("/{goal_id}")
def delete_goal(
    goal_id: UUID,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    goal = session.get(Goal, goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    if goal.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this goal")
    
    session.delete(goal)
    session.commit()
    return {"ok": True}
