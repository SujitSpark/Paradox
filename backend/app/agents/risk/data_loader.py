import pandas as pd
from ...shared.database.sqlite_db import get_connection

def load_data_from_db():
    """Load case data from the SQLite database."""
    conn = get_connection()
    query = "SELECT * FROM cases"
    df = pd.read_sql_query(query, conn)
    conn.close()
    
    # Simple data cleaning: Ensure counts are numeric and handle NaNs if any
    cols_to_numeric = ["adjournments_count", "petitioner_count", "respondent_count", "priority_score", "escalation_level"]
    for col in cols_to_numeric:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
            
    # Convert dates
    date_cols = ["filing_date", "last_hearing_date", "next_hearing_date"]
    for col in date_cols:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors='coerce')
            
    return df
