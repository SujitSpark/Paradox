from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from ..db.session import get_db
from ..models import models
from ..schemas import schemas
from .deps import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard Intelligence"])

@router.get("/kpis")
def get_kpis(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    total = db.query(models.Case).count()
    high_risk = db.query(models.Case).filter(models.Case.adj_risk_score >= 80).count()
    avg_priority = db.query(func.avg(models.Case.priority_score)).scalar() or 0.0
    memos_ready = db.query(models.Memo).count()
    
    return {
        "total_cases": total,
        "high_risk_cases": high_risk,
        "avg_priority": round(avg_priority, 2),
        "memos_ready": memos_ready,
        "trends": {
            "total": "+2.4%",
            "risk": "Requires Action",
            "priority": "Stable",
            "memos": "Optimal"
        }
    }

@router.get("/insights", response_model=schemas.DashboardInsights)
def get_dashboard_insights(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # 1. Fetch Top Critical Case
    top_case = db.query(models.Case).order_by(models.Case.adj_risk_score.desc(), models.Case.priority_score.desc()).first()
    
    # 2. Generate Dynamic Insights
    insights = []
    
    # Insight A: Adjournment Anomaly
    high_adj_count = db.query(models.Case).filter(models.Case.adjournments_count > 30).count()
    if high_adj_count > 0:
        insights.append({
            "title": "Adjournment Surge",
            "detail": f"{high_adj_count} cases have exceeded 30 adjournments, primarily in Criminal Appeals.",
            "type": "critical"
        })
        
    # Insight B: Case Type Concentration
    most_common_type = db.query(models.Case.case_type, func.count(models.Case.case_type)).group_by(models.Case.case_type).order_by(func.count(models.Case.case_type).desc()).first()
    if most_common_type:
        insights.append({
            "title": "Type Concentration",
            "detail": f"{most_common_type[0]} represents {most_common_type[1]} cases in active registry.",
            "type": "warning"
        })
        
    # Insight C: Efficiency
    memos = db.query(models.Memo).count()
    if memos > 10:
        insights.append({
            "title": "Efficiency Gain",
            "detail": "Automated memo generation has covered a significant portion of the priority queue.",
            "type": "success"
        })

    # 3. Prevention Suggestions
    suggestions = [
        {
            "title": "Consolidate Similar Petitions",
            "detail": "Identify cases sharing same legal precedent. Suggest bulk disposal.",
            "icon": "Layers"
        },
        {
            "title": "Prioritize Older Filings",
            "detail": "Cases exceeding 10 years should be moved to 'Fast Track' status immediately.",
            "icon": "Clock"
        },
        {
            "title": "Mediation Opportunity",
            "detail": "Civil disputes show high potential for pre-trial settlement.",
            "icon": "Users"
        }
    ]
    
    return {
        "insights": insights[:3],
        "prevention_suggestions": suggestions,
        "top_critical_case": top_case
    }

@router.get("/logs", response_model=List[schemas.AgentLogRead])
def get_agent_logs(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.AgentLog).order_by(models.AgentLog.timestamp.desc()).all()
