# backend/app/shared/database/sqlite_db.py
import sqlite3
import os
import logging

logger = logging.getLogger(__name__)

# This shim provides a local SQLite database that mirrors the Cases table
# for the specialized agents to perform their calculations.
# Use an absolute path based on the backend directory to ensure consistency
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DB_PATH = os.path.join(BASE_DIR, "judicial_cache.db")

from contextlib import contextmanager

@contextmanager
def get_db_connection():
    """
    Context manager for sqlite3 connections.
    """
    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        yield conn
    except Exception as e:
        logger.error(f"SQLite Connection Error: {e}")
        if conn:
            conn.rollback()
        raise e
    finally:
        if conn:
            conn.close()

def get_connection():
    """Legacy compatibility for get_connection()"""
    return sqlite3.connect(DB_PATH)
