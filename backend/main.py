import hashlib

from fastapi import FastAPI, Depends, HTTPException, Header, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

import models
import schemas
from database import engine, get_db

models.base.metadata.create_all(bind=engine)

app = FastAPI(title="Secure Multi-User Task API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def hash_password(password: str) -> str:
    """
    NOTE: sha256 is used here only to keep this project dependency-free.
    For a real app, install `passlib[bcrypt]` and use bcrypt instead —
    sha256 has no salt/work factor and is not safe for production passwords.
    """
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


# ── Auth ────────────────────────────────────────────────────────────────────

@app.post("/auth/sync", response_model=schemas.UserResponse)
def auth_sync(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    """Finds an existing user (verifying their password) or provisions a new row."""
    user = db.query(models.User).filter(models.User.email == user_data.email).first()
    hashed = hash_password(user_data.password)

    if not user:
        user = models.User(
            full_name=user_data.full_name,
            email=user_data.email,
            hashed_password=hashed,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        if user.hashed_password != hashed:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )

    return user


class PasswordChangeRequest(BaseModel):
    email: str
    current_password: str
    new_password: str


@app.post("/auth/change-password", status_code=status.HTTP_200_OK)
def change_password(
    data: PasswordChangeRequest,
    x_user_id: int = Header(..., alias="X-User-Id"),
    db: Session = Depends(get_db),
):
    """Verifies current password then updates to the new one."""
    user = (
        db.query(models.User)
        .filter(models.User.id == x_user_id, models.User.email == data.email)
        .first()
    )
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.hashed_password != hash_password(data.current_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Current password is incorrect",
        )

    if len(data.new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="New password must be at least 6 characters",
        )

    user.hashed_password = hash_password(data.new_password)
    db.commit()
    return {"message": "Password updated successfully"}


@app.put("/users/me", response_model=schemas.UserResponse)
def update_user_preferences(
    data: schemas.UserPreferencesUpdate,
    x_user_id: int = Header(..., alias="X-User-Id"),
    db: Session = Depends(get_db),
):
    """Updates the current user's display name, accent color, and/or avatar."""
    user = db.query(models.User).filter(models.User.id == x_user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_fields = data.dict(exclude_unset=True)

    if "accent_color" in update_fields and update_fields["accent_color"] is not None:
        color = update_fields["accent_color"]
        if not (color.startswith("#") and len(color) in (4, 7)):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="accent_color must be a hex string like #4F46E5",
            )

    if "avatar_url" in update_fields and update_fields["avatar_url"] is not None:
        # Base64 data URLs can be large; keep a sane cap (~2MB encoded)
        if len(update_fields["avatar_url"]) > 2_750_000:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="Image is too large. Please choose a smaller picture.",
            )

    for key, value in update_fields.items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return user


# ── Tasks ────────────────────────────────────────────────────────────────────

@app.get("/tasks", response_model=List[schemas.TaskResponse])
def get_tasks(
    status: str = "All",
    search: Optional[str] = None,
    x_user_id: int = Header(..., alias="X-User-Id"),
    db: Session = Depends(get_db),
):
    query = db.query(models.Task).filter(models.Task.owner_id == x_user_id)

    if status == "Active":
        query = query.filter(models.Task.is_completed == False)
    elif status == "Inactive":
        query = query.filter(models.Task.is_completed == True)

    if search:
        query = query.filter(models.Task.title.ilike(f"%{search}%"))

    return query.all()


@app.post("/tasks", response_model=schemas.TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    task: schemas.TaskCreate,
    x_user_id: int = Header(..., alias="X-User-Id"),
    db: Session = Depends(get_db),
):
    new_task = models.Task(**task.dict(), owner_id=x_user_id)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task


@app.put("/tasks/{task_id}", response_model=schemas.TaskResponse)
def update_task(
    task_id: int,
    task_data: schemas.TaskUpdate,
    x_user_id: int = Header(..., alias="X-User-Id"),
    db: Session = Depends(get_db),
):
    task = (
        db.query(models.Task)
        .filter(models.Task.id == task_id, models.Task.owner_id == x_user_id)
        .first()
    )
    if not task:
        raise HTTPException(status_code=404, detail="Task missing or access permission denied")

    # Prevent editing a completed task (unless only toggling is_completed back)
    update_fields = task_data.dict(exclude_unset=True)
    toggling_only = set(update_fields.keys()) == {"is_completed"}
    if task.is_completed and not toggling_only:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot edit a completed task. Reopen it first.",
        )

    for key, value in update_fields.items():
        setattr(task, key, value)

    db.commit()
    db.refresh(task)
    return task


@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    x_user_id: int = Header(..., alias="X-User-Id"),
    db: Session = Depends(get_db),
):
    task = (
        db.query(models.Task)
        .filter(models.Task.id == task_id, models.Task.owner_id == x_user_id)
        .first()
    )
    if not task:
        raise HTTPException(status_code=404, detail="Task missing or access permission denied")

    db.delete(task)
    db.commit()
    return None