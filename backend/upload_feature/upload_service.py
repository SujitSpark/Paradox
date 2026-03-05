import os
import shutil
from fastapi import UploadFile, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from .upload_models import FileMetadataDB, FileUploadResponse
from .upload_database import Base, engine

# Initialize the db schema
Base.metadata.create_all(bind=engine)

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")

# Ensure the upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

class UploadService:
    @staticmethod
    def save_file_to_disk(file: UploadFile) -> str:
        """Saves the uploaded file to the designated uploads directory."""
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        
        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to save file remotely. Error: {str(e)}")
            
        return file_path

    @staticmethod
    def store_file_metadata(db: Session, file_name: str, file_path: str, uploaded_by: str, file_type: str) -> FileMetadataDB:
        """Inserts file metadata into the SQLite database."""
        db_file = FileMetadataDB(
            file_name=file_name,
            file_path=file_path,
            uploaded_by=uploaded_by,
            upload_timestamp=datetime.now(timezone.utc),
            file_type=file_type
        )
        
        try:
            db.add(db_file)
            db.commit()
            db.refresh(db_file)
            return db_file
        except Exception as e:
            db.rollback()
            # Clean up the file if db insert fails
            if os.path.exists(file_path):
                os.remove(file_path)
            raise HTTPException(status_code=500, detail=f"Failed to save file metadata to database. Error: {str(e)}")
