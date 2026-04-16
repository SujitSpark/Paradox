# agents/case_intake_agent/config.py

"""Configuration for the Case Intake Agent.

Defines constants such as date format and any other configurable parameters.
"""

# Expected date format for output (ISO)
DATE_OUTPUT_FORMAT = "%Y-%m-%d"

# List of required columns in the CSV
REQUIRED_COLUMNS = [
    "case_id",
    "case_number",
    "filing_date",
    "registration_date",
    "last_hearing_date",
    "next_hearing_date",
    "case_type",
    "nature_of_case",
    "status",
    "adjournments_count",
    "petitioner_count",
    "respondent_count",
    "court_name_level",
    "district",
    "state",
]
