"""FastAPI application entry point."""

from fastapi import FastAPI

from app.routers.catalog import router as catalog_router

app = FastAPI(
    title="Bundle Builder API",
    version="1.0.0",
)
app.include_router(catalog_router)


@app.get("/api/health", tags=["health"])
def get_health() -> dict[str, str]:
    return {"status": "ok"}
