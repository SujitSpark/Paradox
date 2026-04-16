# agents/case_intake_agent/schema.py

"""Pydantic models for the Case Intake Agent.

- `CaseRaw` represents the raw CSV row.
- `CaseCleaned` represents the cleaned and validated data.
- `CaseFeatures` holds engineered features.
- `CaseOutput` is the final JSON structure returned by the agent.
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any
from datetime import datetime

class CaseRaw(BaseModel):
    case_id: str
    case_number: str
    filing_date: str
    registration_date: str
    last_hearing_date: str
    next_hearing_date: str
    case_type: str
    nature_of_case: str
    status: str
    adjournments_count: Optional[int]
    petitioner_count: Optional[int]
    respondent_count: Optional[int]
    court_name_level: str
    district: str
    state: str

    @validator("adjournments_count", "petitioner_count", "respondent_count", pre=True, always=True)
    def parse_int(cls, v):
        if v is None or v == "":
            return None
        try:
            return int(v)
        except ValueError:
            return None

class CaseCleaned(BaseModel):
    case_id: str
    case_number: str
    filing_date: datetime
    registration_date: datetime
    last_hearing_date: datetime
    next_hearing_date: datetime
    case_type: str
    nature_of_case: str
    status: str
    adjournments_count: int = Field(default=0)
    petitioner_count: int = Field(default=0)
    respondent_count: int = Field(default=0)
    court_name_level: str
    district: str
    state: str

    @validator(
        "filing_date",
        "registration_date",
        "last_hearing_date",
        "next_hearing_date",
        pre=True,
    )
    def parse_date(cls, v):
        if isinstance(v, datetime):
            return v
        from dateutil import parser
        try:
            return parser.parse(v)
        except Exception:
            raise ValueError(f"Invalid date format: {v}")

class CaseFeatures(BaseModel):
    case_age_days: int
    days_until_next_hearing: int

class CaseOutput(BaseModel):
    case_id: str
    cleaned: bool = True
    court: Dict[str, Any]
    case_info: Dict[str, Any]
    features: Dict[str, Any]
    flags: Dict[str, Any] = {}
