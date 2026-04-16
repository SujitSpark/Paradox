# agents/priority_scoring_agent/utils.py

from datetime import datetime
import pandas as pd

def parse_date(date_str):
    """Parse date string to datetime object."""
    if pd.isna(date_str) or not date_str:
        return None
    try:
        return datetime.strptime(str(date_str), "%Y-%m-%d")
    except ValueError:
        return None

def get_priority_band(score):
    """Determine priority band based on score."""
    if score >= 80:
        return "HIGH"
    elif score >= 50:
        return "MEDIUM"
    else:
        return "LOW"

def get_escalation_level(score):
    """
    Determine escalation level based on score.
    - Score >= 80 → 3 (URGENT)
    - Score >= 50 → 2 (MEDIUM)
    - Score < 50 → 1 (LOW)
    """
    if score >= 80:
        return 3
    elif score >= 50:
        return 2
    else:
        return 1

def calculate_urgency_boost(case_type):
    """
    Returns urgency boost based on case type.
    - "BAIL", "POCSO", "HABEAS CORPUS" → +35
    - "CRIMINAL", "KIDNAPPING" → +25
    - "FAMILY", "CHILD" → +20
    - Others → +0
    """
    if not case_type or pd.isna(case_type):
        return 0
    
    case_type_upper = str(case_type).upper()
    
    if any(kw in case_type_upper for kw in ["BAIL", "POCSO", "HABEAS CORPUS"]):
        return 35
    elif any(kw in case_type_upper for kw in ["CRIMINAL", "KIDNAPPING"]):
        return 25
    elif any(kw in case_type_upper for kw in ["FAMILY", "CHILD"]):
        return 20
    else:
        return 0
