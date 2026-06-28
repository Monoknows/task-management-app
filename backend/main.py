import hashlib

from fastapi import FastAPI, Depends, HTTPException, Header, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

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


# USER IDENTIFICATION / AUTH ROUTES

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
        # Existing account — the password MUST match, otherwise anyone could
        # log in to anyone else's account just by knowing their email.
        if user.hashed_password != hashed:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )

    return user


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

    for key, value in task_data.dict(exclude_unset=True).items():
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