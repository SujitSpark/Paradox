from datetime import datetime, timezone
import os

from upload_feature.upload_database import SessionLocal, Base, engine
from upload_feature.upload_models import FileMetadataDB

# Ensure the tables exist before inserting data
Base.metadata.create_all(bind=engine)

def seed_database():
    # 1. Create a database session
    db = SessionLocal()
    
    try:
        # 2. Create mock file metadata entries
        mock_files = [
            FileMetadataDB(
                file_name="case_documents_101.pdf",
                file_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads", "case_documents_101.pdf"),
                uploaded_by="registrar_001",
                upload_timestamp=datetime.now(timezone.utc),
                file_type="application/pdf"
            ),
            FileMetadataDB(
                file_name="evidence_summary.csv",
                file_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads", "evidence_summary.csv"),
                uploaded_by="registrar_002",
                upload_timestamp=datetime.now(timezone.utc),
                file_type="text/csv"
            )
        ]
        
        # 3. Add to session and commit to the database
        db.add_all(mock_files)
        db.commit()
        
        print(f"Successfully inserted {len(mock_files)} records into the database!")
        
        # 4. (Optional) Fetch and verify the records
        records = db.query(FileMetadataDB).all()
        for record in records:
            print(f"Inserted DB ID: {record.file_id} | Name: {record.file_name} | Uploaded By: {record.uploaded_by}")
            
    except Exception as e:
        db.rollback()
        print(f"Error inserting data: {e}")
    finally:
        # 5. Always close the session
        db.close()

if __name__ == "__main__":
    print("Seeding SQLite Database...")
    seed_database()
