import sqlite3
import pandas as pd
from .config import DB_PATH, TABLE_DELAY_PATTERNS
from ...shared.database.sqlite_db import get_db_connection
import logging

logger = logging.getLogger(__name__)

def save_patterns(df_patterns: pd.DataFrame):
    """
    Saves the aggregated delay patterns to the database.
    """
    with get_db_connection() as conn:
        # Create table if not exists
        create_table_sql = f"""
        CREATE TABLE IF NOT EXISTS {TABLE_DELAY_PATTERNS} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            district TEXT,
            case_type TEXT,
            avg_adjournments REAL,
            max_adjournments INTEGER,
            avg_age_days REAL,
            analysis_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
        conn.execute(create_table_sql)
        
        # Clear existing entries to prevent duplication
        conn.execute(f"DELETE FROM {TABLE_DELAY_PATTERNS}")
        
        # Insert the patterns
        df_patterns.to_sql(TABLE_DELAY_PATTERNS, conn, if_exists='append', index=False)
        logger.info(f"Successfully saved {len(df_patterns)} research patterns to {TABLE_DELAY_PATTERNS}")
