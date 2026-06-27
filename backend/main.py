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

# USER IDENTIFICATION / AUTH ROUTES 

@app.post("/auth/sync", response_model=schemas.UserResponse)
def auth_sync(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    """Finds an existing user or provisions a row in SQLite."""
    user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if not user:
        user = models.User(
            full_name=user_data.full_name,
            email=user_data.email,
            hashed_password=user_data.password
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user




@app.get("/tasks", response_model=List[schemas.TaskResponse])
def get_tasks(
    status: str = "All", 
    search: Optional[str] = None, 
    x_user_id: int = Header(..., alias="X-User-Id"), 
    db: Session = Depends(get_db)
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
    db: Session = Depends(get_db)
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
    db: Session = Depends(get_db)
):
    task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.owner_id == x_user_id).first()
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
    db: Session = Depends(get_db)
):
    task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.owner_id == x_user_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task missing or access permission denied")
        
    db.delete(task)
    db.commit()
    return None