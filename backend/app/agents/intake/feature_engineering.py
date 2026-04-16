# agents/case_intake_agent/feature_engineering.py

"""Feature engineering for the Case Intake Agent.

Generates derived fields used downstream:
- `case_age_days`: days between filing_date and today.
- `days_until_next_hearing`: days from today to next_hearing_date (negative if past).
- `is_bail_case`: boolean flag – true if `case_type` contains the word "BAIL" (case‑insensitive).
"""

from datetime import datetime, date
from typing import List
from .schema import CaseCleaned, CaseFeatures


def engineer_features(cleaned: CaseCleaned) -> CaseFeatures:
    """Create `CaseFeatures` from a cleaned case record.
    """
    today = date.today()
    
    # filing_date is datetime, convert to date
    filing = cleaned.filing_date.date()
    # last_hearing = cleaned.last_hearing_date.date()
    # next_hearing = cleaned.next_hearing_date.date()
    
    # User requested days_until using next_hearing_date - last_hearing_date
    delta_hearing = (cleaned.next_hearing_date.date() - cleaned.last_hearing_date.date()).days
    
    case_age = (today - filing).days

    return CaseFeatures(
        case_age_days=case_age,
        days_until_next_hearing=delta_hearing,
    )


def engineer_batch(cleaned_cases: List[CaseCleaned]) -> List[CaseFeatures]:
    """Batch process a list of cleaned cases.
    """
    return [engineer_features(c) for c in cleaned_cases]
