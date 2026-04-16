import pandas as pd
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

def preprocess_and_feature_engineer(df: pd.DataFrame) -> pd.DataFrame:
    """
    Performs data cleaning and computes the age of cases.
    """
    try:
        # Dynamic current date as per requirements
        today = datetime.today()
        
        # Ensure 'filing_date' is in datetime format
        df['filing_date'] = pd.to_datetime(df['filing_date'], errors='coerce')
        
        # Identify and report missing filing dates
        missing_dates = df['filing_date'].isna().sum()
        if missing_dates > 0:
            logger.warning(f"Found {missing_dates} cases with invalid filing dates. Removing them from age analysis.")
            df = df.dropna(subset=['filing_date'])
        
        # Vectorized operation for age calculation
        # (today - filing_date) returns a Timedelta object, .dt.days extracts the integer count
        df['age_days'] = (today - df['filing_date']).dt.days
        
        logger.info(f"Processed {len(df)} cases for delay analysis.")
        return df
    except Exception as e:
        logger.error(f"Error in feature engineering: {e}")
        raise
