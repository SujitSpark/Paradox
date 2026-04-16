# agents/priority_scoring_agent/scorer.py

import pandas as pd
import numpy as np
from datetime import datetime
from .config import MAX_AGE_SCORE, AGE_WEIGHT_DAYS, ADJOURNMENT_WEIGHT, MAX_ADJOURNMENT_CAP, VULNERABLE_BOOST
from .utils import calculate_urgency_boost, get_priority_band, get_escalation_level

class PriorityScorer:
    def __init__(self):
        self.current_date = datetime.now()

    def compute_all_scores(self, df: pd.DataFrame) -> pd.DataFrame:
        """Compute the priority score for each case in the DataFrame."""
        if df.empty:
            return df

        # 1. AGE SCORE (Max 40)
        # Compute age_days = current_date - filing_date
        df['filing_date_dt'] = pd.to_datetime(df['filing_date'], errors='coerce')
        df['age_days'] = (self.current_date - df['filing_date_dt']).dt.days.fillna(0)
        
        # Formula: age_score = min(40, (age_days / 3650) * 40)
        df['age_score'] = (df['age_days'] / AGE_WEIGHT_DAYS) * MAX_AGE_SCORE
        df['age_score'] = df['age_score'].clip(upper=MAX_AGE_SCORE)

        # 2. ADJOURNMENT SCORE
        # adjournment_score = min(adjournments_count, 5) * 8
        df['adjournment_score'] = df['adjournments_count'].fillna(0).clip(upper=MAX_ADJOURNMENT_CAP) * ADJOURNMENT_WEIGHT

        # 3. URGENCY BOOST
        df['urgency_boost'] = df['case_type'].apply(calculate_urgency_boost)

        # 4. VULNERABLE BOOST
        # If petitioner_count > 1 → +5
        df['vulnerable_boost'] = np.where(df['petitioner_count'].fillna(0) > 1, VULNERABLE_BOOST, 0)

        # 5. FINAL SCORE
        # priority_score = min(100, age_score + adjournment_score + urgency_boost + vulnerable_boost)
        df['priority_score'] = df['age_score'] + df['adjournment_score'] + df['urgency_boost'] + df['vulnerable_boost']
        df['priority_score'] = df['priority_score'].clip(upper=100).round(2)

        # 6. PRIORITY BAND & ESCALATION LEVEL
        df['priority_band'] = df['priority_score'].apply(get_priority_band)
        df['escalation_level'] = df['priority_score'].apply(get_escalation_level)

        return df
