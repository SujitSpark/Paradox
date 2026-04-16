# agents/ml_risk_prediction_agent/rule_engine.py

import pandas as pd
from .config import TYPE_RISK_MAP

def calculate_rule_risk(df: pd.DataFrame) -> pd.Series:
    """Implement rule-based risk calculation."""
    # 1. Map type_risk values
    # Function to get risk for a single case type
    def get_type_risk(row):
        for keyword, risk_val in TYPE_RISK_MAP.items():
            if keyword in str(row["case_type"]).upper():
                return risk_val
        return 0

    type_risk = df.apply(get_type_risk, axis=1)

    # 2. Formula: min(95, (adjournments_count * 12) + (age_days / 30) + type_risk)
    adjournments_count = df["adjournments_count"].fillna(0)
    age_days = df["age_days"].fillna(0)
    
    rule_risk = (adjournments_count * 12) + (age_days / 30) + type_risk
    
    # Clip to max 95 as per requirements
    return rule_risk.clip(upper=95)
