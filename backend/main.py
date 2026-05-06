from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Header, Depends
from database import engine, Base, SessionLocal
import models
import json
from models import Task, User
from auth import create_token, verify_token
from ai import extract_tasks

app = FastAPI()

# Create tables
Base.metadata.create_all(bind=engine)


# -----------------------
# HOME
# -----------------------
@app.get("/")
def home():
    return {"message": "UdyojaneyAI backend running 🚀"}


# -----------------------
# SEED USERS
# -----------------------
@app.get("/seed-users")
def seed_users():
    db = SessionLocal()

    users = [
        User(username="responder1", password="123", role="responder"),
        User(username="petitioner1", password="123", role="petitioner"),
        User(username="verifier1", password="123", role="verifier"),
    ]

    for u in users:
        existing = db.query(User).filter(User.username == u.username).first()
        if not existing:
            db.add(u)

    db.commit()
    db.close()

    return {"message": "users created"}


# -----------------------
# LOGIN
# -----------------------
@app.post("/login")
def login(username: str, password: str):
    db = SessionLocal()

    user = db.query(User).filter(User.username == username).first()

    if not user or user.password != password:
        return {"error": "Invalid credentials"}

    token = create_token({
        "username": user.username,
        "role": user.role
    })

    db.close()

    return {"token": token, "role": user.role}


# -----------------------
# AUTH HELPER
# -----------------------
def get_current_user(token: str = Header(...)):
    payload = verify_token(token)

    if not payload:
        return {"error": "Invalid token"}

    return payload


# -----------------------
# PROCESS TEXT → AI → SAVE TASKS
# -----------------------
@app.post("/process-text")
def process_text(text: str):
    db = SessionLocal()

    ai_result = extract_tasks(text)

    # Clean AI output
    cleaned = ai_result.strip()

    if cleaned.startswith("```"):
        cleaned = cleaned.replace("```json", "").replace("```", "").strip()

    try:
        tasks = json.loads(cleaned)
    except:
        db.close()
        return {"error": "AI output not valid JSON", "raw": ai_result}

    saved_tasks = []

    for t in tasks:
        task = Task(
            title=t.get("title"),
            description=t.get("description"),
            deadline=t.get("deadline"),
            status="pending"
        )
        db.add(task)
        saved_tasks.append(t)

    db.commit()
    db.close()

    return {
        "message": "tasks saved",
        "tasks": saved_tasks
    }


# -----------------------
# GET ALL TASKS (GENERAL)
# -----------------------
@app.get("/tasks")
def get_tasks():
    db = SessionLocal()
    tasks = db.query(Task).all()

    result = []
    for t in tasks:
        result.append({
            "id": t.id,
            "title": t.title,
            "description": t.description,
            "deadline": t.deadline,
            "status": t.status
        })

    db.close()
    return result


# -----------------------
# VERIFIER: GET PENDING
# -----------------------
@app.get("/tasks/pending")
def get_pending_tasks(user=Depends(get_current_user)):
    if user["role"] != "verifier":
        return {"error": "Not authorized"}

    db = SessionLocal()
    tasks = db.query(Task).filter(Task.status == "pending").all()

    result = []
    for t in tasks:
        result.append({
            "id": t.id,
            "title": t.title,
            "description": t.description,
            "deadline": t.deadline
        })

    db.close()
    return result


# -----------------------
# VERIFIER: APPROVE
# -----------------------
@app.post("/tasks/{task_id}/approve")
def approve_task(task_id: int, user=Depends(get_current_user)):
    if user["role"] != "verifier":
        return {"error": "Not authorized"}

    db = SessionLocal()
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        return {"error": "Task not found"}

    task.status = "approved"
    db.commit()
    db.close()

    return {"message": "Task approved"}


# -----------------------
# VERIFIER: REJECT
# -----------------------
@app.post("/tasks/{task_id}/reject")
def reject_task(task_id: int, user=Depends(get_current_user)):
    if user["role"] != "verifier":
        return {"error": "Not authorized"}

    db = SessionLocal()
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        return {"error": "Task not found"}

    task.status = "rejected"
    db.commit()
    db.close()

    return {"message": "Task rejected"}


# -----------------------
# RESPONDER: VIEW APPROVED
# -----------------------
@app.get("/tasks/approved")
def get_approved_tasks(user=Depends(get_current_user)):
    if user["role"] != "responder":
        return {"error": "Not authorized"}

    db = SessionLocal()
    tasks = db.query(Task).filter(Task.status == "approved").all()

    result = []
    for t in tasks:
        result.append({
            "id": t.id,
            "title": t.title,
            "description": t.description,
            "deadline": t.deadline,
            "status": t.status
        })

    db.close()
    return result


# -----------------------
# RESPONDER: COMPLETE TASK
# -----------------------
@app.post("/tasks/{task_id}/complete")
def complete_task(task_id: int, user=Depends(get_current_user)):
    if user["role"] != "responder":
        return {"error": "Not authorized"}

    db = SessionLocal()
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        return {"error": "Task not found"}

    task.status = "completed"
    db.commit()
    db.close()

    return {"message": "Task marked as completed"}


# -----------------------
# PETITIONER: VIEW ALL STATUS
# -----------------------
@app.get("/tasks/all-status")
def get_all_status(user=Depends(get_current_user)):
    if user["role"] != "petitioner":
        return {"error": "Not authorized"}

    db = SessionLocal()
    tasks = db.query(Task).all()

    result = []
    for t in tasks:
        result.append({
            "id": t.id,
            "title": t.title,
            "status": t.status,
            "deadline": t.deadline
        })

    db.close()
    return result

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)