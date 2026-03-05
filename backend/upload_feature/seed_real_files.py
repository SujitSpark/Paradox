from datetime import datetime, timezone
import os
import shutil

from upload_feature.upload_database import SessionLocal, Base, engine
from upload_feature.upload_models import FileMetadataDB

# Directory where the real cases are located
SOURCE_DIR = "/Users/shubhashri/Downloads/csv/cases"

# We must use absolute path to ensure uploads are stored accurately inside upload_feature/uploads
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DEST_DIR = os.path.join(BASE_DIR, "uploads")

# Ensure the tables exist
Base.metadata.create_all(bind=engine)
# Ensure the destination directory exists
os.makedirs(DEST_DIR, exist_ok=True)

def seed_real_files():
    db = SessionLocal()
    
    try:
        # Get all CSV files in the destination directory (since already uploaded)
        all_files = [f for f in os.listdir(DEST_DIR) if f.endswith('.csv')]
        
        # Sort them and take only the first 5
        all_files.sort()
        first_5_files = all_files[:5]
        
        if not first_5_files:
            print(f"No CSV files found in {DEST_DIR}")
            return
            
        print(f"Found files to process: {first_5_files}")
        
        db_entries = []
        for file_name in first_5_files:
            dest_path = os.path.join(DEST_DIR, file_name)
            
            print(f"Processing {file_name} in {dest_path}...")
            
            # Prepare database metadata model
            db_file = FileMetadataDB(
                file_name=file_name,
                file_path=dest_path,
                uploaded_by="auto_seeder",
                upload_timestamp=datetime.now(timezone.utc),
                file_type="text/csv"
            )
            db_entries.append(db_file)
            
        # Add all to session and commit
        db.add_all(db_entries)
        db.commit()
        
        print(f"\nSuccessfully copied {len(db_entries)} files and stored metadata in the database!")
        
        # Print confirmation
        records = db.query(FileMetadataDB).all()
        print("\nCurrent DB Records:")
        for record in records:
            print(f"ID: {record.file_id} | Name: {record.file_name} | Uploaded By: {record.uploaded_by} | Path: {record.file_path}")
            
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("Starting process to copy real files and seed the SQLite Database...")
    seed_real_files()
