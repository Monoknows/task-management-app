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

@app.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task: TaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

   
    update_data = task.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_task, key, value)
    
    db.commit()
    db.refresh(db_task)
    return db_task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(db_task)
    db.commit()
    return {"detail": "Task deleted successfully"}