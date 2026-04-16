import os

# Database Configuration
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DB_PATH = os.path.join(BASE_DIR, "shared", "database", "judic_ai.db")

# Table names
TABLE_CASES = "cases"
TABLE_DELAY_PATTERNS = "delay_patterns"

# Analysis Config
HOTSPOT_TOP_N = 5
ROUND_DECIMALS = 2
