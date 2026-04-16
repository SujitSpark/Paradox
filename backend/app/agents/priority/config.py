# agents/priority_scoring_agent/config.py

import os

# Database Configuration
DATABASE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../shared/database/judic_ai.db"))
TABLE_NAME = "cases"

# Scoring Constants
MAX_AGE_SCORE = 40
AGE_WEIGHT_DAYS = 3650  # 10 years

ADJOURNMENT_WEIGHT = 8
MAX_ADJOURNMENT_CAP = 5

# Urgency Boosts
URGENCY_BOOSTS = {
    "HIGH_PRIORITY": {
        "keywords": ["BAIL", "POCSO", "HABEAS CORPUS"],
        "boost": 35
    },
    "MEDIUM_PRIORITY": {
        "keywords": ["CRIMINAL", "KIDNAPPING"],
        "boost": 25
    },
    "LOW_PRIORITY": {
        "keywords": ["FAMILY", "CHILD"],
        "boost": 20
    }
}

# Vulnerable Boost
VULNERABLE_BOOST = 5

# Priority Bands
PRIORITY_BANDS = {
    "HIGH": (80, 100),
    "MEDIUM": (50, 79),
    "LOW": (0, 49)
}
