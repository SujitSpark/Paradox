# agents/case_intake_agent/agent.py

"""Orchestrator for the Case Intake Agent.

Steps:
1. Ingest CSV → raw cases
2. Validate raw data
3. Clean cases
4. Validate cleaned data
5. Engineer features
6. Initialise DB and insert records
7. Return a list of JSON‑serialisable dicts (one per case)
"""

import json
from typing import List, Dict
from .ingestion import ingest_csv
from .validation import validate_raw, validate_cleaned
from .cleaning import clean_cases
from .feature_engineering import engineer_batch
from .db_handler import init_db, insert_cases
from .schema import CaseOutput


def process(csv_path: str) -> List[Dict]:
    # 1. Ingest
    raw_cases = ingest_csv(csv_path)

    # 2. Validate raw
    valid_raw, raw_errors = validate_raw(raw_cases)
    if raw_errors:
        print("Raw validation errors:")
        for err in raw_errors:
            print(err)

    # 3. Clean
    cleaned_cases = clean_cases(valid_raw)

    # 4. Validate cleaned (placeholder)
    cleaned_cases, cleaned_errors = validate_cleaned(cleaned_cases)
    if cleaned_errors:
        print("Cleaned validation errors:")
        for err in cleaned_errors:
            print(err)

    # 5. Feature engineering
    features = engineer_batch(cleaned_cases)

    # 6. DB init and insert
    init_db()
    insert_cases(cleaned_cases, features)

    # 7. Build JSON output per case
    outputs: List[Dict] = []
    for cleaned, feat in zip(cleaned_cases, features):
        out = CaseOutput(
            case_id=cleaned.case_id,
            cleaned=True,
            court={
                "court_name_level": cleaned.court_name_level,
                "district": cleaned.district,
                "state": cleaned.state,
            },
            case_info={
                "case_number": cleaned.case_number,
                "case_type": cleaned.case_type,
                "nature_of_case": cleaned.nature_of_case,
                "status": cleaned.status,
                "adjournments_count": cleaned.adjournments_count,
                "petitioner_count": cleaned.petitioner_count,
                "respondent_count": cleaned.respondent_count,
                "filing_date": cleaned.filing_date.strftime("%Y-%m-%d"),
                "registration_date": cleaned.registration_date.strftime("%Y-%m-%d"),
                "last_hearing_date": cleaned.last_hearing_date.strftime("%Y-%m-%d"),
                "next_hearing_date": cleaned.next_hearing_date.strftime("%Y-%m-%d"),
            },
            features={
                "case_age_days": feat.case_age_days,
                "days_until_next_hearing": feat.days_until_next_hearing,
            },
            flags={},
        )
        outputs.append(json.loads(out.json()))
    return outputs
