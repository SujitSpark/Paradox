# agents/scheduler_agent/db_handler.py

import sqlite3
from ...shared.database.sqlite_db import get_connection

def create_hearings_table():
    """Create hearings table if it doesn't already exist.
    """
    conn = get_connection()
    cursor = conn.cursor()
    
    # Check if table exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='hearings'")
    if not cursor.fetchone():
        # Create table
        cursor.execute("""
            CREATE TABLE hearings (
                case_id TEXT PRIMARY KEY,
                scheduled_date DATE,
                time_slot TEXT,
                FOREIGN KEY (case_id) REFERENCES cases(case_id)
            )
        """)
        conn.commit()

def save_schedule(schedule_records):
    """Save the optimized schedule to the database.
    
    Args:
        schedule_records (list): List of dicts with case_id, scheduled_date, time_slot.
    """
    create_hearings_table()
    
    conn = get_connection()
    cursor = conn.cursor()
    
    # We may want to clear existing schedules for these cases- though for now, 
    # we'll just upsert or replace to maintain only one active scheduled hearing.
    # REPLACING existing hearings to avoid duplicate primary key errors.
    
    try:
        # Use execute_many for efficiency
        cursor.executemany("""
            INSERT OR REPLACE INTO hearings (case_id, scheduled_date, time_slot)
            VALUES (?, ?, ?)
        """, [(r['case_id'], r['scheduled_date'], r['time_slot']) for r in schedule_records])
        conn.commit()
        return True
    except sqlite3.Error as e:
        print(f"Error saving schedule: {e}")
        return False
