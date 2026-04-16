# backend/app/core/supervisor.py
from langgraph.graph import StateGraph, END
from typing import TypedDict, Dict, Optional, List
from sqlalchemy.orm import Session
import logging

# Import all agent nodes
from ..agents.agent_nodes import intake_node, priority_risk_node, delay_analysis_node, scheduler_node
from ..agents.memo_agent import memo_node
from ..models.models import AgentLog

logger = logging.getLogger(__name__)

class JudicAIState(TypedDict):
    file_path: Optional[str]           # for batch upload
    case_id: Optional[str]             # for single case
    cases: List[Dict]
    priority_scores: Dict
    risk_scores: Dict
    delay_patterns: Dict
    schedule: List[Dict]
    memos: Dict
    final_output: Dict
    db_session: Session


def supervisor_router(state: JudicAIState) -> str:
    """This is the brain - decides which agent runs next"""
    
    # 1. First step: Start with Intake if no cases
    if not state.get("cases"):
        return "intake_agent"

    # 2. Priority + Risk (combined node)
    if not state.get("priority_scores") or not state.get("risk_scores"):
        return "priority_risk"

    # 3. Delay Pattern Analysis (only for batch > 5 cases)
    if not state.get("delay_patterns") and len(state.get("cases", [])) > 5:
        return "delay_analysis"

    # 4. Scheduler - only if there are high priority cases
    high_priority = sum(1 for v in state.get("priority_scores", {}).values() if v > 60)
    if high_priority > 0 and not state.get("schedule"):
        return "scheduler_agent"

    # 5. Memo Agent - always last for critical cases
    if not state.get("memos"):
        return "memo_agent"

    # Final step
    return "finalize"


def finalize_node(state: JudicAIState):
    """Final step - prepare output and log"""
    summary = f"Orchestration completed. Memos: {state.get('memos', {}).get('count', 0)}"
    
    log = AgentLog(
        agent_name="SupervisorAgent",
        action="orchestration_complete",
        result_summary=summary
    )
    state["db_session"].add(log)
    state["db_session"].commit()

    state["final_output"] = {
        "status": "success",
        "memos_generated": state.get("memos", {}).get("count", 0),
        "high_priority_cases": len([v for v in state.get("priority_scores", {}).values() if v > 70])
    }
    return state


# Build the LangGraph workflow
def create_judicai_supervisor():
    workflow = StateGraph(JudicAIState)

    # Add nodes
    workflow.add_node("intake_agent", intake_node)
    workflow.add_node("priority_risk", priority_risk_node)
    workflow.add_node("delay_analysis", delay_analysis_node)
    workflow.add_node("scheduler_agent", scheduler_node)
    workflow.add_node("memo_agent", memo_node)
    workflow.add_node("finalize", finalize_node)

    # Entry point
    workflow.set_entry_point("intake_agent")

    # Conditional routing using Supervisor logic
    workflow.add_conditional_edges("intake_agent", supervisor_router, {
        "intake_agent": "intake_agent",
        "priority_risk": "priority_risk",
        "delay_analysis": "delay_analysis",
        "scheduler_agent": "scheduler_agent",
        "memo_agent": "memo_agent",
        "finalize": "finalize"
    })
    workflow.add_conditional_edges("priority_risk", supervisor_router, {
        "priority_risk": "priority_risk",
        "delay_analysis": "delay_analysis",
        "scheduler_agent": "scheduler_agent",
        "memo_agent": "memo_agent",
        "finalize": "finalize"
    })
    workflow.add_conditional_edges("delay_analysis", supervisor_router, {
        "delay_analysis": "delay_analysis",
        "scheduler_agent": "scheduler_agent",
        "memo_agent": "memo_agent",
        "finalize": "finalize"
    })
    workflow.add_conditional_edges("scheduler_agent", supervisor_router, {
        "scheduler_agent": "scheduler_agent",
        "memo_agent": "memo_agent",
        "finalize": "finalize"
    })
    workflow.add_conditional_edges("memo_agent", supervisor_router, {
        "memo_agent": "memo_agent",
        "finalize": "finalize"
    })

    workflow.add_edge("finalize", END)

    return workflow.compile()
