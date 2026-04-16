# agents/scheduler_agent/fitness.py

from datetime import datetime, date
from .config import CONFLICT_PENALTY, PRIORITY_WEIGHT, RISK_WEIGHT, START_DATE, END_DATE
from .constraints import count_conflicts

def evaluate_schedule(individual, case_data, date_slots, time_slots):
    """Fitness function for the Genetic Algorithm.
    
    Args:
        individual (list): List of indices mapping cases to (date_slot, time_slot).
        case_data (pd.DataFrame): Input case records.
        date_slots (list): Available dates.
        time_slots (list): Available time slots.
        
    Returns:
        tuple: Fitness value (higher is better).
    """
    # individual is a list where each element represents the (date_idx, time_idx) for each case
    # Format: [slot_idx, slot_idx, ...] where slot_idx maps to a (date, time) pair.
    
    total_slots = len(date_slots) * len(time_slots)
    # Map index to (date, time)
    mapped_schedule = []
    
    for i, slot_idx in enumerate(individual):
        date_idx = slot_idx // len(time_slots)
        time_idx = slot_idx % len(time_slots)
        
        case = case_data.iloc[i]
        assigned_date = date_slots[date_idx]
        assigned_time = time_slots[time_idx]
        
        mapped_schedule.append({
            'case_id': case['case_id'],
            'district': case['district'],
            'assigned_date': assigned_date,
            'assigned_time': assigned_time,
            'priority_score': case['priority_score'],
            'adjournment_risk_score': case['adjournment_risk_score'],
            'days_from_start': (assigned_date - START_DATE).days
        })
    
    import pandas as pd
    schedule_df = pd.DataFrame(mapped_schedule)
    
    # 1. Calculate Conflicts
    conflicts = count_conflicts(schedule_df)
    
    # 2. Optimization scores
    # We want high priority cases EARLIER. 
    # Max days is 14. Weight = (15 - days_from_start)
    
    optimization_score = 0
    for _, row in schedule_df.iterrows():
        # Earliest date gets highest multiplier (e.g., 14, 13, ..., 1)
        time_multiplier = (15 - row['days_from_start'])
        
        optimization_score += (row['priority_score'] * PRIORITY_WEIGHT * time_multiplier)
        optimization_score += (row['adjournment_risk_score'] * RISK_WEIGHT * time_multiplier)
    
    # Final fitness
    fitness = -(conflicts * CONFLICT_PENALTY) + optimization_score
    
    return (fitness,)
