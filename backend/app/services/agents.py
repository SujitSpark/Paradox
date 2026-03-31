import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from ..models import models

class AgentSimulationService:
    @staticmethod
    def run_priority_scoring(case: models.Case, db: Session):
        """Simulates the Priority Agent's scoring logic."""
        # Baseline score from age
        base_score = min(case.age_days / 365 * 20, 40) 
        
        # Modifier for case nature
        nature_map = {
            "Writ": 30,
            "Criminal": 25,
            "Family": 15,
            "Civil": 10,
            "Labour": 20
        }
        nature_score = nature_map.get(case.case_type, 10)
        
        # Modifier for adjournments
        adj_score = min(case.adjournments_count * 5, 25)
        
        total_score = min(base_score + nature_score + adj_score + random.uniform(0, 10), 100)
        case.priority_score = round(total_score, 2)
        
        # Log action
        AgentSimulationService._log_action(
            db, case.case_internal_id, "Priority Agent", "Score Calculation", 
            f"Calculated priority score of {case.priority_score} based on age ({case.age_days} days) and type ({case.case_type})."
        )
        return case.priority_score

    @staticmethod
    def run_risk_assessment(case: models.Case, db: Session):
        """Simulates the Risk Agent's assessment logic."""
        # Risk increases with high adjournment counts and low movement
        risk_score = min((case.adjournments_count * 15) + (case.age_days / 200), 100)
        case.adj_risk_score = round(risk_score, 2)
        
        AgentSimulationService._log_action(
            db, case.case_internal_id, "Risk Agent", "Risk Assessment", 
            f"Adjournment risk assessed at {case.adj_risk_score}%. High frequency of past delays detected."
        )
        return case.adj_risk_score

    @staticmethod
    def generate_judicial_memo(case: models.Case, db: Session):
        """Simulates the Memo Agent's drafting logic."""
        memo_text = f"""
JUDICIAL MEMORANDUM - {case.case_id}
Nature: {case.nature_of_case} ({case.case_type})
Priority Score: {case.priority_score} | Risk: {case.adj_risk_score}%

FINDINGS:
1. This case has been pending for {case.age_days} days in {case.district}.
2. Current adjournment count stands at {case.adjournments_count}, which exceeds regional averages.
3. The Priority Agent recommends immediate hearing due to the sensitive nature of the matter.

RECOMMENDATION:
- Move to 'Fast Track' status.
- Schedule final hearing within the current judicial quarter.
        """
        new_memo = models.Memo(case_internal_id=case.case_internal_id, memo_text=memo_text.strip())
        db.add(new_memo)
        
        AgentSimulationService._log_action(
            db, case.case_internal_id, "Memo Agent", "Memo Generation", 
            "Drafted comprehensive judicial memorandum for chamber review."
        )
        return new_memo

    @staticmethod
    def _log_action(db: Session, case_id: int, agent: str, action: str, summary: str):
        log = models.AgentLog(
            case_internal_id=case_id,
            agent_name=agent,
            action=action,
            result_summary=summary
        )
        db.add(log)
        db.commit()
