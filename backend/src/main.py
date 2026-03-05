from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="JudicAI MVP API", description="Judicial case management API using Appwrite")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to JudicAI API"}

# Include routers from controllers here
from upload_feature.upload_router import upload_router
app.include_router(upload_router)

# from src.controllers import cases, upload, escalation
# app.include_router(cases.router, prefix="/api/cases")
# ...
