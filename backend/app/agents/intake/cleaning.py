# agents/case_intake_agent/cleaning.py

"""Cleaning utilities for the Case Intake Agent.

- Trim whitespace from all string fields.
- Upper‑case fields that are typically case‑insensitive (e.g., case_type, status).
- Ensure numeric fields are proper ints (handled in schema but we double‑check).
"""

from typing import List
from .schema import CaseRaw, CaseCleaned
from datetime import datetime


def clean_case(raw: CaseRaw) -> CaseCleaned:
    """Convert a `CaseRaw` instance into a cleaned `CaseCleaned`.
    """
    # Helper to strip and upper‑case strings safely
    def clean_str(value: str) -> str:
        return value.strip() if isinstance(value, str) else value

    # Upper‑case for selected fields
    def upper_str(value: str) -> str:
        return value.strip().upper() if isinstance(value, str) else value

    return CaseCleaned(
        case_id=clean_str(raw.case_id),
        case_number=clean_str(raw.case_number),
        filing_date=clean_str(raw.filing_date),
        registration_date=clean_str(raw.registration_date),
        last_hearing_date=clean_str(raw.last_hearing_date),
        next_hearing_date=clean_str(raw.next_hearing_date),
        case_type=upper_str(raw.case_type),
        nature_of_case=clean_str(raw.nature_of_case),
        status=upper_str(raw.status),
        adjournments_count=raw.adjournments_count or 0,
        petitioner_count=raw.petitioner_count or 0,
        respondent_count=raw.respondent_count or 0,
        court_name_level=clean_str(raw.court_name_level),
        district=clean_str(raw.district),
        state=clean_str(raw.state),
    )


def clean_cases(raw_cases: List[CaseRaw]) -> List[CaseCleaned]:
    """Batch clean a list of `CaseRaw` objects.
    """
    return [clean_case(rc) for rc in raw_cases]
