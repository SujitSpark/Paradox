import pandas as pd
import logging
from .config import TABLE_CASES
from ...shared.database.sqlite_db import get_connection

logger = logging.getLogger(__name__)
import sqlite3

def load_cases_data() -> pd.DataFrame:
    """
    Loads all relevant case data from the SQLite database.
    """
    try:
        conn = get_connection()
        # Select all columns needed for analysis
        query = f"SELECT * FROM {TABLE_CASES}"
        df = pd.read_sql_query(query, conn)
        conn.close()
        logger.info(f"Loaded {len(df)} cases from {TABLE_CASES}")
        return df
    except sqlite3.Error as e:
        logger.error(f"Error loading cases from database: {e}")
        raise
