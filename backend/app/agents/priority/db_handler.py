# agents/priority_scoring_agent/db_handler.py

import sqlite3
import pandas as pd
from .config import TABLE_NAME
from ...shared.database.sqlite_db import get_connection

class DBHandler:
    def __init__(self):
        # We no longer use self.db_path directly, but we keep it for compatibility if needed.
        pass

    def get_connection(self):
        return get_connection()

    def load_cases(self) -> pd.DataFrame:
        """Load all cases from the database into a DataFrame."""
        conn = self.get_connection()
        query = f"SELECT * FROM {TABLE_NAME}"
        df = pd.read_sql_query(query, conn)
        conn.close()
        return df

    def ensure_columns_exist(self):
        """Add priority_score and escalation_level columns if they do not exist."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Check if columns exist
        cursor.execute(f"PRAGMA table_info({TABLE_NAME})")
        columns = [info[1] for info in cursor.fetchall()]
        
        if "priority_score" not in columns:
            print(f"Adding 'priority_score' column to {TABLE_NAME} table...")
            cursor.execute(f"ALTER TABLE {TABLE_NAME} ADD COLUMN priority_score REAL")
            conn.commit()
            
        if "escalation_level" not in columns:
            print(f"Adding 'escalation_level' column to {TABLE_NAME} table...")
            cursor.execute(f"ALTER TABLE {TABLE_NAME} ADD COLUMN escalation_level INTEGER")
            conn.commit()
        
        conn.close()

    def update_scores(self, df: pd.DataFrame):
        """Update scores and escalation levels for each case in the database."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Prepare list of tuples for batch update
        update_data = df[['priority_score', 'escalation_level', 'case_id']].values.tolist()
        
        # Use executemany for high performance
        cursor.executemany(
            f"UPDATE {TABLE_NAME} SET priority_score = ?, escalation_level = ? WHERE case_id = ?",
            update_data
        )
        
        conn.commit()
        conn.close()
        print(f"Successfully updated {len(df)} rows in database with scores and escalation levels.")
