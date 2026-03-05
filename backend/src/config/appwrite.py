import os
from appwrite.client import Client
from appwrite.services.databases import Databases
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Appwrite Client
client = Client()
client.set_endpoint(os.getenv("APPWRITE_ENDPOINT", "https://cloud.appwrite.io/v1"))
client.set_project(os.getenv("APPWRITE_PROJECT_ID", ""))
client.set_key(os.getenv("APPWRITE_API_KEY", ""))

# Initialize Appwrite Databases Service
databases = Databases(client)

# Define Database and Collection IDs (replace with actual IDs later if needed)
DATABASE_ID = "judicial"
CASES_COLLECTION_ID = "cases"
