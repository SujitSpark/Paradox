Project Rules:
- Use only Appwrite Databases service – no Auth, Storage, Functions unless explicitly requested
- Never hardcode or expose APPWRITE_API_KEY
- Always use server-side SDK with API key for writes
- Structure: backend/src/services for DB logic wrappers
- Case documents must have $id = case_id
- Backend is Python/FastAPI.
