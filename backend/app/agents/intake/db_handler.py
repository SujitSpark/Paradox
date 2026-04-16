# agents/case_intake_agent/db_handler.py

"""Database handler for the Case Intake Agent.

Provides functions to create the `cases` table (if it does not exist) and
insert cleaned case records together with their engineered features.
"""

import sqlite3
from typing import List
from .schema import CaseCleaned, CaseFeatures
from ...shared.database.sqlite_db import get_connection


def init_db() -> None:
    """Create the `cases` table if it does not already exist.
    """
    conn = get_connection()
    cursor = conn.cursor()
    # DO NOT DROP TABLE. This clobbers the main application schema.
    # cursor.execute("DROP TABLE IF EXISTS cases")
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS cases (
            case_id TEXT PRIMARY KEY,
            case_number TEXT,
            filing_date DATE,
            registration_date DATE,
            last_hearing_date DATE,
            next_hearing_date DATE,
            case_type TEXT,
            nature_of_case TEXT,
            status TEXT,
            adjournments_count INTEGER,
            petitioner_count INTEGER,
            respondent_count INTEGER,
            court_name_level TEXT,
            district TEXT,
            state TEXT,
            case_age_days INTEGER,
            days_until_next_hearing INTEGER
        )
        """
    )
    conn.commit()


def insert_cases(cleaned_cases: List[CaseCleaned], features: List[CaseFeatures]) -> None:
    """Insert a batch of cases with their features into the DB.
    """
    conn = get_connection()
    cursor = conn.cursor()
    for cleaned, feat in zip(cleaned_cases, features):
        cursor.execute(
            """
            INSERT OR REPLACE INTO cases (
                case_id, case_number, filing_date, registration_date,
                last_hearing_date, next_hearing_date, case_type, nature_of_case,
                status, adjournments_count, petitioner_count, respondent_count,
                court_name_level, district, state,
                case_age_days, days_until_next_hearing
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            """,
            (
                cleaned.case_id,
                cleaned.case_number,
                cleaned.filing_date,
                cleaned.registration_date,
                cleaned.last_hearing_date,
                cleaned.next_hearing_date,
                cleaned.case_type,
                cleaned.nature_of_case,
                cleaned.status,
                cleaned.adjournments_count,
                cleaned.petitioner_count,
                cleaned.respondent_count,
                cleaned.court_name_level,
                cleaned.district,
                cleaned.state,
                feat.case_age_days,
                feat.days_until_next_hearing,
            ),
        )
    conn.commit()
