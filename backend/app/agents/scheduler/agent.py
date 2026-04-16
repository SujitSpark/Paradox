# agents/scheduler_agent/agent.py

import json
import logging
from datetime import date
from .data_loader import load_eligible_cases
from .scheduler_core import run_optimization
from .db_handler import save_schedule

# Configure Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class SmartSchedulerAgent:
    """Smart Scheduler Agent for generating optimized court hearing schedules.
    """
    
    def run(self):
        """Execute the scheduling pipeline.
        
        Returns:
            str: JSON representation of the optimized schedule.
        """
        logger.info("Starting Smart Scheduler Agent pipeline.")
        
        # 1. Load Data
        cases_df = load_eligible_cases()
        if cases_df.empty:
            logger.warning("No eligible cases found for scheduling.")
            return json.dumps([])
        
        logger.info(f"Loaded {len(cases_df)} cases for scheduling.")
        
        # 2. Run Genetic Algorithm
        best_ind, date_slots, time_slots = run_optimization(cases_df)
        
        # 3. Format Best Individual into scheduled records
        optimized_schedule = []
        for i, slot_idx in enumerate(best_ind):
            date_idx = slot_idx // len(time_slots)
            time_idx = slot_idx % len(time_slots)
            
            case = cases_df.iloc[i]
            assigned_date = date_slots[date_idx]
            assigned_time = time_slots[time_idx]
            
            optimized_schedule.append({
                "case_id": str(case['case_id']),
                "scheduled_date": assigned_date.strftime('%Y-%m-%d'),
                "time_slot": assigned_time
            })
            
        # 4. Save to Database
        if save_schedule(optimized_schedule):
            logger.info(f"Successfully saved {len(optimized_schedule)} hearings to database.")
        else:
            logger.error("Failed to save schedule to database.")
            
        # 5. Return JSON output
        result_json = json.dumps(optimized_schedule, indent=2)
        return result_json

if __name__ == "__main__":
    agent = SmartSchedulerAgent()
    output = agent.run()
    print(output)
