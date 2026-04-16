import sys
import os
import json

# Add project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from agents.delay_pattern_agent.agent import DelayPatternAgent

def test_delay_pattern_agent():
    """
    Test script to run the DelayPatternAgent and verify its output.
    """
    print("🚀 Initializing Delay Pattern Analysis Agent...")
    agent = DelayPatternAgent()
    
    try:
        print("📊 Running delay pattern analysis pipeline...")
        results = agent.run()
        
        # Verify JSON structure
        assert "patterns" in results, "Output missing 'patterns' key"
        assert "insights" in results, "Output missing 'insights' key"
        
        print("\n✅ Analysis Pipeline Completed Successfully!")
        
        # Print top hotspots
        print("\n🔥 Top Delay Hotspots:")
        print(json.dumps(results["insights"], indent=4))
        
        # Display some overall stats
        print(f"\n📊 Total patterns found: {len(results['patterns'])}")
        
    except Exception as e:
        print(f"\n❌ Test Failed with error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_delay_pattern_agent()
