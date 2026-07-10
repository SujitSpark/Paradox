# Workspace Rules: Paradox (JudicAI)

This folder contains global customization rules and context.

## 📖 Mandatory First Step
Before attempting to modify or analyze this repository, you **MUST** read the comprehensive project breakdown in:
* **[PROJECT_KNOWLEDGE.md](file:///d:/test/Paradox/.agents/PROJECT_KNOWLEDGE.md)**

This file details the database structures, LangGraph agent workflows, API routers, and front-end states, helping you avoid redundant file reads and saving LLM context tokens.

## ⚙️ Development Guidelines
1. **Python Virtual Environment:** Always run python scripts or start the backend using the local virtual environment:
   * Execution path: `.\backend\venv\Scripts\python.exe`
   * Backend launch: `.\backend\venv\Scripts\uvicorn.exe app.main:app --port 8000` (run from the `backend` directory)
2. **Frontend Dev Server:** Run using `npm.cmd run dev` (run from the `frontend` directory) to avoid Windows execution policy issues.
3. **Database Setup:** Local database is SQLite and located at `backend/judic_ai.db`. If you need to seed or reset the database, run:
   * `.\backend\venv\Scripts\python.exe scripts/seed_supreme_court.py`
