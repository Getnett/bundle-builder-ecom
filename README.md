# Bundle Builder

The repository contains two independent applications:

- `frontend/` — React, TypeScript, Tailwind CSS, and Zustand
- `backend/` — FastAPI and the validated catalog data

## Run locally

Set up the backend:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
fastapi dev
```

In another terminal, set up the frontend:

```bash
cd frontend
nvm use
npm install
npm run dev
```

FastAPI runs at `http://127.0.0.1:8000`. Vite runs at
`http://127.0.0.1:5173` and proxies `/api` requests to FastAPI.

## Deploy on Render

Create two services from this repository.

Backend web service:

```text
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

Set `CORS_ORIGINS` to the deployed frontend origin, without a trailing slash.

Frontend static site:

```text
Root Directory: frontend
Build Command: npm ci && npm run build
Publish Directory: dist
```

Set `VITE_API_BASE_URL` to the deployed backend origin, without a trailing
slash. Both values are deployment-time environment variables; copy the
corresponding `.env.example` files for local overrides.

## Verify

Backend:

```bash
cd backend
source .venv/bin/activate
python -m pytest
```

Frontend:

```bash
cd frontend
npm test
npm run lint
npm run build
```
