# agents/priority_scoring_agent/agent.py

import json
from .db_handler import DBHandler
from .scorer import PriorityScorer

class PriorityScoringAgent:
    def __init__(self):
        self.db_handler = DBHandler()
        self.scorer = PriorityScorer()

    def run(self):
        """Orchestrate the scoring flow."""
        print("Starting Priority Scoring Agent with Escalation Logic...")
        
        # 1. Ensure columns exist
        self.db_handler.ensure_columns_exist()
        
        # 2. Load data
        df = self.db_handler.load_cases()
        if df.empty:
            print("No cases found in database.")
            return []

        # 3. Compute scores
        df = self.scorer.compute_all_scores(df)
        
        # 4. Update database
        self.db_handler.update_scores(df)
        
        # 5. Format JSON output
        results = df[['case_id', 'priority_score', 'priority_band', 'escalation_level']].to_dict('records')
        
        print("Priority Scoring Agent completed successfully.")
        return results

if __name__ == "__main__":
    agent = PriorityScoringAgent()
    output = agent.run()
    print(json.dumps(output, indent=2))
