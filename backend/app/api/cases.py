from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import os

from ..db.session import get_db
from ..models import models
from ..schemas import schemas
from ..services.agents import AgentSimulationService
from .deps import get_current_user
from ..core.supervisor import create_judicai_supervisor
from ..agents.intake_sync import sync_intake_to_postgres

router = APIRouter(prefix="/cases", tags=["Case Management"])
judicai_supervisor = create_judicai_supervisor()

@router.get("", response_model=List[schemas.CaseRead])
def get_cases(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    query = db.query(models.Case)
    if current_user.role == models.UserRole.JUDGE:
        query = query.filter(models.Case.assigned_user_id == current_user.user_id)
    return query.offset(skip).limit(limit).all()

@router.get("/{case_id}", response_model=schemas.CaseRead)
def get_case(case_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_case = db.query(models.Case).filter(models.Case.case_id == case_id).first()
    if not db_case:
        raise HTTPException(status_code=404, detail="Case not found")
    return db_case

@router.post("", response_model=schemas.CaseRead)
def create_case(case: schemas.CaseCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_case = models.Case(**case.dict())
    delta = datetime.now() - case.filing_date
    db_case.age_days = delta.days
    db.add(db_case)
    db.commit()
    db.refresh(db_case)
    return db_case

@router.post("/upload")
async def upload_cases(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Orchestrates intake through Case Intake Agent and syncs to PostgreSQL."""
    try:
        content = await file.read()
        file_path = f"tmp_{file.filename}"
        with open(file_path, "wb") as f:
            f.write(content)
            
        initial_state = AgentSimulationService.get_initial_state(db, file_path=file_path)
        result = judicai_supervisor.invoke(initial_state)
        
        if result.get("cases"):
            sync_intake_to_postgres(db, result["cases"])
            
        os.remove(file_path)
        return {"status": "success", "detail": "Batch uploaded and synced to PostgreSQL"}
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Upload Error: {str(e)}")

@router.post("/run-full-analysis")
def run_full_analysis(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Invokes the LangGraph Supervisor to orchestrate the full judicial pipeline."""
    initial_state = AgentSimulationService.get_initial_state(db)
    try:
        result = judicai_supervisor.invoke(initial_state)
        return result.get("final_output", {"status": "error", "detail": "Orchestration failed"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline Error: {str(e)}")

# --- Support Routes ---

@router.get("/support/memos", response_model=List[schemas.MemoRead])
def get_memos(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    query = db.query(models.Memo)
    if current_user.role == models.UserRole.JUDGE:
        query = query.join(models.Case).filter(models.Case.assigned_user_id == current_user.user_id)
    return query.all()

@router.get("/support/hearings", response_model=List[schemas.HearingRead])
def get_hearings(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    query = db.query(models.Hearing)
    if current_user.role == models.UserRole.JUDGE:
        query = query.join(models.Case).filter(models.Case.assigned_user_id == current_user.user_id)
    return query.all()

@router.post("/support/escalations", response_model=schemas.EscalationRead)
def create_escalation(esc: schemas.EscalationCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    new_esc = models.Escalation(**esc.dict())
    db.add(new_esc)
    db_case = db.query(models.Case).filter(models.Case.case_internal_id == esc.case_internal_id).first()
    if db_case:
        db_case.escalation_level = esc.escalation_level
    db.commit()
    db.refresh(new_esc)
    return new_esc
