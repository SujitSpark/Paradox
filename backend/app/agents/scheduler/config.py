# agents/scheduler_agent/config.py

import os
from datetime import datetime, timedelta

# Scheduling Window
SCHEDULING_WINDOW_DAYS = 14
START_DATE = datetime.now().date()
END_DATE = START_DATE + timedelta(days=SCHEDULING_WINDOW_DAYS)

# Time Slots
TIME_SLOTS = ["10:00", "11:00", "12:00", "14:00", "15:00"]

# Genetic Algorithm Parameters
POPULATION_SIZE = 50
GENERATIONS = 40
CROSSOVER_PROB = 0.8
MUTATION_PROB = 0.2

# Fitness Weights
CONFLICT_PENALTY = 1000
PRIORITY_WEIGHT = 5.0
RISK_WEIGHT = 3.0
DELAY_PENALTY_WEIGHT = 1.0

# Database Configuration
# The database path is relative to the project root
DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../shared/database/judic_ai.db"))
