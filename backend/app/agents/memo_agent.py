# backend/app/agents/memo_agent.py
from langchain_ollama import ChatOllama
from sqlalchemy.orm import Session
from ..models.models import Case, Memo, AgentLog
from typing import Dict
import logging

logger = logging.getLogger(__name__)

# Initialize LLM
try:
    llm = ChatOllama(model="gemma3:12b", temperature=0.3)
except Exception as e:
    logger.warning("Could not initialize LLM for Memo Agent. Fallingback to template logic.")
    llm = None

def memo_node(state: Dict):
    """
    Generates formal judicial memos ONLY for high-priority or high-risk cases.
    """
    db: Session = state["db_session"]
    
    # Filter critical cases only (to avoid generating too many memos)
    critical_cases = db.query(Case).filter(
        (Case.priority_score > 65) | (Case.adj_risk_score > 65)
    ).all()

    memos_created = 0

    for case in critical_cases:
        # Check if memo already exists
        existing = db.query(Memo).filter(Memo.case_internal_id == case.case_internal_id).first()
        if existing:
            continue

        prompt = f"""
You are an experienced judicial assistant in Indian District/High Courts.
Write a short, formal, polite and professional memo (maximum 120-150 words) addressed to the Judge.

Case Details:
- Case Number     : {case.case_number}
- Case Type       : {case.case_type}
- Nature          : {case.nature_of_case or 'Not specified'}
- Age of Case     : {case.age_days} days
- Adjournments    : {case.adjournments_count}
- Priority Score  : {case.priority_score:.1f}/100
- Delay Risk      : {case.adj_risk_score:.1f}%
- Court           : {case.court_name} ({case.district}, {case.state})

Purpose: Recommend urgent listing/hearing with clear reasons.

Use formal court language. Do not use bullet points. End with: "Recommended for early hearing."

Write only the memo body.
"""

        try:
            # Check if LLM is initialized and reachable
            if not llm:
                raise Exception("LLM not initialized")
            
            response = llm.invoke(prompt)
            memo_text = response.content.strip()
        except Exception as e:
            logger.warning(f"Ollama/LLM Error for case {case.case_number}: {e}. Using fallback template.")
            # Fallback memo if LLM fails or is unavailable
            memo_text = f"Urgent Memo: Case {case.case_number} ({case.case_type}) is {case.age_days} days old with {case.adjournments_count} adjournments. Priority score: {case.priority_score:.1f}. High risk of further delay identified by JudicAI engines. Recommended for early listing and priority hearing."

            # Save memo to database
            memo = Memo(
                case_internal_id=case.case_internal_id,
                memo_text=memo_text
            )
            db.add(memo)
            memos_created += 1

        except Exception as e:
            # Fallback memo if LLM fails
            fallback_text = f"Urgent Memo: Case {case.case_number} ({case.case_type}) is {case.age_days} days old with {case.adjournments_count} adjournments. Priority: {case.priority_score:.1f}. High risk of further delay. Recommended for early listing."
            memo = Memo(case_internal_id=case.case_internal_id, memo_text=fallback_text)
            db.add(memo)
            memos_created += 1

    db.commit()

    # Log the action
    log = AgentLog(
        case_internal_id=None,   # system level log
        agent_name="JudicialMemoAgent",
        action="generate_memos",
        result_summary=f"Generated {memos_created} memos for critical cases"
    )
    db.add(log)
    db.commit()

    state["memos"] = {"count": memos_created, "status": "completed"}
    return state
