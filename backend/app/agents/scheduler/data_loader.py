import pandas as pd
from ...shared.database.sqlite_db import get_connection

def load_eligible_cases():
    """Load cases that are not yet disposed and need scheduling.
    
    Returns:
        pd.DataFrame: Case data with required columns.
    """
    conn = get_connection()
    
    query = """
    SELECT 
        case_id, 
        case_type, 
        status, 
        district, 
        state, 
        priority_score, 
        adjournment_risk_score, 
        next_hearing_date
    FROM cases
    WHERE status != 'Disposed'
    """
    df = pd.read_sql_query(query, conn)
    conn.close()
    
    # Preprocess next_hearing_date: convert 'YYYY-MM-DD HH:MM:SS' strings to date objects
    def parse_hearing_date(d_str):
        if not d_str:
            return None
        try:
            # Handle 'YYYY-MM-DD HH:MM:SS' or 'YYYY-MM-DD'
            return pd.to_datetime(d_str).date()
        except:
            return None

    df['priority_score'] = df['priority_score'].fillna(0.0)
    df['adjournment_risk_score'] = df['adjournment_risk_score'].fillna(0.0)
    
    # Convert string to date object for comparison
    df['next_hearing_date'] = df['next_hearing_date'].apply(parse_hearing_date)
    
    return df
