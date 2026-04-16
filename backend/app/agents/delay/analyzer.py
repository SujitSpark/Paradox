import pandas as pd
from .config import ROUND_DECIMALS, HOTSPOT_TOP_N
import logging

logger = logging.getLogger(__name__)

def analyze_delays(df: pd.DataFrame):
    """
    Groups case data by district and case_type to compute statistical patterns of delays.
    
    Returns:
        tuple (pd.DataFrame, pd.DataFrame): patterns (full aggregated statistics), 
                                           insights (top 5 delay hotspots)
    """
    try:
        # Group by district and case_type
        # Using .agg() to apply multiple operations to specific columns
        patterns = df.groupby(["district", "case_type"]).agg({
            "adjournments_count": ["mean", "max"],
            "age_days": "mean"
        }).reset_index()
        
        # Flatten multi-index columns resulting from aggregated stats
        # ('adjournments_count', 'mean') -> 'avg_adjournments'
        # ('adjournments_count', 'max') -> 'max_adjournments'
        # ('age_days', 'mean') -> 'avg_age_days'
        patterns.columns = [
            "district", 
            "case_type", 
            "avg_adjournments", 
            "max_adjournments", 
            "avg_age_days"
        ]
        
        # Round the numerical results for readability
        patterns = patterns.round(ROUND_DECIMALS)
        
        # Identify top hotspots based on highest mean adjournments
        insights = patterns.nlargest(HOTSPOT_TOP_N, "avg_adjournments")
        
        logger.info(f"Generated statistical patterns for {len(patterns)} (district, case_type) pairs.")
        logger.info(f"Top delay hotspots identified: {len(insights)}")
        
        return patterns, insights
    except Exception as e:
        logger.error(f"Error during delay analysis aggregation: {e}")
        raise
