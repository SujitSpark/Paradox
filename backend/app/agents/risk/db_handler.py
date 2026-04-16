# backend/app/agents/risk/db_handler.py

import sqlite3
import pandas as pd
from ...shared.database.sqlite_db import get_db_connection

def update_db_schema():
    """Ensure the necessary columns exist in the 'cases' table."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Check current columns
        cursor.execute("PRAGMA table_info(cases)")
        columns = [row[1] for row in cursor.fetchall()]
        
        # Required columns
        required_cols = {
            "adjournment_risk_score": "REAL",
            "risk_level": "TEXT"
        }
        
        for col, dtype in required_cols.items():
            if col not in columns:
                print(f"Adding column {col} ({dtype}) to 'cases' table...")
                cursor.execute(f"ALTER TABLE cases ADD COLUMN {col} {dtype}")
                
        # One-time migration: Drop risk_explanation if it exists
        if "risk_explanation" in columns:
            print("Dropping column risk_explanation from 'cases' table...")
            cursor.execute("ALTER TABLE cases DROP COLUMN risk_explanation")

def save_results_to_db(df: pd.DataFrame):
    """
    Update predicted values back to the cases table using batch execution.
    """
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Prepare batch update data
        if "id" in df.columns:
            update_query = """
                UPDATE cases 
                SET adjournment_risk_score = ?, risk_level = ?
                WHERE id = ?
            """
            batch_data = [(row["adjournment_risk_score"], row["risk_level"], row["id"]) for _, row in df.iterrows()]
        else:
            # Fallback to case_id
            update_query = """
                UPDATE cases 
                SET adjournment_risk_score = ?, risk_level = ?
                WHERE case_id = ?
            """
            batch_data = [(row["adjournment_risk_score"], row["risk_level"], row["case_id"]) for _, row in df.iterrows()]
            
        cursor.executemany(update_query, batch_data)
        
    print(f"Successfully updated {len(df)} cases with risk scores.")
