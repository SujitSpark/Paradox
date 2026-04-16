# backend/app/db/migrate_schema.py
from sqlalchemy import text
from .session import engine
import logging

def migrate():
    print("INFO: Starting PostgreSQL Schema Migration (Case Model Expansion)...")
    
    with engine.connect() as conn:
        # Use a single block for all ALTER TABLE commands
        # PostgreSQL 9.6+ supports ADD COLUMN IF NOT EXISTS
        columns_to_add = [
            ("priority_band", "VARCHAR"),
            ("adj_risk_score", "FLOAT"),
            ("risk_level", "VARCHAR"),
            ("escalation_level", "INTEGER"),
            ("days_until_next_hearing", "INTEGER"),
            ("age_days", "INTEGER"),
            ("last_adjournment_date", "TIMESTAMP"),
            ("last_hearing_date", "TIMESTAMP"),
            ("next_hearing_date", "TIMESTAMP"),
        ]
        
        for col, dtype in columns_to_add:
            try:
                print(f"   - Ensuring column '{col}' exists...")
                # Important: PostgreSQL IF NOT EXISTS for columns
                conn.execute(text(f"ALTER TABLE cases ADD COLUMN IF NOT EXISTS {col} {dtype}"))
                conn.commit()
                print(f"     SUCCESS: Verified '{col}'")
            except Exception as e:
                print(f"     ERROR on '{col}': {str(e)}")
                conn.rollback() # Recover from failed transaction if any
        
        # Ensure DelayPattern table exists
        print("INFO: Ensuring DelayPattern table exists...")
        try:
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS delay_patterns (
                    pattern_id SERIAL PRIMARY KEY,
                    district VARCHAR,
                    case_type VARCHAR,
                    avg_delay_days FLOAT,
                    hotspot_score FLOAT,
                    recommended_action TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """))
            conn.commit()
            print("SUCCESS: DelayPattern table verified.")
        except Exception as e:
            print(f"ERROR on DelayPattern: {str(e)}")
            conn.rollback()

    print("\nDONE: Migration Complete.")

if __name__ == "__main__":
    migrate()
