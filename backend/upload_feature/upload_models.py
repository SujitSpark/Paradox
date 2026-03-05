from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, timezone
from .upload_database import Base
from pydantic import BaseModel
from typing import Optional

# SQLAlchemy DB Model
class FileMetadataDB(Base):
    __tablename__ = "file_uploads"

    file_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    file_name = Column(String, index=True, nullable=False)
    file_path = Column(String, nullable=False)
    uploaded_by = Column(String, index=True, nullable=False) # e.g., 'registrar_xyz'
    upload_timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    file_type = Column(String, nullable=False)


# Pydantic Schemas for API responses/requests
class FileUploadResponse(BaseModel):
    file_id: int
    file_name: str
    file_path: str
    uploaded_by: str
    upload_timestamp: datetime
    file_type: str

    class Config:
        from_attributes = True
