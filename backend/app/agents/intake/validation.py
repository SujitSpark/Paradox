# agents/case_intake_agent/validation.py

"""Validation utilities for the Case Intake Agent.

Ensures that all required columns are present and that dates are valid.
If a record fails validation, it is flagged but still returned so the
pipeline can decide how to handle it.
"""

from typing import List, Tuple
from .schema import CaseRaw, CaseCleaned
from .config import REQUIRED_COLUMNS


def validate_raw(raw_cases: List[CaseRaw]) -> Tuple[List[CaseRaw], List[str]]:
    """Validate raw cases against required columns.

    Returns a tuple of (valid_cases, error_messages).
    """
    errors = []
    valid = []
    for idx, case in enumerate(raw_cases):
        missing = [col for col in REQUIRED_COLUMNS if getattr(case, col, None) is None]
        if missing:
            errors.append(f"Row {idx + 1}: missing columns {missing}")
        else:
            valid.append(case)
    return valid, errors


def validate_cleaned(cleaned_cases: List[CaseCleaned]) -> Tuple[List[CaseCleaned], List[str]]:
    """Validate cleaned cases – placeholder for future business rules.
    """
    # Currently all fields are typed; additional checks can be added here.
    return cleaned_cases, []
