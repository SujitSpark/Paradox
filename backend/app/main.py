from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import datetime, timedelta
import random

from .db.session import engine, Base, get_db
from .models import models
from .schemas import schemas
from .core import security
from .services.agents import AgentSimulationService

# Initialize Database
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Paradox (JudicAI) Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Authentication Routes ---

@app.post("/auth/register", response_model=schemas.UserRead)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_pass = security.get_password_hash(user.password)
    new_user = models.User(
        username=user.username,
        full_name=user.full_name,
        hashed_password=hashed_pass,
        role=user.role # This will now be a UserRole enum
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/auth/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if not db_user or not security.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = security.create_access_token(data={"sub": db_user.username, "role": db_user.role})
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "role": db_user.role, 
        "full_name": db_user.full_name or db_user.username
    }


# --- Case Management Routes ---

@app.get("/cases", response_model=List[schemas.CaseRead])
def get_cases(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Case).offset(skip).limit(limit).all()

@app.get("/cases/{case_id}", response_model=schemas.CaseRead)
def get_case(case_id: str, db: Session = Depends(get_db)):
    db_case = db.query(models.Case).filter(models.Case.case_id == case_id).first()
    if not db_case:
        raise HTTPException(status_code=404, detail="Case not found")
    return db_case

@app.post("/cases", response_model=schemas.CaseRead)
def create_case(case: schemas.CaseCreate, db: Session = Depends(get_db)):
    db_case = models.Case(**case.model_dump())
    # Calculate age_days
    delta = datetime.now() - case.filing_date
    db_case.age_days = delta.days
    
    db.add(db_case)
    db.commit()
    db.refresh(db_case)
    return db_case


# --- Agent Orchestration ---

@app.post("/agents/run-full-analysis/{case_internal_id}", response_model=schemas.AnalysisResults)
def run_full_analysis(case_internal_id: int, db: Session = Depends(get_db)):
    db_case = db.query(models.Case).filter(models.Case.case_internal_id == case_internal_id).first()
    if not db_case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    # 1. Pipeline Execution
    priority = AgentSimulationService.run_priority_scoring(db_case, db)
    risk = AgentSimulationService.run_risk_assessment(db_case, db)
    memo = AgentSimulationService.generate_judicial_memo(db_case, db)
    
    # 2. Mock Scheduling
    slot = "Morning - 10:30 AM"
    hearing_date = datetime.now() + timedelta(days=random.randint(7, 30))
    new_hearing = models.Hearing(
        case_internal_id=db_case.case_internal_id,
        hearing_date=hearing_date,
        slot_time=slot,
        status="Scheduled"
    )
    db.add(new_hearing)
    db.commit()
    
    return {
        "case_id": db_case.case_id,
        "priority_score": priority,
        "risk_score": risk,
        "memo_summary": memo.memo_text[:100] + "...",
        "next_hearing_slot": f"{hearing_date.date()} at {slot}"
    }

# --- Support Routes ---

@app.get("/memos", response_model=List[schemas.MemoRead])
def get_memos(db: Session = Depends(get_db)):
    return db.query(models.Memo).all()

@app.get("/dashboard/kpis")
def get_kpis(db: Session = Depends(get_db)):
    total = db.query(models.Case).count()
    high_risk = db.query(models.Case).filter(models.Case.adj_risk_score > 70).count()
    avg_priority = db.query(func.avg(models.Case.priority_score)).scalar() or 0.0
    memos_ready = db.query(models.Memo).count()
    
    return {
        "total_cases": total,
        "high_risk_cases": high_risk,
        "avg_priority": round(avg_priority, 2),
        "memos_ready": memos_ready
    }

import random
from sqlalchemy import func
