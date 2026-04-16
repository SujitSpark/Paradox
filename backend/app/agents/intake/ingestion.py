# agents/case_intake_agent/ingestion.py

"""Ingestion module for the Case Intake Agent.

Loads a CSV/TSV file using pandas and converts each row into a `CaseRaw`
Pydantic model defined in `schema.py`.
"""

import pandas as pd
from typing import List
from .schema import CaseRaw


def ingest_csv(csv_path: str) -> List[CaseRaw]:
    """Read the CSV file and return a list of `CaseRaw` objects.

    Parameters
    ----------
    csv_path: str
        Path to the CSV file.

    Returns
    -------
    List[CaseRaw]
        List of raw case records.
    """
    # Assuming tab-separated as provided in the sample
    df = pd.read_csv(csv_path, sep=",", dtype=str)
    
    records: List[CaseRaw] = []
    for _, row in df.iterrows():
        # Convert pandas Series to dict, replace NaN with None
        row_dict = row.where(pd.notnull(row), None).to_dict()
        records.append(CaseRaw(**row_dict))
    return records
