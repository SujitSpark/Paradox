# backend/app/tests/integration_test.py
import os
import sys
import httpx
import asyncio
from sqlalchemy import text
from ..main import app, get_db
from ..db.session import engine, Base

# Add project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

async def test_full_judicial_pipeline():
    print("\nSTARTING: Full Judicial Pipeline Integration Test...")
    
    # 1. Reset/Ensure Database Schema
    Base.metadata.create_all(bind=engine)
    print("SUCCESS: Database schema verified.")

    # 2. Upload Case CSV
    csv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "test_judicial_cases.csv"))
    if not os.path.exists(csv_path):
        print(f"ERROR: Test CSV not found at {csv_path}")
        return

    print(f"INFO: Uploading test CSV: {csv_path}...")
    
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        with open(csv_path, "rb") as f:
            files = {"file": ("test_cases.csv", f, "text/csv")}
            response = await client.post("/cases/upload", files=files)
    
    if response.status_code != 200:
        print(f"ERROR: Upload Failed: {response.text}")
        return
        
    print(f"SUCCESS: Upload Success: {response.json()}")

    # 3. Trigger Full Analysis
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test", timeout=60.0) as client:
        response = await client.post("/agents/run-full-analysis")
    
    if response.status_code != 200:
        print(f"ERROR: Analysis Failed: {response.text}")
        return
        
    result = response.json()
    print(f"SUCCESS: Intelligence Pipeline executed: {result}")
    
    # 4. Final Validation of Outputs
    print("INFO: Validating persistent analytics in PostgreSQL...")
    with next(get_db()) as db:
        from ..models.models import Case, Memo, Hearing, DelayPattern
        
        case_count = db.query(Case).count()
        memo_count = db.query(Memo).count()
        hearing_count = db.query(Hearing).count()
        pattern_count = db.query(DelayPattern).count()
        
        print(f"DATA: Final Stats:")
        print(f"   - Cases in DB: {case_count}")
        print(f"   - Memos Generated: {memo_count}")
        print(f"   - Scheduled Hearings: {hearing_count}")
        print(f"   - Regional Patterns: {pattern_count}")

        if case_count >= 10:
            print("\nDONE: INTEGRATION TEST PASSED!")
        else:
            print("\nFAILURE: TEST FAILED: Case count mismatch.")

if __name__ == "__main__":
    try:
        asyncio.run(test_full_judicial_pipeline())
    except Exception as e:
        print(f"TEST FAILURE: {str(e)}")
        import traceback
        traceback.print_exc()
