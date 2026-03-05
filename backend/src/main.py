from fastapi import FastAPI

app = FastAPI(title="JudicAI MVP API", description="Judicial case management API using Appwrite")

@app.get("/")
def read_root():
    return {"message": "Welcome to JudicAI API"}

# Include routers from controllers here
# from src.controllers import cases, upload, escalation
# app.include_router(cases.router, prefix="/api/cases")
# ...
