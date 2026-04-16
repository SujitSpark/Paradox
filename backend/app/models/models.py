from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text, Enum as SQLEnum, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..db.session import Base
import enum

class UserRole(str, enum.Enum):
    REGISTRAR = "registrar"
    JUDGE = "judge"

class User(Base):
    __tablename__ = "users"
    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    handled_cases = relationship("Case", back_populates="assigned_user", foreign_keys="Case.assigned_user_id")


class Case(Base):
    __tablename__ = "cases"
    case_internal_id = Column(Integer, primary_key=True, autoincrement=True)
    case_id = Column(String, unique=True, index=True, nullable=False)           # from CSV
    case_number = Column(String, nullable=False, index=True)

    # Dates from your CSV
    filing_date = Column(DateTime, nullable=False, index=True)
    registration_date = Column(DateTime, nullable=True)
    last_hearing_date = Column(DateTime, nullable=True)
    next_hearing_date = Column(DateTime, nullable=True)

    case_type = Column(String, nullable=False, index=True)
    nature_of_case = Column(String, nullable=True)
    status = Column(String, default="Pending", index=True)

    court_name = Column(String, nullable=False, index=True)           # e.g. "Fast Track Court"
    court_name_level = Column(String, nullable=True, index=True)      # e.g. "Labour Court"
    district = Column(String, nullable=False, index=True)
    state = Column(String, nullable=False, index=True)

    # Counts from CSV
    petitioner_count = Column(Integer, default=1)
    respondent_count = Column(Integer, default=1)
    adjournments_count = Column(Integer, default=0)

    # Computed / Agent-updated fields
    age_days = Column(Integer, default=0)
    last_adjournment_date = Column(DateTime, nullable=True)
    
    # Intelligence Metrics (ML & Rules)
    priority_score = Column(Float, default=0.0, index=True)
    priority_band = Column(String, nullable=True) # HIGH, MEDIUM, LOW
    adj_risk_score = Column(Float, default=0.0, index=True)
    risk_level = Column(String, nullable=True) # HIGH, MEDIUM, LOW
    escalation_level = Column(Integer, default=0, index=True)
    days_until_next_hearing = Column(Integer, default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    assigned_user_id = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    assigned_user = relationship("User", back_populates="handled_cases", foreign_keys=[assigned_user_id])

    adjournments = relationship("AdjournmentHistory", back_populates="case", cascade="all, delete-orphan")
    hearings = relationship("Hearing", back_populates="case", cascade="all, delete-orphan")
    escalations = relationship("Escalation", back_populates="case", cascade="all, delete-orphan")
    memos = relationship("Memo", back_populates="case", cascade="all, delete-orphan")

    # Performance indexes
    __table_args__ = (
        Index('ix_case_district_type_status', 'district', 'case_type', 'status'),
        Index('ix_case_priority_risk', 'priority_score', 'adj_risk_score'),
    )


class AdjournmentHistory(Base):
    __tablename__ = "adjournment_history"
    adj_id = Column(Integer, primary_key=True, index=True)
    case_internal_id = Column(Integer, ForeignKey("cases.case_internal_id", ondelete="CASCADE"))
    adj_date = Column(DateTime, nullable=False)
    reason = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    case = relationship("Case", back_populates="adjournments")


class Hearing(Base):
    __tablename__ = "hearings"
    hearing_id = Column(Integer, primary_key=True, index=True)
    case_internal_id = Column(Integer, ForeignKey("cases.case_internal_id", ondelete="CASCADE"))
    hearing_date = Column(DateTime, nullable=False)
    slot_time = Column(String, nullable=True)
    status = Column(String, default="Scheduled")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    case = relationship("Case", back_populates="hearings")


class Escalation(Base):
    __tablename__ = "escalations"
    escalation_id = Column(Integer, primary_key=True, index=True)
    case_internal_id = Column(Integer, ForeignKey("cases.case_internal_id", ondelete="CASCADE"))
    escalation_level = Column(Integer, default=1)
    reason = Column(Text)
    escalated_at = Column(DateTime(timezone=True), server_default=func.now())

    case = relationship("Case", back_populates="escalations")


class Memo(Base):
    __tablename__ = "memos"
    memo_id = Column(Integer, primary_key=True, index=True)
    case_internal_id = Column(Integer, ForeignKey("cases.case_internal_id", ondelete="CASCADE"))
    memo_text = Column(Text, nullable=False)
    generated_at = Column(DateTime(timezone=True), server_default=func.now())

    case = relationship("Case", back_populates="memos")


class AgentLog(Base):
    __tablename__ = "agent_logs"
    log_id = Column(Integer, primary_key=True, index=True)
    case_internal_id = Column(Integer, ForeignKey("cases.case_internal_id", ondelete="SET NULL"), nullable=True)
    agent_name = Column(String, nullable=False)
    action = Column(String, nullable=False)
    result_summary = Column(Text)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())


class DelayPattern(Base):
    __tablename__ = "delay_patterns"
    id = Column(Integer, primary_key=True, index=True)
    district = Column(String, nullable=False, index=True)
    case_type = Column(String, nullable=False, index=True)
    avg_adjournments = Column(Float, default=0.0)
    max_adjournments = Column(Integer, default=0)
    avg_age_days = Column(Float, default=0.0)
    analysis_date = Column(DateTime(timezone=True), server_default=func.now())
