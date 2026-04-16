from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import List, Optional
from enum import Enum

from ..models.models import UserRole


# --- Auth Schemas ---
class UserBase(BaseModel):
    username: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str
    role: UserRole

class UserLogin(BaseModel):
    username: str
    password: str

class UserRead(UserBase):
    user_id: int
    role: UserRole
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    full_name: str


# --- Case Schemas ---
class CaseBase(BaseModel):
    case_id: str
    case_number: str
    filing_date: datetime
    registration_date: Optional[datetime] = None
    last_hearing_date: Optional[datetime] = None
    next_hearing_date: Optional[datetime] = None
    
    case_type: str
    nature_of_case: Optional[str] = None
    status: str = "Pending"
    
    court_name: str
    court_name_level: Optional[str] = None
    district: str
    state: str
    
    petitioner_count: int = 1
    respondent_count: int = 1
    adjournments_count: int = 0

class CaseCreate(CaseBase):
    pass

class CaseRead(CaseBase):
    case_internal_id: int
    age_days: int
    last_adjournment_date: Optional[datetime] = None
    priority_score: float
    adj_risk_score: float
    risk_level: Optional[str] = None
    escalation_level: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    assigned_user_id: Optional[int] = None
    model_config = ConfigDict(from_attributes=True)

# --- Agent Simulation Schemas ---
class AnalysisResults(BaseModel):
    case_id: str
    priority_score: float
    risk_score: float
    memo_summary: str
    next_hearing_slot: str

class AgentLogRead(BaseModel):
    log_id: int
    agent_name: str
    action: str
    result_summary: str
    timestamp: datetime
    model_config = ConfigDict(from_attributes=True)

# --- Support Schemas ---
class AdjournmentRead(BaseModel):
    adj_id: int
    adj_date: datetime
    reason: str
    model_config = ConfigDict(from_attributes=True)

class HearingRead(BaseModel):
    hearing_id: int
    case_internal_id: int
    hearing_date: datetime
    slot_time: str
    status: str
    model_config = ConfigDict(from_attributes=True)

class EscalationBase(BaseModel):
    case_internal_id: int
    escalation_level: int
    reason: str

class EscalationCreate(EscalationBase):
    pass

class EscalationRead(EscalationBase):
    escalation_id: int
    escalated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class MemoRead(BaseModel):
    memo_id: int
    case_internal_id: int
    memo_text: str
    generated_at: datetime
    model_config = ConfigDict(from_attributes=True)

# --- Dashboard Schemas ---
class InsightItem(BaseModel):
    title: str
    detail: str
    type: str # warning, success, critical

class PreventionSuggestion(BaseModel):
    title: str
    detail: str
    icon: Optional[str] = "Lightbulb"

class DashboardInsights(BaseModel):
    insights: List[InsightItem]
    prevention_suggestions: List[PreventionSuggestion]
    top_critical_case: Optional[CaseRead] = None
