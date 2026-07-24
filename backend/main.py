"""FastAPI application entry point."""

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.catalog import router as catalog_router

app = FastAPI(
    title="Bundle Builder API",
    version="1.0.0",
)

allowed_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "").split(",")
    if origin.strip()
]

if allowed_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_methods=["GET"],
        allow_headers=["Accept"],
    )

app.include_router(catalog_router)


@app.get("/api/health", tags=["health"])
def get_health() -> dict[str, str]:
    return {"status": "ok"}
