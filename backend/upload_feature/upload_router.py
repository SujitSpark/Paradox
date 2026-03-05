from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from .upload_database import get_db
from .upload_models import FileUploadResponse
from .upload_service import UploadService

upload_router = APIRouter(
    prefix="/api/uploads",
    tags=["uploads"],
)

ALLOWED_FILE_TYPES = [
    "application/pdf", 
    "text/csv", 
    "application/vnd.ms-excel", 
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/jpeg",
    "image/png"
]

@upload_router.post("/", response_model=FileUploadResponse)
async def upload_file_endpoint(
    file: UploadFile = File(...),
    uploaded_by: str = Form(..., description="ID of the registrar uploading the file"),
    db: Session = Depends(get_db)
):
    """
    Endpoint for a Registrar to upload a file.
    Validates the file type, saves it to disk, and stores metadata in SQLite.
    """
    
    if not file:
        raise HTTPException(status_code=400, detail="No file provided")
        
    # Validation (Optional type check)
    if file.content_type not in ALLOWED_FILE_TYPES:
         raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}. Allowed types: PDF, CSV, Excel, JPEG, PNG.")
    
    # Save the file to disk
    file_path = UploadService.save_file_to_disk(file)
    
    # Insert metadata into SQLite Database
    db_file = UploadService.store_file_metadata(
        db=db,
        file_name=file.filename,
        file_path=file_path,
        uploaded_by=uploaded_by,
        file_type=file.content_type
    )
    
    return db_file
