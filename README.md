# Bundle Builder

The repository contains two independent applications:

- `frontend/` — React, TypeScript, Tailwind CSS, and Zustand
- `backend/` — FastAPI and the validated catalog data

## Live deployment

[View the deployed Bundle Builder on Render](https://bundle-builder-ecom.onrender.com)

## Key decisions

- Accordion selection counts represent distinct products. Selecting multiple
  variants of one product still counts as one selected product.
- Every product variant has an independent quantity keyed by SKU. Changing the
  active variant changes which quantity the card controls without modifying
  the other variants.
- Product cards and review rows are synchronized views of one Zustand store.
  Review groups, selection counts, and totals are derived instead of stored as
  duplicate state.
- Saving is explicit. The bundle is written to `localStorage` only when the
  shopper selects **Save my system for later**.
- The catalog comes from the FastAPI backend.
- Backend unit and compare-at prices are authoritative. Discount badges are
  display-only, and totals are calculated in integer cents.
- Smaller desktop and tablet viewports use the stacked layout.

## Additional features

- A first-visit welcome experience introduces the builder while the catalog
  loads in the background. After the shopper enters, a separate versioned
  `localStorage` flag prevents the welcome screen from appearing again.
- The application is deployed on Render:
  [View the live Bundle Builder](https://bundle-builder-ecom.onrender.com).
- The interface supports sidebar, stacked, and phone layouts while preserving
  the same configuration and pricing behavior.

## Main libraries

| Library                          | Responsibility                                                                              |
| -------------------------------- | ------------------------------------------------------------------------------------------- |
| Zod Mini                         | Validates the catalog response at the API boundary and provides the inferred catalog types. |
| Zustand + Immer                  | Owns bundle configuration state and provides concise immutable actions.                     |
| TanStack Query                   | Fetches, caches, retries, and cancels catalog requests.                                     |
| Radix UI                         | Provides accessible accordion and radio-group behavior.                                     |
| Tailwind CSS v4 + tailwind-merge | Applies semantic design tokens and safely composes utility classes.                         |
| FastAPI                          | Serves the validated catalog JSON to the frontend.                                          |

## Component structure

```text
App
├── WelcomePage / CatalogLoadState
└── BundleBuilder
    ├── StepAccordion
    │   └── StepAccordionItem
    │       ├── ProductGrid
    │       │   └── ProductCard
    │       │       ├── ProductImage / ProductDescription
    │       │       ├── ColorSwatches
    │       │       ├── QuantityStepper
    │       │       └── PriceTag
    │       └── PlanCard
    └── ReviewPanel
        ├── ReviewSelections
        │   └── ReviewLineItem
        └── ReviewSummary
```

- `components/ui/` contains reusable UI primitives such as buttons, icons,
  badges, chevrons, and the welcome-page mark.
- `store/` contains the catalog-keyed Zustand store and actions.
  `bundle-state.ts` contains pure selectors, normalization, review grouping,
  and pricing logic.
- `api/` owns catalog requests, while `schemas/` validates API data before it
  reaches application state.
- `primitives.css` contains raw design values, `tailwind-theme.css` maps them
  to semantic utilities, and `index.css` remains the global stylesheet entry.
- `backend/app/` contains the FastAPI catalog route, Pydantic models, and the
  canonical JSON catalog.

## Run locally

### Backend — macOS or Linux

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
fastapi dev
```

### Backend — Windows PowerShell

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
fastapi dev
```

When using Command Prompt instead of PowerShell, activate the environment with
`.venv\Scripts\activate.bat`.

### Frontend

In another terminal:

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
