# agents/scheduler_agent/constraints.py

from datetime import datetime

def is_valid_schedule(case, assigned_date, assigned_time):
    """Checks hard constraints for a single case assignment.
    
    Args:
        case (pd.Series): Case record.
        assigned_date (date): Date assigned.
        assigned_time (str): Time slot assigned.
        
    Returns:
        bool: True if valid.
    """
    today = datetime.now().date()
    
    # 1. scheduled_date >= today
    if assigned_date < today:
        return False
        
    # 2. scheduled_date >= next_hearing_date (if exists)
    if case['next_hearing_date']:
        try:
            next_hearing_date = datetime.strptime(case['next_hearing_date'], '%Y-%m-%d').date()
            if assigned_date < next_hearing_date:
                return False
        except ValueError:
            # Handle potential date parsing error if format varies
            pass
            
    return True

def count_conflicts(schedule_df):
    """Count number of scheduling collisions (same date, time, and district).
    
    Args:
        schedule_df (pd.DataFrame): Dataframe with case_id, district, assigned_date, assigned_time.
        
    Returns:
        int: Number of conflicts.
    """
    # Group by district, assigned_date, assigned_time and count occurrences
    conflicts = schedule_df.groupby(['district', 'assigned_date', 'assigned_time']).size().reset_index(name='counts')
    # A conflict occurs if counts > 1
    total_conflicts = conflicts[conflicts['counts'] > 1]['counts'].sum() - len(conflicts[conflicts['counts'] > 1])
    return int(total_conflicts)
