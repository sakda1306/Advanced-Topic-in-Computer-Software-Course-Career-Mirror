# CareerMirror API

FastAPI backend. Endpoints and error codes: [docs/Contract.md](../docs/Contract.md). Architecture and code layout: [docs/Design.md](../docs/Design.md).

## Run locally (without Docker)

```bash
cd api
python -m venv .venv
.venv/Scripts/activate            # macOS/Linux: source .venv/bin/activate
pip install -r requirements-dev.txt
cp ../.env.example .env           # then set JWT_SECRET (32+ characters)
mkdir -p var
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

Open http://localhost:8000/docs for the interactive API docs.

## Run with Docker

From the repo root: `docker compose up --build`. The SQLite files live on the `api-data` volume; `/data` is mounted read-only.

## Tests and lint

```bash
pytest -q
ruff check . && ruff format --check .
```

## Database changes

Edit `app/infra/models.py`, then add a migration in `migrations/versions/` (next number, e.g. `0002_cv_documents.py`). New user tables need `ForeignKey("users.id", ondelete="CASCADE")` so `DELETE /api/me` removes them. `alembic check` must report no differences.

## What exists so far

| area | status |
|---|---|
| app factory, Problem-JSON errors, request id, security headers, body limits | done |
| auth: register, login (5 failures/min per email), logout, me, delete account | done |
| health | done |
| CV, questionnaire, chat, profile, roles, quota | not started |
| quota headers `X-Quota-*` on authenticated responses | with the quota service |
