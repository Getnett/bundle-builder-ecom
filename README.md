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
