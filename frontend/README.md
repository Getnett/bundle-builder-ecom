# Bundle Builder Frontend

React application for configuring and reviewing a security-system bundle.
TanStack Query manages the catalog API request, caching, cancellation, and
retry lifecycle.

## Requirements

- Node.js 20.19 or newer
- npm
- The FastAPI backend running at `http://127.0.0.1:8000`

## Install

```bash
cd frontend
nvm use
npm install
```

The included `.nvmrc` selects the locally verified Node.js version. If it is
not installed yet, run `nvm install` first.

## Start

```bash
npm run dev
```

Vite starts at `http://127.0.0.1:5173` and proxies `/api` requests to the
FastAPI backend.

## Verify

The frontend test suite requests its catalog from the running FastAPI
backend; it does not keep a frontend catalog fixture.

```bash
npm test
npm run lint
npm run build
```

## Styling architecture

- `src/primitives.css` contains raw Figma values.
- `src/tailwind-theme.css` exposes semantic Tailwind utilities.
- `src/index.css` is the only global stylesheet entry point.
