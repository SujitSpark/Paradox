# backend/app/agents/intake_sync.py
from sqlalchemy.orm import Session
from ..models.models import Case
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

def sync_intake_to_postgres(db: Session, intake_results: list):
    """
    Takes the output of the Case Intake Agent (which may have saved to SQLite)
    and ensures it is persisted in our main PostgreSQL database.
    """
    synced_count = 0
    for res in intake_results:
        # res maps to the keys in agents/case_intake_agent/schema.py
        case_info = res.get("case_info", {})
        court_info = res.get("court", {})
        features = res.get("features", {})
        
        # Check if exists
        db_case = db.query(Case).filter(Case.case_id == str(res.get("case_id"))).first()
        
        if not db_case:
            db_case = Case(
                case_id=str(res.get("case_id")),
                case_number=case_info.get("case_number"),
                case_type=case_info.get("case_type"),
                nature_of_case=case_info.get("nature_of_case"),
                status=case_info.get("status", "Pending"),
                district=court_info.get("district"),
                state=court_info.get("state"),
                court_name=court_info.get("court_name_level", "Unknown"),
                court_name_level=court_info.get("court_name_level"),
                filing_date=datetime.strptime(case_info.get("filing_date"), "%Y-%m-%d") if case_info.get("filing_date") else None,
                registration_date=datetime.strptime(case_info.get("registration_date"), "%Y-%m-%d") if case_info.get("registration_date") else None,
                last_hearing_date=datetime.strptime(case_info.get("last_hearing_date"), "%Y-%m-%d") if case_info.get("last_hearing_date") else None,
                next_hearing_date=datetime.strptime(case_info.get("next_hearing_date"), "%Y-%m-%d") if case_info.get("next_hearing_date") else None,
                adjournments_count=case_info.get("adjournments_count", 0),
                petitioner_count=case_info.get("petitioner_count", 1),
                respondent_count=case_info.get("respondent_count", 1),
                age_days=features.get("case_age_days", 0),
                days_until_next_hearing=features.get("days_until_next_hearing", 0)
            )
            db.add(db_case)
            synced_count += 1
            
    db.commit()
    logger.info(f"Synced {synced_count} new cases to PostgreSQL.")
    return synced_count
