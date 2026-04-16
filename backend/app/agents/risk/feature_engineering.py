# agents/ml_risk_prediction_agent/feature_engineering.py

import pandas as pd
from .config import TODAY

def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Preprocess data and engineer features for ML and rule-based models."""
    
    # Calculate days since filing
    df["age_days"] = (pd.to_datetime(TODAY) - df["filing_date"]).dt.days.fillna(0)
    
    # Calculate days since last hearing
    df["days_since_last_hearing"] = (pd.to_datetime(TODAY) - df["last_hearing_date"]).dt.days.fillna(0)
    
    # Calculate case complexity
    df["case_complexity"] = (df["petitioner_count"] + df["respondent_count"]).fillna(0)
    
    # Handle missing values for other numeric columns
    numeric_cols = ["adjournments_count", "priority_score", "escalation_level"]
    for col in numeric_cols:
        df[col] = df[col].fillna(0)
        
    return df

def encode_categoricals(df: pd.DataFrame, categorical_features: list) -> pd.DataFrame:
    """Apply one-hot encoding for categorical variables."""
    # Note: For production-grade, we'd use a fitted encoder. 
    # For this agent, we'll use pd.get_dummies for simplicity in this specific task context.
    return pd.get_dummies(df, columns=categorical_features, drop_first=True)
