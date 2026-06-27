from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import models, schemas
from database import engine, get_db

models.base.metadata.create_all(bind=engine)

app = FastAPI(title="Task Management API", description="API for managing tasks")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# User identification and auth routes
@app.post("/auth/sync", response_model=schemas.UserResponse)
def auth_sync(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if not user_data:
        user =models.User(     
            full_name=user_data.full_name,
            email=user_data.email,
            hashed_password=user_data.password  
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    return new_user

@app.get("/tasks", response_model=List[TaskResponse])
def get_tasks(
    status: str = "All",
    search: Optional[str] = None,
    x_user_id: int = Query(..., alias="X-User-ID"),
    db: Session = Depends(get_db)
):
    query = db.query(models.Task).filter(models.Task.owner_id == x_user_id)

    if search:
        query = query.filter(models.Task.title.ilike(f"%{search}%"))
    
    if status.lower() == "active":
        query = query.filter(models.Task.is_completed == False)
    elif status.lower() == "inactive":
        query = query.filter(models.Task.is_completed == True)

    return query.all()

@app.post("/tasks", response_model=schemas.TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    task: schemas.TaskCreate,
    x_user_id: int = Header(..., alias="X-User-ID"),
    db: Session = Depends(get_db)
):
    new_task =models.Task(***task.dict(), owner_id=x_user_id)
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