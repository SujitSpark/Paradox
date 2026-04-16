import json
import logging

from .data_loader import load_cases_data
from .feature_engineering import preprocess_and_feature_engineer
from .analyzer import analyze_delays
from .db_handler import save_patterns

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class DelayPatternAgent:
    """
    Agent responsible for analyzing judicial case delays and detecting hotspots.
    
    This agent orchestrates the statistical analysis of case delays across 
    different districts and case types to provide actionable insights.
    """
    
    def __init__(self):
        self.name = "DelayPatternAnalysisAgent"

    def run(self) -> dict:
        """
        Executes the delay pattern analysis pipeline.
        
        Process Flow:
        1. Load case data from the database.
        2. Perform feature engineering to calculate case age and complexity.
        3. Analyze delays to identify statistical patterns.
        4. Detect hotspots (districts/types with abnormally high delays).
        5. Store aggregated statistics back to the database.
        6. Return findings as structured JSON.

        Returns:
            dict: A dictionary containing 'patterns' and 'insights'.
        """
        logger.info(f"Starting {self.name} pipeline execution.")
        
        try:
            # 1. Load Data
            df = load_cases_data()
            if df.empty:
                logger.warning("No cases found in the database. Analysis aborted.")
                return {"patterns": [], "insights": []}
            
            # 2. Feature Engineering
            df = preprocess_and_feature_engineer(df)
            
            # 3. Analyze Patterns & Insights
            patterns_df, insights_df = analyze_delays(df)
            
            # 4. Storage
            save_patterns(patterns_df)
            
            # 5. Format results
            patterns_json = patterns_df.to_dict(orient='records')
            insights_json = insights_df.to_dict(orient='records')
            
            logger.info(f"Pipeline completed successfully. Generated {len(patterns_json)} patterns.")
            
            return {
                "patterns": patterns_json,
                "insights": insights_json
            }
            
        except Exception as e:
            logger.error(f"Critical error in {self.name} execution: {e}", exc_info=True)
            raise

if __name__ == "__main__":
    # Internal test execution
    agent = DelayPatternAgent()
    print(json.dumps(agent.run(), indent=2))
