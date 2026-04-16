# agents/scheduler_agent/scheduler_core.py

import random
import numpy as np
from deap import base, creator, tools, algorithms
from datetime import timedelta
from .config import (
    START_DATE, END_DATE, TIME_SLOTS, POPULATION_SIZE, GENERATIONS, 
    CROSSOVER_PROB, MUTATION_PROB
)
from .fitness import evaluate_schedule

def run_optimization(case_data):
    """Run the Genetic Algorithm to optimize the hearing schedule.
    
    Args:
        case_data (pd.DataFrame): Input case records.
        
    Returns:
        list: Best schedule (list of slot indices for each case).
    """
    num_cases = len(case_data)
    if num_cases == 0:
        return []

    # Prepare scheduling window dates
    num_days = (END_DATE - START_DATE).days
    date_slots = [START_DATE + timedelta(days=d) for d in range(num_days)]
    
    total_slots = len(date_slots) * len(time_slots := TIME_SLOTS)
    
    # DEAP Configuration
    # Weights=(1.0,) because we want to MAXIMIZE fitness
    if not hasattr(creator, "FitnessMax"):
        creator.create("FitnessMax", base.Fitness, weights=(1.0,))
    if not hasattr(creator, "Individual"):
        creator.create("Individual", list, fitness=creator.FitnessMax)
    
    toolbox = base.Toolbox()
    
    # Each case is assigned a slot index [0, total_slots - 1]
    toolbox.register("attr_slot", random.randint, 0, total_slots - 1)
    toolbox.register("individual", tools.initRepeat, creator.Individual, toolbox.attr_slot, n=num_cases)
    toolbox.register("population", tools.initRepeat, list, toolbox.individual)
    
    # Fitness evaluation function
    # Passing fixed arguments using partials or lambda
    toolbox.register("evaluate", evaluate_schedule, case_data=case_data, date_slots=date_slots, time_slots=time_slots)
    
    # Genetic Operations
    toolbox.register("mate", tools.cxTwoPoint)
    toolbox.register("mutate", tools.mutUniformInt, low=0, up=total_slots - 1, indpb=0.05)
    toolbox.register("select", tools.selTournament, tournsize=3)
    
    # Initialize Population
    pop = toolbox.population(n=POPULATION_SIZE)
    
    # Hall of Fame to track the best individual
    hof = tools.HallOfFame(1)
    
    # Stats tracking
    stats = tools.Statistics(lambda ind: ind.fitness.values)
    stats.register("avg", np.mean)
    stats.register("min", np.min)
    stats.register("max", np.max)
    
    # Run Algorithm
    pop, log = algorithms.eaSimple(pop, toolbox, cxpb=CROSSOVER_PROB, mutpb=MUTATION_PROB, 
                                    ngen=GENERATIONS, stats=stats, halloffame=hof, verbose=False)
    
    best_individual = hof[0]
    
    return best_individual, date_slots, time_slots
